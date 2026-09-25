import { deriveSkillTree, nodeHref, type RawSkillNode } from "../src/lib/deriveSkillTree";

function node(overrides: Partial<RawSkillNode>): RawSkillNode {
  return {
    id: "node-1",
    title: "Test Node",
    step: 1,
    orderInStep: 0,
    posX: 50,
    posY: 50,
    prerequisites: [],
    progressForViewer: null,
    ...overrides,
  };
}

describe("deriveSkillTree", () => {
  it("marks a node with no prerequisites and no progress as unlocked", () => {
    const { nodes } = deriveSkillTree([node({ id: "a", prerequisites: [] })]);
    expect(nodes[0].status).toBe("unlocked");
  });

  it("marks a COMPLETED node as completed", () => {
    const { nodes } = deriveSkillTree([
      node({
        id: "a",
        progressForViewer: {
          status: "COMPLETED",
          completedAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      }),
    ]);
    expect(nodes[0].status).toBe("completed");
  });

  it("marks an IN_PROGRESS node as current", () => {
    const { nodes } = deriveSkillTree([
      node({
        id: "a",
        progressForViewer: { status: "IN_PROGRESS", completedAt: null, updatedAt: "2026-01-01" },
      }),
    ]);
    expect(nodes[0].status).toBe("current");
  });

  it("marks a node as locked if its prerequisite is not completed", () => {
    const raw = [
      node({ id: "a", progressForViewer: null }),
      node({ id: "b", prerequisites: [{ dependsOnNodeId: "a" }] }),
    ];
    const { nodes } = deriveSkillTree(raw);
    const nodeB = nodes.find((n) => n.id === "b")!;
    expect(nodeB.status).toBe("locked");
  });

  it("marks a node as unlocked if all prerequisites are completed", () => {
    const raw = [
      node({
        id: "a",
        progressForViewer: {
          status: "COMPLETED",
          completedAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      }),
      node({ id: "b", prerequisites: [{ dependsOnNodeId: "a" }] }),
    ];
    const { nodes } = deriveSkillTree(raw);
    const nodeB = nodes.find((n) => n.id === "b")!;
    expect(nodeB.status).toBe("unlocked");
  });

  it("derives one edge per prerequisite relationship", () => {
    const raw = [node({ id: "a" }), node({ id: "b", prerequisites: [{ dependsOnNodeId: "a" }] })];
    const { edges } = deriveSkillTree(raw);
    expect(edges).toHaveLength(1);
    expect(edges[0].from.id).toBe("a");
    expect(edges[0].to.id).toBe("b");
  });

  it("marks an edge solid when source is completed and target is not locked", () => {
    const raw = [
      node({
        id: "a",
        progressForViewer: {
          status: "COMPLETED",
          completedAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      }),
      node({ id: "b", prerequisites: [{ dependsOnNodeId: "a" }] }),
    ];
    const { edges } = deriveSkillTree(raw);
    expect(edges[0].solid).toBe(true);
  });

  it("marks an edge dashed when source is not completed", () => {
    const raw = [
      node({ id: "a", progressForViewer: null }),
      node({ id: "b", prerequisites: [{ dependsOnNodeId: "a" }] }),
    ];
    const { edges } = deriveSkillTree(raw);
    expect(edges[0].solid).toBe(false);
  });

  it("keeps an edge solid once the target is also completed", () => {
    const raw = [
      node({
        id: "a",
        progressForViewer: {
          status: "COMPLETED",
          completedAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      }),
      node({
        id: "b",
        prerequisites: [{ dependsOnNodeId: "a" }],
        progressForViewer: {
          status: "COMPLETED",
          completedAt: "2026-01-02",
          updatedAt: "2026-01-01",
        },
      }),
    ];
    const { edges } = deriveSkillTree(raw);
    expect(edges[0].solid).toBe(true);
  });

  it("marks edges dashed into a multi-prereq node when only one prereq is done", () => {
    const raw = [
      node({
        id: "a",
        progressForViewer: {
          status: "COMPLETED",
          completedAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      }),
      node({ id: "b", progressForViewer: null }),
      node({
        id: "c",
        prerequisites: [{ dependsOnNodeId: "a" }, { dependsOnNodeId: "b" }],
      }),
    ];
    const { nodes, edges } = deriveSkillTree(raw);
    expect(nodes.find((n) => n.id === "c")!.status).toBe("locked");
    expect(edges.find((e) => e.id === "a->c")!.solid).toBe(false);
    expect(edges.find((e) => e.id === "b->c")!.solid).toBe(false);
  });

  it("produces no edges for a node with no prerequisites", () => {
    const { edges } = deriveSkillTree([node({ id: "a", prerequisites: [] })]);
    expect(edges).toHaveLength(0);
  });
});

describe("nodeHref", () => {
  const derived = (overrides: Partial<RawSkillNode>[]) =>
    deriveSkillTree(overrides.map((o) => node(o))).nodes;

  it("links unlocked, in-progress and completed nodes to their lesson", () => {
    const nodes = derived([
      { id: "a" },
      {
        id: "b",
        progressForViewer: { status: "IN_PROGRESS", completedAt: null, updatedAt: "2026-01-01" },
      },
      {
        id: "c",
        progressForViewer: {
          status: "COMPLETED",
          completedAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      },
    ]);

    expect(nodes.map((n) => nodeHref("course-1", n))).toEqual([
      "/courses/course-1/nodes/a",
      "/courses/course-1/nodes/b",
      "/courses/course-1/nodes/c",
    ]);
  });

  it("returns null for a locked node", () => {
    const nodes = derived([{ id: "a" }, { id: "b", prerequisites: [{ dependsOnNodeId: "a" }] }]);
    const locked = nodes.find((n) => n.id === "b")!;

    expect(locked.status).toBe("locked");
    expect(nodeHref("course-1", locked)).toBeNull();
  });
});
