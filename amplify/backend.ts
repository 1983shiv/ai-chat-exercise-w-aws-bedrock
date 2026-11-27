import { defineBackend } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { chat } from './functions/chat/resource';

const backend = defineBackend({
  auth,
  data,
  chat,
});

const chatLambda = backend.chat.resources.lambda;
const account = Stack.of(chatLambda).account;

// Least privilege: one action, one model, one inference profile.
chatLambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['bedrock:InvokeModel'],
    // for amazon nova llm
    // resources: [
    //   'arn:aws:bedrock:*::foundation-model/amazon.nova-micro-v1:0',
    //   `arn:aws:bedrock:*:${account}:inference-profile/apac.amazon.nova-micro-v1:0`,
    // ],

    // for claude
    resources: [
      'arn:aws:bedrock:*::foundation-model/anthropic.claude-haiku-4-5-20251001-v1:0',
      `arn:aws:bedrock:*:${account}:inference-profile/global.anthropic.claude-haiku-4-5-20251001-v1:0`,
    ],
    // global.anthropic.claude-haiku-4-5-20251001-v1:0
    // arn:aws:bedrock:ap-south-1:484907483534:inference-profile/global.anthropic.claude-haiku-4-5-20251001-v1:0
    // inference profile ID
    // apac.amazon.nova-lite-v1:0
    // inference profile ARN
    // arn:aws:bedrock:ap-south-1:484907483534:inference-profile/apac.amazon.nova-lite-v1:0
  })
);