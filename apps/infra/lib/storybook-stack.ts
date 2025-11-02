import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { EnvironmentConfig } from "./config";
import { StaticSite } from "./constructs/static-site";

/**
 * Props for StorybookStack
 */
export interface StorybookStackProps extends cdk.StackProps {
  config: EnvironmentConfig;
}

/**
 * Storybook Stack
 *
 * Creates the infrastructure for the Storybook component library:
 * - S3 bucket for static website files
 * - CloudFront distribution with HTTPS
 * - SSL certificate via ACM
 * - Route53 DNS record
 * - Security headers
 * - Optimized caching policies (long TTL for assets, short TTL for HTML)
 * - Standard HTML navigation (no SPA routing needed)
 *
 * This stack is independent and can be deployed separately.
 * It uses the reusable StaticSite construct for all infrastructure.
 *
 * Domains:
 * - Dev: storybook.dev.synth-tree.com
 * - Prod: storybook.synth-tree.com
 *
 * Build Output:
 * - Storybook is built from the UI package
 * - Build directory: packages/ui/storybook-static/
 * - Deploy with: aws s3 sync storybook-static/ s3://bucket-name/
 * - Invalidate CloudFront: aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
 */
export class StorybookStack extends cdk.Stack {
  /**
   * The CloudFront distribution serving Storybook
   */
  public readonly distribution: cdk.aws_cloudfront.IDistribution;

  /**
   * The S3 bucket containing the Storybook files
   */
  public readonly bucket: cdk.aws_s3.IBucket;

  /**
   * The full website URL
   */
  public readonly websiteUrl: string;

  constructor(scope: Construct, id: string, props: StorybookStackProps) {
    super(scope, id, props);

    const { config } = props;

    // ========================================
    // Static Site Infrastructure
    // ========================================

    /**
     * Create the static site using the reusable construct
     * This includes S3, CloudFront, SSL certificate, and DNS
     */
    const staticSite = new StaticSite(this, "StorybookSite", {
      environmentName: config.name,
      domainName: config.storybookDomain,
      hostedZoneName: config.hostedZoneName,
      priceClass: config.cloudfront.priceClass,
      siteName: "storybook",
      enableSpaRouting: false, // Storybook uses standard HTML navigation
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

    cdk.Tags.of(this).add("Stack", "Storybook");
    cdk.Tags.of(this).add("Application", "UI");
  }
}
