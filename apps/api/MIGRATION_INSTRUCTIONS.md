# Database Migration Instructions

## 🔴 IMPORTANT: Run This Before Testing

The color fields have been added to the Prisma schema, but you need to run a database migration to actually create these columns in your database.

## Steps to Migrate

### 1. Start your database (if not running)
```bash
# From project root
docker compose up -d
```

### 2. Run the migration
```bash
cd apps/api
pnpm prisma migrate dev --name add_color_fields
```

This will:
- Create a new migration file
- Add `brandColor` column to the `Course` table
- Add `color` column to the `SkillNode` table
- Update existing rows with default values

### 3. Verify the migration
```bash
pnpm prisma studio
```

Open Prisma Studio and check that:
- `Course` table has a `brandColor` column
- `SkillNode` table has a `color` column

## If Migration Fails

If you see `Error: P1001: Can't reach database server`, it means your database isn't running:

```bash
# Check if database container is running
docker ps

# If not, start it
docker compose up -d

# Wait a few seconds for DB to be ready, then retry migration
pnpm prisma migrate dev --name add_color_fields
```

## Alternative: Reset Database (Development Only)

⚠️ **WARNING: This will delete all data!**

```bash
cd apps/api
pnpm prisma migrate reset
```

This will:
- Drop the database
- Run all migrations from scratch
- Seed the database (if you have a seed script)

## After Migration

Your color picker integration will work! You can:
1. Create courses with custom brand colors
2. Create skill nodes with custom visualization colors
3. See colors persisted in the database

## Checking Migration Status

```bash
cd apps/api

# View migration history
pnpm prisma migrate status

# View the generated SQL
cat prisma/migrations/<timestamp>_add_color_fields/migration.sql
```

---

**Note:** All GraphQL schema updates and TypeScript types have already been generated. You just need to run the database migration!
