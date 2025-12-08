# Database Scripts

These scripts help manage your database backups, resets, and restores for the API application.

## Prerequisites

- `DATABASE_URL` environment variable must be set
- `pg_dump` and `psql` tools must be installed (comes with PostgreSQL)
- Prisma CLI must be available (`npx prisma`)

## Scripts

### 📁 db-backup.sh
Creates a backup of your entire database.

```bash
# Using npm script (recommended)
pnpm db:backup

# Or directly
bash scripts/db-backup.sh 