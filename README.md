# 🌳 Synth Tree

A modern, tree-based learning management system designed for bootcamp students to navigate structured learning paths and track their progress through interactive, hierarchical skill trees.

## 📚 Table of Contents

- [Repository Structure](#-repository-structure)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [Database Management](#-database-management)
- [How to Contribute](#-how-to-contribute)
- [Building & Deployment](#-building--deployment)
- [Project Conventions](#-project-conventions)
- [Troubleshooting](#-troubleshooting)
- [Additional Resources](#-additional-resources)

## 🏗️ Repository Structure

This project is organized as a **monorepo** using [pnpm workspaces](https://pnpm.io/workspaces), allowing multiple applications and shared packages to coexist in a single repository.

```
synth-tree/
├── apps/                    # Applications
│   ├── admin-dashboard/     # React admin interface
│   ├── api/                 # GraphQL API server
│   ├── client-frontend/     # React client interface
│   └── infra/               # AWS CDK infrastructure
└── packages/                # Shared packages
    ├── ui/                  # Component library + Storybook
    ├── theme/               # Design tokens & theming
    ├── api-types/           # Auto-generated TypeScript types
    └── config/              # Shared utilities & configs
```

### Apps

- **`admin-dashboard`** - Admin interface built with React 19, TypeScript, and Firebase Authentication for managing learning content and users
- **`api`** - GraphQL API server powered by Apollo Server, Pothos, and Prisma ORM for data access
- **`infra`** - AWS infrastructure as code using CDK for deploying and managing cloud resources

### Packages

- **`@skilltree/ui`** - Reusable React component library built on Radix UI with Storybook documentation
- **`@skilltree/theme`** - Centralized design tokens (colors, spacing, typography) and theming utilities
- **`@skilltree/api-types`** - Auto-generated TypeScript types from GraphQL schema for type-safe API consumption
- **`@skilltree/config`** - Shared configuration and utility functions used across apps

### Environments

#### Development

- [GraphQL API](https://api.dev.synth-tree.com/)
- [Storybook](https://storybook.dev.synth-tree.com/)
- [Admin Dashboard](https://dev.synth-tree.com/)

#### Production

- [GraphQL API](https://api.synth-tree.com/)
- [Storybook](https://storybook.synth-tree.com/?path=/docs/ui-badge--docs)
- [Admin Dashboard](https://app.synth-tree.com/auth/login)

## 🛠️ Tech Stack

### Frontend

- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [React Router v7](https://reactrouter.com/) - Client-side routing
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI primitives

### Backend

- [Node.js 20](https://nodejs.org/) - JavaScript runtime
- [Express 5](https://expressjs.com/) - Web application framework
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - GraphQL server
- [GraphQL](https://graphql.org/) - Query language for APIs
- [Pothos](https://pothos-graphql.dev/) - Code-first GraphQL schema builder
- [Prisma ORM](https://www.prisma.io/) - Type-safe database toolkit

### Database

- [PostgreSQL 16](https://www.postgresql.org/) - Local development database
- [Aurora Serverless v2](https://aws.amazon.com/rds/aurora/serverless/) - Production database on AWS

### Authentication

- [Firebase Authentication](https://firebase.google.com/docs/auth) - User authentication and management

### Infrastructure

- [AWS CDK](https://aws.amazon.com/cdk/) - Infrastructure as code
- [ECS Fargate](https://aws.amazon.com/fargate/) - Serverless container hosting
- [CloudFront](https://aws.amazon.com/cloudfront/) - CDN for frontend assets
- [S3](https://aws.amazon.com/s3/) - Static asset storage
- [Application Load Balancer](https://aws.amazon.com/elasticloadbalancing/) - API traffic distribution

### Development Tools

- [pnpm](https://pnpm.io/) - Fast, disk-efficient package manager
- [Docker Compose](https://docs.docker.com/compose/) - Local development environment
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) - Auto-generate TypeScript types from GraphQL
- [Storybook](https://storybook.js.org/) - Component documentation and testing

## ✅ Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **[Node.js 20+](https://nodejs.org/)** - JavaScript runtime

  ```bash
  # Check your Node version
  node --version  # Should output v20.x.x or higher
  ```

- **[pnpm](https://pnpm.io/installation)** - Package manager

  ```bash
  # Install pnpm globally
  npm install -g pnpm

  # Verify installation
  pnpm --version
  ```

- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** - For running PostgreSQL locally

  ```bash
  # Verify Docker is running
  docker --version
  docker-compose --version
  ```

- **[PostgreSQL](https://www.postgresql.org/download/)** - Database (can run via Docker)

- **[Firebase Account](https://firebase.google.com/)** - For authentication setup

- **[AWS CLI](https://aws.amazon.com/cli/)** - For deployment (optional for local development)
  ```bash
  # Verify AWS CLI installation
  aws --version
  ```

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd synth-tree
```

### 2. Install Dependencies

We use `pnpm` with workspaces to manage dependencies across all apps and packages:

```bash
# Install all dependencies for the entire monorepo
pnpm install
```

This command will install dependencies for all apps and packages defined in the workspace.

### 3. Set Up Environment Variables

Each app requires its own environment configuration. Start by copying the example files:

```bash
# Admin Dashboard
cp apps/admin-dashboard/.env.example apps/admin-dashboard/.env

# API Server
cp apps/api/.env.example apps/api/.env
```

**Important:** The `.env.example` files contain the structure you need, but **you must contact your mentor** to receive the actual API keys, secrets, and credentials for:

- Firebase configuration
- Database connection strings
- AWS credentials (for deployment)

### 4. Start the Database

We use Docker Compose to run PostgreSQL locally:

```bash
# Start PostgreSQL in detached mode
docker-compose up -d

# Verify the database is running
docker-compose ps
```

Expected output:

```
NAME                COMMAND                  SERVICE             STATUS
postgres            "docker-entrypoint.s…"   postgres            running
```

### 5. Run Database Migrations

Apply the database schema using Prisma:

```bash
# Navigate to the API app
cd apps/api

# Run migrations to create database tables
pnpm prisma migrate dev

# Generate Prisma Client
pnpm prisma generate

# Navigate back to root
cd ../..
```

### 6. Generate GraphQL Types

After Prisma generates the database client, generate TypeScript types for the GraphQL API:

```bash
cd apps/api
pnpm codegen
cd ../..
```

## 🔐 Environment Variables

### Admin Dashboard (`apps/admin-dashboard/.env`)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:4000/graphql
```

### API Server (`apps/api/.env`)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/skilltree
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
PORT=4000
NODE_ENV=development
```

**⚠️ Security Notice:** Never commit `.env` files to git. These files are already listed in `.gitignore`. Always contact your mentor for the proper credentials.

## 💻 Running Locally

Once setup is complete, you can run each application in development mode:

### Start the API Server

```bash
# From the root directory
cd apps/api
pnpm dev

# The GraphQL server will start at http://localhost:4000
# GraphQL Playground available at http://localhost:4000/graphql
```

### Start the Admin Dashboard

```bash
# In a new terminal, from the root directory
cd apps/admin-dashboard
pnpm dev

# The app will start at http://localhost:5173
```

### Start Storybook (Component Library)

```bash
# In a new terminal, from the root directory
cd packages/ui
pnpm storybook

# Storybook will start at http://localhost:6006
```

### Running Everything Concurrently

You can run all applications simultaneously using the root workspace:

```bash
# From the root directory
pnpm dev
```

This command will start all development servers in parallel.

## 🗄️ Database Management

### Workflow for Schema Changes

Whenever you need to modify the database schema, follow this workflow:

1. **Update Prisma Schema**

   ```bash
   # Edit the schema file
   code apps/api/prisma/schema.prisma
   ```

2. **Create Migration**

   ```bash
   cd apps/api
   pnpm prisma migrate dev --name descriptive_migration_name
   ```

   This command will:
   - Generate a SQL migration file
   - Apply the migration to your local database
   - Regenerate the Prisma Client

3. **Generate Prisma Client**

   ```bash
   pnpm prisma generate
   ```

   This regenerates the type-safe Prisma Client based on your schema.

4. **Run GraphQL Codegen**

   ```bash
   pnpm codegen
   ```

   This generates TypeScript types in `packages/api-types` from your GraphQL schema, ensuring type safety across the frontend and backend.

### Useful Database Commands

```bash
# Open Prisma Studio (GUI for viewing/editing data)
cd apps/api
pnpm prisma studio

# Reset database (⚠️ deletes all data)
pnpm prisma migrate reset

# View migration status
pnpm prisma migrate status

# Seed the database (if seed script exists)
pnpm prisma db seed
```

## 🤝 How to Contribute

We follow a structured Git workflow to maintain code quality and proper documentation. Please follow these guidelines when contributing:

### Branch Management

- **Always create your branches off of `main`**

  ```bash
  # Ensure you're on main and it's up to date
  git checkout main
  git pull origin main

  # Create a new branch
  git checkout -b feature/JIRA-123-add-user-dashboard
  ```

### Branch Naming Conventions

Use descriptive branch names that include the Jira task ID:

- **Features:** `feature/JIRA-123-description`
- **Bug Fixes:** `bugfix/JIRA-456-description`
- **Hotfixes:** `hotfix/JIRA-789-description`
- **Documentation:** `docs/JIRA-101-description`

Examples:

```bash
git checkout -b feature/ST-42-implement-skill-tree-visualization
git checkout -b bugfix/ST-87-fix-login-redirect-loop
git checkout -b docs/ST-15-update-api-documentation
```

### Commit Messages

Write clear, descriptive commit messages that explain **what** and **why**:

```bash
# Good commit messages
git commit -m "feat(dashboard): add user progress visualization component

- Created ProgressChart component using Recharts
- Integrated with GraphQL API for real-time data
- Added responsive design for mobile devices

Refs: ST-42"

# Bad commit messages (avoid these)
git commit -m "fixed stuff"
git commit -m "update"
git commit -m "wip"
```

**Commit Message Format:**

```
type(scope): brief description

- Detailed point 1
- Detailed point 2

Refs: JIRA-ID
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Requests (PRs)

**All Pull Requests must:**

1. **Be tied to a Jira task** - Reference the Jira ID in the PR title and description
2. **Have descriptive titles** - Format: `[JIRA-ID] Brief description of changes`
3. **Include detailed explanations** containing:
   - What changes were made
   - Why these changes were necessary
   - How to test the changes
   - Screenshots/videos (for UI changes)
   - Any breaking changes or migration steps

**Pull Request Template Example:**

```markdown
## 📋 Description

[JIRA-42] Implement Skill Tree Visualization Component

## 🎯 What Changed

- Created `SkillTreeVisualization` component using D3.js
- Added GraphQL query to fetch user progress data
- Implemented interactive node clicking for skill details
- Added unit tests for tree rendering logic

## 🤔 Why

Users need a visual representation of their learning progress to stay motivated and understand their learning path.

## 🧪 How to Test

1. Log in to the admin dashboard
2. Navigate to `/dashboard/skills`
3. Verify the skill tree renders correctly
4. Click on a skill node and verify the details panel opens
5. Test on mobile viewport (responsive design)

## 📸 Screenshots

[Attach screenshots here]

## ⚠️ Breaking Changes

None

## ✅ Checklist

- [x] Code follows project conventions
- [x] Tests added/updated
- [x] Documentation updated
- [x] Tested locally
- [x] No console errors
```

### Code Review Process

1. Push your branch to the remote repository

   ```bash
   git push -u origin feature/JIRA-123-your-feature
   ```

2. Create a Pull Request on GitHub/GitLab
3. Request review from at least one team member or mentor
4. Address any feedback and update your PR
5. Once approved, your code will be merged by a maintainer

### Code Quality Checklist

Before creating a PR, ensure:

- [ ] Code follows TypeScript and ESLint conventions
- [ ] All tests pass (`pnpm test`)
- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] Component changes documented in Storybook (if applicable)
- [ ] No console errors or warnings in development
- [ ] Code is properly formatted (Prettier)
- [ ] Sensitive data (API keys, secrets) not committed

## 🚢 Building & Deployment

### Building for Production

Build all apps and packages for production:

```bash
# Build everything
pnpm build

# May be necessary to run this first to build dependencies
cd packages/theme
pnpm build
cd ../ui
pnpm build
cd ../..

# Build specific app
cd apps/admin-dashboard
pnpm build
```

The built files will be output to each app's `dist/` directory.

### Deployment with AWS CDK

The infrastructure is defined as code using AWS CDK in the `apps/infra` directory.

**Prerequisites for Deployment:**

- AWS account with proper credentials configured
- AWS CLI installed and configured
- Proper IAM permissions for CDK deployment

**Deploy to AWS:**

```bash
cd apps/infra

# Bootstrap CDK (first time only, per account/region)
pnpm cdk bootstrap

# Synthesize CloudFormation template
pnpm cdk synth

# Deploy all stacks
pnpm cdk deploy --all

# Deploy specific stack
pnpm cdk deploy NetworkStack
pnpm cdk deploy DatabaseStack
pnpm cdk deploy ApiStack
pnpm cdk deploy FrontendStack
```

**Production Environment:**

- **Frontend** - Deployed to S3 + CloudFront CDN
- **API** - Runs on ECS Fargate behind Application Load Balancer
- **Database** - Aurora Serverless v2 PostgreSQL
- **Storybook** - Deployed to separate S3 + CloudFront distribution

### Continuous Integration/Deployment (CI/CD)

[Configuration pending - GitHub Actions workflows will be added]

## 📐 Project Conventions

### Code Style

- **TypeScript** - Strict mode enabled for all projects
- **ESLint** - Enforced code quality rules
- **Prettier** - Automatic code formatting
- **File Naming** - Use kebab-case for files: `user-profile.tsx`, `api-client.ts`
- **Component Naming** - Use PascalCase for React components: `UserProfile.tsx`

### File Organization

```
src/
├── components/       # Reusable UI components
├── features/         # Feature-based modules
│   └── auth/
│       ├── components/
│       ├── hooks/
│       └── pages/
├── hooks/            # Custom React hooks
├── lib/              # Third-party library configs
├── contexts/         # React Context providers
└── layouts/          # Page layout components
```

### Import Order

Organize imports in this order:

1. React and external libraries
2. Internal absolute imports (`@skilltree/*`)
3. Relative imports from parent directories
4. Relative imports from current directory
5. Type imports (last)

```typescript
// External libraries
import { useState } from "react";
import { useQuery } from "@apollo/client";

// Internal packages
import { Button } from "@skilltree/ui";
import { useTheme } from "@skilltree/theme";

// Relative imports
import { UserList } from "../components/UserList";
import { useAuth } from "./useAuth";

// Type imports
import type { User } from "@skilltree/api-types";
```

### GraphQL Conventions

- Use consistent naming: Queries start with `get`, Mutations start with action verb
- Example: `getUserById`, `createUser`, `updateSkillProgress`
- Keep GraphQL operations in separate `.graphql` files when possible

### Testing Standards

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write component tests for complex UI logic
- Maintain minimum 80% code coverage (goal)

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Database Connection Errors

**Problem:** `Error: P1001: Can't reach database server`

**Solution:**

```bash
# Ensure Docker is running
docker-compose ps

# Restart the database
docker-compose down
docker-compose up -d

# Check the DATABASE_URL in apps/api/.env
```

#### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::4000`

**Solution:**

```bash
# Find the process using the port
lsof -i :4000

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or change the PORT in your .env file
```

#### Prisma Client Not Generated

**Problem:** `Cannot find module '@prisma/client'`

**Solution:**

```bash
cd apps/api
pnpm prisma generate
```

#### Firebase Authentication Errors

**Problem:** `Firebase: Error (auth/invalid-api-key)`

**Solution:**

- Verify your `.env` file has correct Firebase credentials
- Contact your mentor for the proper Firebase configuration
- Ensure environment variables are prefixed with `VITE_` for Vite apps

#### TypeScript Errors After Schema Changes

**Problem:** Type errors after updating Prisma schema

**Solution:**

```bash
# Regenerate all types
cd apps/api
pnpm prisma generate
pnpm codegen
cd ../..

# Restart TypeScript server in VSCode
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

#### pnpm Install Failures

**Problem:** Installation fails due to dependency conflicts

**Solution:**

```bash
# Clear pnpm cache
pnpm store prune

# Remove all node_modules and lock file
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm pnpm-lock.yaml

# Reinstall
pnpm install
```

### Getting Help

If you encounter an issue not listed here:

1. Check the error message carefully - it often contains the solution
2. Search existing issues in the project repository
3. Ask in the bootcamp Slack channel
4. Contact your mentor
5. Create a detailed issue report with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)
   - What you've already tried

## 📚 Additional Resources

### Designs

- [Figma Designs](https://www.figma.com/design/SqPytLeQQ0D80HvbyzRFf1/Skill-Tree-Platform?node-id=0-1&p=f&t=xwzH0yyxnVXoNYwf-0)

### Learning Materials

#### React & TypeScript

- [React Official Docs](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

#### GraphQL

- [GraphQL Introduction](https://graphql.org/learn/)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [Pothos GraphQL Tutorial](https://pothos-graphql.dev/docs/guide)

#### Database & ORM

- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

#### Styling & UI

- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)

#### Infrastructure & AWS

- [AWS CDK Workshop](https://cdkworkshop.com/)
- [AWS ECS Tutorial](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/getting-started-fargate.html)

### Recommended VSCode Extensions

- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Prisma** - Prisma schema syntax highlighting
- **GraphQL** - GraphQL syntax highlighting and autocomplete
- **Tailwind CSS IntelliSense** - TailwindCSS class autocomplete
- **Error Lens** - Inline error display

### Useful Commands Reference

```bash
# Package Management
pnpm install              # Install all dependencies
pnpm add <package>        # Add dependency to root
pnpm add <package> -w     # Add dependency to workspace root
pnpm add <package> --filter @skilltree/ui  # Add to specific package

# Development
pnpm dev                  # Run all apps in dev mode
pnpm build                # Build all apps and packages
pnpm test                 # Run all tests
pnpm type-check           # Check TypeScript types

# Database
pnpm prisma migrate dev   # Create and apply migration
pnpm prisma studio        # Open Prisma Studio GUI
pnpm prisma generate      # Generate Prisma Client
pnpm codegen              # Generate GraphQL types

# Docker
docker-compose up -d      # Start containers in background
docker-compose down       # Stop and remove containers
docker-compose logs       # View container logs
docker-compose ps         # List running containers

# Git
git status                # Check status
git add .                 # Stage all changes
git commit -m "message"   # Commit changes
git push                  # Push to remote
git pull                  # Pull latest changes
```

---

**Questions or need help?** Contact your mentor or ask in the team channel.

**Happy coding! 🚀**
