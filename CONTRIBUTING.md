# Contributing to Synth Tree

Welcome! This document covers the conventions every contributor should follow when working in this repo.

## Branch naming

Every branch maps to exactly one Jira ticket in the **SYN** project. Use one of the following prefixes:

| Prefix | Use for |
|---|---|
| `feature/` | New functionality |
| `bugfix/` | Bug fixes |
| `chore/` | Tooling, dependencies, scripts (no user-visible change) |
| `docs/` | Documentation-only changes |
| `refactor/` | Internal refactors with no behavior change |

The full format is:

```
<prefix>/SYN-<number>-<short-kebab-description>
```

### Examples

```
feature/SYN-42-implement-skill-tree-visualization
bugfix/SYN-87-fix-login-redirect-loop
chore/SYN-15-update-eslint-config
docs/SYN-23-document-graphql-schema
```

### Rules

- One branch per ticket. If a ticket is too big, split it into sub-tickets — don't open a second branch against the same ID.
- No slashes inside the description. Use hyphens (`SYN-70-file-upload-images-and-videos`, not `SYN-70-File-Upload-Images/Videos`).
- Lowercase preferred for the description; the ticket prefix `SYN-` stays uppercase.
- Delete merged branches promptly (`git push origin --delete <branch>` and `git branch -d <branch>`).

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) style. The first line is the summary, with the ticket reference at the end:

```
feat(api): add SkillTree pagination cursor (SYN-42)
fix(client-frontend): redirect to /login after sign-out (SYN-87)
chore: bump pnpm to 10.17.1 (SYN-15)
```

Keep the summary line under 72 characters. Add a body if the change needs explanation.

## Pull requests

1. Open the PR against `main` and fill out the template (`.github/PULL_REQUEST_TEMPLATE.md`) — the Jira link, description, and pre-submission checklist are required.
2. Make sure CI passes before requesting review.
3. PRs require at least one approval from a code owner (`.github/CODEOWNERS`).
4. Merge with **Squash and merge** so each ticket lands as one commit on `main`.
5. After merge, delete the branch.

## Local development

Before starting work:

```bash
pnpm install
pnpm db:start              # Postgres in Docker
pnpm dev                   # API + admin-dashboard + client-frontend in parallel
```

Before pushing:

```bash
pnpm type-check            # tsc across all workspaces
pnpm lint                  # eslint across all workspaces
pnpm format:check          # prettier check
pnpm test                  # jest
```

Or fix and re-run:

```bash
pnpm format
pnpm lint --fix
```

## Code style

Style is enforced by Prettier (`.prettierrc`) and ESLint (`eslint.config.js` at the root). The defaults are:

- 2-space indentation, LF line endings, UTF-8 (see `.editorconfig`)
- Double quotes, semicolons, trailing commas everywhere
- 100-character print width

Don't fight the formatter — run `pnpm format` before commits.

## Adding a new package or app

1. Place it under `apps/` (deployable application) or `packages/` (library consumed by apps).
2. Name it `@synth-tree/<name>` — no unscoped names.
3. Add it to `pnpm-workspace.yaml` if not already covered by `apps/*` / `packages/*`.
4. If it should run on `pnpm type-check` / `pnpm lint` / `pnpm test` from the root, add the corresponding scripts.

## Where things live

| Concern | Location |
|---|---|
| GraphQL API | `apps/api` |
| Admin app | `apps/admin-dashboard` |
| Learner-facing app | `apps/client-frontend` |
| AWS CDK infra | `apps/infra` |
| Shared UI components + Storybook | `packages/ui` |
| Design tokens, theme provider | `packages/theme` |
| Generated GraphQL types | `packages/api-types` |
| Runtime config helpers | `packages/config` |
| Engineering docs | `docs/engineering` |
| Design assets | `docs/design` |

## Questions?

Ping a code owner or open a discussion on the relevant ticket.
