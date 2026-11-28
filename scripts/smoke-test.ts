import {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  DescribeLogGroupsCommand,
  FilterLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';



const runtime = globalThis as typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>;
    exit(code?: number): never;
  };
};
const region = runtime.process?.env?.AWS_REGION ?? 'us-east-1';
const prefix = runtime.process?.env?.LOG_GROUP_PREFIX ?? '/aws/lambda/amplify-';

async function main(): Promise<void> {
  const sts = new STSClient({ region });
  const identity = await sts.send(new GetCallerIdentityCommand({}));
  console.log(`Identity: ${identity.Arn}`);
  if (!identity.Arn?.includes(':assumed-role/')) {
    throw new Error('Expected an assumed-role identity');
  }

  const logs = new CloudWatchLogsClient({ region });
  const groups = await logs.send(new DescribeLogGroupsCommand({ logGroupNamePrefix: prefix }));
  const names = (groups.logGroups ?? [])
    .map((g) => g.logGroupName)
    .filter((n): n is string => Boolean(n));
  console.log(`Found ${names.length} log group(s): ${names.join(', ')}`);
  if (names.length === 0) {
    throw new Error(`No log groups with prefix ${prefix}`);
  }

  const target = names.find((n) => n.includes('chat')) ?? names[0];
  const events = await logs.send(
    new FilterLogEventsCommand({ logGroupName: target, filterPattern: 'ERROR', limit: 3 })
  );
  console.log(`Read ${events.events?.length ?? 0} ERROR event(s) from ${target}`);

  try {
    await logs.send(new CreateLogGroupCommand({ logGroupName: '/tmp/should-fail' }));
  } catch (err) {
    if (err instanceof Error && err.name === 'AccessDeniedException') {
      console.log('OK: write was denied (AccessDeniedException)');
      return;
    }
    throw err;
  }
  throw new Error('FAIL: the role was able to create a log group');
}

main().catch((err) => {
  console.error(err);
  runtime.process?.exit(1);
});