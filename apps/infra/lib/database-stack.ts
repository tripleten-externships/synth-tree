import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { EnvironmentConfig } from "./config";

/**
 * Props for DatabaseStack
 */
export interface DatabaseStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
  vpc: ec2.IVpc;
  databaseSecurityGroup: ec2.ISecurityGroup;
  bastionSecurityGroup: ec2.ISecurityGroup;
  publicSubnets: ec2.ISubnet[];
  privateSubnets: ec2.ISubnet[];
}

/**
 * Database Stack
 *
 * Creates the Aurora Serverless v2 PostgreSQL database infrastructure:
 * - Aurora Serverless v2 cluster (PostgreSQL)
 * - Database credentials stored in AWS Secrets Manager
 * - Automated backups with environment-specific retention
 * - Encryption at rest using AWS KMS
 * - Multi-AZ deployment for high availability
 * - Bastion host for secure database access
 * - Parameter Store for connection strings
 *
 * Dependencies:
 * - Network Stack (VPC, subnets, and security groups)
 *
 * Configuration (from EnvironmentConfig):
 * - Dev: 0.5-2 ACUs, 7-day backups, single instance
 * - Prod: 2-8 ACUs, 30-day backups, multi-AZ (2 instances)
 */
export class DatabaseStack extends cdk.Stack {
  /**
   * The Aurora database cluster
   * Used by the API stack to configure database connection
   */
  public readonly cluster: rds.IDatabaseCluster;

  /**
   * The database credentials secret
   * Provides connection information to ECS tasks
   */
  public readonly secret: secretsmanager.ISecret;

  /**
   * The bastion host EC2 instance
   * Used for secure administrative access to the database
   */
  public readonly bastionHost: ec2.IInstance;

  /**
   * Database connection endpoint
   */
  public readonly databaseEndpoint: string;

  /**
   * Database port
   */
  public readonly databasePort: number;

  /**
   * Database name
   */
  public readonly databaseName: string;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const {
      config,
      vpc,
      databaseSecurityGroup,
      bastionSecurityGroup,
      publicSubnets,
      privateSubnets,
    } = props;

    // ========================================
    // Database Credentials Secret
    // ========================================

    /**
     * Create Secrets Manager secret for database credentials
     * This secret will be automatically populated by RDS with the actual credentials
     * and can be used by ECS tasks to connect to the database
     */
    this.secret = new secretsmanager.Secret(this, "DatabaseSecret", {
      secretName: `${config.name}/database/credentials`,
      description: `Database credentials for ${config.name} environment`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: "postgres",
        }),
        generateStringKey: "password",
        excludeCharacters: '"@/\\',
        passwordLength: 32,
      },
    });

    // Note: Secret rotation requires a Lambda function to handle the rotation logic.
    // This can be added later by creating a rotation Lambda and calling:
    // this.secret.addRotationSchedule("RotationSchedule", {
    //   automaticallyAfter: cdk.Duration.days(config.secretsRotationDays),
    //   rotationLambda: rotationLambda,
    // });

    // ========================================
    // Database Subnet Group
    // ========================================

    /**
     * Create DB subnet group using private subnets
     * Aurora instances will be deployed across these subnets for HA
     */
    const subnetGroup = new rds.SubnetGroup(this, "DatabaseSubnetGroup", {
      vpc,
      description: `Subnet group for ${config.name} Aurora cluster`,
      vpcSubnets: {
        subnets: privateSubnets,
      },
      subnetGroupName: `${config.name}-aurora-subnet-group`,
    });

    // ========================================
    // Aurora Serverless v2 Cluster
    // ========================================

    /**
     * Create Aurora Serverless v2 PostgreSQL cluster
     * with environment-specific scaling and backup configuration
     */
    this.cluster = new rds.DatabaseCluster(this, "AuroraCluster", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_15_5,
      }),
      credentials: rds.Credentials.fromSecret(this.secret),
      writer: rds.ClusterInstance.serverlessV2("writer", {
        enablePerformanceInsights: true,
        performanceInsightRetention: rds.PerformanceInsightRetention.DEFAULT,
        publiclyAccessible: false,
      }),
      readers:
        config.database.instanceCount > 1
          ? [
              rds.ClusterInstance.serverlessV2("reader", {
                scaleWithWriter: true,
                enablePerformanceInsights: true,
                performanceInsightRetention:
                  rds.PerformanceInsightRetention.DEFAULT,
                publiclyAccessible: false,
              }),
            ]
          : undefined,
      serverlessV2MinCapacity: config.database.minCapacity,
      serverlessV2MaxCapacity: config.database.maxCapacity,
      vpc,
      vpcSubnets: {
        subnets: privateSubnets,
      },
      securityGroups: [databaseSecurityGroup],
      subnetGroup,
      defaultDatabaseName: config.database.databaseName,
      backup: {
        retention: cdk.Duration.days(config.database.backupRetentionDays),
        preferredWindow: "03:00-04:00", // 3-4 AM UTC
      },
      preferredMaintenanceWindow: "sun:04:00-sun:05:00", // Sunday 4-5 AM UTC
      removalPolicy:
        config.name === "prod"
          ? cdk.RemovalPolicy.SNAPSHOT
          : cdk.RemovalPolicy.DESTROY,
      deletionProtection: config.name === "prod",
      cloudwatchLogsExports: ["postgresql"],
      cloudwatchLogsRetention: logs.RetentionDays.ONE_MONTH,
      storageEncrypted: true,
      monitoringInterval: cdk.Duration.seconds(60),
      enableDataApi: false,
    });

    // Store database details
    this.databaseEndpoint = this.cluster.clusterEndpoint.hostname;
    this.databasePort = this.cluster.clusterEndpoint.port;
    this.databaseName = config.database.databaseName;

    // ========================================
    // Bastion Host
    // ========================================

    /**
     * Create IAM role for bastion host with SSM Session Manager permissions
     */
    const bastionRole = new iam.Role(this, "BastionRole", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      description: "IAM role for bastion host with SSM access",
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonSSMManagedInstanceCore"
        ),
      ],
    });

    /**
     * Get latest Amazon Linux 2023 AMI
     */
    const bastionAmi = ec2.MachineImage.latestAmazonLinux2023({
      cpuType: ec2.AmazonLinuxCpuType.X86_64,
    });

    /**
     * User data script to install PostgreSQL client tools
     */
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      "#!/bin/bash",
      "# Update system",
      "dnf update -y",
      "",
      "# Install PostgreSQL client",
      "dnf install -y postgresql15",
      "",
      "# Install session manager plugin (already included in AL2023)",
      "echo 'PostgreSQL client installed successfully'"
    );

    /**
     * Create bastion host EC2 instance
     * Deployed in public subnet for SSH/SSM access
     */
    this.bastionHost = new ec2.Instance(this, "BastionHost", {
      vpc,
      vpcSubnets: {
        subnets: [publicSubnets[0]], // First public subnet
      },
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      machineImage: bastionAmi,
      securityGroup: bastionSecurityGroup,
      role: bastionRole,
      userData,
      ssmSessionPermissions: true,
      blockDevices: [
        {
          deviceName: "/dev/xvda",
          volume: ec2.BlockDeviceVolume.ebs(8, {
            encrypted: true,
            volumeType: ec2.EbsDeviceVolumeType.GP3,
          }),
        },
      ],
    });

    cdk.Tags.of(this.bastionHost).add("Name", `${config.name}-bastion-host`);

    // ========================================
    // Parameter Store Values
    // ========================================

    /**
     * Store database connection details in Parameter Store
     * for easy access by ECS tasks and other services
     */
    new ssm.StringParameter(this, "DbEndpointParameter", {
      parameterName: `/skilltree/${config.name}/database/endpoint`,
      stringValue: this.databaseEndpoint,
      description: "Database cluster endpoint",
      tier: ssm.ParameterTier.STANDARD,
    });

    new ssm.StringParameter(this, "DbPortParameter", {
      parameterName: `/skilltree/${config.name}/database/port`,
      stringValue: this.databasePort.toString(),
      description: "Database port",
      tier: ssm.ParameterTier.STANDARD,
    });

    new ssm.StringParameter(this, "DbNameParameter", {
      parameterName: `/skilltree/${config.name}/database/name`,
      stringValue: this.databaseName,
      description: "Database name",
      tier: ssm.ParameterTier.STANDARD,
    });

    // Create connection string parameter (without password)
    const connectionStringTemplate = `postgresql://postgres:<PASSWORD>@${this.databaseEndpoint}:${this.databasePort}/${this.databaseName}`;
    new ssm.StringParameter(this, "DbConnectionStringParameter", {
      parameterName: `/skilltree/${config.name}/database/connection-string-template`,
      stringValue: connectionStringTemplate,
      description: "Database connection string template (replace <PASSWORD>)",
      tier: ssm.ParameterTier.STANDARD,
    });

    // ========================================
    // CloudFormation Outputs
    // ========================================

    new cdk.CfnOutput(this, "ClusterEndpoint", {
      value: this.cluster.clusterEndpoint.hostname,
      description: "Aurora cluster writer endpoint",
      exportName: `${config.name}-ClusterEndpoint`,
    });

    new cdk.CfnOutput(this, "ClusterReaderEndpoint", {
      value: this.cluster.clusterReadEndpoint.hostname,
      description: "Aurora cluster reader endpoint",
      exportName: `${config.name}-ClusterReaderEndpoint`,
    });

    new cdk.CfnOutput(this, "ClusterPort", {
      value: this.cluster.clusterEndpoint.port.toString(),
      description: "Aurora cluster port",
      exportName: `${config.name}-ClusterPort`,
    });

    new cdk.CfnOutput(this, "DatabaseName", {
      value: this.databaseName,
      description: "Database name",
      exportName: `${config.name}-DatabaseName`,
    });

    new cdk.CfnOutput(this, "SecretArn", {
      value: this.secret.secretArn,
      description: "Database credentials secret ARN",
      exportName: `${config.name}-DatabaseSecretArn`,
    });

    new cdk.CfnOutput(this, "BastionInstanceId", {
      value: this.bastionHost.instanceId,
      description: "Bastion host instance ID",
      exportName: `${config.name}-BastionInstanceId`,
    });

    new cdk.CfnOutput(this, "BastionPublicIp", {
      value: this.bastionHost.instancePublicIp,
      description: "Bastion host public IP address",
      exportName: `${config.name}-BastionPublicIp`,
    });

    new cdk.CfnOutput(this, "ConnectionInstructions", {
      value: [
        "Connect to RDS via bastion host:",
        "",
        "1. Start SSM session to bastion:",
        `   aws ssm start-session --target ${this.bastionHost.instanceId}`,
        "",
        "2. Create port forwarding tunnel (run locally):",
        `   aws ssm start-session --target ${this.bastionHost.instanceId} \\`,
        `     --document-name AWS-StartPortForwardingSessionToRemoteHost \\`,
        `     --parameters '{"host":["${this.databaseEndpoint}"],"portNumber":["5432"],"localPortNumber":["5432"]}'`,
        "",
        "3. Connect with psql (in another terminal):",
        `   psql -h localhost -p 5432 -U postgres -d ${this.databaseName}`,
        "",
        "Password is stored in AWS Secrets Manager:",
        `   aws secretsmanager get-secret-value --secret-id ${this.secret.secretName} --query SecretString --output text`,
      ].join("\n"),
      description: "Instructions for connecting to the database via bastion",
    });
  }
}
