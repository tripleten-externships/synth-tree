#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { AdminStack } from "../lib/admin-stack";
import { ApiStack } from "../lib/api-stack";
import { ENVIRONMENTS, getConfig, type Environment } from "../lib/config";
import { DatabaseStack } from "../lib/database-stack";
import { FrontendStack } from "../lib/frontend-stack";
import { NetworkStack } from "../lib/network-stack";
import { StorybookStack } from "../lib/storybook-stack";

/**
 * Synth Tree Infrastructure CDK App
 *
 * Each domain (network/database/api/frontend/storybook) is a top-level
 * cdk.Stack with a predictable CloudFormation name like
 * `synth-tree-dev-Api`. This makes it possible to deploy/redeploy/destroy
 * individual stacks and to look them up by name from CI workflows.
 *
 * Usage:
 *   - Deploy to dev:  cdk deploy --context environment=dev --all
 *   - Deploy to prod: cdk deploy --context environment=prod --all
 *   - Deploy a single stack: cdk deploy synth-tree-dev-Api
 *
 * Or set ENVIRONMENT in the shell:
 *   - ENVIRONMENT=dev cdk deploy --all
 *   - ENVIRONMENT=prod cdk deploy --all
 */

const app = new cdk.App();

const environmentParam = (app.node.tryGetContext("environment") ||
  process.env.ENVIRONMENT ||
  "dev") as string;

if (!ENVIRONMENTS.includes(environmentParam as Environment)) {
  throw new Error(
    `Invalid environment: ${environmentParam}. Must be one of: ${ENVIRONMENTS.join(", ")}`,
  );
}

const environment = environmentParam as Environment;
const config = getConfig(environment);

console.log(`🚀 Synthesizing stacks for environment: ${environment}`);
console.log(`📍 Region: ${config.region}`);
console.log(`🌐 Domain: ${config.domain}`);

const env = {
  account: config.account || process.env.CDK_DEFAULT_ACCOUNT,
  region: config.region,
};

const commonProps = {
  env,
  tags: config.tags,
};

// ─── Network ───────────────────────────────────────────────────────────────
// VPC, subnets, NAT gateways, security groups.
const networkStack = new NetworkStack(app, `${config.name}-Network`, {
  ...commonProps,
  description: `Network infrastructure for Synth Tree ${config.name} environment`,
  config,
});

// ─── Database ──────────────────────────────────────────────────────────────
// Aurora Serverless v2 PostgreSQL cluster. Depends on network for VPC/SG.
const databaseStack = new DatabaseStack(app, `${config.name}-Database`, {
  ...commonProps,
  description: `Database infrastructure for Synth Tree ${config.name} environment`,
  config,
  vpc: networkStack.vpc,
  databaseSecurityGroup: networkStack.databaseSecurityGroup,
  bastionSecurityGroup: networkStack.bastionSecurityGroup,
  publicSubnets: networkStack.publicSubnets,
  privateSubnets: networkStack.privateSubnets,
});
databaseStack.addDependency(networkStack);

// ─── API ───────────────────────────────────────────────────────────────────
// ECS Fargate service + Application Load Balancer. Depends on network + DB.
const apiStack = new ApiStack(app, `${config.name}-Api`, {
  ...commonProps,
  description: `API infrastructure for Synth Tree ${config.name} environment`,
  config,
  vpc: networkStack.vpc,
  albSecurityGroup: networkStack.albSecurityGroup,
  ecsSecurityGroup: networkStack.ecsSecurityGroup,
  databaseSecret: databaseStack.secret,
  databaseCluster: databaseStack.cluster,
});
apiStack.addDependency(networkStack);
apiStack.addDependency(databaseStack);

// ─── Frontend (client-frontend) ──────────────────────────────────────────────
// S3 + CloudFront for the learner-facing client app. Independent.
new FrontendStack(app, `${config.name}-Frontend`, {
  ...commonProps,
  description: `Client frontend infrastructure for Synth Tree ${config.name} environment`,
  config,
});

// ─── Admin (admin-dashboard) ─────────────────────────────────────────────────
// S3 + CloudFront for the admin dashboard, on its own subdomain. Independent.
new AdminStack(app, `${config.name}-Admin`, {
  ...commonProps,
  description: `Admin dashboard infrastructure for Synth Tree ${config.name} environment`,
  config,
});

// ─── Storybook ─────────────────────────────────────────────────────────────
// S3 + CloudFront for Storybook. Independent.
new StorybookStack(app, `${config.name}-Storybook`, {
  ...commonProps,
  description: `Storybook infrastructure for Synth Tree ${config.name} environment`,
  config,
});

// App-level tags. Stack-level tags from `commonProps.tags` are already
// applied per stack; these mirror them at the app level for AWS resource
// groups / billing filters.
cdk.Tags.of(app).add("Project", "synth-tree");
cdk.Tags.of(app).add("Environment", config.name);
cdk.Tags.of(app).add("ManagedBy", "cdk");

app.synth();
