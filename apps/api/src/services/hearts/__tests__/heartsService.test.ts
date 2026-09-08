import { computeRefill } from "../heartsService";

describe("computeRefill", () => {
  it("returns unchanged state if already at max hearts", () => {
    const now = new Date();
    const state = {
      currentHearts: 5,
      lastRefilledAt: new Date(now.getTime() - 60 * 60 * 1000),
    };
    expect(computeRefill(state, now)).toEqual(state);
  });

  it("adds no hearts if less than 30 minutes have passed", () => {
    const now = new Date();
    const state = {
      currentHearts: 3,
      lastRefilledAt: new Date(now.getTime() - 10 * 60 * 1000),
    };
    const result = computeRefill(state, now);
    expect(result.currentHearts).toBe(3);
  });

  it("adds exactly one heart after exactly 30 minutes", () => {
    const now = new Date();
    const state = {
      currentHearts: 3,
      lastRefilledAt: new Date(now.getTime() - 30 * 60 * 1000),
    };
    const result = computeRefill(state, now);
    expect(result.currentHearts).toBe(4);
  });

  it("adds multiple hearts if enough time has passed", () => {
    const now = new Date();
    const state = {
      currentHearts: 1,
      lastRefilledAt: new Date(now.getTime() - 90 * 60 * 1000),
    };
    const result = computeRefill(state, now);
    expect(result.currentHearts).toBe(4);
  });

  it("caps refill at MAX_HEARTS even if a lot of time passed", () => {
    const now = new Date();
    const state = {
      currentHearts: 2,
      lastRefilledAt: new Date(now.getTime() - 10 * 60 * 60 * 1000),
    };
    const result = computeRefill(state, now);
    expect(result.currentHearts).toBe(5);
  });

  it("preserves partial progress toward the next heart", () => {
    const now = new Date();
    const state = {
      currentHearts: 2,
      lastRefilledAt: new Date(now.getTime() - 45 * 60 * 1000),
    };
    const result = computeRefill(state, now);
    expect(result.currentHearts).toBe(3);

    const expectedLastRefilledAt = new Date(state.lastRefilledAt.getTime() + 30 * 60 * 1000);
    expect(result.lastRefilledAt.getTime()).toBe(expectedLastRefilledAt.getTime());
  });

  it("does not advance lastRefilledAt at all if no interval has elapsed", () => {
    const now = new Date();
    const state = {
      currentHearts: 2,
      lastRefilledAt: now,
    };
    const result = computeRefill(state, now);
    expect(result.lastRefilledAt.getTime()).toBe(now.getTime());
  });
});
