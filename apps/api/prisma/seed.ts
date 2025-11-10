import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.lesson.deleteMany();
  await prisma.skilltree.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  // Admin
  const admin = await prisma.user.create({
    data: {
      id: "firebase-uid-admin",
      email: "admin@synth-tree.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });
  // Student 1
  const testUser1 = await prisma.user.create({
    data: {
      id: "firebase-uid-user",
      email: "testUser1@synth-tree.com",
      name: "TestUser2",
      role: "USER",
    },
  });
  // Student 2
  const testUser2 = await prisma.user.create({
    data: {
      id: "firebase-uid-user",
      email: "testUser1@synth-tree.com",
      name: "TestUser2",
      role: "USER",
    },
  });

  console.log(admin);
  console.log(testUser1);
  console.log(testUser2);

  // Create lessons (John O had named them "Courses", as ask him to clarify)
  const introLesson = await prisma.lesson.create({});
  const periodicTableLesson = await prisma.lesson.create({});
  const statesOfMatterLesson = await prisma.lesson.create({});
  const acidAndBasesLesson = await prisma.lesson.create({});
  const atomicStructureLesson = await prisma.lesson.create({});

  // Create SkillTrees
  const skillTree1 = await prisma.skilltree.create({});
  const skillTree2 = await prisma.skilltree.create({});
}

main()
  .catch(console.error)
  .finally(() => {
    prisma.$disconnect();
  });
