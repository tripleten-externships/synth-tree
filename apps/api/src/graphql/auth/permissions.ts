import { ForbiddenError } from "apollo-server-errors";
import { GraphQLError } from "graphql";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";

export async function assertCourseOwnership(
  ctx: GraphQLContext,
  courseId: string
) {
  requireAdmin(ctx);
  const course = await ctx.prisma.course.findUniqueOrThrow({
    where: { id: courseId },
  });
  if (!course || course.deletedAt) throw new GraphQLError("Course not found");
  if (course.authorId !== ctx.user?.uid) {
    throw new ForbiddenError("You do not have access to this course");
  }
  return course;
}

export async function assertTreeOwnership(ctx: GraphQLContext, treeId: string) {
  requireAdmin(ctx);
  const tree = await ctx.prisma.skillTree.findUniqueOrThrow({
    where: { id: treeId },
    include: {
      course: true,
    },
  });

  if (!tree || tree.deletedAt) throw new GraphQLError("Tree not found");
  if (tree.course.authorId !== ctx.user?.uid) {
    throw new ForbiddenError("You do not have access to this tree");
  }
  return tree;
}

export async function assertNodeOwnership(ctx: GraphQLContext, nodeId: string) {
  requireAdmin(ctx);
  const node = await ctx.prisma.skillNode.findUniqueOrThrow({
    where: { id: nodeId },
    include: {
      tree: { include: { course: true } },
    },
  });

  if (!node || node.deletedAt) throw new GraphQLError("Node not found");

  if (node.tree.course.authorId !== ctx.user?.uid) {
    throw new ForbiddenError("You do not have access to this node");
  }
  return node;
}
