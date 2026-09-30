import { graphql, GraphQLError } from "graphql";
import { schema } from "../../schema";
import { getAdminAnalytics } from "../analytics";

jest.mock("../analytics", () => ({ getAdminAnalytics: jest.fn() }));
const analytics = jest.mocked(getAdminAnalytics);
const source = `query Analytics($range: AnalyticsRange!) {
  adminAnalytics(range: $range) {
    activeLearners { current previous percentChange }
    lessonsCompleted { current previous percentChange }
    avgSessionMinutes { current previous percentChange }
    courseCompletionRate { current previous percentChange }
  }
}`;
const context = (admin = true, authenticated = true) => ({
  prisma: {},
  auth: {
    requireAuth: () => {
      if (!authenticated) throw new GraphQLError("Authentication required");
      return "admin";
    },
    isAdmin: () => admin,
  },
});
const fixture = {
  activeLearners: { current: 3, previous: 2, percentChange: 50 },
  lessonsCompleted: { current: 0, previous: 0, percentChange: null },
  avgSessionMinutes: { current: 12.5, previous: 10.2, percentChange: 22.5 },
  courseCompletionRate: { current: null, previous: null, percentChange: null },
};
beforeEach(() => {
  analytics.mockReset();
  analytics.mockResolvedValue(fixture);
});

it.each([
  ["SEVEN_DAYS", "7d"],
  ["THIRTY_DAYS", "30d"],
  ["NINETY_DAYS", "90d"],
  ["ALL", "all"],
])("maps %s to %s and serializes decimal and null metrics", async (publicRange, internalRange) => {
  const ctx = context();
  const result = await graphql({
    schema,
    source,
    variableValues: { range: publicRange },
    contextValue: ctx,
  });
  expect(result.errors).toBeUndefined();
  expect(result.data?.adminAnalytics).toEqual(fixture);
  expect(analytics).toHaveBeenCalledWith(ctx.prisma, internalRange);
});

it("uses 7d when range is omitted", async () => {
  const ctx = context();
  const result = await graphql({
    schema,
    source: "{ adminAnalytics { activeLearners { current } } }",
    contextValue: ctx,
  });
  expect(result.errors).toBeUndefined();
  expect(analytics).toHaveBeenCalledWith(ctx.prisma, "7d");
});

it.each(["8d", "7d", null])(
  "rejects invalid public range %s before calling the service",
  async (range) => {
    const result = await graphql({
      schema,
      source,
      variableValues: { range },
      contextValue: context(),
    });
    expect(result.errors).toHaveLength(1);
    expect(analytics).not.toHaveBeenCalled();
  },
);

it.each([
  [false, true],
  [false, false],
])("requires admin access before reading cached analytics", async (admin, authenticated) => {
  const result = await graphql({
    schema,
    source,
    variableValues: { range: "SEVEN_DAYS" },
    contextValue: context(admin, authenticated),
  });
  expect(result.errors).toHaveLength(1);
  expect(analytics).not.toHaveBeenCalled();
});
