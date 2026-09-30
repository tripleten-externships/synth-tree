/** Local-only browser demo. Run with seed, cleanup, or --help. */
import "dotenv/config";
import { PrismaClient, type Prisma } from "@prisma/client";

const authorId = "syn79-analytics-demo-author";
const courseId = "79900000-0000-4000-8000-000000000001";
const treeId = "79900000-0000-4000-8000-000000000002";
const title = "[SYN-79 DEMO] Analytics range check";
const learners = [2, 20, 60].map((days, index) => ({
  id: `syn79-analytics-demo-learner-${days}d`,
  email: `syn79-analytics-${days}d@example.invalid`,
  days,
  nodeId: `79900000-0000-4000-8000-00000000001${index}`,
  progressId: `79900000-0000-4000-8000-00000000002${index}`,
}));
const users = [
  {
    id: authorId,
    email: "syn79-analytics-author@example.invalid",
    name: "[SYN-79 DEMO] Author",
    role: "ADMIN" as const,
  },
  ...learners.map((learner) => ({
    id: learner.id,
    email: learner.email,
    name: `[SYN-79 DEMO] Learner ${learner.days} days`,
    role: "USER" as const,
  })),
];

async function seed(tx: Prisma.TransactionClient) {
  const existing = await tx.user.count({
    where: {
      OR: [
        { id: { in: users.map((user) => user.id) } },
        { email: { in: users.map((user) => user.email) } },
      ],
    },
  });
  if (existing || (await tx.course.count({ where: { id: courseId } }))) {
    throw new Error(
      "Demo records already exist. Run the analytics cleanup command before seeding again.",
    );
  }
  const now = Date.now();
  await tx.user.createMany({ data: users });
  await tx.course.create({ data: { id: courseId, title, authorId, status: "DRAFT" } });
  await tx.skillTree.create({ data: { id: treeId, courseId, title: "Demo activity dates" } });
  for (const [index, learner] of learners.entries()) {
    const activityAt = new Date(now - learner.days * 24 * 60 * 60 * 1000);
    await tx.skillNode.create({
      data: {
        id: learner.nodeId,
        treeId,
        title: `Demo lesson ${learner.days} days ago`,
        orderInStep: index,
        posX: index,
        createdAt: activityAt,
        updatedAt: activityAt,
      },
    });
    await tx.userNodeProgress.create({
      data: {
        id: learner.progressId,
        userId: learner.id,
        nodeId: learner.nodeId,
        status: "COMPLETED",
        createdAt: activityAt,
        updatedAt: activityAt,
        completedAt: activityAt,
      },
    });
  }
}

async function cleanup(tx: Prisma.TransactionClient) {
  const storedUsers = await tx.user.findMany({
    where: { id: { in: users.map((user) => user.id) } },
  });
  const course = await tx.course.findUnique({
    where: { id: courseId },
    include: {
      trees: { include: { nodes: { include: { progresses: true, lessons: true, quiz: true } } } },
    },
  });
  if (!storedUsers.length && !course) {
    console.log("No analytics demo records found; nothing to remove.");
    return;
  }
  const userMatches =
    storedUsers.length === users.length &&
    users.every((expected) =>
      storedUsers.some(
        (actual) =>
          actual.id === expected.id &&
          actual.email === expected.email &&
          actual.name === expected.name &&
          actual.role === expected.role,
      ),
    );
  const tree = course?.trees[0];
  const contentMatches =
    course?.authorId === authorId &&
    course.title === title &&
    course.status === "DRAFT" &&
    course.trees.length === 1 &&
    tree?.id === treeId &&
    tree.nodes.length === learners.length &&
    learners.every((learner) =>
      tree.nodes.some(
        (node) =>
          node.id === learner.nodeId &&
          node.lessons.length === 0 &&
          node.quiz === null &&
          node.progresses.length === 1 &&
          node.progresses[0].id === learner.progressId &&
          node.progresses[0].userId === learner.id,
      ),
    );
  const ids = users.map((user) => user.id);
  const extraActivity = await tx.user.count({
    where: {
      id: { in: ids },
      OR: [
        { coursesAuthored: { some: { id: { not: courseId } } } },
        {
          nodeProgress: { some: { id: { notIn: learners.map((learner) => learner.progressId) } } },
        },
        { xpEvents: { some: {} } },
        { quizAttempts: { some: {} } },
        { dailyQuests: { some: {} } },
        { xp: { isNot: null } },
        { streak: { isNot: null } },
        { hearts: { isNot: null } },
      ],
    },
  });
  const extraLinks = await tx.skillNodePrerequisite.count({
    where: {
      OR: [
        { nodeId: { in: learners.map((learner) => learner.nodeId) } },
        { dependsOnNodeId: { in: learners.map((learner) => learner.nodeId) } },
      ],
    },
  });
  if (!userMatches || !contentMatches || extraActivity || extraLinks) {
    throw new Error(
      "Demo records differ from the original fixture. Nothing was removed; inspect them before cleanup.",
    );
  }
  await tx.course.delete({ where: { id: courseId } });
  await tx.user.deleteMany({ where: { id: { in: ids } } });
  console.log("Removed only the verified SYN-79 analytics demo records.");
}

async function main() {
  const action = process.argv[2];
  if (action === "--help") {
    console.log(
      "Usage: analyticsDemo.ts seed | cleanup\nLocal PostgreSQL only. Seed adds a separate draft course and three dated learner completions. Cleanup verifies and removes only those demo records. No Firebase accounts are created.",
    );
    return;
  }
  if (action !== "seed" && action !== "cleanup")
    throw new Error("Choose seed or cleanup, or use --help.");
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (
    !["postgresql:", "postgres:"].includes(url.protocol) ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
  ) {
    throw new Error("This demo script requires a local PostgreSQL DATABASE_URL.");
  }
  const db = new PrismaClient();
  try {
    await db.$transaction(action === "seed" ? seed : cleanup);
    if (action === "seed") {
      console.log("Added three demo learners with lesson completions 2, 20 and 60 days ago.");
      console.log(
        "With no other activity: 7d = 1, 30d = 2, 90d = 3, all = 3 (both measured cards).",
      );
      console.log("Previous counts: 7d = 0, 30d = 0, 90d = 0. All-time previous = null.");
      console.log("The 60-day event is just outside the previous 30-day window as time advances.");
    }
    console.log("Wait at least 60 seconds, then refresh Analytics so the server cache expires.");
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Analytics demo command failed");
  process.exitCode = 1;
});
