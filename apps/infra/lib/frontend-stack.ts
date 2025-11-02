import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { EnvironmentConfig } from "./config";
import { StaticSite } from "./constructs/static-site";

/**
 * Props for FrontendStack
 */
export interface FrontendStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

/**
 * Frontend Stack
 *
 * Creates the infrastructure for the React frontend application:
 * - S3 bucket for static website files
 * - CloudFront distribution with HTTPS
 * - SSL certificate via ACM
 * - Route53 DNS record
 * - Security headers
 * - Optimized caching policies (long TTL for assets, short TTL for HTML)
 * - SPA routing support (404 → index.html)
 *
 * This stack is independent and can be deployed separately.
 * It uses the reusable StaticSite construct for all infrastructure.
 *
 * Domains:
 * - Dev: dev.skilltree.io
 * - Prod: app.skilltree.io
 *
 * Build Output:
 * - Frontend app is built with Vite
 * - Build directory: apps/admin-dashboard/dist/
 * - Deploy with: aws s3 sync dist/ s3://bucket-name/
 * - Invalidate CloudFront: aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
 */
export class FrontendStack extends cdk.Stack {
  /**
   * The CloudFront distribution serving the frontend
   */
  public readonly distribution: cdk.aws_cloudfront.IDistribution;

  /**
   * The S3 bucket containing the frontend files
   */
  public readonly bucket: cdk.aws_s3.IBucket;

  /**
   * The full website URL
   */
  public readonly websiteUrl: string;

  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    const { config } = props;

    // ========================================
    // Static Site Infrastructure
    // ========================================

    /**
     * Create the static site using the reusable construct
     * This includes S3, CloudFront, SSL certificate, and DNS
     */
    const staticSite = new StaticSite(this, "FrontendSite", {
      environmentName: config.name,
      domainName: config.domain,
      hostedZoneName: config.hostedZoneName,
      priceClass: config.cloudfront.priceClass,
      siteName: "frontend",
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

    cdk.Tags.of(this).add("Stack", "Frontend");
    cdk.Tags.of(this).add("Application", "AdminDashboard");
  }
}
