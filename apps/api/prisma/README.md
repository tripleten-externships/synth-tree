# Prisma Seed Script for Synth-Tree API

This script populates your database with sample data for development and testing purposes. It is designed to be **idempotent** (can run multiple times without duplicating data).

---

## File Location

apps/api/prisma/seed.ts

---

## What the Seed Script Does

- Clears existing data in all relevant tables.
- Creates **3 sample users**, including:
  - 1 Admin
  - 2 Students
- Creates **1 course** with **2 skill trees**.
- Adds **5 nodes** across the skill trees.
- Creates **5–10 lessons** with varied content (HTML, video, image).
- Adds **sample progress records** for all users on all nodes.
- Prepares your database for local development and testing.

---

## How to Run the Seed Script

1. Ensure your `.env` file has a valid `DATABASE_URL` pointing to your PostgreSQL database.
2. Run Prisma migrations if you haven’t yet:

```bash
npx prisma migrate dev

Run the seed script using ts-node:
npx ts-node apps/api/prisma/seed.ts

```

Notes

Running the script multiple times is safe; previous data will be cleared before seeding.

Designed for development/testing only. Avoid running in production unless intentional.

Seeded data includes:

Users (Admin + 2 students)

Course

Skill trees

Nodes

Lessons

User progress records
