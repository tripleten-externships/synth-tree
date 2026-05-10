# API

GraphQL API server for Synth Tree, built with Apollo Server, Pothos, and Prisma.

## Running tests

The integration tests need a running Postgres instance. The repo's `docker-compose.yml` provides one.

```bash
# 1. Start Postgres in the background
docker compose up -d

# 2. From this directory:
cd apps/api

# Run all tests
pnpm test

# Run integration tests only
pnpm test:integration
```

See the root `README.md` for full project setup, env-var configuration, and database migration instructions.
