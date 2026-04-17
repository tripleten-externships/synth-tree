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
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as cloudwatchActions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as sns from "aws-cdk-lib/aws-sns";
import * as snsSubscriptions from "aws-cdk-lib/aws-sns-subscriptions";
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

  // SNS that receive cloudWatch alarm notification
  public readonly alarmTopic: sns.Topic;

  // CloudWatch dashboard for API, ECS, and RDS monitoring
  public readonly dashboard: cloudwatch.Dashboard;

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

    // this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, "Alb", {
    const alb = new elbv2.ApplicationLoadBalancer(this, "Alb", {
      vpc,
      internetFacing: true,
      securityGroup: albSecurityGroup,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      loadBalancerName: `${config.name}-api-alb`,
      deletionProtection: config.name === "synth-tree-prod",
    });
    this.loadBalancer = alb;
    // cdk.Tags.of(this.loadBalancer).add("Name", `${config.name}-api-alb`);
    cdk.Tags.of(alb).add("Name", `${config.name}-api-alb`);

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
    // this.loadBalancer.addListener("HttpListener", {
    alb.addListener("HttpListener", {
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
    // this.loadBalancer.addListener("HttpListener", {
    alb.addListener("HttpsListener", {
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

    //================================================================================================================================================================
    //================================================================================================================================================================
    //================================================================================================================================================================

    // Monitoring: SNS alarm topic
    /*
     SNS topic for cloudWatch alarm notification
     if alarmEmail is set in config, an email subscription is created
     the subscriber must confirm the email before notification is sent
     */
    this.alarmTopic = new sns.Topic(this, "AlarmTopic", {
      topicName: `${config.name}-api-alarms`,
      displayName: `${config.name} API Alarms`,
    });

    if (config.monitoring.alarmEmail) {
      this.alarmTopic.addSubscription(
        new snsSubscriptions.EmailSubscription(config.monitoring.alarmEmail),
      );
    }

    // Monitoring: cloudwatch metrics

    const metricPeriod = cdk.Duration.minutes(5);

    // ALB metrics
    const requestCount = new cloudwatch.Metric({
      namespace: "AWS/ApplicationELB",
      metricName: "RequestCount",
      dimensionsMap: { LoadBalancer: alb.loadBalancerFullName },
      statistic: "Sum",
      period: metricPeriod,
      label: "Request Count",
    });

    const targetResponseTime = new cloudwatch.Metric({
      namespace: "AWS/ApplicationELB",
      metricName: "TargetResponseTime",
      dimensionsMap: { LoadBalancer: alb.loadBalancerFullName },
      statistic: "p99",
      period: metricPeriod,
      label: "Latency p99 (s)",
    });

    const http5xxCount = new cloudwatch.Metric({
      namespace: "AWS/ApplicationELB",
      metricName: "HTTPCode_Target_5XX_Count",
      dimensionsMap: { LoadBalancer: alb.loadBalancerFullName },
      statistic: "Sum",
      period: metricPeriod,
      label: "5XX Errors",
    });

    const http4xxCount = new cloudwatch.Metric({
      namespace: "AWS/ApplicationELB",
      metricName: "HTTPCode_Target_4XX_Count",
      dimensionsMap: { LoadBalancer: alb.loadBalancerFullName },
      statistic: "Sum",
      period: metricPeriod,
      label: "4XX Errors",
    });

    const healthyHostCount = new cloudwatch.Metric({
      namespace: "AWS/ApplicationELB",
      metricName: "HealthyHostCount",
      dimensionsMap: {
        LoadBalancer: alb.loadBalancerFullName,
        TargetGroup: targetGroup.targetGroupFullName,
      },
      statistic: "Minimum",
      period: metricPeriod,
      label: "Healthy Hosts",
    });

    const unhealthyHostCount = new cloudwatch.Metric({
      namespace: "AWS/ApplicationELB",
      metricName: "UnHealthyHostCount",
      dimensionsMap: {
        LoadBalancer: alb.loadBalancerFullName,
        TargetGroup: targetGroup.targetGroupFullName,
      },
      statistic: "Maximum",
      period: metricPeriod,
      label: "Unhealthy Hosts",
    });

    // ECS metrics
    const ecsCpu = this.service.metricCpuUtilization({
      period: metricPeriod,
      label: "ECS CPU (%)",
    });

    const ecsMemory = this.service.metricMemoryUtilization({
      period: metricPeriod,
      label: "ECS Memory (%)",
    });

    // Running task count from container insight
    const ecsTaskCount = new cloudwatch.Metric({
      namespace: "ECS/ContainerInsights",
      metricName: "RunningTaskCount",
      dimensionsMap: {
        ClusterName: this.cluster.clusterName,
        ServiceName: this.service.serviceName,
      },
      statistic: "Average",
      period: metricPeriod,
      label: "Running Tasks",
    });

    // RDS/Aurora metrics
    const rdsConnections = new cloudwatch.Metric({
      namespace: "AWS/RDS",
      metricName: "DatabaseConnections",
      dimensionsMap: { DBClusterIdentifier: databaseCluster.clusterIdentifier },
      statistic: "Average",
      period: metricPeriod,
      label: "DB Connections",
    });

    const rdsCpu = new cloudwatch.Metric({
      namespace: "AWS/RDS",
      metricName: "CPUUtilization",
      dimensionsMap: { DBClusterIdentifier: databaseCluster.clusterIdentifier },
      statistic: "Average",
      period: metricPeriod,
      label: "RDS CPU (%)",
    });

    const rdsCapacity = new cloudwatch.Metric({
      namespace: "AWS/RDS",
      metricName: "ServerlessDatabaseCapacity",
      dimensionsMap: { DBClusterIdentifier: databaseCluster.clusterIdentifier },
      statistic: "Average",
      period: metricPeriod,
      label: "Aurora Capacity (ACUs)",
    });

    const rdsCommitLatency = new cloudwatch.Metric({
      namespace: "AWS/RDS",
      metricName: "CommitLatency",
      dimensionsMap: { DBClusterIdentifier: databaseCluster.clusterIdentifier },
      statistic: "Average",
      period: metricPeriod,
      label: "Commit Latency (ms)",
    });

    // ================================================================================
    // Monitoring: cloudWatch alarm
    const alarmAction = new cloudwatchActions.SnsAction(this.alarmTopic);

    // ALB p99 latency exceed threshold
    const latencyAlarm = new cloudwatch.Alarm(this, "HighLatencyAlarm", {
      alarmName: `${config.name}-high-latency`,
      alarmDescription: `API p99 latency exceeded ${config.monitoring.latencyThresholdSeconds}s`,
      metric: targetResponseTime,
      threshold: config.monitoring.latencyThresholdSeconds,
      evaluationPeriods: 3,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    latencyAlarm.addAlarmAction(alarmAction);
    latencyAlarm.addOkAction(alarmAction);

    /*
     5XX error rate alarm using following math expression to calculate traffic:  rate = (5xx count / total request) * 100
     treatMissingData = NOT_BREACHING handle the zero-request case safely
     */
    const errorRateAlarm = new cloudwatch.Alarm(this, "HighErrorRateAlarm", {
      alarmName: `${config.name}-high-error-rate`,
      alarmDescription: `5XX error rate exceeded ${config.monitoring.errorRateThresholdPercent}%`,
      metric: new cloudwatch.MathExpression({
        expression: "m5xx / mRequests * 100",
        usingMetrics: { m5xx: http5xxCount, mRequests: requestCount },
        period: metricPeriod,
        label: "5XX Error Rate (%)",
      }),
      threshold: config.monitoring.errorRateThresholdPercent,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    errorRateAlarm.addAlarmAction(alarmAction);
    errorRateAlarm.addOkAction(alarmAction);

    // one or more ALB target became unhealthy
    const unhealthyHostAlarm = new cloudwatch.Alarm(
      this,
      "UnhealthyHostsAlarm",
      {
        alarmName: `${config.name}-unhealthy-hosts`,
        alarmDescription: "One or more ALB targets are unhealthy",
        metric: unhealthyHostCount,
        threshold: 0,
        evaluationPeriods: 2,
        comparisonOperator:
          cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      },
    );
    unhealthyHostAlarm.addAlarmAction(alarmAction);
    unhealthyHostAlarm.addOkAction(alarmAction);

    // ECS cpu utilization alarm
    const ecsCpuAlarm = new cloudwatch.Alarm(this, "EcsCpuAlarm", {
      alarmName: `${config.name}-ecs-high-cpu`,
      alarmDescription: `ECS CPU exceeded ${config.monitoring.cpuAlarmPercent}%`,
      metric: ecsCpu,
      threshold: config.monitoring.cpuAlarmPercent,
      evaluationPeriods: 3,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    ecsCpuAlarm.addAlarmAction(alarmAction);
    ecsCpuAlarm.addOkAction(alarmAction);

    // ECS memory utilization alarm
    const ecsMemoryAlarm = new cloudwatch.Alarm(this, "EcsMemoryAlarm", {
      alarmName: `${config.name}-ecs-high-memory`,
      alarmDescription: `ECS memory exceeded ${config.monitoring.memoryAlarmPercent}%`,
      metric: ecsMemory,
      threshold: config.monitoring.memoryAlarmPercent,
      evaluationPeriods: 3,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    ecsMemoryAlarm.addAlarmAction(alarmAction);
    ecsMemoryAlarm.addOkAction(alarmAction);

    // RDS cpu utilization alarm
    const rdsCpuAlarm = new cloudwatch.Alarm(this, "RdsCpuAlarm", {
      alarmName: `${config.name}-rds-high-cpu`,
      alarmDescription: `RDS CPU exceeded ${config.monitoring.cpuAlarmPercent}%`,
      metric: rdsCpu,
      threshold: config.monitoring.cpuAlarmPercent,
      evaluationPeriods: 3,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    rdsCpuAlarm.addAlarmAction(alarmAction);
    rdsCpuAlarm.addOkAction(alarmAction);

    // RDS database connection count alarm
    const rdsConnectionsAlarm = new cloudwatch.Alarm(
      this,
      "RdsConnectionsAlarm",
      {
        alarmName: `${config.name}-rds-high-connections`,
        alarmDescription: `RDS connections exceeded ${config.monitoring.dbConnectionAlarmThreshold}`,
        metric: rdsConnections,
        threshold: config.monitoring.dbConnectionAlarmThreshold,
        evaluationPeriods: 2,
        comparisonOperator:
          cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      },
    );
    rdsConnectionsAlarm.addAlarmAction(alarmAction);
    rdsConnectionsAlarm.addOkAction(alarmAction);

    // ================================================================================

    // Monitoring: cloudwatch dashboard
    this.dashboard = new cloudwatch.Dashboard(this, "ApiDashboard", {
      dashboardName: `${config.name}-api-dashboard`,
      defaultInterval: cdk.Duration.hours(3),
    });

    // this is header
    this.dashboard.addWidgets(
      new cloudwatch.TextWidget({
        markdown: [
          `# ${config.name} — API Monitoring`,
          `**Region:** ${this.region} | **API:** ${this.apiUrl} | _5-minute metric periods_`,
        ].join("\n"),
        width: 24,
        height: 1,
      }),
    );

    // alarm status overview
    this.dashboard.addWidgets(
      new cloudwatch.AlarmStatusWidget({
        title: "Alarm Status",
        alarms: [
          latencyAlarm,
          errorRateAlarm,
          unhealthyHostAlarm,
          ecsCpuAlarm,
          ecsMemoryAlarm,
          rdsCpuAlarm,
          rdsConnectionsAlarm,
        ],
        width: 24,
        height: 3,
      }),
    );

    // ALB - request rate, latency, errors, host health
    this.dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: "Request Rate",
        left: [requestCount],
        width: 6,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "Latency p99 (seconds)",
        left: [targetResponseTime],
        leftYAxis: { label: "Seconds", showUnits: false },
        leftAnnotations: [
          {
            value: config.monitoring.latencyThresholdSeconds,
            color: cloudwatch.Color.RED,
            label: "Alarm threshold",
          },
        ],
        width: 6,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "HTTP Error Counts",
        left: [http5xxCount, http4xxCount],
        width: 6,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "Target Health",
        left: [healthyHostCount, unhealthyHostCount],
        width: 6,
        height: 6,
      }),
    );

    // ECS - cpu, memory, running task count
    this.dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: "ECS CPU Utilization",
        left: [ecsCpu],
        leftYAxis: { label: "Percent", min: 0, max: 100, showUnits: false },
        leftAnnotations: [
          {
            value: config.monitoring.cpuAlarmPercent,
            color: cloudwatch.Color.RED,
            label: "Alarm threshold",
          },
        ],
        width: 8,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "ECS Memory Utilization",
        left: [ecsMemory],
        leftYAxis: { label: "Percent", min: 0, max: 100, showUnits: false },
        leftAnnotations: [
          {
            value: config.monitoring.memoryAlarmPercent,
            color: cloudwatch.Color.RED,
            label: "Alarm threshold",
          },
        ],
        width: 8,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "Running Task Count",
        left: [ecsTaskCount],
        width: 8,
        height: 6,
      }),
    );

    // RDS - connection, cpu, aurora capacity, commit latency
    this.dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: "RDS Database Connections",
        left: [rdsConnections],
        leftAnnotations: [
          {
            value: config.monitoring.dbConnectionAlarmThreshold,
            color: cloudwatch.Color.RED,
            label: "Alarm threshold",
          },
        ],
        width: 6,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "RDS CPU Utilization",
        left: [rdsCpu],
        leftYAxis: { label: "Percent", min: 0, max: 100, showUnits: false },
        leftAnnotations: [
          {
            value: config.monitoring.cpuAlarmPercent,
            color: cloudwatch.Color.RED,
            label: "Alarm threshold",
          },
        ],
        width: 6,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "Aurora Serverless Capacity (ACUs)",
        left: [rdsCapacity],
        leftYAxis: { label: "ACUs", showUnits: false },
        width: 6,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: "RDS Commit Latency",
        left: [rdsCommitLatency],
        leftYAxis: { label: "Milliseconds", showUnits: false },
        width: 6,
        height: 6,
      }),
    );

    // ================================================================================

    // CloudFormation output
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

    new cdk.CfnOutput(this, "DashboardUrl", {
      value: `https://${this.region}.console.aws.amazon.com/cloudwatch/home#dashboards:name=${config.name}-api-dashboard`,
      description: "CloudWatch dashboard URL",
      exportName: `${config.name}-DashboardUrl`,
    });

    new cdk.CfnOutput(this, "AlarmTopicArn", {
      value: this.alarmTopic.topicArn,
      description: "SNS alarm topic ARN",
      exportName: `${config.name}-AlarmTopicArn`,
    });
  }
}
