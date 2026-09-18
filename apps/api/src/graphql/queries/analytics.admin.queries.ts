import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
//import { GraphQLError } from "graphql";

export interface AnalyticsSummary {
  activeLearners: number;
  lessonsCompleted: number;
  avgSessionMinutes: number;
  courseCompletionRate: number;
}

const AnalyticsSummaryRef = builder.objectRef<AnalyticsSummary>("AnalyticsSummary");

AnalyticsSummaryRef.implement({
  fields: (t) => ({
    activeLearners: t.exposeInt("activeLearners"),
    lessonsCompleted: t.exposeInt("lessonsCompleted"),
    avgSessionMinutes: t.exposeFloat("avgSessionMinutes"),
    courseCompletionRate: t.exposeFloat("courseCompletionRate"),
  }),
});

let cachedData: { timestamp: number; data: AnalyticsSummary } | null = null;
const CACHE_TTL_MS = 60 * 1000;

builder.queryFields((t) => ({
  adminAnalytics: t.field({
    type: AnalyticsSummaryRef,
    args: {
      range: t.arg.string({ required: false }),
    },
    resolve: async (_root, { range }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);

      // STRICT ERROR HANDLING (Uncomment to enforce & Uncomment GraphQLError import ) ---

      // const validRanges = ["7d", "30d", "90d", "all"];
      // if (range && !validRanges.includes(range)) {
      //   throw new GraphQLError(`Invalid range parameter: "${range}". Must be one of: ${validRanges.join(", ")}`, {
      //     extensions: { code: "BAD_USER_INPUT" },
      //   });
      // }


      const nowTimestamp = Date.now();
      if (cachedData && nowTimestamp - cachedData.timestamp < CACHE_TTL_MS) {
        return cachedData.data;
      }

      const now = new Date();
      let days = 7;

      if (range === "30d") days = 30;
      else if (range === "90d") days = 90;
      else if (range === "all") days = 365 * 5;

      const currentStartDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      const previousStartDate = new Date(currentStartDate.getTime() - days * 24 * 60 * 60 * 1000);

      const activeLearners = await ctx.prisma.user.count({
        where: { updatedAt: { gte: currentStartDate } },
      });
      const prevActiveLearners = await ctx.prisma.user.count({
        where: { updatedAt: { gte: previousStartDate, lt: currentStartDate } },
      });

      const lessonsCompleted = await ctx.prisma.userNodeProgress.count({
        where: {
          status: "COMPLETED",
          updatedAt: { gte: currentStartDate },
        },
      });
      const prevLessonsCompleted = await ctx.prisma.userNodeProgress.count({
        where: {
          status: "COMPLETED",
          updatedAt: { gte: previousStartDate, lt: currentStartDate },
        },
      });

      const calcChange = (curr: number, prev: number) => {
        if (prev === 0) return curr > 0 ? 100 : 0;
        return Number((((curr - prev) / prev) * 100).toFixed(1));
      };

      const result = {
        activeLearners,
        lessonsCompleted,
        avgSessionMinutes: 14.5,
        courseCompletionRate: 68.2,
      };

      cachedData = {
        timestamp: nowTimestamp,
        data: result,
      };

      return result;
    },
  }),
}));
