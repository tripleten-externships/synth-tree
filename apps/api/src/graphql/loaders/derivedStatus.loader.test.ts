import type { PrismaClient } from "@prisma/client";
import { createDerivedStatusLoader } from "./derivedStatus.loader";

function setup() {
  const findPrerequisites = jest.fn().mockResolvedValue([]);
  const findProgress = jest.fn().mockResolvedValue([]);

  const prisma = {
    skillNodePrerequisite: { findMany: findPrerequisites },
    userNodeProgress: { findMany: findProgress },
  } as unknown as PrismaClient;

  return { prisma, findPrerequisites, findProgress };
}

describe("derivedStatus loader", () => {
  it("unlocks a node with no prerequisites", async () => {
    const { prisma } = setup();

    const loader = createDerivedStatusLoader(prisma, "viewer");

    await expect(loader.load("root")).resolves.toBe("UNLOCKED");
  });

  it.each(["COMPLETED", "IN_PROGRESS"] as const)(
    "preserves %s even when a prerequisite is incomplete",
    async (status) => {
      const { prisma, findPrerequisites, findProgress } = setup();

      findPrerequisites.mockResolvedValue([{ nodeId: "node", dependsOnNodeId: "prerequisite" }]);
      findProgress.mockResolvedValue([{ nodeId: "node", status }]);

      const loader = createDerivedStatusLoader(prisma, "viewer");

      await expect(loader.load("node")).resolves.toBe(status);
    },
  );

  it.each([null, "NOT_STARTED", "IN_PROGRESS"])(
    "locks a node when one prerequisite has status %s",
    async (status) => {
      const { prisma, findPrerequisites, findProgress } = setup();

      findPrerequisites.mockResolvedValue([
        { nodeId: "node", dependsOnNodeId: "first" },
        { nodeId: "node", dependsOnNodeId: "second" },
      ]);
      findProgress.mockResolvedValue([
        { nodeId: "first", status: "COMPLETED" },
        ...(status ? [{ nodeId: "second", status }] : []),
      ]);

      const loader = createDerivedStatusLoader(prisma, "viewer");

      await expect(loader.load("node")).resolves.toBe("LOCKED");
    },
  );

  it("unlocks on a new request after all prerequisites complete", async () => {
    const { prisma, findPrerequisites, findProgress } = setup();

    findPrerequisites.mockResolvedValue([
      { nodeId: "node", dependsOnNodeId: "first" },
      { nodeId: "node", dependsOnNodeId: "second" },
    ]);
    findProgress.mockResolvedValue([{ nodeId: "first", status: "COMPLETED" }]);

    const firstRequest = createDerivedStatusLoader(prisma, "viewer");
    await expect(firstRequest.load("node")).resolves.toBe("LOCKED");

    findProgress.mockResolvedValue([
      { nodeId: "first", status: "COMPLETED" },
      { nodeId: "second", status: "COMPLETED" },
    ]);

    const nextRequest = createDerivedStatusLoader(prisma, "viewer");
    await expect(nextRequest.load("node")).resolves.toBe("UNLOCKED");
  });

  it("batches nodes and preserves their requested order", async () => {
    const { prisma, findPrerequisites, findProgress } = setup();

    findProgress.mockResolvedValue([
      { nodeId: "second", status: "COMPLETED" },
      { nodeId: "first", status: "IN_PROGRESS" },
    ]);

    const loader = createDerivedStatusLoader(prisma, "viewer");

    await expect(Promise.all([loader.load("first"), loader.load("second")])).resolves.toEqual([
      "IN_PROGRESS",
      "COMPLETED",
    ]);

    expect(findPrerequisites).toHaveBeenCalledTimes(1);
    expect(findProgress).toHaveBeenCalledTimes(1);
    expect(findProgress).toHaveBeenCalledWith({
      where: {
        userId: "viewer",
        nodeId: { in: ["first", "second"] },
      },
      select: { nodeId: true, status: true },
    });
  });
});
