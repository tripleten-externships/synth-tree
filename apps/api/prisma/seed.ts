import { PrismaClient, ContentType, ProgressStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // --------------------------
  // Cleanup / idempotency
  // --------------------------
  await prisma.quizAttemptAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizOption.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonBlocks.deleteMany();
  await prisma.skillNodePrerequisite.deleteMany();
  await prisma.skillNode.deleteMany();
  await prisma.skillTree.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // --------------------------
  // Users
  // --------------------------
  const admin = await prisma.user.create({
    data: {
      id: "firebase-uid-admin",
      email: "admin@synth-tree.com",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      id: "firebase-uid-user-1",
      email: "user1@synth-tree.com",
      name: "Test User 1",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      id: "firebase-uid-user-2",
      email: "user2@synth-tree.com",
      name: "Test User 2",
    },
  });

  const users = [admin, user1, user2];

  // --------------------------
  // Courses
  // --------------------------
  const course = await prisma.course.create({
    data: {
      title: "Intro to Chemistry",
      description: "Basics of chemistry",
      authorId: admin.id,
    },
  });

  // --------------------------
  // SkillTrees
  // --------------------------
  const tree1 = await prisma.skillTree.create({
    data: {
      title: "Chemistry Tree 1",
      description: "Foundational chemistry concepts",
      courseId: course.id,
    },
  });

  const tree2 = await prisma.skillTree.create({
    data: {
      title: "Chemistry Tree 2",
      description: "Advanced chemistry concepts",
      courseId: course.id,
    },
  });

  // --------------------------
  // SkillNodes + Lessons
  // --------------------------
  const nodesTree1 = [
    await prisma.skillNode.create({
      data: {
        treeId: tree1.id,
        title: "Atoms & Molecules",
        step: 1,
        orderInStep: 0,
      },
    }),
    await prisma.skillNode.create({
      data: {
        treeId: tree1.id,
        title: "States of Matter",
        step: 2,
        orderInStep: 0,
      },
    }),
    await prisma.skillNode.create({
      data: {
        treeId: tree1.id,
        title: "Acids & Bases",
        step: 3,
        orderInStep: 0,
      },
    }),
  ];

  const nodesTree2 = [
    await prisma.skillNode.create({
      data: {
        treeId: tree2.id,
        title: "Atomic Structure",
        step: 1,
        orderInStep: 0,
      },
    }),
    await prisma.skillNode.create({
      data: {
        treeId: tree2.id,
        title: "Periodic Table",
        step: 2,
        orderInStep: 0,
      },
    }),
  ];

  // Lessons for Tree 1
  // `flatMap` is used to turn each node into an array of two lesson objects,
  // and then flatten the arrays into a single array for createMany.
  await prisma.lessonBlocks.createMany({
    data: nodesTree1.flatMap((node, i) => [
      {
        nodeId: node.id,
        type: ContentType.HTML,
        html: `<h1>${node.title} Lesson 1</h1>`,
        order: 0,
      },
      {
        nodeId: node.id,
        type: ContentType.VIDEO,
        url: `https://example.com/video-${i + 1}`,
        order: 1,
      },
    ]),
  });

  // Lessons for Tree 2
  await prisma.lessonBlocks.createMany({
    data: nodesTree2.flatMap((node, i) => [
      {
        nodeId: node.id,
        type: ContentType.HTML,
        html: `<h1>${node.title} Lesson 1</h1>`,
        order: 0,
      },
      {
        nodeId: node.id,
        type: ContentType.IMAGE,
        url: `https://example.com/image-${i + 1}`,
        order: 1,
      },
    ]),
  });

  // --------------------------
  // Sample progress
  // --------------------------
  // `userNodeProgress` tracks each user's progress on a specific node.
  // Here, all nodes are initialized with status NOT_STARTED.
  for (const user of users) {
    for (const node of [...nodesTree1, ...nodesTree2]) {
      await prisma.userNodeProgress.create({
        data: {
          userId: user.id,
          nodeId: node.id,
          status: ProgressStatus.NOT_STARTED,
        },
      });
    }
  }

  console.log("Seed complete:");
  console.log({ users, course, tree1, tree2, nodesTree1, nodesTree2 });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
