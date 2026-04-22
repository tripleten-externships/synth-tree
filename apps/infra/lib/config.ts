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

  // Monitoring and alarm
  monitoring: {
    alarmEmail?: string; // email for SNS alarm notification
    latencyThresholdSeconds: number; // p99 ALB response time alarm threshold
    errorRateThresholdPercent: number; // 5xx error rate alarm threshold
    cpuAlarmPercent: number; // ECS and RDS CPU utilization alarm threshold
    memoryAlarmPercent: number; // ECS memory utilization alarm threshold
    dbConnectionAlarmThreshold: number; // RDS database connections alarm threshold
  };

  // Resource tags
  tags: Record<string, string>;
}

/**
 * Development Environment Configuration
 */
export const devConfig: EnvironmentConfig = {
  name: "synth-tree-dev",
  account: process.env.CDK_DEFAULT_ACCOUNT || "516217144302",
  region: "us-east-1",

  // Domains
  domain: "dev.synth-tree.com",
  apiDomain: "api.dev.synth-tree.com",
  storybookDomain: "storybook.dev.synth-tree.com",
  hostedZoneName: "synth-tree.com",

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
    containerPort: 4000,
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

  // Monitoring: for relaxed thresholds for dev, you can always replace or test with other variables
  monitoring: {
    latencyThresholdSeconds: 3,
    errorRateThresholdPercent: 5,
    cpuAlarmPercent: 85,
    memoryAlarmPercent: 85,
    dbConnectionAlarmThreshold: 50,
  },

  // Tags
  tags: {
    Environment: "dev",
    Project: "synth-tree",
    ManagedBy: "cdk",
    CostCenter: "development",
  },
};

/**
 * Production Environment Configuration
 */
export const prodConfig: EnvironmentConfig = {
  name: "synth-tree-prod",
  account: process.env.CDK_DEFAULT_ACCOUNT || "",
  region: "us-east-1",

  // Domains
  domain: "app.synth-tree.com",
  apiDomain: "api.synth-tree.com",
  storybookDomain: "storybook.synth-tree.com",
  hostedZoneName: "synth-tree.com",

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
    containerPort: 4000,
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

  // Monitoring: for stricter thresholds for prod
  monitoring: {
    alarmEmail: "......", // email for recieve alarm
    latencyThresholdSeconds: 2,
    errorRateThresholdPercent: 1,
    cpuAlarmPercent: 80,
    memoryAlarmPercent: 80,
    dbConnectionAlarmThreshold: 100,
  },

  // Tags
  tags: {
    Environment: "prod",
    Project: "synth-tree",
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
