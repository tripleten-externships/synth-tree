import { ApolloServer } from "@apollo/server";
import { CourseStatus, PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer } from "./server";
import { makeAdminContext, makeUserContext } from "./context";
import {
  seedUsers,
  cleanCourses,
  cleanAll,
  ADMIN_USER_ID,
  REGULAR_USER_ID,
  SECOND_REGULAR_USER_ID,
} from "./seed";

// skillNode / skillNodes / skillNodesByTree must not expose draft or deleted
// course content to learners. Admins and the course's author still see it.

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

async function seedNode(
  opts: {
    status?: CourseStatus;
    authorId?: string;
    courseDeleted?: boolean;
    treeDeleted?: boolean;
    nodeDeleted?: boolean;
  } = {},
) {
  const deletedAt = new Date();
  const course = await prisma.course.create({
    data: {
      title: "Course",
      status: opts.status ?? "PUBLISHED",
      authorId: opts.authorId ?? ADMIN_USER_ID,
      deletedAt: opts.courseDeleted ? deletedAt : null,
    },
  });
  const tree = await prisma.skillTree.create({
    data: {
      courseId: course.id,
      title: "Tree",
      deletedAt: opts.treeDeleted ? deletedAt : null,
    },
  });
  const node = await prisma.skillNode.create({
    data: {
      treeId: tree.id,
      title: "Node",
      step: 1,
      orderInStep: 0,
      deletedAt: opts.nodeDeleted ? deletedAt : null,
    },
  });
  return { course, tree, node };
}

const SKILL_NODE = `
  query SkillNode($id: ID!) {
    skillNode(id: $id) {
      id
      title
    }
  }
`;

const SKILL_NODES = `
  query SkillNodes {
    skillNodes(limit: 100) {
      id
    }
  }
`;

const SKILL_NODES_BY_TREE = `
  query SkillNodesByTree($treeId: ID!) {
    skillNodesByTree(treeId: $treeId) {
      id
    }
  }
`;

describe("skillNode queries", () => {
  let server: ApolloServer<GraphQLContext>;

  const asLearner = () => makeUserContext(prisma, SECOND_REGULAR_USER_ID);

  async function querySkillNode(id: string, contextValue: GraphQLContext) {
    return singleResult(
      await server.executeOperation({ query: SKILL_NODE, variables: { id } }, { contextValue }),
    );
  }

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);
  });

  afterEach(async () => {
    await cleanCourses(prisma);
  });

  afterAll(async () => {
    await cleanAll(prisma);
    await prisma.$disconnect();
  });

  describe("skillNode(id)", () => {
    it("returns a node of a published course to a learner", async () => {
      const { node } = await seedNode();

      const res = await querySkillNode(node.id, asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.skillNode).toEqual({ id: node.id, title: "Node" });
    });

    it("returns null to a learner for a draft course's node", async () => {
      const { node } = await seedNode({ status: "DRAFT" });

      const res = await querySkillNode(node.id, asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.skillNode).toBeNull();
    });

    it("returns null to a learner when the course, tree or node is deleted", async () => {
      const courseDeleted = await seedNode({ courseDeleted: true });
      const treeDeleted = await seedNode({ treeDeleted: true });
      const nodeDeleted = await seedNode({ nodeDeleted: true });

      for (const { node } of [courseDeleted, treeDeleted, nodeDeleted]) {
        const res = await querySkillNode(node.id, asLearner());
        expect(res.errors).toBeUndefined();
        expect(res.data.skillNode).toBeNull();
      }
    });

    it("lets the course's author read a node of their own draft course", async () => {
      const { node } = await seedNode({ status: "DRAFT", authorId: REGULAR_USER_ID });

      const res = await querySkillNode(node.id, makeUserContext(prisma, REGULAR_USER_ID));

      expect(res.errors).toBeUndefined();
      expect(res.data.skillNode.id).toBe(node.id);
    });

    it("lets an admin read a draft course's node", async () => {
      const { node } = await seedNode({ status: "DRAFT" });

      const res = await querySkillNode(node.id, makeAdminContext(prisma, ADMIN_USER_ID));

      expect(res.errors).toBeUndefined();
      expect(res.data.skillNode.id).toBe(node.id);
    });

    it("returns null for a malformed id instead of a database error", async () => {
      const res = await querySkillNode("1", asLearner());

      expect(res.errors).toBeUndefined();
      expect(res.data.skillNode).toBeNull();
    });
  });

  describe("skillNodes", () => {
    it("lists only published course nodes for a learner", async () => {
      const published = await seedNode();
      const draft = await seedNode({ status: "DRAFT" });

      const res = singleResult(
        await server.executeOperation({ query: SKILL_NODES }, { contextValue: asLearner() }),
      );

      expect(res.errors).toBeUndefined();
      const ids = res.data.skillNodes.map((n: { id: string }) => n.id);
      expect(ids).toContain(published.node.id);
      expect(ids).not.toContain(draft.node.id);
    });
  });

  describe("skillNodesByTree", () => {
    it("returns nothing to a learner for a draft course's tree", async () => {
      const { tree } = await seedNode({ status: "DRAFT" });

      const res = singleResult(
        await server.executeOperation(
          { query: SKILL_NODES_BY_TREE, variables: { treeId: tree.id } },
          { contextValue: asLearner() },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.skillNodesByTree).toEqual([]);
    });

    it("returns a draft course's nodes to an admin", async () => {
      const { tree, node } = await seedNode({ status: "DRAFT" });

      const res = singleResult(
        await server.executeOperation(
          { query: SKILL_NODES_BY_TREE, variables: { treeId: tree.id } },
          { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.skillNodesByTree).toEqual([{ id: node.id }]);
    });

    it("returns an empty list for a malformed tree id", async () => {
      const res = singleResult(
        await server.executeOperation(
          { query: SKILL_NODES_BY_TREE, variables: { treeId: "not-a-uuid" } },
          { contextValue: asLearner() },
        ),
      );

      expect(res.errors).toBeUndefined();
      expect(res.data.skillNodesByTree).toEqual([]);
    });
  });
});
