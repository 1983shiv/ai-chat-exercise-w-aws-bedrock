import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as budgets from 'aws-cdk-lib/aws-budgets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface GithubDebuggerStackProps extends StackProps {
  githubOwner: string;
  githubRepo: string;
  alertEmail: string;
  monthlyBudgetUsd: number;
  /** Set false if your account already has the GitHub OIDC provider. */
  createOidcProvider: boolean;
}

export class GithubDebuggerStack extends Stack {
  constructor(scope: Construct, id: string, props: GithubDebuggerStackProps) {
    super(scope, id, props);

    const issuer = 'token.actions.githubusercontent.com';

    const providerArn = props.createOidcProvider
      ? new iam.OpenIdConnectProvider(this, 'GithubOidc', {
          url: `https://${issuer}`,
          clientIds: ['sts.amazonaws.com'],
        }).openIdConnectProviderArn
      : `arn:aws:iam::${this.account}:oidc-provider/${issuer}`;

    // Only this repo, only the main branch, only the STS audience.
    const role = new iam.Role(this, 'DebuggerRole', {
      roleName: 'gha-cloudwatch-debugger',
      description: 'GitHub Actions: read-only CloudWatch Logs for the auto-debugger',
      maxSessionDuration: Duration.hours(1),
      assumedBy: new iam.WebIdentityPrincipal(providerArn, {
        StringEquals: { [`${issuer}:aud`]: 'sts.amazonaws.com' },
        StringLike: {
          [`${issuer}:sub`]: `repo:${props.githubOwner}/${props.githubRepo}:ref:refs/heads/main`,
        },
      }),
    });

    // DescribeLogGroups does not support resource-level scoping.
    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'ListLogGroups',
        actions: ['logs:DescribeLogGroups'],
        resources: ['*'],
      })
    );

    // Read-only access to Amplify Lambda log groups only.
    const logGroupArn = `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/lambda/amplify-*`;
    role.addToPolicy(
      new iam.PolicyStatement({
        sid: 'ReadAmplifyLambdaLogs',
        actions: ['logs:FilterLogEvents', 'logs:GetLogEvents', 'logs:DescribeLogStreams'],
        resources: [logGroupArn, `${logGroupArn}:*`],
      })
    );

    // Guardrail from Lab 1, now as code: email at 80% actual and 100% forecasted spend.
    new budgets.CfnBudget(this, 'MonthlyBudget', {
      budget: {
        budgetName: 'chat-debugger-monthly',
        budgetType: 'COST',
        timeUnit: 'MONTHLY',
        budgetLimit: { amount: props.monthlyBudgetUsd, unit: 'USD' },
      },
      notificationsWithSubscribers: [
        {
          notification: {
            notificationType: 'ACTUAL',
            comparisonOperator: 'GREATER_THAN',
            threshold: 80,
            thresholdType: 'PERCENTAGE',
          },
          subscribers: [{ subscriptionType: 'EMAIL', address: props.alertEmail }],
        },
        {
          notification: {
            notificationType: 'FORECASTED',
            comparisonOperator: 'GREATER_THAN',
            threshold: 100,
            thresholdType: 'PERCENTAGE',
          },
          subscribers: [{ subscriptionType: 'EMAIL', address: props.alertEmail }],
        },
      ],
    });

    new CfnOutput(this, 'RoleArn', { value: role.roleArn });
  }
}