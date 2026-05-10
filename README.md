# 🌳 Synth Tree

A modern, tree-based learning management system designed for bootcamp students to navigate structured learning paths and track progress through interactive, hierarchical skill trees.

## Quickstart

```bash
# 1. Install (uses pnpm workspaces)
pnpm install

# 2. Copy env templates
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/admin-dashboard/.env.example apps/admin-dashboard/.env
cp apps/client-frontend/.env.example apps/client-frontend/.env
# Fill in Firebase + DB values in each .env you just created.

# 3. Start the database (Postgres in Docker)
pnpm db:start

# 4. Run migrations
pnpm db:migrate:dev

# 5. Run everything in parallel: API, admin-dashboard, client-frontend
pnpm dev
```

Open:

- Admin dashboard: <http://localhost:5173>
- Client frontend: <http://localhost:5174>
- GraphQL playground: <http://localhost:4000>
- Storybook: `pnpm storybook` → <http://localhost:6006>

## Repository layout

```
synth-tree/
├── apps/
│   ├── admin-dashboard/   React 19 + Vite — admin app for instructors/owners
│   ├── api/               GraphQL API: Apollo Server + Pothos + Prisma
│   ├── client-frontend/   React 19 + Vite — learner-facing app
│   └── infra/             AWS CDK stacks (network, database, api, frontend, storybook)
├── packages/
│   ├── api-types/         Auto-generated TypeScript types from the GraphQL schema
│   ├── config/            Shared runtime helpers (Firebase init, Apollo client, env)
│   ├── theme/             Design tokens + ThemeProvider
│   └── ui/                Shared component library (Radix + shadcn-ui + sonner)
├── docs/
│   ├── design/            Wireframes, Figma exports, design references
│   └── engineering/       Database schema, migrations, internal references
├── CONTRIBUTING.md        Branch + commit + PR conventions
├── docker-compose.yml     Local Postgres
└── pnpm-workspace.yaml
```

## Tech stack

**Frontend:** React 19, TypeScript, Vite, React Router 7, TailwindCSS, Radix UI, shadcn-ui, sonner.
**Backend:** Node.js 20, Express 5, Apollo Server 5, GraphQL, Pothos (code-first schema), Prisma ORM, PostgreSQL 16.
**Auth:** Firebase Authentication.
**Infra:** AWS CDK → ECS Fargate (API), CloudFront + S3 (frontends + Storybook), Aurora Serverless v2 (prod DB).
**Tooling:** pnpm 10 workspaces, ESLint 9 (flat config), Prettier 3, Jest 29, Storybook.

## Common commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start DB + parallel dev servers for api, admin-dashboard, client-frontend |
| `pnpm build` | Build every workspace recursively |
| `pnpm type-check` | Run `tsc --noEmit` in every workspace that defines a `type-check` script |
| `pnpm lint` | Run ESLint in every workspace that defines a `lint` script |
| `pnpm format` / `pnpm format:check` | Run / check Prettier |
| `pnpm test` | Run tests across the monorepo |
| `pnpm db:start` / `db:stop` | Local Postgres via Docker |
| `pnpm db:migrate:dev` / `db:studio` / `db:validate` | Prisma helpers |
| `pnpm storybook` | Run Storybook for `@synth-tree/ui` |

## Environments

|  | Dev | Production |
|---|---|---|
| API | <https://api.dev.synth-tree.com> | <https://api.synth-tree.com> |
| Admin app | <https://dev.synth-tree.com> | <https://app.synth-tree.com/auth/login> |
| Storybook | <https://storybook.dev.synth-tree.com> | <https://storybook.synth-tree.com> |

## Where to read next

- **Contributing** — branch convention, commit style, PR rules: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- **Database schema** (models + relations): [`docs/engineering/database-schema.md`](./docs/engineering/database-schema.md)
- **Database migrations** (Prisma workflow): [`docs/engineering/database-migrations.md`](./docs/engineering/database-migrations.md)
- **Design assets**: [`docs/design/`](./docs/design)
- **CI/CD pipelines**: [`.github/workflows/`](./.github/workflows) and [`apps/infra/CI_CD.md`](./apps/infra/CI_CD.md)

## License

Private — internal Synth Tree project.
