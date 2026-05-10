# API

GraphQL API server for Synth Tree, built with Apollo Server, Pothos, and Prisma.

## Local setup

Auth-related setup (Firebase service account, env vars, creating test users) is documented in [`docs/engineering/local-auth.md`](../../docs/engineering/local-auth.md).

For the full repo quickstart, see the [root README](../../README.md).

## Running tests

Integration tests need a running Postgres. The repo's `docker-compose.yml` provides one.

```bash
# Start Postgres in the background
docker compose up -d

# From this directory:
cd apps/api

# All tests
pnpm test

# Integration tests only
pnpm test:integration
```

## Useful scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run the API in watch mode (nodemon + ts-node) |
| `pnpm build` | `prisma generate` then compile to `dist/` |
| `pnpm codegen` | Re-emit `packages/api-types/src/graphql.ts` from the live schema |
| `pnpm prisma:migrate:dev` | Author/run a Prisma migration |
| `pnpm prisma:reset` | Drop and recreate the local DB (destructive) |
| `pnpm db:seed:local-users` | Seed `admin@local.dev` + `learner@local.dev` test accounts |
| `pnpm create:user` | Create one Firebase + Postgres user (see local-auth.md) |
| `pnpm refresh:token` | Refresh an expired ID token saved by `create:user` |

## Tech stack

- Apollo Server 5 + `@as-integrations/express5`
- Pothos (code-first schema builder) + `@pothos/plugin-prisma`
- Prisma ORM (PostgreSQL)
- Firebase Admin SDK for token verification
- Pino structured logging
