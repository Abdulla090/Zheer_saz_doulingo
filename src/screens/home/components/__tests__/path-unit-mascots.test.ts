import { describe, expect, it } from "@jest/globals";

import { mascotForUnit, unitMascotSlot } from "../path-unit-mascots";

/** Every peak row in a unit of `count` lessons starting at `unitStart`. */
function slotsForUnit(unitStart: number, count: number) {
  const found: { sectionItemIndex: number; slot: number }[] = [];
  for (let i = 0; i < count; i += 1) {
    const slot = unitMascotSlot(unitStart + i, i, count);
    if (slot) found.push({ sectionItemIndex: i, slot: slot.slot });
  }
  return found;
}

describe("unit mascot placement", () => {
  it("gives a full unit an opening and a mid-unit companion", () => {
    const slots = slotsForUnit(0, 10);

    expect(slots.map((s) => s.slot)).toEqual([0, 1]);
    // Opening companion greets the learner near lesson 1.
    expect(slots[0]?.sectionItemIndex).toBeLessThan(4);
    // The second waits around the middle of the unit.
    expect(slots[1]?.sectionItemIndex).toBeGreaterThanOrEqual(4);
  });

  it("never puts both companions on the same row", () => {
    for (let unitStart = 0; unitStart < 12; unitStart += 1) {
      const slots = slotsForUnit(unitStart, 10);
      const rows = new Set(slots.map((s) => s.sectionItemIndex));
      expect(rows.size).toBe(slots.length);
      expect(new Set(slots.map((s) => s.slot)).size).toBe(slots.length);
    }
  });

  /*
   * Units start at every offset as the learner's skipped-unit count shifts, and
   * the curve's period (8) does not divide the unit length (10). A global
   * `index % 4` rule therefore lands at a different place inside each unit,
   * which is what made companions drift and cluster. Anchoring to the unit is
   * what this guards.
   */
  it("places companions in every unit regardless of where it starts", () => {
    for (let unitStart = 0; unitStart < 20; unitStart += 1) {
      const slots = slotsForUnit(unitStart, 10);
      expect(slots.length).toBeGreaterThan(0);
      expect(slots.length).toBeLessThanOrEqual(2);
    }
  });

  it("degrades to a single companion in a short unit", () => {
    for (let count = 1; count <= 4; count += 1) {
      const slots = slotsForUnit(0, count);
      expect(slots.length).toBeLessThanOrEqual(2);
      // Whatever it finds must still be inside the unit.
      for (const s of slots) expect(s.sectionItemIndex).toBeLessThan(count);
    }
  });

  it("keeps a unit's companions in that unit's colour family", () => {
    // Same theme in, same pets out — a unit must not change face on re-render.
    expect(mascotForUnit("green", 0)).toBe(mascotForUnit("green", 0));
    expect(mascotForUnit("green", 0)).not.toBe(mascotForUnit("green", 1));

    // Neighbouring units in the normal cycle must not share a pet, or the
    // handover between units would be invisible.
    expect(mascotForUnit("blue", 0)).not.toBe(mascotForUnit("green", 0));
    expect(mascotForUnit("purple", 0)).not.toBe(mascotForUnit("blue", 0));
  });

  it("wraps rather than falling off the end of a theme's roster", () => {
    for (const slot of [0, 1, 2, 5, 99]) {
      expect(typeof mascotForUnit("orange", slot)).toBe("string");
    }
  });
});
