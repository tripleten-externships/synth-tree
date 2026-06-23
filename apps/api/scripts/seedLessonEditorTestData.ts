import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const ADMIN_EMAIL = "admin@local.dev";
const COURSE_TITLE = "Lesson Editor Test Course";
const NODE_TITLE = "Test Lesson Node";

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!admin) {
    console.error("run pnpm db:seed:local-users first");
    process.exit(1);
  }

  let course = await prisma.course.findFirst({
    where: { title: COURSE_TITLE, authorId: admin.id, deletedAt: null },
    include: { trees: { include: { nodes: { where: { deletedAt: null } } } } },
  });

  if (!course) {
    course = await prisma.course.create({
      data: {
        title: COURSE_TITLE,
        authorId: admin.id,
        status: "DRAFT",
        trees: { create: { title: "Test Tree" } },
      },
      include: { trees: { include: { nodes: true } } },
    });
  }

  const tree = course.trees[0];
  let node = tree?.nodes[0];

  if (!node && tree) {
    node = await prisma.skillNode.create({
      data: {
        treeId: tree.id,
        title: NODE_TITLE,
        step: 1,
        orderInStep: 1,
        posX: 1,
        posY: 1,
      },
    });
  }

  console.log("");
  console.log("login: admin@local.dev / Local123!");
  console.log("node id:", node!.id);
  console.log(`open: http://localhost:5173/lessons/${node!.id}/edit`);
  console.log("");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
