import { nearestFreeCell } from "../placeSkillNode";

const at = (...cells: Array<[number, number]>) => cells.map(([posX, posY]) => ({ posX, posY }));

describe("nearestFreeCell", () => {
  it("returns the preferred cell when it is free", () => {
    expect(nearestFreeCell({ posX: 30, posY: 25 }, at())).toEqual({ posX: 30, posY: 25 });
  });

  it("snaps the preferred cell to the 5% grid", () => {
    expect(nearestFreeCell({ posX: 32, posY: 18 }, at())).toEqual({ posX: 30, posY: 20 });
  });

  it("keeps the preferred cell 10% away from the canvas edges", () => {
    expect(nearestFreeCell({ posX: 110, posY: -5 }, at())).toEqual({ posX: 90, posY: 10 });
  });

  it("moves along the row to the closest spot that doesn't overlap a node", () => {
    expect(nearestFreeCell({ posX: 50, posY: 40 }, at([50, 40]))).toEqual({ posX: 70, posY: 40 });
  });

  it("treats a node that is off the grid as taking the space around it", () => {
    expect(nearestFreeCell({ posX: 30, posY: 10 }, at([33, 12]))).toEqual({ posX: 10, posY: 10 });
  });

  it("wraps onto the row below when the row is full", () => {
    const row = at([10, 10], [30, 10], [50, 10], [70, 10], [90, 10]);
    expect(nearestFreeCell({ posX: 110, posY: 10 }, row)).toEqual({ posX: 90, posY: 25 });
  });

  it("falls back to any unused cell, even at the edge, once nothing is clear", () => {
    const inner: Array<[number, number]> = [];
    for (let x = 10; x <= 90; x += 5) {
      for (let y = 10; y <= 90; y += 5) inner.push([x, y]);
    }
    expect(nearestFreeCell({ posX: 50, posY: 50 }, at(...inner))).toEqual({ posX: 95, posY: 50 });
  });

  it("returns null when every cell on the canvas is taken", () => {
    const all: Array<[number, number]> = [];
    for (let x = 0; x <= 100; x += 5) {
      for (let y = 0; y <= 100; y += 5) all.push([x, y]);
    }
    expect(nearestFreeCell({ posX: 50, posY: 50 }, at(...all))).toBeNull();
  });
});
