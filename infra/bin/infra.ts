#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
// import { InfraStack } from '../lib/infra-stack';
import { GithubDebuggerStack } from '../lib/github-debugger-stack';

const app = new cdk.App();

function ctx(name: string): string {
  const value = app.node.tryGetContext(name);
  if (value === undefined || value === null || String(value) === '') {
    throw new Error(`Missing CDK context value: ${name}`);
  }
  return String(value);
}

new GithubDebuggerStack(app, 'ChatDebuggerGithub', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'ap-south-1',
  },
  githubOwner: ctx('githubOwner'),
  githubRepo: ctx('githubRepo'),
  alertEmail: ctx('alertEmail'),
  monthlyBudgetUsd: Number(ctx('monthlyBudgetUsd')),
  createOidcProvider: String(app.node.tryGetContext('createOidcProvider')) !== 'false',
});

// new InfraStack(app, 'InfraStack', {
//   /* If you don't specify 'env', this stack will be environment-agnostic.
//    * Account/Region-dependent features and context lookups will not work,
//    * but a single synthesized template can be deployed anywhere. */

//   /* Uncomment the next line to specialize this stack for the AWS Account
//    * and Region that are implied by the current CLI configuration. */
//   // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

//   /* Uncomment the next line if you know exactly what Account and Region you
//    * want to deploy the stack to. */
//   env: { account: '484907483534', region: 'ap-south-1' },

//   /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
// });
