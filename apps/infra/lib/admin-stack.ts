import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { EnvironmentConfig } from "./config";
import { StaticSite } from "./constructs/static-site";

/**
 * Props for AdminStack
 */
export interface AdminStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

/**
 * Admin Stack
 *
 * Hosts the **admin-dashboard** React app on its own subdomain, kept as a
 * SEPARATE static site from FrontendStack so no admin code ever ships in the
 * client (learner) bundle.
 *
 * Mirrors FrontendStack but with `siteName: "admin"` and `config.adminDomain`,
 * so it gets its own S3 bucket, CloudFront distribution, ACM certificate,
 * Route53 record, and CloudFormation exports (`<env>-admin-*`).
 *
 * Domains:
 * - Dev: admin.dev.synth-tree.com
 * - Prod: admin.synth-tree.com
 *
 * Build Output:
 * - Admin app is built with Vite
 * - Build directory: apps/admin-dashboard/dist/
 * - Deploy with: aws s3 sync dist/ s3://bucket-name/
 * - Invalidate CloudFront: aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
 */
export class AdminStack extends cdk.Stack {
  /**
   * The CloudFront distribution serving the admin dashboard
   */
  public readonly distribution: cdk.aws_cloudfront.IDistribution;

  /**
   * The S3 bucket containing the admin dashboard files
   */
  public readonly bucket: cdk.aws_s3.IBucket;

  /**
   * The full website URL
   */
  public readonly websiteUrl: string;

  constructor(scope: Construct, id: string, props: AdminStackProps) {
    super(scope, id, props);

    const { config } = props;

    // ========================================
    // Static Site Infrastructure
    // ========================================

    /**
     * Create the static site using the reusable construct
     * This includes S3, CloudFront, SSL certificate, and DNS
     */
    const staticSite = new StaticSite(this, "AdminSite", {
      environmentName: config.name,
      domainName: config.adminDomain,
      hostedZoneName: config.hostedZoneName,
      priceClass: config.cloudfront.priceClass,
      siteName: "admin",
      enableSpaRouting: true, // Enable SPA routing for React app
      defaultTtl: config.cloudfront.defaultTtl,
      maxTtl: config.cloudfront.maxTtl,
      minTtl: config.cloudfront.minTtl,
    });

    // Export public properties
    this.distribution = staticSite.distribution;
    this.bucket = staticSite.bucket;
    this.websiteUrl = staticSite.websiteUrl;

    // ========================================
    // Additional Tags
    // ========================================

    cdk.Tags.of(this).add("Stack", "Admin");
    cdk.Tags.of(this).add("Application", "AdminDashboard");
  }
}
