/**
 * Environment Configuration for SkillTree Infrastructure
 *
 * This file defines environment-specific configurations for dev and prod environments.
 * Based on the architecture defined in ARCHITECTURE.md
 */

export interface EnvironmentConfig {
  // Basic environment info
  name: string;
  account: string;
  region: string;

  // Domain configuration
  domain: string;
  apiDomain: string;
  storybookDomain: string;
  hostedZoneName: string;

  // VPC Configuration
  vpcCidr: string;
  publicSubnetCidrs: string[];
  privateSubnetCidrs: string[];
  maxAzs: number;

  // Database Configuration (Aurora Serverless v2)
  database: {
    minCapacity: number; // ACUs
    maxCapacity: number; // ACUs
    backupRetentionDays: number;
    autoPauseMinutes?: number; // Only for dev
    instanceCount: number;
    databaseName: string;
  };

  // ECS Configuration
  ecs: {
    cpu: number; // 512 = 0.5 vCPU, 1024 = 1 vCPU
    memory: number; // MB
    minTaskCount: number;
    maxTaskCount: number;
    containerPort: number;
    healthCheckPath: string;
    targetCpuUtilization: number;
    targetMemoryUtilization: number;
  };

  // CloudWatch Logs
  logRetentionDays: number;

  // S3/CloudFront Configuration
  cloudfront: {
    priceClass: string;
    defaultTtl: number;
    maxTtl: number;
    minTtl: number;
  };

  // Secrets Manager
  secretsRotationDays: number;

  // Resource tags
  tags: Record<string, string>;
}

/**
 * Development Environment Configuration
 */
export const devConfig: EnvironmentConfig = {
  name: "dev",
  account: process.env.CDK_DEFAULT_ACCOUNT || "",
  region: "us-east-1",

  // Domains
  domain: "dev.skilltree.io",
  apiDomain: "api.dev.skilltree.io",
  storybookDomain: "storybook.dev.skilltree.io",
  hostedZoneName: "skilltree.io",

  // VPC - 10.0.0.0/16
  vpcCidr: "10.0.0.0/16",
  publicSubnetCidrs: ["10.0.1.0/24", "10.0.2.0/24"],
  privateSubnetCidrs: ["10.0.10.0/24", "10.0.11.0/24"],
  maxAzs: 2,

  // Database - Cost-optimized for dev
  database: {
    minCapacity: 0.5,
    maxCapacity: 2,
    backupRetentionDays: 7,
    autoPauseMinutes: 15, // Auto-pause after 15 minutes of inactivity
    instanceCount: 1,
    databaseName: "skilltree",
  },

  // ECS - Minimal configuration for dev
  ecs: {
    cpu: 512, // 0.5 vCPU
    memory: 1024, // 1 GB
    minTaskCount: 1,
    maxTaskCount: 4,
    containerPort: 3000,
    healthCheckPath: "/health",
    targetCpuUtilization: 70,
    targetMemoryUtilization: 70,
  },

  // Logs
  logRetentionDays: 7,

  // CloudFront
  cloudfront: {
    priceClass: "PriceClass_100", // US, Canada, Europe
    defaultTtl: 0, // No cache for HTML
    maxTtl: 31536000, // 1 year for assets
    minTtl: 0,
  },

  // Secrets rotation
  secretsRotationDays: 90,

  // Tags
  tags: {
    Environment: "dev",
    Project: "skilltree",
    ManagedBy: "cdk",
    CostCenter: "development",
  },
};

/**
 * Production Environment Configuration
 */
export const prodConfig: EnvironmentConfig = {
  name: "prod",
  account: process.env.CDK_DEFAULT_ACCOUNT || "",
  region: "us-east-1",

  // Domains
  domain: "app.skilltree.io",
  apiDomain: "api.skilltree.io",
  storybookDomain: "storybook.skilltree.io",
  hostedZoneName: "skilltree.io",

  // VPC - 10.0.0.0/16
  vpcCidr: "10.0.0.0/16",
  publicSubnetCidrs: ["10.0.1.0/24", "10.0.2.0/24"],
  privateSubnetCidrs: ["10.0.10.0/24", "10.0.11.0/24"],
  maxAzs: 2,

  // Database - Production-ready configuration
  database: {
    minCapacity: 2,
    maxCapacity: 8,
    backupRetentionDays: 30,
    instanceCount: 2, // Multi-AZ for HA
    databaseName: "skilltree",
  },

  // ECS - Production configuration
  ecs: {
    cpu: 1024, // 1 vCPU
    memory: 2048, // 2 GB
    minTaskCount: 2,
    maxTaskCount: 10,
    containerPort: 3000,
    healthCheckPath: "/health",
    targetCpuUtilization: 70,
    targetMemoryUtilization: 70,
  },

  // Logs
  logRetentionDays: 30,

  // CloudFront
  cloudfront: {
    priceClass: "PriceClass_100", // US, Canada, Europe
    defaultTtl: 0, // No cache for HTML
    maxTtl: 31536000, // 1 year for assets
    minTtl: 0,
  },

  // Secrets rotation
  secretsRotationDays: 30,

  // Tags
  tags: {
    Environment: "prod",
    Project: "skilltree",
    ManagedBy: "cdk",
    CostCenter: "production",
  },
};

/**
 * Get configuration for the specified environment
 */
export function getConfig(environment: "dev" | "prod"): EnvironmentConfig {
  return environment === "prod" ? prodConfig : devConfig;
}

/**
 * Available environments
 */
export const ENVIRONMENTS = ["dev", "prod"] as const;
export type Environment = (typeof ENVIRONMENTS)[number];
