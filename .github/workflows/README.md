# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the SkillTree monorepo. All workflows are based on the comprehensive CI/CD guide at [`apps/infra/CI_CD.md`](../../apps/infra/CI_CD.md).

## 📋 Overview

| Workflow                                                   | Purpose                                    | Triggers                                     | Environments |
| ---------------------------------------------------------- | ------------------------------------------ | -------------------------------------------- | ------------ |
| [`deploy-infrastructure.yml`](./deploy-infrastructure.yml) | Deploy AWS infrastructure via CDK          | PR (diff only), Push to main, Manual         | dev, prod    |
| [`deploy-api.yml`](./deploy-api.yml)                       | Build & deploy API to ECS                  | Push to main (when API changes), Manual      | dev, prod    |
| [`deploy-frontend.yml`](./deploy-frontend.yml)             | Build & deploy React app to S3/CloudFront  | Push to main (when frontend changes), Manual | dev, prod    |
| [`deploy-storybook.yml`](./deploy-storybook.yml)           | Build & deploy Storybook to S3/CloudFront  | Push to main (when UI changes), Manual       | dev, prod    |
| [`pr-validation.yml`](./pr-validation.yml)                 | Validate PRs (lint, test, build, CDK diff) | Pull requests to main                        | N/A          |

## 🚀 Deployment Strategy

### Automatic Deployments

- **Dev Environment**: Automatically deploys when code is merged to `main`
- **Prod Environment**: Requires manual approval (configured in GitHub environment settings)

### Manual Deployments

All deployment workflows support manual triggering via GitHub Actions UI:

1. Go to Actions tab
2. Select the workflow
3. Click "Run workflow"
4. Choose environment (dev/prod)

### Deployment Flow

```
PR Created → PR Validation (lint, test, build)
     ↓
PR Approved & Merged to main
     ↓
Deploy to Dev (automatic)
     ↓
Manual Approval for Prod
     ↓
Deploy to Prod
```

## 🔐 Required GitHub Secrets

Configure these secrets in: **Settings → Secrets and variables → Actions**

### Environment-Agnostic Secrets

These secrets are used by workflows but can be stored at the repository level:

| Secret Name                  | Description                          | Required For                             |
| ---------------------------- | ------------------------------------ | ---------------------------------------- |
| `AWS_ACCESS_KEY_ID_DEV`      | AWS access key for dev environment   | Infrastructure, API, Frontend, Storybook |
| `AWS_SECRET_ACCESS_KEY_DEV`  | AWS secret key for dev environment   | Infrastructure, API, Frontend, Storybook |
| `AWS_ACCESS_KEY_ID_PROD`     | AWS access key for prod environment  | Infrastructure, API, Frontend, Storybook |
| `AWS_SECRET_ACCESS_KEY_PROD` | AWS secret key for prod environment  | Infrastructure, API, Frontend, Storybook |
| `AWS_ACCOUNT_ID_DEV`         | AWS account ID for dev (optional)    | Infrastructure                           |
| `AWS_ACCOUNT_ID_PROD`        | AWS account ID for prod (optional)   | Infrastructure                           |
| `FIREBASE_API_KEY`           | Firebase API key                     | Frontend                                 |
| `FIREBASE_AUTH_DOMAIN`       | Firebase auth domain                 | Frontend                                 |
| `FIREBASE_PROJECT_ID`        | Firebase project ID                  | Frontend, API                            |
| `FIREBASE_PRIVATE_KEY`       | Firebase service account private key | API                                      |
| `FIREBASE_CLIENT_EMAIL`      | Firebase service account email       | API                                      |

### Optional Secrets

| Secret Name       | Description                                                   | Required For   |
| ----------------- | ------------------------------------------------------------- | -------------- |
| `BASTION_SSH_KEY` | SSH key for bastion host (if using SSH tunnel for migrations) | API migrations |

## 🌍 Environment Configuration

### Setting Up GitHub Environments

1. Go to **Settings → Environments**
2. Create two environments: `dev` and `prod`

#### Dev Environment

```yaml
Environment name: dev
Protection rules: None (auto-deploy on merge)
Environment secrets: None (use repository secrets)
```

#### Prod Environment

```yaml
Environment name: prod
Protection rules:
  ✓ Required reviewers: 1-2 people
  ✓ Deployment branches: main only
  ✓ Wait timer: 5 minutes (optional)
Environment secrets: None (use repository secrets)
```

## 📦 Workflow Details

### 1. Infrastructure Deployment (`deploy-infrastructure.yml`)

**What it does:**

- Runs CDK diff on PRs to preview infrastructure changes
- Deploys all CDK stacks (Network, Database, API, Frontend, Storybook)
- Handles stack dependencies and deployment order
- Includes drift detection capability

**Key Features:**

- ✅ CDK bootstrap verification
- ✅ Parallel stack deployment (concurrency: 3)
- ✅ CloudFormation output capture
- ✅ Drift detection (optional)

**Stack Deployment Order:**

1. NetworkStack
2. DatabaseStack
3. ApiStack (depends on Network, Database)
4. FrontendStack, StorybookStack (independent)

### 2. API Deployment (`deploy-api.yml`)

**What it does:**

- Builds Docker image with multi-stage builds
- Pushes to ECR with git SHA and latest tags
- Runs Prisma migrations (can be skipped)
- Updates ECS service with zero-downtime deployment
- Performs health checks and automatic rollback on failure

**Key Features:**

- ✅ Docker layer caching
- ✅ Prisma migration deployment
- ✅ ECS blue-green deployment
- ✅ Health check validation
- ✅ Automatic rollback on failure

**Health Check Endpoints:**

- Dev: `https://api.dev.skilltree.io/health`
- Prod: `https://api.skilltree.io/health`

### 3. Frontend Deployment (`deploy-frontend.yml`)

**What it does:**

- Builds Vite React application with environment-specific configs
- Syncs to S3 with optimized cache headers
- Invalidates CloudFront distribution
- Verifies deployment

**Key Features:**

- ✅ Environment-specific builds (dev/prod)
- ✅ Optimized cache headers (long cache for assets, no cache for index.html)
- ✅ CloudFront cache invalidation
- ✅ Deployment verification

**Build Environment Variables:**

- `VITE_API_URL`: API endpoint URL
- `VITE_ENVIRONMENT`: dev or prod
- `VITE_FIREBASE_*`: Firebase configuration

### 4. Storybook Deployment (`deploy-storybook.yml`)

**What it does:**

- Builds Storybook static site
- Syncs to S3
- Invalidates CloudFront cache
- Independent from main application deployment

**Key Features:**

- ✅ Static site generation
- ✅ Independent deployment cycle
- ✅ CloudFront cache invalidation

**Deployment URLs:**

- Dev: CloudFront distribution URL
- Prod: `https://storybook.skilltree.io`

### 5. PR Validation (`pr-validation.yml`)

**What it does:**

- Detects which parts of the monorepo changed
- Runs appropriate validation checks
- Provides CDK diff commentary on PRs
- Prevents broken code from being merged

**Validation Checks:**

- ✅ Lint and type checking
- ✅ API tests and Prisma validation
- ✅ API Docker build
- ✅ Frontend build
- ✅ Storybook build
- ✅ Infrastructure CDK diff and synth

**Smart Path Detection:**
Uses `dorny/paths-filter` to only run checks for changed code:

- `apps/infra/**` → Infrastructure validation
- `apps/api/**` → API tests and build
- `apps/admin-dashboard/**` → Frontend build
- `packages/ui/**` → Storybook build

## 🔧 Workflow Customization

### Modifying Deployment Behavior

#### Skip Migrations (API)

When deploying API manually, you can skip database migrations:

```yaml
inputs:
  skip_migrations: true
```

#### Change Node/PNPM Versions

Update environment variables in each workflow:

```yaml
env:
  NODE_VERSION: "24"
  PNPM_VERSION: "10"
```

#### Adjust ECS Desired Count

Modify the `--desired-count` in API deployment steps:

```bash
aws ecs update-service \
  --desired-count 2  # Change this value
```

### Adding New Workflows

When adding new workflows, follow these conventions:

1. Use descriptive names: `deploy-[component].yml`
2. Include concurrency control
3. Set appropriate permissions (least privilege)
4. Cache dependencies (pnpm store)
5. Add environment-specific configuration
6. Include proper error handling and rollback

## 🐛 Troubleshooting

### Common Issues

**CDK Bootstrap Required**

```
Error: CDKToolkit stack not found
Solution: Run `npx cdk bootstrap` in apps/infra/
```

**ECR Repository Not Found**

```
Error: Repository not found
Solution: Infrastructure must be deployed first (creates ECR repositories)
```

**CloudFormation Stack Not Found**

```
Error: Stack dev-Frontend not found
Solution: Deploy infrastructure before deploying applications
```

**Health Check Failed**

```
Error: Health check returned 000 or non-200 status
Solution: Check ECS service logs, verify security groups, and service configuration
```

### Viewing Logs

**GitHub Actions Logs:**

- Go to Actions tab
- Select the workflow run
- Expand job steps to view logs

**AWS CloudWatch Logs:**

```bash
# API logs
aws logs tail /aws/ecs/dev-api --follow

# ECS deployment events
aws ecs describe-services --cluster dev-api-cluster --services dev-api-service
```

## 📚 Additional Resources

- [CI/CD Guide](../../apps/infra/CI_CD.md) - Comprehensive CI/CD documentation
- [Deployment Guide](../../apps/infra/DEPLOYMENT.md) - Manual deployment procedures
- [Operations Guide](../../apps/infra/OPERATIONS.md) - Monitoring and operations
- [Developer Guide](../../apps/infra/DEVELOPER_GUIDE.md) - Development workflows

## 🔄 Workflow Maintenance

### Regular Tasks

**Weekly:**

- Review failed workflow runs
- Check for workflow updates in dependencies

**Monthly:**

- Rotate AWS credentials
- Review and update Node.js/PNPM versions
- Update GitHub Actions to latest versions

**Quarterly:**

- Audit secrets and permissions
- Review and optimize workflow performance
- Update documentation

### Updating Actions Versions

Periodically update action versions in workflows:

```yaml
- uses: actions/checkout@v4 # Check for v5
- uses: actions/setup-node@v4 # Check for updates
- uses: aws-actions/configure-aws-credentials@v4
- uses: pnpm/action-setup@v2
- uses: actions/cache@v4
```

---

**For questions or issues, refer to the [CI/CD Guide](../../apps/infra/CI_CD.md) or contact the DevOps team.**
