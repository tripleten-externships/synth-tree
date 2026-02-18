import { GraphQLError } from "graphql";
import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import { GraphQLContext } from "@graphql/context";
import { CourseProgressShape, CourseProgress } from "@graphql/models/models.all";


// helper
// - always requires auth
// - default: current user
// - override: admin only
export function resolveTargetUserId(
 ctx: GraphQLContext,
 argsUserId?: string | null
): string {
 const authedUserId = ctx.auth.requireAuth();

 // default path -> current user
 if (!argsUserId) return authedUserId;

 // allow passing own id
 if (argsUserId === authedUserId) return authedUserId;

 // override path -> admin only
 requireAdmin(ctx);
 return argsUserId;
}


// queries
builder.queryFields((t) => ({
 // myProgress
 // - default -> current user
 // - admin -> optional userId override
 myProgress: t.prismaField({
   type: ["UserNodeProgress"],
   args: {
     userId: t.arg.id({ required: false }),
   },
   resolve: async (query, _root, args, ctx) => {
     const targetUserId = resolveTargetUserId(ctx, args.userId);

     return ctx.prisma.userNodeProgress.findMany({
       ...query,
       where: { userId: targetUserId },
       orderBy: { updatedAt: "desc" },
     });
   },
 }),


 // nodeProgress
 // - single node + single user
 // - null means no row yet (implicit NOT_STARTED)
 // - admin override via userId
 nodeProgress: t.prismaField({
   type: "UserNodeProgress",
   nullable: true,
   args: {
     nodeId: t.arg.id({ required: true }),
     userId: t.arg.id({ required: false }),
   },
   resolve: async (query, _parent, args, ctx) => {
     const targetUserId = resolveTargetUserId(ctx, args.userId);

     // validate node exists and is not deleted
     const nodeExists = await ctx.prisma.skillNode.findFirst({
       where: { id: args.nodeId, deletedAt: null },
       select: { id: true },
     });

     if (!nodeExists) throw new GraphQLError("Node not found");

     return ctx.prisma.userNodeProgress.findUnique({
       ...query,
       where: {
         userId_nodeId: {
           userId: targetUserId,
           nodeId: args.nodeId,
         },
       },
     });
   },
 }),


 // courseProgress
 // - aggregated stats for one user in one course
 // - admin override via userId
 // - row existence === started
 courseProgress: t.field({
   type: CourseProgress,
   args: {
     courseId: t.arg.id({ required: true }),
     userId: t.arg.id({ required: false }),
   },
   resolve: async (_parent, args, ctx): Promise<CourseProgressShape> => {
     const targetUserId = resolveTargetUserId(ctx, args.userId);

     // validate course
     const courseExists = await ctx.prisma.course.findFirst({
       where: { id: args.courseId, deletedAt: null },
       select: { id: true },
     });

     if (!courseExists) throw new GraphQLError("Course not found");

     // total nodes in course (exclude deleted trees/nodes)
     const totalNodes = await ctx.prisma.skillNode.count({
       where: {
         deletedAt: null,
         tree: {
           courseId: args.courseId,
           deletedAt: null,
         },
       },
     });

     const inProgressNodes = await ctx.prisma.userNodeProgress.count({
       where: {
         userId: targetUserId,
         status: "IN_PROGRESS",
         node: {
           deletedAt: null,
           tree: {
             courseId: args.courseId,
             deletedAt: null,
           },
         },
       },
     });

     const completedNodes = await ctx.prisma.userNodeProgress.count({
       where: {
         userId: targetUserId,
         status: "COMPLETED",
         node: {
           deletedAt: null,
           tree: {
             courseId: args.courseId,
             deletedAt: null,
           },
         },
       },
     });

     const notStartedNodes = Math.max(totalNodes - (inProgressNodes + completedNodes), 0);

     const completionPercentage =
       totalNodes === 0
         ? 0
         : Math.round((completedNodes / totalNodes) * 100);

     return {
       courseId: args.courseId,
       totalNodes,
       inProgressNodes,
       completedNodes,
       notStartedNodes,
       completionPercentage,
     };
   },
 }),
}));
