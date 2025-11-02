import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

/**
 * Props for StaticSite construct
 */
export interface StaticSiteProps {
  /**
   * Environment name (dev, prod)
   */
  environmentName: string;

  /**
   * Domain name for the site (e.g., app.skilltree.io, storybook.skilltree.io)
   */
  domainName: string;

  /**
   * Hosted zone name (e.g., skilltree.io)
   */
  hostedZoneName: string;

  /**
   * CloudFront price class
   */
  priceClass: string;

  /**
   * Site name for resource naming (e.g., "frontend", "storybook")
   */
  siteName: string;

  /**
   * Whether to enable SPA routing (404 → index.html)
   * Default: true for frontend, false for storybook
   */
  enableSpaRouting?: boolean;

  /**
   * Default TTL for cache (in seconds)
   */
  defaultTtl: number;

  /**
   * Max TTL for cache (in seconds)
   */
  maxTtl: number;

  /**
   * Min TTL for cache (in seconds)
   */
  minTtl: number;
}

/**
 * StaticSite Construct
 *
 * Creates a complete static site infrastructure with:
 * - S3 bucket for hosting static files
 * - CloudFront distribution with HTTPS
 * - SSL certificate via ACM
 * - Route53 DNS record
 * - Security headers
 * - Optimized caching policies
 *
 * This construct is reusable for both frontend and storybook deployments.
 */
export class StaticSite extends Construct {
  /**
   * The S3 bucket containing the static site files
   */
  public readonly bucket: s3.IBucket;

  /**
   * The CloudFront distribution serving the site
   */
  public readonly distribution: cloudfront.IDistribution;

  /**
   * The full website URL (e.g., https://app.skilltree.io)
   */
  public readonly websiteUrl: string;

  /**
   * The SSL certificate for the domain
   */
  public readonly certificate: certificatemanager.ICertificate;

  constructor(scope: Construct, id: string, props: StaticSiteProps) {
    super(scope, id);

    const {
      environmentName,
      domainName,
      hostedZoneName,
      priceClass,
      siteName,
      enableSpaRouting = true,
      defaultTtl,
      maxTtl,
      minTtl,
    } = props;

    // ========================================
    // Route53 Hosted Zone Lookup
    // ========================================

    /**
     * Look up the existing Route53 hosted zone
     */
    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: hostedZoneName,
    });

    // ========================================
    // SSL Certificate
    // ========================================

    /**
     * Create SSL/TLS certificate for the domain
     * Must be in us-east-1 for CloudFront
     * Uses DNS validation with Route53
     */
    this.certificate = new certificatemanager.Certificate(this, "Certificate", {
      domainName: domainName,
      validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    // ========================================
    // S3 Bucket
    // ========================================

    /**
     * Create S3 bucket for static website files
     * - All public access blocked (CloudFront accesses via OAI)
     * - Server-side encryption enabled
     * - Versioning enabled for rollback capability
     * - Lifecycle rules to delete old versions
     */
    this.bucket = new s3.Bucket(this, "Bucket", {
      bucketName: `${environmentName}-${siteName}-skilltree-io`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      lifecycleRules: [
        {
          id: "DeleteOldVersions",
          noncurrentVersionExpiration: cdk.Duration.days(30),
          enabled: true,
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    cdk.Tags.of(this.bucket).add("Name", `${environmentName}-${siteName}`);

    // ========================================
    // CloudFront Origin Access Identity
    // ========================================

    /**
     * Create OAI for CloudFront to access S3 bucket
     * This allows CloudFront to access the private bucket
     */
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OAI",
      {
        comment: `OAI for ${domainName}`,
      }
    );

    // Grant CloudFront OAI read access to the bucket
    this.bucket.grantRead(originAccessIdentity);

    // ========================================
    // Security Headers Policy
    // ========================================

    /**
     * Create Response Headers Policy for security headers
     * Adds headers to all responses from CloudFront
     */
    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
      this,
      "SecurityHeadersPolicy",
      {
        responseHeadersPolicyName: `${environmentName}-${siteName}-security-headers`,
        comment: `Security headers for ${domainName}`,
        securityHeadersBehavior: {
          strictTransportSecurity: {
            accessControlMaxAge: cdk.Duration.seconds(31536000),
            includeSubdomains: true,
            override: true,
          },
          contentTypeOptions: {
            override: true,
          },
          frameOptions: {
            frameOption: cloudfront.HeadersFrameOption.DENY,
            override: true,
          },
          xssProtection: {
            protection: true,
            modeBlock: true,
            override: true,
          },
          referrerPolicy: {
            referrerPolicy:
              cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
            override: true,
          },
        },
      }
    );

    // ========================================
    // Cache Policies
    // ========================================

    /**
     * Cache policy for static assets (JS, CSS, images)
     * Long TTL with query string and header caching
     */
    const staticAssetsCachePolicy = new cloudfront.CachePolicy(
      this,
      "StaticAssetsCachePolicy",
      {
        cachePolicyName: `${environmentName}-${siteName}-static-assets`,
        comment: "Cache policy for static assets (JS, CSS, images)",
        defaultTtl: cdk.Duration.seconds(maxTtl),
        maxTtl: cdk.Duration.seconds(maxTtl),
        minTtl: cdk.Duration.seconds(0),
        enableAcceptEncodingGzip: true,
        enableAcceptEncodingBrotli: true,
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
        headerBehavior: cloudfront.CacheHeaderBehavior.none(),
        cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      }
    );

    /**
     * Cache policy for HTML files
     * Short TTL or no cache for index.html
     */
    const htmlCachePolicy = new cloudfront.CachePolicy(
      this,
      "HtmlCachePolicy",
      {
        cachePolicyName: `${environmentName}-${siteName}-html`,
        comment: "Cache policy for HTML files",
        defaultTtl: cdk.Duration.seconds(defaultTtl),
        maxTtl: cdk.Duration.seconds(300), // 5 minutes max
        minTtl: cdk.Duration.seconds(minTtl),
        enableAcceptEncodingGzip: true,
        enableAcceptEncodingBrotli: true,
        queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
        headerBehavior: cloudfront.CacheHeaderBehavior.none(),
        cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      }
    );

    // ========================================
    // CloudFront Distribution
    // ========================================

    /**
     * Create CloudFront distribution configuration
     */
    const distributionConfig: cloudfront.DistributionProps = {
      comment: `${siteName} distribution for ${environmentName}`,
      defaultRootObject: "index.html",
      domainNames: [domainName],
      certificate: this.certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      priceClass:
        priceClass === "PriceClass_100"
          ? cloudfront.PriceClass.PRICE_CLASS_100
          : cloudfront.PriceClass.PRICE_CLASS_ALL,
      enableLogging: false, // Can be enabled with S3 bucket for logs
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      // Add error responses for SPA routing if enabled
      ...(enableSpaRouting && {
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.seconds(0),
          },
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
            ttl: cdk.Duration.seconds(0),
          },
        ],
      }),
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(this.bucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: htmlCachePolicy,
        responseHeadersPolicy: responseHeadersPolicy,
      },
      additionalBehaviors: {
        // Cache static assets with long TTL
        "*.js": {
          origin: new cloudfrontOrigins.S3Origin(this.bucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          compress: true,
          cachePolicy: staticAssetsCachePolicy,
          responseHeadersPolicy: responseHeadersPolicy,
        },
        "*.css": {
          origin: new cloudfrontOrigins.S3Origin(this.bucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          compress: true,
          cachePolicy: staticAssetsCachePolicy,
          responseHeadersPolicy: responseHeadersPolicy,
        },
        "*.png": {
          origin: new cloudfrontOrigins.S3Origin(this.bucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          compress: true,
          cachePolicy: staticAssetsCachePolicy,
          responseHeadersPolicy: responseHeadersPolicy,
        },
        "*.jpg": {
          origin: new cloudfrontOrigins.S3Origin(this.bucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          compress: true,
          cachePolicy: staticAssetsCachePolicy,
          responseHeadersPolicy: responseHeadersPolicy,
        },
        "*.ico": {
          origin: new cloudfrontOrigins.S3Origin(this.bucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          compress: true,
          cachePolicy: staticAssetsCachePolicy,
          responseHeadersPolicy: responseHeadersPolicy,
        },
        "*.svg": {
          origin: new cloudfrontOrigins.S3Origin(this.bucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          compress: true,
          cachePolicy: staticAssetsCachePolicy,
          responseHeadersPolicy: responseHeadersPolicy,
        },
        "*.woff": {
          origin: new cloudfrontOrigins.S3Origin(this.bucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          compress: true,
          cachePolicy: staticAssetsCachePolicy,
          responseHeadersPolicy: responseHeadersPolicy,
        },
        "*.woff2": {
          origin: new cloudfrontOrigins.S3Origin(this.bucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          compress: true,
          cachePolicy: staticAssetsCachePolicy,
          responseHeadersPolicy: responseHeadersPolicy,
        },
      },
    };

    /**
     * Create the CloudFront distribution
     */
    this.distribution = new cloudfront.Distribution(
      this,
      "Distribution",
      distributionConfig
    );

    cdk.Tags.of(this.distribution).add(
      "Name",
      `${environmentName}-${siteName}-distribution`
    );

    // ========================================
    // Route53 DNS Record
    // ========================================

    /**
     * Create A record (alias) pointing to CloudFront distribution
     */
    new route53.ARecord(this, "DnsRecord", {
      zone: hostedZone,
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(this.distribution)
      ),
      comment: `${siteName} for ${environmentName} environment`,
    });

    // Set website URL
    this.websiteUrl = `https://${domainName}`;

    // ========================================
    // CloudFormation Outputs
    // ========================================

    new cdk.CfnOutput(this, "DistributionId", {
      value: this.distribution.distributionId,
      description: `CloudFront distribution ID for ${siteName}`,
      exportName: `${environmentName}-${siteName}-DistributionId`,
    });

    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: this.distribution.distributionDomainName,
      description: `CloudFront domain name for ${siteName}`,
      exportName: `${environmentName}-${siteName}-DistributionDomain`,
    });

    new cdk.CfnOutput(this, "WebsiteUrl", {
      value: this.websiteUrl,
      description: `Website URL for ${siteName}`,
      exportName: `${environmentName}-${siteName}-WebsiteUrl`,
    });

    new cdk.CfnOutput(this, "BucketName", {
      value: this.bucket.bucketName,
      description: `S3 bucket name for ${siteName}`,
      exportName: `${environmentName}-${siteName}-BucketName`,
    });
  }
}
