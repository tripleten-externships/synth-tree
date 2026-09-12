import { deriveSkillTree, type RawSkillNode } from "../src/lib/deriveSkillTree";

function node(overrides: Partial<RawSkillNode>): RawSkillNode {
  return {
    id: "node-1",
    title: "Test Node",
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
      node({ id: "a", progressForViewer: { status: "COMPLETED", completedAt: "2026-01-01" } }),
    ]);
    expect(nodes[0].status).toBe("completed");
  });

  it("marks an IN_PROGRESS node as current", () => {
    const { nodes } = deriveSkillTree([
      node({ id: "a", progressForViewer: { status: "IN_PROGRESS", completedAt: null } }),
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
      node({ id: "a", progressForViewer: { status: "COMPLETED", completedAt: "2026-01-01" } }),
      node({ id: "b", prerequisites: [{ dependsOnNodeId: "a" }] }),
    ];
    const { nodes } = deriveSkillTree(raw);
    const nodeB = nodes.find((n) => n.id === "b")!;
    expect(nodeB.status).toBe("unlocked");
  });

  it("derives one edge per prerequisite relationship", () => {
    const raw = [
      node({ id: "a" }),
      node({ id: "b", prerequisites: [{ dependsOnNodeId: "a" }] }),
    ];
    const { edges } = deriveSkillTree(raw);
    expect(edges).toHaveLength(1);
    expect(edges[0].from.id).toBe("a");
    expect(edges[0].to.id).toBe("b");
  });

  it("marks an edge solid when source is completed and target is unlocked", () => {
    const raw = [
      node({ id: "a", progressForViewer: { status: "COMPLETED", completedAt: "2026-01-01" } }),
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

  it("produces no edges for a node with no prerequisites", () => {
    const { edges } = deriveSkillTree([node({ id: "a", prerequisites: [] })]);
    expect(edges).toHaveLength(0);
  });
});
