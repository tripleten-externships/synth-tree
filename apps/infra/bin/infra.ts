#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { getConfig, ENVIRONMENTS, type Environment } from "../lib/config";
import { NetworkStack } from "../lib/network-stack";
import { DatabaseStack } from "../lib/database-stack";
import { ApiStack } from "../lib/api-stack";
import { FrontendStack } from "../lib/frontend-stack";
import { StorybookStack } from "../lib/storybook-stack";
import { StorageStack } from "../lib/storage-stack";

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
// For CI/CD validation: use a placeholder account if CDK_DEFAULT_ACCOUNT is not set
const accountId = config.account || process.env.CDK_DEFAULT_ACCOUNT || "123456789012";

const env = {
  account: accountId,
  region: config.region,
};

/**
 * Network Stack
 * VPC, subnets, NAT gateways, security groups
 * No dependencies
 */
const networkStack = new NetworkStack(app, `${config.name}-Network`, {
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
  app,
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

// Storage Stack
// S3 bucket for file uploads
// No dependencies
const storageStack = new StorageStack(app, `${config.name}-Storage`, {
  env,
  description: `Storage infrastructure for Synth Tree ${config.name} environment`,
  tags: config.tags,
});
/**
 * API Stack
 * ECS Fargate service, Application Load Balancer
 * Depends on: Network Stack, Database Stack, Storage Stack
 */
const apiStack = new ApiStack(app, `${config.name}-Api`, {
  env,
  description: `API infrastructure for Synth Tree ${config.name} environment`,
  tags: config.tags,
  config,
  vpc: networkStack.vpc,
  albSecurityGroup: networkStack.albSecurityGroup,
  ecsSecurityGroup: networkStack.ecsSecurityGroup,
  databaseSecret: databaseStack.secret,
  databaseCluster: databaseStack.cluster,
  uploadBucket: storageStack.uploadBucket,
});

// API stack depends on both network and database stacks
apiStack.addDependency(networkStack);
apiStack.addDependency(databaseStack);
apiStack.addDependency(storageStack);
/**
 * Frontend Stack
 * S3 bucket, CloudFront distribution for React app
 * Independent - no dependencies
 */
const frontendStack = new FrontendStack(
  app,
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
  app,
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
