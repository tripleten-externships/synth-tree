import { ApolloServer } from "@apollo/server";
import { CourseStatus, PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer } from "./server";
import { makeUserContext } from "./context";
import { seedUsers, cleanCourses, cleanAll, ADMIN_USER_ID, REGULAR_USER_ID } from "./seed";

const prisma = new PrismaClient();

type RecommendedNextData = { currentUser: { recommendedNext: { id: string }[] } };

const RECOMMENDED_NEXT = `
  query RecommendedNext {
    currentUser {
      recommendedNext {
        id
      }
    }
  }
`;

type SeedOptions = {
  status: CourseStatus;
  courseDeletedAt?: Date;
  treeDeletedAt?: Date;
  nodeDeletedAt?: Date;
};

// Creates course -> tree -> one step 1 node with no prerequisites, so the node
// is recommended unless its course, tree or the node itself is hidden.
async function seedNode(title: string, options: SeedOptions) {
  const course = await prisma.course.create({
    data: {
      title: `${title} Course`,
      status: options.status,
      authorId: ADMIN_USER_ID,
      deletedAt: options.courseDeletedAt,
    },
  });
  const tree = await prisma.skillTree.create({
    data: { courseId: course.id, title: `${title} Tree`, deletedAt: options.treeDeletedAt },
  });
  const node = await prisma.skillNode.create({
    data: { treeId: tree.id, title, step: 1, orderInStep: 0, deletedAt: options.nodeDeletedAt },
  });
  return node.id;
}

describe("User.recommendedNext visibility", () => {
  let server: ApolloServer<GraphQLContext>;

  async function recommendedIds(): Promise<string[]> {
    const result = await server.executeOperation<RecommendedNextData>(
      { query: RECOMMENDED_NEXT },
      { contextValue: makeUserContext(prisma, REGULAR_USER_ID) },
    );
    if (result.body.kind !== "single") throw new Error("Expected a single result");

    expect(result.body.singleResult.errors).toBeUndefined();
    return result.body.singleResult.data?.currentUser.recommendedNext.map((node) => node.id) ?? [];
  }

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);
    // Leftover nodes could fill the 6-slot limit and hide the node under test.
    await cleanCourses(prisma);
  });

  afterEach(async () => {
    await cleanCourses(prisma);
  });

  afterAll(async () => {
    await cleanAll(prisma);
    await prisma.$disconnect();
  });

  const deletedAt = new Date();

  it.each<[string, SeedOptions]>([
    ["nodes in a draft course", { status: CourseStatus.DRAFT }],
    [
      "nodes in a soft-deleted course",
      { status: CourseStatus.PUBLISHED, courseDeletedAt: deletedAt },
    ],
    ["nodes in a soft-deleted tree", { status: CourseStatus.PUBLISHED, treeDeletedAt: deletedAt }],
    ["soft-deleted nodes", { status: CourseStatus.PUBLISHED, nodeDeletedAt: deletedAt }],
  ])("skips %s", async (_label, options) => {
    const visibleId = await seedNode("Visible", { status: CourseStatus.PUBLISHED });
    const hiddenId = await seedNode("Hidden", options);

    const ids = await recommendedIds();

    expect(ids).toContain(visibleId);
    expect(ids).not.toContain(hiddenId);
  });
});
