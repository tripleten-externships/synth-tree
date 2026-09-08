# GitHub Actions Workflows

CI/CD for the Synth Tree monorepo. Deploys are orchestrated from a single
push-triggered workflow; the per-service workflows are reusable building blocks
that also run manually.

## Branch → environment

| Branch        | Deploys to | How code lands on it                   |
| ------------- | ---------- | -------------------------------------- |
| `development` | **dev**    | merge feature branches → `development` |
| `main`        | **prod**   | merge `development` → `main` (release) |

`development` is the default branch. Feature PRs target `development`
(auto-deploys to dev on merge); releases are a `development` → `main` merge
(auto-deploys to prod). Nothing deploys from any other branch.

## Workflows

| Workflow                                                   | Purpose                                                     | Triggers                                             |
| ---------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| [`deploy-orchestrator.yml`](./deploy-orchestrator.yml)     | The only auto-deployer. Detects changed services and calls the reusable deploy workflows for the right environment. | Push to `development`/`main`; manual (`workflow_dispatch`) |
| [`deploy-infrastructure.yml`](./deploy-infrastructure.yml) | Deploy AWS infra via CDK (`cdk deploy --all`)               | Reusable (`workflow_call`) + manual                  |
| [`deploy-api.yml`](./deploy-api.yml)                       | Build & deploy the API image to ECS                         | Reusable + manual                                    |
| [`deploy-frontend.yml`](./deploy-frontend.yml)             | Build & deploy **client-frontend** to S3/CloudFront         | Reusable + manual                                    |
| [`deploy-admin.yml`](./deploy-admin.yml)                   | Build & deploy **admin-dashboard** to S3/CloudFront         | Reusable + manual                                    |
| [`deploy-storybook.yml`](./deploy-storybook.yml)           | Build & deploy Storybook to S3/CloudFront                   | Reusable + manual                                    |
| [`drift-detection.yml`](./drift-detection.yml)             | Weekly CloudFormation drift check (both envs)               | Schedule + manual                                    |
| [`pr-validation.yml`](./pr-validation.yml)                 | Lint, test, build, CDK diff on PRs                          | PRs into `development` and `main`                    |

Each service is a static site or service mapped to a CDK stack:

| Service     | App                    | Dev URL                          | Prod URL                     |
| ----------- | ---------------------- | -------------------------------- | ---------------------------- |
| Client      | `apps/client-frontend` | `dev.synth-tree.com`             | `app.synth-tree.com`         |
| Admin       | `apps/admin-dashboard` | `admin.dev.synth-tree.com`       | `admin.synth-tree.com`       |
| API         | `apps/api`             | `api.dev.synth-tree.com/graphql` | `api.synth-tree.com/graphql` |
| Storybook   | `packages/ui`          | `storybook.dev.synth-tree.com`   | `storybook.synth-tree.com`   |

## How deploys run

### Automatic (via the orchestrator)

On a push to `development` (→ dev) or `main` (→ prod), the orchestrator:

1. Resolves the target environment from the branch.
2. Path-diffs the pushed commits to decide which services changed.
3. Calls each changed service's reusable workflow with `environment: dev|prod`
   and `secrets: inherit`, in dependency order — infrastructure first, then API,
   then the client frontend; admin and storybook wait only on infrastructure.

A service whose files didn't change is skipped; downstream services still run
(a skipped dependency counts as satisfied).

### Manual (individual workflows)

Every `deploy-*.yml` can be run on its own from the **Actions** tab
(`workflow_dispatch`), choosing `dev` or `prod`. Manual runs are **restricted to
code owners** — the first step ([`.github/actions/require-codeowner`](../actions/require-codeowner/action.yml))
fails the run if the triggering user isn't a global owner in
[`CODEOWNERS`](../CODEOWNERS). This guard only applies to manual runs; it's a
no-op when the orchestrator calls the workflow.

### Manual full-stack deploy

Run **Deploy Orchestrator** from the Actions tab, pick the environment, and
optionally toggle `deploy_all` to redeploy every service (e.g. to push a feature
branch to dev). Without `deploy_all` it deploys only what the last commit changed.

## No prod approval gate

There is no in-workflow approval step. If you want a manual gate on prod, add
required reviewers to a `prod` GitHub Environment in repo settings — the
workflows do **not** bind one, so by default prod deploys proceed automatically
on a merge to `main`.

## Required repository secrets

AWS credentials per environment, and Firebase config injected into the frontend
builds:

- `AWS_ACCESS_KEY_ID_DEV` / `AWS_SECRET_ACCESS_KEY_DEV`
- `AWS_ACCESS_KEY_ID_PROD` / `AWS_SECRET_ACCESS_KEY_PROD`
- **Required:** `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`
  — the auth-critical values. The shared Firebase init throws if any are
  missing (which renders a blank page).
- **Optional:** `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`,
  `FIREBASE_APP_ID` — the apps use Firebase **Auth only**, so these are unused
  and fall back to inert defaults when unset. Set them only if a Cloud Storage /
  Messaging / Analytics SDK is ever added.
