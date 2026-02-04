# Database Migration Process

This document explains how we manage database schema changes using **Prisma**, including creating migrations, testing them locally, deploying them to production, rolling them back safely, and seeding data for development.

**Location**: `apps/api/prisma/`

## Overview

**Prisma Migrate** is used to track and apply database schema changes. All schema changes live in `schema.prisma` and are translated into SQL migrations stored in: `apps/api/prisma/migrations/`

The migrations folder represents your migration history.
Each migration represents a change to the database.

## Migration Workflow

### Develop:

Before you begin:

- Ensure your database is running.
- Confirm `DATABASE_URL` points to your local database. (This is in .env)
- Create a prisma schema (`schema.prisma`), this is already set up.
- cd into apps/api

1. **Update the Prisma Schema**

Edit `apps/api/prisma/schema.prisma` with your desired changes.

2. **Create a new migration**

Run:

```bash
pnpm prisma migrate dev
```

or, to set the name in the same commmand:

```bash
pnpm prisma migrate dev --name <name_of_your_choice>
```

Example:

```bash
pnpm prisma migrate dev --name add_course_publish_status
```

This will:

- Generate a new folder in `prisma/migrations/`
- Create the SQL migration file
- Apply the migration to your database
- Regenerate the Prisma Client (To manually regenerate run `pnpm prisma generate`)

3. **GraphQL Codegen**

To keep GraphQL in sync, run:

```bash
pnpm codegen
```

### Test:

- Inspect the generated SQL in the migration folder
- Run the API and confirm everything works as expected
- Run any automated tests
- Validate data integrity

Prisma Studio is a useful GUI tool for viewing/editing data. To use it, cd into apps/api, and run:

```bash
pnpm prisma studio
```

Tip: You can reset your local DB during development with:

```bash
pnpm prisma migrate reset
```

### Deploy:

In production, **never** use `prisma migrate dev`! There are risks that come with running that command.

Instead, apply already created migrations using:

```bash
pnpm prisma migrate deploy
```

This will apply pending migrations only and is safe for CI/CD and production environments.

## Development vs Production Migrations

Data in development environments can be messed with, but production data is real valuable data and should be kept safe.

**Never run `prisma migrate dev` against a production database.**

This command can:

- Drop tables
- Reset schemas
- Reorder migrations
- Prompt destructive actions

So, running this for production could delete data and break the database.

**So instead, remember, use `prisma migrate deploy` for production**

- This command applies existing migrations only.

## Rollback & Recovery Procedures

When rolling back changes, you will need to use a **roll forward** approach using new migrations. Prisma does not have built-in rollback functionality. This reversion of changes is called a down migration, while normal new migrations are called up migrations.

### Rolling back changes:

1. Update `schema.prisma` to the previous correct state
2. Run:

```bash
pnpm prisma migrate dev --name revert_<issue>
```

### Migration failure:

When a migration fails, and you need to resolve it to run subsequent migrations, run:

```bash
pnpm prisma migrate resolve --rolled-back <migration_name>
```

- This will not undo any changes, but will tell Prisma to ignore the failed migration.
- Migration name here is the folder the holds the migration.sql file, for example: "20251102184320_initial_schema_dump"

## Manual Migration and Data Backfills

When you change the schema, new data will work as it will follow the new rules automatically, but the old data can cause problems.

Example problems that require backfilling:

- Adding a non-nullable column
- Introducing a new enum value
- Changing how data is derived or related
- Enforcing new constraints or indexes

Backfilling is the step where you update the existing data so it is compatible with a new schema change.

You don't backfill in the same migration, best practice is: schema change first, data fix second, and constraint enforcement last.

### Example:

Let's say you want to add Course.status and eventually require it.

1. In schema.prisma, you would want to temporaily add the new column as nullable:

```prisma
model Course {
id String @id @default(uuid())
title String
status CourseStatus? // nullable for now
}
```

2. Migrate:

```bash
pnpm prisma migrate dev --name add_course_status_nullable
```

This way no data breaks, the old data is still valid.

2. Deploy and run a backfill with either sql or a prisma script

```sql
UPDATE "Course"
SET "status" = 'DRAFT'
WHERE "status" IS NULL;
```

or

```ts
await prisma.course.updateMany({
  where: { status: null },
  data: { status: "DRAFT" },
});
```

3. Verify the backfill

```sql
SELECT COUNT(*) FROM "Course" WHERE "status" IS NULL;
/* Expected result: 0 */
```

4. Enforce the constraint in a follow up migration

```prisma
model Course {
id String @id @default(uuid())
title String
status CourseStatus // non-nullable
}
```

```bash
pnpm prisma migrate dev --name enforce_course_status_not_null
```

**Idempotency**

Backfills need to be "idempotent." Meaning they are safe to be re-run without causing issues. This is important as scripts may need to be re-run, deploys may fail, and you might need to retry in production.

Bad backfill:

```sql
UPDATE "User" SET role = 'ADMIN';
```

Good backfill:

```sql
UPDATE "User"
SET role = 'USER'
WHERE role IS NULL;
```

## Seeding Data

Seeding is for _local and development environments only_ and should not be run automatically in production unless designed for it.

Seeding is used to populate local databases with baseline data.

Run:

```bash
pnpm prisma db seed
```

Seed logic lives in: `apps/api/prisma/seed.ts`

Seeds must also be idempotent.

## Existing Dev Scripts

We also maintain scripts for development:

- `apps/api/scripts/createDevAdminUser.md`

This documents how to create a local admin user for testing.

## Troubleshooting

### Prisma CLI and Client version mismatch

If you see unexpected runtime errors after upgrading Prisma:

```bash
pnpm install
pnpm prisma generate
```

Ensure `@prisma/client` and `prisma` versions match in `package.json`

### Migration fails with schema drift

```bash
pnpm prisma migrate reset
```

_Keep in mind: This will wipe local data!_

### Prisma Client out of sync

```bash
pnpm prisma generate
```

### Production migration not applying

- Ensure `prisma migrate deploy` is being used
- Verify the database connection string
- Check applied migrations:

```bash
pnpm prisma migrate status
```

### Migration was edited after being applied

Never edit a migration after it has been deployed. Always create a new migration.
If you want to edit a migration before deploying it you can use the --create-only flag.

### List of prisma commands

To see a list of prisma commands, run:

```bash
pnpm prisma migrate
```

## Examples from Existing Migrations

### Initial Schema Dump

From `20251102184320_initial_schema_dump/migration.sql`:

```sql
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
```

This migration establishes the base `User` table and a reusable enum, which is later referenced by other tables.

### Core Domain Schema Expansion

From `20251113171548_st_14_core_database_schema/migration.sql`:

```sql
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED');

CREATE TABLE "Course" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Course"
ADD CONSTRAINT "Course_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id");
```

This migration demonstrates:

- Enum reuse for constrained values
- Incremental schema growth
- Explicit foreign key relationships
- Defaults and timestamps managed at the database level

## Prisma docs:

https://www.prisma.io/docs/orm/prisma-migrate (ctrl+clicK)
