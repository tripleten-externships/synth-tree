import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { EnvironmentConfig } from "./config";

/**
 * Props for NetworkStack
 */
export interface NetworkStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

/**
 * Network Stack
 *
 * Creates the VPC infrastructure including:
 * - VPC with public and private subnets across 2 AZs
 * - Internet Gateway for public subnets
 * - NAT Gateways for private subnet internet access
 * - Security Groups for ALB, ECS, RDS, and Bastion
 *
 * This stack has no dependencies and should be deployed first.
 *
 * Architecture:
 * - VPC CIDR: 10.0.0.0/16
 * - Public Subnets: 10.0.1.0/24, 10.0.2.0/24 (for ALB, NAT Gateway, Bastion)
 * - Private Subnets: 10.0.10.0/24, 10.0.11.0/24 (for ECS, RDS)
 * - 2 Availability Zones for high availability
 */
export class NetworkStack extends cdk.Stack {
  /**
   * The VPC created by this stack
   * Used by other stacks that need to deploy resources in the network
   */
  public readonly vpc: ec2.IVpc;

  /**
   * Public subnets for internet-facing resources (ALB, NAT Gateway, Bastion)
   */
  public readonly publicSubnets: ec2.ISubnet[];

  /**
   * Private subnets for internal resources (ECS tasks, RDS)
   */
  public readonly privateSubnets: ec2.ISubnet[];

  /**
   * Security group for the Application Load Balancer
   * Allows HTTPS (443) and HTTP (80) traffic from the internet
   */
  public readonly albSecurityGroup: ec2.ISecurityGroup;

  /**
   * Security group for ECS tasks
   * Allows traffic from ALB on container port (3000)
   */
  public readonly ecsSecurityGroup: ec2.ISecurityGroup;

  /**
   * Security group for RDS/Aurora database
   * Allows PostgreSQL (5432) traffic from ECS and Bastion
   */
  public readonly databaseSecurityGroup: ec2.ISecurityGroup;

  /**
   * Security group for Bastion host
   * Allows SSH (22) from the internet
   */
  public readonly bastionSecurityGroup: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

    const { config } = props;

    // ========================================
    // VPC Configuration
    // ========================================

    /**
     * Create VPC with custom subnet configuration
     * We manually configure subnets to have precise control over CIDR blocks
     * and ensure they match our architecture specifications exactly.
     */
    this.vpc = new ec2.Vpc(this, "Vpc", {
      ipAddresses: ec2.IpAddresses.cidr(config.vpcCidr),
      maxAzs: config.maxAzs,

      // Enable DNS for service discovery and private hosted zones
      enableDnsHostnames: true,
      enableDnsSupport: true,

      // Define NAT Gateway strategy based on environment
      // Dev: 1 NAT Gateway total for cost savings
      // Prod: 1 NAT Gateway per AZ for high availability
      natGateways: config.name === "prod" ? config.maxAzs : 1,

      // Configure subnet groups
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24, // /24 = 256 IPs per subnet
          mapPublicIpOnLaunch: true,
        },
        {
          name: "Private",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24, // /24 = 256 IPs per subnet
        },
      ],
    });

    // Store subnet references for exports
    this.publicSubnets = this.vpc.publicSubnets;
    this.privateSubnets = this.vpc.privateSubnets;

    // Tag all VPC resources with environment
    cdk.Tags.of(this.vpc).add("Name", `${config.name}-vpc`);
    cdk.Tags.of(this.vpc).add("Environment", config.name);

    // ========================================
    // Security Groups
    // ========================================

    /**
     * ALB Security Group
     * Allows inbound HTTPS and HTTP traffic from the internet
     * Allows outbound traffic to ECS tasks on the container port
     */
    this.albSecurityGroup = new ec2.SecurityGroup(this, "AlbSecurityGroup", {
      vpc: this.vpc,
      description: "Security group for Application Load Balancer",
      allowAllOutbound: false, // We'll add specific egress rules
    });

    // Allow HTTPS from internet
    this.albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      "Allow HTTPS from internet"
    );

    // Allow HTTP from internet (for redirect to HTTPS)
    this.albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP from internet (redirect to HTTPS)"
    );

    cdk.Tags.of(this.albSecurityGroup).add("Name", `${config.name}-alb-sg`);

    /**
     * ECS Security Group
     * Allows inbound traffic from ALB on container port
     * Allows outbound HTTPS for pulling images and API calls
     * Allows outbound PostgreSQL to RDS
     */
    this.ecsSecurityGroup = new ec2.SecurityGroup(this, "EcsSecurityGroup", {
      vpc: this.vpc,
      description: "Security group for ECS tasks",
      allowAllOutbound: false, // We'll add specific egress rules
    });

    // Allow inbound from ALB on container port
    this.ecsSecurityGroup.addIngressRule(
      this.albSecurityGroup,
      ec2.Port.tcp(config.ecs.containerPort),
      "Allow traffic from ALB on container port"
    );

    // Allow outbound HTTPS for pulling Docker images and making API calls
    this.ecsSecurityGroup.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      "Allow HTTPS for pulling images and API calls"
    );

    cdk.Tags.of(this.ecsSecurityGroup).add("Name", `${config.name}-ecs-sg`);

    /**
     * RDS Security Group
     * Allows inbound PostgreSQL traffic from ECS tasks and Bastion host only
     */
    this.databaseSecurityGroup = new ec2.SecurityGroup(
      this,
      "RdsSecurityGroup",
      {
        vpc: this.vpc,
        description: "Security group for RDS database",
        allowAllOutbound: false, // Database doesn't need outbound
      }
    );

    cdk.Tags.of(this.databaseSecurityGroup).add(
      "Name",
      `${config.name}-rds-sg`
    );

    /**
     * Bastion Security Group
     * Allows inbound SSH from internet (will be further secured via key pair and SSM)
     * Allows all outbound for system updates and database access
     */
    this.bastionSecurityGroup = new ec2.SecurityGroup(
      this,
      "BastionSecurityGroup",
      {
        vpc: this.vpc,
        description: "Security group for Bastion host",
        allowAllOutbound: true, // Allow updates and RDS access
      }
    );

    // Allow SSH from internet
    // Note: In production, this should be restricted to specific IPs or use SSM Session Manager
    this.bastionSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH from internet (restrict to specific IPs in production)"
    );

    cdk.Tags.of(this.bastionSecurityGroup).add(
      "Name",
      `${config.name}-bastion-sg`
    );

    // ========================================
    // Security Group Cross-References
    // ========================================

    /**
     * Add cross-references between security groups after all are created
     * This avoids circular dependency issues
     */

    // ALB can send traffic to ECS on container port
    this.albSecurityGroup.addEgressRule(
      this.ecsSecurityGroup,
      ec2.Port.tcp(config.ecs.containerPort),
      "Allow traffic to ECS tasks on container port"
    );

    // ECS can connect to RDS on PostgreSQL port
    this.ecsSecurityGroup.addEgressRule(
      this.databaseSecurityGroup,
      ec2.Port.tcp(5432),
      "Allow PostgreSQL connection to RDS"
    );

    // RDS allows connections from ECS
    this.databaseSecurityGroup.addIngressRule(
      this.ecsSecurityGroup,
      ec2.Port.tcp(5432),
      "Allow PostgreSQL from ECS tasks"
    );

    // RDS allows connections from Bastion
    this.databaseSecurityGroup.addIngressRule(
      this.bastionSecurityGroup,
      ec2.Port.tcp(5432),
      "Allow PostgreSQL from Bastion host"
    );

    // ========================================
    // CloudFormation Outputs
    // ========================================

    new cdk.CfnOutput(this, "VpcId", {
      value: this.vpc.vpcId,
      description: "VPC ID",
      exportName: `${config.name}-VpcId`,
    });

    new cdk.CfnOutput(this, "VpcCidr", {
      value: this.vpc.vpcCidrBlock,
      description: "VPC CIDR block",
      exportName: `${config.name}-VpcCidr`,
    });

    new cdk.CfnOutput(this, "AvailabilityZones", {
      value: this.vpc.availabilityZones.join(","),
      description: "Availability Zones used by the VPC",
      exportName: `${config.name}-AvailabilityZones`,
    });

    new cdk.CfnOutput(this, "PublicSubnetIds", {
      value: this.publicSubnets.map((subnet) => subnet.subnetId).join(","),
      description: "Public subnet IDs",
      exportName: `${config.name}-PublicSubnetIds`,
    });

    new cdk.CfnOutput(this, "PrivateSubnetIds", {
      value: this.privateSubnets.map((subnet) => subnet.subnetId).join(","),
      description: "Private subnet IDs",
      exportName: `${config.name}-PrivateSubnetIds`,
    });

    new cdk.CfnOutput(this, "AlbSecurityGroupId", {
      value: this.albSecurityGroup.securityGroupId,
      description: "ALB Security Group ID",
      exportName: `${config.name}-AlbSecurityGroupId`,
    });

    new cdk.CfnOutput(this, "EcsSecurityGroupId", {
      value: this.ecsSecurityGroup.securityGroupId,
      description: "ECS Security Group ID",
      exportName: `${config.name}-EcsSecurityGroupId`,
    });

    new cdk.CfnOutput(this, "RdsSecurityGroupId", {
      value: this.databaseSecurityGroup.securityGroupId,
      description: "RDS Security Group ID",
      exportName: `${config.name}-RdsSecurityGroupId`,
    });

    new cdk.CfnOutput(this, "BastionSecurityGroupId", {
      value: this.bastionSecurityGroup.securityGroupId,
      description: "Bastion Security Group ID",
      exportName: `${config.name}-BastionSecurityGroupId`,
    });
  }
}
