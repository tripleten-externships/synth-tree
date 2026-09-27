import { cellKey, nearestFreeCell } from "../placeSkillNode";

const occupiedSet = (...cells: Array<[number, number]>) =>
  new Set(cells.map(([x, y]) => cellKey(x, y)));

describe("nearestFreeCell", () => {
  it("returns the preferred cell when it is free", () => {
    expect(nearestFreeCell({ posX: 30, posY: 25 }, occupiedSet())).toEqual({
      posX: 30,
      posY: 25,
    });
  });

  it("snaps the preferred cell to the 5% grid", () => {
    expect(nearestFreeCell({ posX: 32, posY: 18 }, occupiedSet())).toEqual({
      posX: 30,
      posY: 20,
    });
  });

  it("keeps the preferred cell 10% away from the canvas edges", () => {
    expect(nearestFreeCell({ posX: 110, posY: -5 }, occupiedSet())).toEqual({
      posX: 90,
      posY: 10,
    });
  });

  it("prefers the same row, then to the right, when the cell is taken", () => {
    expect(nearestFreeCell({ posX: 50, posY: 40 }, occupiedSet([50, 40]))).toEqual({
      posX: 55,
      posY: 40,
    });
  });

  it("drops to the row below once the row neighbours are taken too", () => {
    const occupied = occupiedSet([50, 40], [55, 40], [45, 40]);
    expect(nearestFreeCell({ posX: 50, posY: 40 }, occupied)).toEqual({ posX: 55, posY: 45 });
  });

  it("can use the canvas edge once the inner cells around it are full", () => {
    const occupied = occupiedSet([90, 10], [85, 10], [95, 10]);
    expect(nearestFreeCell({ posX: 90, posY: 10 }, occupied)).toEqual({ posX: 95, posY: 15 });
  });

  it("returns null when every cell on the canvas is taken", () => {
    const all: Array<[number, number]> = [];
    for (let x = 0; x <= 100; x += 5) {
      for (let y = 0; y <= 100; y += 5) all.push([x, y]);
    }
    expect(nearestFreeCell({ posX: 50, posY: 50 }, occupiedSet(...all))).toBeNull();
  });
});
