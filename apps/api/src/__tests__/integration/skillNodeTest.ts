import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { getTestServer } from "./server";
import { makeAdminContext } from "./context";
import { seedUsers, cleanCourses, cleanAll, ADMIN_USER_ID } from "./seed";

const prisma = new PrismaClient();

function singleResult(result: any) {
  expect(result.body.kind).toBe("single");
  return result.body.singleResult;
}

const NODE_FIELDS = `id step orderInStep posX posY`;

const CREATE_FIRST = `
  mutation CreateFirst($input: CreateFirstSkillNodeInput!) {
    createFirstSkillNode(input: $input) { ${NODE_FIELDS} }
  }
`;

const CREATE_RIGHT = `
  mutation CreateRight($input: CreateSkillNodeToRightInput!) {
    createSkillNodeToRight(input: $input) { ${NODE_FIELDS} }
  }
`;

const CREATE_BELOW = `
  mutation CreateBelow($input: CreateSkillNodeBelowInput!) {
    createSkillNodeBelow(input: $input) { ${NODE_FIELDS} }
  }
`;

const UPDATE_NODE = `
  mutation UpdateNode($id: ID!, $input: UpdateSkillNodeInput!) {
    updateSkillNode(id: $id, input: $input) { ${NODE_FIELDS} }
  }
`;

const DELETE_ADVANCED = `
  mutation DeleteAdvanced($id: ID!) {
    deleteSkillNodeAdvanced(id: $id)
  }
`;

// SYN-128: both canvases read posX/posY as percentages (0-100), so the
// create mutations have to place nodes on that scale, spaced far enough apart
// that they don't overlap, and never on a cell another node already uses.
describe("SkillNode positions", () => {
  let server: ApolloServer<GraphQLContext>;
  let treeId: string;

  const run = async (query: string, variables: Record<string, unknown>) =>
    singleResult(
      await server.executeOperation(
        { query, variables },
        { contextValue: makeAdminContext(prisma, ADMIN_USER_ID) },
      ),
    );

  const createFirst = async (title = "A") => {
    const res = await run(CREATE_FIRST, { input: { treeId, title } });
    expect(res.errors).toBeUndefined();
    return res.data.createFirstSkillNode;
  };

  const createRight = async (referenceNodeId: string, title: string) => {
    const res = await run(CREATE_RIGHT, { input: { referenceNodeId, title } });
    expect(res.errors).toBeUndefined();
    return res.data.createSkillNodeToRight;
  };

  const createBelow = async (referenceNodeId: string, title: string) => {
    const res = await run(CREATE_BELOW, { input: { referenceNodeId, title } });
    expect(res.errors).toBeUndefined();
    return res.data.createSkillNodeBelow;
  };

  const moveNode = async (id: string, posX: number, posY: number) => {
    const res = await run(UPDATE_NODE, { id, input: { posX, posY } });
    expect(res.errors).toBeUndefined();
    return res.data.updateSkillNode;
  };

  const positionOf = (n: { posX: number; posY: number }) => ({ posX: n.posX, posY: n.posY });

  beforeAll(async () => {
    server = await getTestServer();
    await seedUsers(prisma);
  });

  beforeEach(async () => {
    const course = await prisma.course.create({
      data: { title: "Positions course", authorId: ADMIN_USER_ID },
    });
    const tree = await prisma.skillTree.create({
      data: { courseId: course.id, title: "Positions tree" },
    });
    treeId = tree.id;
  });

  afterEach(async () => {
    await cleanCourses(prisma);
  });

  afterAll(async () => {
    await cleanAll(prisma);
    await prisma.$disconnect();
  });

  describe("create mutations", () => {
    it("places the first node near the top-left of the canvas", async () => {
      const a = await createFirst();
      expect(positionOf(a)).toEqual({ posX: 10, posY: 10 });
    });

    it("places each node to the right 20% after the rightmost node in its row", async () => {
      const a = await createFirst();
      const b = await createRight(a.id, "B");
      const c = await createRight(a.id, "C");

      expect(positionOf(b)).toEqual({ posX: 30, posY: 10 });
      expect(positionOf(c)).toEqual({ posX: 50, posY: 10 });
    });

    it("places a node below 15% under the node it was created from", async () => {
      const a = await createFirst();
      const b = await createRight(a.id, "B");
      const below = await createBelow(b.id, "Below B");

      expect(below.step).toBe(2);
      expect(positionOf(below)).toEqual({ posX: 30, posY: 25 });
    });

    it("follows the row's rightmost node after the author drags it", async () => {
      const a = await createFirst();
      const b = await createRight(a.id, "B");
      await moveNode(b.id, 50, 40);

      const c = await createRight(a.id, "C");
      expect(positionOf(c)).toEqual({ posX: 70, posY: 40 });
    });

    it("moves to the nearest free cell when the preferred one is taken", async () => {
      const a = await createFirst();
      const below = await createBelow(a.id, "Below A");
      // Park the step-2 node exactly where the next node in row 1 would go.
      await moveNode(below.id, 30, 10);

      const b = await createRight(a.id, "B");

      expect(positionOf(b)).not.toEqual({ posX: 30, posY: 10 });
      expect(positionOf(b)).not.toEqual({ posX: 10, posY: 10 });
      expect(b.posX % 5).toBe(0);
      expect(b.posY % 5).toBe(0);
      expect(Math.max(Math.abs(b.posX - 30), Math.abs(b.posY - 10))).toBe(5);
    });

    it("keeps nodes on the canvas when a row runs past the right edge", async () => {
      const a = await createFirst();
      const nodes = [a];
      for (let i = 0; i < 6; i++) {
        nodes.push(await createRight(a.id, `N${i}`));
      }

      const cells = nodes.map((n) => `${n.posX},${n.posY}`);
      expect(new Set(cells).size).toBe(nodes.length);
      for (const n of nodes) {
        expect(n.posX).toBeGreaterThanOrEqual(0);
        expect(n.posX).toBeLessThanOrEqual(100);
        expect(n.posY).toBeGreaterThanOrEqual(0);
        expect(n.posY).toBeLessThanOrEqual(100);
      }
    });
  });

  describe("deleteSkillNodeAdvanced", () => {
    it("keeps the remaining nodes where they are", async () => {
      const a = await createFirst();
      const b = await createRight(a.id, "B");
      const c = await createRight(a.id, "C");

      const res = await run(DELETE_ADVANCED, { id: b.id });
      expect(res.errors).toBeUndefined();

      const after = await prisma.skillNode.findMany({
        where: { treeId },
        orderBy: { orderInStep: "asc" },
      });
      expect(
        after.map((n) => ({ id: n.id, orderInStep: n.orderInStep, ...positionOf(n as any) })),
      ).toEqual([
        { id: a.id, orderInStep: 1, posX: 10, posY: 10 },
        { id: c.id, orderInStep: 2, posX: 50, posY: 10 },
      ]);
    });
  });

  describe("updateSkillNode range check", () => {
    it.each([
      ["posX above 100", { posX: 101 }],
      ["posY below 0", { posY: -5 }],
    ])("rejects %s", async (_label, input) => {
      const a = await createFirst();

      const res = await run(UPDATE_NODE, { id: a.id, input });

      expect(res.errors).toBeDefined();
      expect(res.errors[0].extensions.code).toBe("BAD_USER_INPUT");
      const stored = await prisma.skillNode.findUniqueOrThrow({ where: { id: a.id } });
      expect(positionOf(stored as any)).toEqual(positionOf(a));
    });

    it("accepts the edges of the canvas", async () => {
      const a = await createFirst();
      const moved = await moveNode(a.id, 0, 100);
      expect(positionOf(moved)).toEqual({ posX: 0, posY: 100 });
    });
  });
});
