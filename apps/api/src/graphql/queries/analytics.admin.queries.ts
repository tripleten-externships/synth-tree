import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";
import {
  getAdminAnalytics,
  type AnalyticsSummary,
  type MetricStat,
} from "../../services/analytics";

const AnalyticsRange = builder.enumType("AnalyticsRange", {
  values: {
    SEVEN_DAYS: { value: "7d" },
    THIRTY_DAYS: { value: "30d" },
    NINETY_DAYS: { value: "90d" },
    ALL: { value: "all" },
  } as const,
});

const MetricStatRef = builder.objectRef<MetricStat>("AnalyticsMetric");
MetricStatRef.implement({
  fields: (t) => ({
    current: t.exposeFloat("current", { nullable: true }),
    previous: t.exposeFloat("previous", { nullable: true }),
    percentChange: t.exposeFloat("percentChange", { nullable: true }),
  }),
});

const AnalyticsSummaryRef = builder.objectRef<AnalyticsSummary>("AnalyticsSummary");
AnalyticsSummaryRef.implement({
  fields: (t) => ({
    activeLearners: t.field({
      type: MetricStatRef,
      nullable: false,
      resolve: (p) => p.activeLearners,
    }),
    lessonsCompleted: t.field({
      type: MetricStatRef,
      nullable: false,
      resolve: (p) => p.lessonsCompleted,
    }),
    avgSessionMinutes: t.field({
      type: MetricStatRef,
      nullable: false,
      resolve: (p) => p.avgSessionMinutes,
    }),
    courseCompletionRate: t.field({
      type: MetricStatRef,
      nullable: false,
      resolve: (p) => p.courseCompletionRate,
    }),
  }),
});

builder.queryFields((t) => ({
  adminAnalytics: t.field({
    type: AnalyticsSummaryRef,
    nullable: false,
    args: {
      range: t.arg({ type: AnalyticsRange, required: true, defaultValue: "7d" }),
    },
    resolve: async (_root, { range }, ctx) => {
      ctx.auth.requireAuth();
      requireAdmin(ctx);
      return getAdminAnalytics(ctx.prisma, range);
    },
  }),
}));
