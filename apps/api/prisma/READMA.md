# Matthew Richards README: Create Database Seed Script

1. Seed script is created at `apps/api/prisma/seed.ts`.
2. 3 users are created:

   - Admin (given by default)
   - User1
   - User2

   Notes:
   Only ADMIN and USER roles seemed to exist up this point. I.e no TEACHER or PROFESSOR role.
   id: "firebase-uid-user" is assigned to USERS which I am unsure if that is the id firebase gives us.

3. 5 lessons are created:
   Notes:
   Ask John O for lessons schema. In the meantime I will make a mock one so I can test the seed code.
   I also will need to regenerate the schema via `pnpm prisma generate`
