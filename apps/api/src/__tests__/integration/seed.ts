/*
this file use for integration testing
seedUsers() creates 2 test users (1 admin, 1 regular user),
cleanCourses() delete all course data in fk-safe order
cleanAll() also removes test users
*/

import { PrismaClient } from "@prisma/client";
export const ADMIN_USER_ID = "test-admin-user-id";
export const REGULAR_USER_ID = "test-regular-user-id";
export const SECOND_REGULAR_USER_ID = "test-regular-user-2-id";

export async function seedUsers(prisma: PrismaClient) {
  await prisma.user.upsert({
    where: { id: ADMIN_USER_ID },
    update: {},
    create: {
      id: ADMIN_USER_ID,
      email: "admin@test.com",
      name: "Test Admin",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { id: REGULAR_USER_ID },
    update: {},
    create: {
      id: REGULAR_USER_ID,
      email: "user@test.com",
      name: "Test User",
      role: "USER",
    },
  });

  await prisma.user.upsert({
    where: { id: SECOND_REGULAR_USER_ID },
    update: {},
    create: {
      id: SECOND_REGULAR_USER_ID,
      email: "user2@test.com",
      name: "Test User 2",
      role: "USER",
    },
  });
}

export async function cleanCourses(prisma: PrismaClient) {
  await prisma.quizAttemptAnswer.deleteMany({});
  await prisma.quizAttempt.deleteMany({});
  await prisma.quizOption.deleteMany({});
  await prisma.quizQuestion.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.lessonBlocks.deleteMany({});
  await prisma.userNodeProgress.deleteMany({});
  await prisma.skillNodePrerequisite.deleteMany({});
  await prisma.skillNode.deleteMany({});
  await prisma.skillTree.deleteMany({});
  await prisma.course.deleteMany({});
}

export async function cleanAll(prisma: PrismaClient) {
  await cleanCourses(prisma);
  await prisma.user.deleteMany({
    where: { id: { in: [ADMIN_USER_ID, REGULAR_USER_ID, SECOND_REGULAR_USER_ID] } },
  });
}
