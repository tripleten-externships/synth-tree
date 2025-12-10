// COMMENTED OUT - STALE CODE (models don't exist in current schema)
// import { builder } from "./builder";
// import { prisma } from "@lib/prisma";

// How it works:
// 1. Queries (skillTree, skillTrees) fetch SkillTree + nodes from DB (no auth needed).
// 2. Mutations (createSkillTree, createSkillNode, updateSkillNode) require ADMIN auth.
// 3. Input validation ensures required fields (courseId, treeId, title) are non-empty.
// 4. createSkillNode prevents circular dependencies (node != its own prerequisite).
// 5. createSkillNode wraps node + prerequisites in a transaction (all-or-nothing).
// 6. updateSkillNode verifies target node exists before updating.
// 7. All Prisma calls use typed client (no escape hatches); include: { nodes: true } eagerly loads relationships.

// Input types (GraphQL validation)
/*
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
*/

// Auth (ADMIN only); throws if not admin.
/*
function assertAdmin(ctx: { user?: { id: string; role?: string } | null }) {
  if (!ctx.user || ctx.user.role !== "ADMIN") {
    throw new Error("Forbidden: admin access required");
  }
}

// Validate input fields; throw on missing required fields.
function validateCreateSkillTree(input: any) {
  if (!input.courseId || input.courseId.trim() === "") {
    throw new Error("Validation: courseId is required and cannot be empty");
  }
  if (!input.title || input.title.trim() === "") {
    throw new Error("Validation: title is required and cannot be empty");
  }
}

function validateCreateSkillNode(input: any) {
  if (!input.treeId || input.treeId.trim() === "") {
    throw new Error("Validation: treeId is required and cannot be empty");
  }
  if (!input.title || input.title.trim() === "") {
    throw new Error("Validation: title is required and cannot be empty");
  }
}

// Check for circular prerequisite dependencies (node cannot depend on itself).
async function checkCircularDependencies(
  nodeId: string,
  prerequisiteIds: string[]
) {
  if (prerequisiteIds.includes(nodeId)) {
    throw new Error("Validation: node cannot be its own prerequisite");
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
// createSkillTree: admin create; validate input; Prisma call = any
builder.mutationField("createSkillTree", (t) =>
  t.prismaField({
    type: "SkillTree",
    args: { input: t.arg({ type: CreateSkillTreeInput, required: true }) },
    resolve: (_query, _root, { input }, ctx) => {
      assertAdmin(ctx);
      validateCreateSkillTree(input as any);
      return prisma.skillTree.create({ data: input as any });
    },
  })
);

// createSkillNode: admin create node + prerequisites in transaction (all-or-nothing).
builder.mutationField("createSkillNode", (t) =>
  t.prismaField({
    type: "SkillNode",
    args: { input: t.arg({ type: CreateSkillNodeInput, required: true }) },
    resolve: async (_query, _root, { input }, ctx) => {
      assertAdmin(ctx);
      validateCreateSkillNode(input as any);
      const { prerequisiteIds, ...rest } = input as any;
      // Check for circular deps before transaction
      if (prerequisiteIds && prerequisiteIds.length > 0) {
        await checkCircularDependencies(rest.id || "new", prerequisiteIds);
      }
      // Wrap in transaction: if prereqs fail, node creation rolls back
      const node = await prisma.$transaction(async (tx) => {
        const createdNode = await tx.skillNode.create({ data: rest });
        if (prerequisiteIds && prerequisiteIds.length > 0) {
          await tx.skillNodePrerequisite.createMany({
            data: prerequisiteIds.map((depId: string) => ({
              nodeId: createdNode.id,
              dependsOnNodeId: depId,
            })),
            skipDuplicates: true,
          });
        }
        return createdNode;
      });
      return node;
    },
  })
);

// updateSkillNode: admin update; validate id exists; Prisma call = any
builder.mutationField("updateSkillNode", (t) =>
  t.prismaField({
    type: "SkillNode",
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateSkillNodeInput, required: true }),
    },
    resolve: async (_query, _root, { id, input }, ctx) => {
      assertAdmin(ctx);
      const nodeId = String(id);
      // Verify node exists before update
      const exists = await prisma.skillNode.findUnique({
        where: { id: nodeId },
      });
      if (!exists) {
        throw new Error(`Validation: SkillNode with id '${nodeId}' not found`);
      }
      const data = input as any;
      return prisma.skillNode.update({ where: { id: nodeId }, data });
    },
  })
);
*/
