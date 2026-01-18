import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as logs from "aws-cdk-lib/aws-logs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as rds from "aws-cdk-lib/aws-rds";
import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import * as applicationautoscaling from "aws-cdk-lib/aws-applicationautoscaling";
import { Construct } from "constructs";
import { EnvironmentConfig } from "./config";

/**
 * Props for ApiStack
 */
export interface ApiStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
  vpc: ec2.IVpc;
  albSecurityGroup: ec2.ISecurityGroup;
  ecsSecurityGroup: ec2.ISecurityGroup;
  databaseSecret: secretsmanager.ISecret;
  databaseCluster: rds.IDatabaseCluster;
}

/**
 * API Stack
 *
 * Creates the ECS Fargate infrastructure for the GraphQL API:
 * - Application Load Balancer (internet-facing)
 * - ECS Cluster with Container Insights
 * - ECS Fargate Service with auto-scaling
 * - Task Definition with container configuration
 * - CloudWatch Logs for application logging
 * - SSL/TLS certificate for API domain
 * - Route53 DNS record
 * - Task execution role with permissions for Secrets Manager and ECR
 * - Task role for runtime permissions
 *
 * Dependencies:
 * - Network Stack (VPC, security groups)
 * - Database Stack (database secret and cluster endpoint)
 *
 * Configuration (from EnvironmentConfig):
 * - Dev: 0.5 vCPU, 1GB RAM, 1 task
 * - Prod: 1 vCPU, 2GB RAM, 2-10 tasks with auto-scaling
 *
 * Auto-scaling based on:
 * - CPU utilization (target: 70%)
 */
export class ApiStack extends cdk.Stack {
  /**
   * The ECS cluster
   */
  public readonly cluster: ecs.ICluster;

  /**
   * The ECS service
   */
  public readonly service: ecs.FargateService;

  /**
   * The Application Load Balancer
   */
  public readonly loadBalancer: elbv2.IApplicationLoadBalancer;

  /**
   * The API URL (ALB DNS name or custom domain)
   */
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const {
      config,
      vpc,
      albSecurityGroup,
      ecsSecurityGroup,
      databaseSecret,
      databaseCluster,
    } = props;

    // ========================================
    // ECR Repository
    // ========================================

    /**
     * ECR repository for API container images
     */
    const apiRepository = new ecr.Repository(this, "ApiRepository", {
      repositoryName: `${config.name}-api`,
      removalPolicy:
        config.name === "synth-tree-prod"
          ? cdk.RemovalPolicy.RETAIN
          : cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: config.name !== "synth-tree-prod", // Clean up images when stack is deleted
      imageScanOnPush: true, // Enable vulnerability scanning
    });

    // ========================================
    // SSL Certificate
    // ========================================

    /**
     * Look up the existing Route53 hosted zone for synth-tree.com
     * This must exist before deploying the stack
     */
    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: config.hostedZoneName,
    });

    /**
     * Create SSL/TLS certificate for the API domain
     * Uses DNS validation with Route53
     */
    const certificate = new certificatemanager.Certificate(
      this,
      "ApiCertificate",
      {
        domainName: config.apiDomain,
        validation:
          certificatemanager.CertificateValidation.fromDns(hostedZone),
      },
    );

    // ========================================
    // Application Load Balancer
    // ========================================

    /**
     * Create internet-facing Application Load Balancer
     * Deployed in public subnets
     */
    this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, "Alb", {
      vpc,
      internetFacing: true,
      securityGroup: albSecurityGroup,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      loadBalancerName: `${config.name}-api-alb`,
      deletionProtection: config.name === "synth-tree-prod",
    });

    cdk.Tags.of(this.loadBalancer).add("Name", `${config.name}-api-alb`);

    /**
     * Create target group for ECS tasks
     * Health check on /health endpoint
     */
    const targetGroup = new elbv2.ApplicationTargetGroup(
      this,
      "ApiTargetGroup",
      {
        vpc,
        port: config.ecs.containerPort,
        protocol: elbv2.ApplicationProtocol.HTTP,
        targetType: elbv2.TargetType.IP,
        healthCheck: {
          enabled: true,
          path: config.ecs.healthCheckPath,
          interval: cdk.Duration.seconds(30),
          timeout: cdk.Duration.seconds(5),
          healthyThresholdCount: 2,
          unhealthyThresholdCount: 3,
          healthyHttpCodes: "200",
        },
        deregistrationDelay: cdk.Duration.seconds(30),
      },
    );

    /**
     * HTTP listener - redirects to HTTPS
     */
    this.loadBalancer.addListener("HttpListener", {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultAction: elbv2.ListenerAction.redirect({
        protocol: "HTTPS",
        port: "443",
        permanent: true,
      }),
    });

    /**
     * HTTPS listener - forwards to target group
     */
    this.loadBalancer.addListener("HttpsListener", {
      port: 443,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [certificate],
      defaultAction: elbv2.ListenerAction.forward([targetGroup]),
    });

    // ========================================
    // Route53 DNS Record
    // ========================================

    /**
     * Create A record (alias) pointing to the ALB
     */
    new route53.ARecord(this, "ApiDnsRecord", {
      zone: hostedZone,
      recordName: config.apiDomain,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.LoadBalancerTarget(this.loadBalancer),
      ),
      comment: `API endpoint for ${config.name} environment`,
    });

    // Set the API URL
    this.apiUrl = `https://${config.apiDomain}`;

    // ========================================
    // ECS Cluster
    // ========================================

    /**
     * Create ECS Fargate cluster with Container Insights enabled
     */
    this.cluster = new ecs.Cluster(this, "Cluster", {
      vpc,
      clusterName: `${config.name}-api-cluster`,
      // Use containerInsightsV2 instead of deprecated containerInsights
      containerInsights: true,
      enableFargateCapacityProviders: true,
    });

    cdk.Tags.of(this.cluster).add("Name", `${config.name}-api-cluster`);

    // ========================================
    // CloudWatch Log Group
    // ========================================

    /**
     * Create log group for container logs
     * Retention period varies by environment
     */
    const logGroup = new logs.LogGroup(this, "ApiLogGroup", {
      logGroupName: `/ecs/${config.name}/api`,
      retention:
        config.name === "synth-tree-prod"
          ? logs.RetentionDays.ONE_MONTH
          : logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ========================================
    // Task Execution Role
    // ========================================

    /**
     * IAM role for ECS task execution
     * Allows ECS agent to pull images, write logs, and read secrets
     */
    const taskExecutionRole = new iam.Role(this, "TaskExecutionRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      description: "ECS task execution role for API service",
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonECSTaskExecutionRolePolicy",
        ),
      ],
    });

    // Grant permissions to read database secret
    databaseSecret.grantRead(taskExecutionRole);

    // Import Firebase secret from Secrets Manager
    const firebaseSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "FirebaseSecret",
      `/skilltree/${config.name}/firebase`,
    );

    // Grant permissions to read Firebase secret
    firebaseSecret.grantRead(taskExecutionRole);

    // Grant permissions to read parameters from Parameter Store
    taskExecutionRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["ssm:GetParameters", "ssm:GetParameter"],
        resources: [
          `arn:aws:ssm:${this.region}:${this.account}:parameter/skilltree/${config.name}/*`,
        ],
      }),
    );

    // ========================================
    // Task Role
    // ========================================

    /**
     * IAM role for the running container
     * Allows the application to access AWS services
     */
    const taskRole = new iam.Role(this, "TaskRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      description: "ECS task role for API service runtime",
    });

    // Grant permissions to read database secret
    databaseSecret.grantRead(taskRole);

    // Grant permissions to read parameters from Parameter Store
    taskRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["ssm:GetParameters", "ssm:GetParameter"],
        resources: [
          `arn:aws:ssm:${this.region}:${this.account}:parameter/skilltree/${config.name}/*`,
        ],
      }),
    );

    // ========================================
    // Task Definition
    // ========================================

    /**
     * Create Fargate task definition
     * Defines CPU, memory, and container configuration
     */
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "ApiTaskDefinition",
      {
        family: `${config.name}-api`,
        cpu: config.ecs.cpu,
        memoryLimitMiB: config.ecs.memory,
        executionRole: taskExecutionRole,
        taskRole: taskRole,
        runtimePlatform: {
          cpuArchitecture: ecs.CpuArchitecture.X86_64,
          operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        },
      },
    );

    /**
     * Add container to task definition
     */
    const container = taskDefinition.addContainer("ApiContainer", {
      // image: ecs.ContainerImage.fromRegistry("nginxdemos/hello"),
      image: ecs.ContainerImage.fromEcrRepository(apiRepository, "latest"),

      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: "api",
        logGroup: logGroup,
      }),
      environment: {
        NODE_ENV:
          config.name === "synth-tree-prod" ? "production" : "development",
        PORT: config.ecs.containerPort.toString(),
        DATABASE_HOST: databaseCluster.clusterEndpoint.hostname,
        DATABASE_PORT: databaseCluster.clusterEndpoint.port.toString(),
        DATABASE_NAME: config.database.databaseName,
      },
      secrets: {
        // Database credentials from Secrets Manager
        DATABASE_USERNAME: ecs.Secret.fromSecretsManager(
          databaseSecret,
          "username",
        ),
        DATABASE_PASSWORD: ecs.Secret.fromSecretsManager(
          databaseSecret,
          "password",
        ),
        // Firebase credentials from Secrets Manager
        FIREBASE_PROJECT_ID: ecs.Secret.fromSecretsManager(
          firebaseSecret,
          "project_id",
        ),
        FIREBASE_CLIENT_EMAIL: ecs.Secret.fromSecretsManager(
          firebaseSecret,
          "client_email",
        ),
        FIREBASE_PRIVATE_KEY: ecs.Secret.fromSecretsManager(
          firebaseSecret,
          "private_key",
        ),
      },
      containerName: "api",
      essential: true,
      healthCheck: {
        command: [
          "CMD-SHELL",
          `curl -f http://localhost:${config.ecs.containerPort}${config.ecs.healthCheckPath} || exit 1`,
        ],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        retries: 3,
        startPeriod: cdk.Duration.seconds(60),
      },
    });

    /**
     * Add port mapping for container
     */
    container.addPortMappings({
      containerPort: config.ecs.containerPort,
      protocol: ecs.Protocol.TCP,
    });

    // ========================================
    // ECS Fargate Service
    // ========================================

    /**
     * Create ECS Fargate service
     * Deploys tasks in private subnets
     */
    this.service = new ecs.FargateService(this, "ApiService", {
      cluster: this.cluster,
      taskDefinition,
      serviceName: `${config.name}-api-service`,
      desiredCount: config.ecs.minTaskCount,
      minHealthyPercent: 50,
      maxHealthyPercent: 200,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [ecsSecurityGroup],
      assignPublicIp: false,
      healthCheckGracePeriod: cdk.Duration.seconds(60),
      circuitBreaker: {
        rollback: true,
      },
      enableExecuteCommand: true, // For debugging with ECS Exec
      capacityProviderStrategies: [
        {
          capacityProvider: "FARGATE",
          weight: 1,
          base: config.ecs.minTaskCount,
        },
      ],
    });

    /**
     * Attach service to target group
     */
    this.service.attachToApplicationTargetGroup(targetGroup);

    cdk.Tags.of(this.service).add("Name", `${config.name}-api-service`);

    // ========================================
    // Auto Scaling
    // ========================================

    /**
     * Configure auto-scaling for the ECS service
     * Only apply scaling rules if max > min (i.e., scaling is desired)
     */
    if (config.ecs.maxTaskCount > config.ecs.minTaskCount) {
      const scaling = this.service.autoScaleTaskCount({
        minCapacity: config.ecs.minTaskCount,
        maxCapacity: config.ecs.maxTaskCount,
      });

      /**
       * Scale based on CPU utilization
       * Target: 70% CPU utilization
       */
      scaling.scaleOnCpuUtilization("CpuScaling", {
        targetUtilizationPercent: config.ecs.targetCpuUtilization,
        scaleInCooldown: cdk.Duration.seconds(300),
        scaleOutCooldown: cdk.Duration.seconds(60),
      });

      /**
       * Scale based on memory utilization
       * Target: 70% memory utilization
       */
      scaling.scaleOnMemoryUtilization("MemoryScaling", {
        targetUtilizationPercent: config.ecs.targetMemoryUtilization,
        scaleInCooldown: cdk.Duration.seconds(300),
        scaleOutCooldown: cdk.Duration.seconds(60),
      });
    }

    // ========================================
    // CloudFormation Outputs
    // ========================================

    new cdk.CfnOutput(this, "ApiUrl", {
      value: this.apiUrl,
      description: "API endpoint URL",
      exportName: `${config.name}-ApiUrl`,
    });

    new cdk.CfnOutput(this, "LoadBalancerDns", {
      value: this.loadBalancer.loadBalancerDnsName,
      description: "Load balancer DNS name",
      exportName: `${config.name}-LoadBalancerDns`,
    });

    new cdk.CfnOutput(this, "ClusterName", {
      value: this.cluster.clusterName,
      description: "ECS cluster name",
      exportName: `${config.name}-ClusterName`,
    });

    new cdk.CfnOutput(this, "ServiceName", {
      value: this.service.serviceName,
      description: "ECS service name",
      exportName: `${config.name}-ServiceName`,
    });

    new cdk.CfnOutput(this, "TargetGroupArn", {
      value: targetGroup.targetGroupArn,
      description: "Target group ARN",
      exportName: `${config.name}-TargetGroupArn`,
    });

    new cdk.CfnOutput(this, "LogGroupName", {
      value: logGroup.logGroupName,
      description: "CloudWatch log group name",
      exportName: `${config.name}-ApiLogGroupName`,
    });

    new cdk.CfnOutput(this, "ApiRepositoryUri", {
      value: apiRepository.repositoryUri,
      description: "ECR repository URI for the API",
      exportName: `${config.name}-ApiRepositoryUri`,
    });
  }
}
