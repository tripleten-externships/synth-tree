import { ForbiddenError } from "apollo-server-errors";
import { GraphQLError } from "graphql";
import { GraphQLContext } from "@graphql/context";

export async function assertCourseOwnership(
  ctx: GraphQLContext,
  courseId: string,
) {
  const course = await ctx.prisma.course.findUniqueOrThrow({
    where: { id: courseId },
  });
  if (!course || course.deletedAt) throw new GraphQLError("Course not found");
  if (!ctx.auth.isAdmin() && course.authorId !== ctx.user?.uid) {
    throw new ForbiddenError("You do not have access to this course");
  }
  return course;
}

export async function assertTreeOwnership(ctx: GraphQLContext, treeId: string) {
  const tree = await ctx.prisma.skillTree.findUniqueOrThrow({
    where: { id: treeId },
    include: {
      course: true,
    },
  });

  if (!tree || tree.deletedAt) throw new GraphQLError("Tree not found");
  if (!ctx.auth.isAdmin() && tree.course.authorId !== ctx.user?.uid) {
    throw new ForbiddenError("You do not have access to this tree");
  }
  return tree;
}

export async function assertNodeOwnership(ctx: GraphQLContext, nodeId: string) {
  const node = await ctx.prisma.skillNode.findUniqueOrThrow({
    where: { id: nodeId },
    include: {
      tree: { include: { course: true } },
    },
  });

  if (!node || node.deletedAt) throw new GraphQLError("Node not found");

  if (!ctx.auth.isAdmin() && node.tree.course.authorId !== ctx.user?.uid) {
    throw new ForbiddenError("You do not have access to this node");
  }
  return node;
}
