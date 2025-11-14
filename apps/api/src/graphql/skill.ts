import { builder } from "./builder";
import { prisma } from "@lib/prisma";
// Pothos + Prisma resolvers; keep thin and delegate to Prisma.

// Input types (GraphQL validation)
const CreateSkillTreeInput = builder.inputType("CreateSkillTreeInput", {
  fields: (t) => ({
    courseId: t.string({ required: true }),
    title: t.string({ required: true }),
    description: t.string(),
  }),
});

const CreateSkillNodeInput = builder.inputType("CreateSkillNodeInput", {
  fields: (t) => ({
    treeId: t.string({ required: true }),
    title: t.string({ required: true }),
    step: t.int(),
    orderInStep: t.int(),
    posX: t.int(),
    posY: t.int(),
    prerequisiteIds: t.field({ type: ["String"] }),
  }),
});

const UpdateSkillNodeInput = builder.inputType("UpdateSkillNodeInput", {
  fields: (t) => ({
    title: t.string(),
    step: t.int(),
    orderInStep: t.int(),
    posX: t.int(),
    posY: t.int(),
    description: t.string(),
  }),
});

// Auth (ADMIN only); throws if not admin.
function assertAdmin(ctx: { user?: { id: string; role?: string } | null }) {
  if (!ctx.user || ctx.user.role !== "ADMIN") {
    throw new Error("Forbidden: admin access required");
  }
}

// Queries (typed via prismaField)
// skillTree: fetch by id; include nodes
builder.queryField("skillTree", (t) =>
  t.prismaField({
    type: "SkillTree",
    args: { id: t.arg.id({ required: true }) },
    resolve: (_query, _root, args) => {
      return prisma.skillTree.findUnique({
        where: { id: String(args.id) },
        include: { nodes: true },
      });
    },
  })
);

// skillTrees: list all; include nodes
builder.queryField("skillTrees", (t) =>
  t.prismaField({
    type: ["SkillTree"],
    resolve: () => prisma.skillTree.findMany({ include: { nodes: true } }),
  })
);

// Mutations (admin-only)
// createSkillTree: admin create; GraphQL validates input; Prisma call = any
builder.mutationField("createSkillTree", (t) =>
  t.prismaField({
    type: "SkillTree",
    args: { input: t.arg({ type: CreateSkillTreeInput, required: true }) },
    resolve: (_query, _root, { input }, ctx) => {
      assertAdmin(ctx);
      return prisma.skillTree.create({ data: input as any });
    },
  })
);

// createSkillNode: admin create node; then create prerequisites via createMany (skipDuplicates)
builder.mutationField("createSkillNode", (t) =>
  t.prismaField({
    type: "SkillNode",
    args: { input: t.arg({ type: CreateSkillNodeInput, required: true }) },
    resolve: async (_query, _root, { input }, ctx) => {
      assertAdmin(ctx);
      const { prerequisiteIds, ...rest } = input as any;
      const node = await prisma.skillNode.create({ data: rest });
      if (prerequisiteIds && prerequisiteIds.length > 0) {
        await prisma.skillNodePrerequisite.createMany({
          data: prerequisiteIds.map((depId: string) => ({
            nodeId: node.id,
            dependsOnNodeId: depId,
          })),
          // Avoid failing if duplicates are attempted (idempotent wiring)
          skipDuplicates: true,
        });
      }
      return node;
    },
  })
);

// updateSkillNode: admin update; GraphQL validates fields; Prisma call = any
builder.mutationField("updateSkillNode", (t) =>
  t.prismaField({
    type: "SkillNode",
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateSkillNodeInput, required: true }),
    },
    resolve: async (_query, _root, { id, input }, ctx) => {
      assertAdmin(ctx);
      const data = input as any;
      return prisma.skillNode.update({ where: { id: String(id) }, data });
    },
  })
);
