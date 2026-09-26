import { deriveSkillTree, type RawSkillNode } from "../src/lib/deriveSkillTree";
import { summarizeCourseProgress } from "../src/lib/courseProgress";

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

const done = (updatedAt = "2026-01-01") => ({
  status: "COMPLETED" as const,
  completedAt: updatedAt,
  updatedAt,
});
const started = (updatedAt: string) => ({
  status: "IN_PROGRESS" as const,
  completedAt: null,
  updatedAt,
});

function summarize(raw: RawSkillNode[]) {
  return summarizeCourseProgress(raw, deriveSkillTree(raw).nodes);
}

describe("summarizeCourseProgress", () => {
  it("computes completed / total and a rounded percent", () => {
    const summary = summarize([
      node({ id: "a", progressForViewer: done() }),
      node({ id: "b", step: 2, prerequisites: [{ dependsOnNodeId: "a" }] }),
      node({ id: "c", step: 3, prerequisites: [{ dependsOnNodeId: "b" }] }),
    ]);

    expect(summary).toMatchObject({ completed: 1, total: 3, percent: 33, allComplete: false });
  });

  it("continues with the most recently updated in-progress node", () => {
    const summary = summarize([
      node({ id: "a", progressForViewer: started("2026-01-01T10:00:00Z") }),
      node({ id: "b", orderInStep: 1, progressForViewer: started("2026-01-02T10:00:00Z") }),
    ]);

    expect(summary.continueNodeId).toBe("b");
  });

  it("falls back to the first unlocked node in tree order", () => {
    const summary = summarize([
      node({ id: "a", progressForViewer: done() }),
      node({ id: "c", step: 2, orderInStep: 1, prerequisites: [{ dependsOnNodeId: "a" }] }),
      node({ id: "b", step: 2, orderInStep: 0, prerequisites: [{ dependsOnNodeId: "a" }] }),
      node({ id: "d", step: 3, prerequisites: [{ dependsOnNodeId: "b" }] }),
    ]);

    expect(summary.continueNodeId).toBe("b");
  });

  it("reopens the first node once the whole course is complete", () => {
    const summary = summarize([
      node({
        id: "b",
        step: 2,
        progressForViewer: done(),
        prerequisites: [{ dependsOnNodeId: "a" }],
      }),
      node({ id: "a", step: 1, progressForViewer: done() }),
    ]);

    expect(summary).toMatchObject({ allComplete: true, percent: 100, continueNodeId: "a" });
  });

  it("handles a course with no nodes", () => {
    expect(summarize([])).toEqual({
      completed: 0,
      total: 0,
      percent: 0,
      continueNodeId: null,
      allComplete: false,
    });
  });
});
