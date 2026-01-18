#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { getConfig, ENVIRONMENTS, type Environment } from "../lib/config";
import { NetworkStack } from "../lib/network-stack";
import { DatabaseStack } from "../lib/database-stack";
import { ApiStack } from "../lib/api-stack";
import { FrontendStack } from "../lib/frontend-stack";
import { StorybookStack } from "../lib/storybook-stack";

/**
 * Synth Tree Infrastructure CDK App
 *
 * This app creates infrastructure for the Synth Tree application across multiple environments.
 * Usage:
 *   - Deploy to dev:  cdk deploy --context environment=dev --all
 *   - Deploy to prod: cdk deploy --context environment=prod --all
 *
 * Or use environment variable:
 *   - ENVIRONMENT=dev cdk deploy --all
 *   - ENVIRONMENT=prod cdk deploy --all
 */

const app = new cdk.App();

// Get environment from context or environment variable
const environmentParam = (app.node.tryGetContext("environment") ||
  process.env.ENVIRONMENT ||
  "dev") as string;

// Validate environment
if (!ENVIRONMENTS.includes(environmentParam as Environment)) {
  throw new Error(
    `Invalid environment: ${environmentParam}. Must be one of: ${ENVIRONMENTS.join(
      ", ",
    )}`,
  );
}

const environment = environmentParam as Environment;
const config = getConfig(environment);

console.log(`🚀 Synthesizing stacks for environment: ${environment}`);
console.log(`📍 Region: ${config.region}`);
console.log(`🌐 Domain: ${config.domain}`);

// Define CDK environment
const env = {
  account: config.account || process.env.CDK_DEFAULT_ACCOUNT,
  region: config.region,
};

/**
 * Parent Stack
 * Groups all infrastructure stacks together in CloudFormation
 */
const parentStack = new cdk.Stack(app, `${config.name}-Stack`, {
  env,
  description: `Stack for Synth Tree ${config.name} environment`,
  tags: config.tags,
});

/**
 * Network Stack
 * VPC, subnets, NAT gateways, security groups
 * No dependencies
 */
const networkStack = new NetworkStack(parentStack, `${config.name}-Network`, {
  env,
  description: `Network infrastructure for Synth Tree ${config.name} environment`,
  tags: config.tags,
  config,
});

/**
 * Database Stack
 * Aurora Serverless v2 PostgreSQL cluster
 * Depends on: Network Stack
 */
const databaseStack = new DatabaseStack(
  parentStack,
  `${config.name}-Database`,
  {
    env,
    description: `Database infrastructure for Synth Tree ${config.name} environment`,
    tags: config.tags,
    config,
    vpc: networkStack.vpc,
    databaseSecurityGroup: networkStack.databaseSecurityGroup,
    bastionSecurityGroup: networkStack.bastionSecurityGroup,
    publicSubnets: networkStack.publicSubnets,
    privateSubnets: networkStack.privateSubnets,
  },
);

// Database stack depends on network stack
databaseStack.addDependency(networkStack);

/**
 * API Stack
 * ECS Fargate service, Application Load Balancer
 * Depends on: Network Stack, Database Stack
 */
const apiStack = new ApiStack(parentStack, `${config.name}-Api`, {
  env,
  description: `API infrastructure for Synth Tree ${config.name} environment`,
  tags: config.tags,
  config,
  vpc: networkStack.vpc,
  albSecurityGroup: networkStack.albSecurityGroup,
  ecsSecurityGroup: networkStack.ecsSecurityGroup,
  databaseSecret: databaseStack.secret,
  databaseCluster: databaseStack.cluster,
});

// API stack depends on both network and database stacks
apiStack.addDependency(networkStack);
apiStack.addDependency(databaseStack);

/**
 * Frontend Stack
 * S3 bucket, CloudFront distribution for React app
 * Independent - no dependencies
 */
const frontendStack = new FrontendStack(
  parentStack,
  `${config.name}-Frontend`,
  {
    env,
    description: `Frontend infrastructure for Synth Tree ${config.name} environment`,
    tags: config.tags,
    config,
  },
);

/**
 * Storybook Stack
 * S3 bucket, CloudFront distribution for Storybook
 * Independent - no dependencies
 */
const storybookStack = new StorybookStack(
  parentStack,
  `${config.name}-Storybook`,
  {
    env,
    description: `Storybook infrastructure for Synth Tree ${config.name} environment`,
    tags: config.tags,
    config,
  },
);

// Add stack-level tags
cdk.Tags.of(app).add("Project", "synth-tree");
cdk.Tags.of(app).add("Environment", config.name);
cdk.Tags.of(app).add("ManagedBy", "cdk");

app.synth();
