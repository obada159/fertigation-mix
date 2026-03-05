import { describe, it, expect } from "bun:test";
import {
  getEquipmentList,
  estimateSetupCost,
  getBeginnerPlants,
  getPlantProtocol,
  getWalkthrough,
  getTroubleshooting,
  getStockSolutionGuides,
  getStockSolutionGuide,
} from "../src/index.ts";

// ──────────────────────────────────────────────
// Equipment list tests
// ──────────────────────────────────────────────

describe("equipment list", () => {
  it("returns all equipment items", () => {
    const all = getEquipmentList();
    expect(all.length).toBeGreaterThanOrEqual(15);
  });

  it("filters by budget tier", () => {
    const essential = getEquipmentList("essential");
    const optional = getEquipmentList("optional");
    expect(essential.length).toBeGreaterThan(optional.length);
    essential.forEach((e) => expect(e.budget).toBe("essential"));
  });

  it("each item has required fields", () => {
    const all = getEquipmentList();
    all.forEach((e) => {
      expect(e.name).toBeTruthy();
      expect(e.purpose).toBeTruthy();
      expect(e.estimatedCostUsd.min).toBeLessThanOrEqual(e.estimatedCostUsd.max);
    });
  });

  it("essential items include pressure cooker and SAB", () => {
    const essential = getEquipmentList("essential");
    const names = essential.map((e) => e.name.toLowerCase());
    expect(names.some((n) => n.includes("pressure") || n.includes("autoclave"))).toBe(true);
    expect(names.some((n) => n.includes("still air") || n.includes("sab"))).toBe(true);
  });
});

// ──────────────────────────────────────────────
// Setup cost estimator tests
// ──────────────────────────────────────────────

describe("setup cost estimator", () => {
  it("calculates min and max costs", () => {
    const cost = estimateSetupCost(false);
    expect(cost.min).toBeGreaterThan(0);
    expect(cost.max).toBeGreaterThan(cost.min);
    expect(cost.items).toBeGreaterThan(0);
  });

  it("including optional items increases cost", () => {
    const withoutOptional = estimateSetupCost(false);
    const withOptional = estimateSetupCost(true);
    expect(withOptional.max).toBeGreaterThanOrEqual(withoutOptional.max);
    expect(withOptional.items).toBeGreaterThanOrEqual(withoutOptional.items);
  });
});

// ──────────────────────────────────────────────
// Beginner plants tests
// ──────────────────────────────────────────────

describe("beginner plants", () => {
  it("returns all plants", () => {
    const all = getBeginnerPlants();
    expect(all.length).toBeGreaterThanOrEqual(8);
  });

  it("filters by difficulty", () => {
    const beginners = getBeginnerPlants("beginner");
    const intermediate = getBeginnerPlants("intermediate");
    beginners.forEach((p) => expect(p.difficulty).toBe("beginner"));
    intermediate.forEach((p) => expect(p.difficulty).toBe("intermediate"));
  });

  it("each plant has required fields", () => {
    const all = getBeginnerPlants();
    all.forEach((p) => {
      expect(p.name).toBeTruthy();
      expect(p.scientificName).toBeTruthy();
      expect(p.explantType).toBeTruthy();
      expect(p.mediaRecommendation).toBeTruthy();
      expect(p.tips.length).toBeGreaterThan(0);
      expect(p.timeToShootsWeeks).toBeGreaterThan(0);
    });
  });

  it("potato is the easiest plant", () => {
    const potato = getPlantProtocol("Potato");
    expect(potato).toBeDefined();
    expect(potato?.difficulty).toBe("beginner");
    expect(potato?.successRate).toContain("90");
  });

  it("African Violet has BAP recommendation", () => {
    const av = getPlantProtocol("African Violet");
    expect(av).toBeDefined();
    const bap = av?.growthRegulators.find((gr) => gr.id === "bap");
    expect(bap).toBeDefined();
    expect(bap?.mgPerLiter).toBeGreaterThan(0);
  });

  it("lookup is case-insensitive", () => {
    expect(getPlantProtocol("MINT")).toBeDefined();
    expect(getPlantProtocol("mint")).toBeDefined();
    expect(getPlantProtocol("Mint")).toBeDefined();
  });

  it("returns undefined for unknown plant", () => {
    expect(getPlantProtocol("unicorn-flower")).toBeUndefined();
  });
});

// ──────────────────────────────────────────────
// Walkthrough tests
// ──────────────────────────────────────────────

describe("walkthrough", () => {
  it("returns all steps in order", () => {
    const all = getWalkthrough();
    expect(all.length).toBeGreaterThanOrEqual(10);
    // Step numbers should be monotonically increasing
    for (let i = 1; i < all.length; i++) {
      expect(all[i].stepNumber).toBeGreaterThanOrEqual(all[i - 1].stepNumber);
    }
  });

  it("covers all 4 stages", () => {
    const stages = new Set(getWalkthrough().map((s) => s.stage));
    expect(stages.has("initiation")).toBe(true);
    expect(stages.has("multiplication")).toBe(true);
    expect(stages.has("rooting")).toBe(true);
    expect(stages.has("acclimatization")).toBe(true);
  });

  it("filters by stage", () => {
    const initiation = getWalkthrough("initiation");
    initiation.forEach((s) => expect(s.stage).toBe("initiation"));
    expect(initiation.length).toBeGreaterThan(0);
  });

  it("each step has instruction and details", () => {
    const all = getWalkthrough();
    all.forEach((s) => {
      expect(s.title).toBeTruthy();
      expect(s.instruction).toBeTruthy();
      expect(s.details.length).toBeGreaterThan(50); // Substantive details
    });
  });
});

// ──────────────────────────────────────────────
// Troubleshooting tests
// ──────────────────────────────────────────────

describe("troubleshooting", () => {
  it("returns all entries", () => {
    const all = getTroubleshooting();
    expect(all.length).toBeGreaterThanOrEqual(7);
  });

  it("each entry has symptoms, causes, and solutions", () => {
    const all = getTroubleshooting();
    all.forEach((t) => {
      expect(t.problem).toBeTruthy();
      expect(t.symptoms.length).toBeGreaterThan(0);
      expect(t.causes.length).toBeGreaterThan(0);
      expect(t.solutions.length).toBeGreaterThan(0);
      expect(t.prevention).toBeTruthy();
    });
  });

  it("finds contamination problems by keyword", () => {
    const results = getTroubleshooting("contamination");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.problem.toLowerCase().includes("contamination"))).toBe(true);
  });

  it("finds browning by keyword", () => {
    const results = getTroubleshooting("browning");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns empty for nonsense keyword", () => {
    const results = getTroubleshooting("xyznonexistent");
    expect(results.length).toBe(0);
  });
});

// ──────────────────────────────────────────────
// Stock solution guides tests
// ──────────────────────────────────────────────

describe("stock solution guides", () => {
  it("returns all guides", () => {
    const all = getStockSolutionGuides();
    expect(all.length).toBeGreaterThanOrEqual(6);
  });

  it("each guide has complete info", () => {
    const all = getStockSolutionGuides();
    all.forEach((g) => {
      expect(g.name).toBeTruthy();
      expect(g.concentration).toBeTruthy();
      expect(g.components.length).toBeGreaterThan(0);
      expect(g.storageTemp).toBeTruthy();
      expect(g.shelfLife).toBeTruthy();
    });
  });

  it("finds macronutrient stock by keyword", () => {
    const macro = getStockSolutionGuide("macronutrient");
    expect(macro).toBeDefined();
    expect(macro?.concentration).toBe("10x");
  });

  it("finds iron stock by keyword", () => {
    const iron = getStockSolutionGuide("iron");
    expect(iron).toBeDefined();
    expect(iron?.components.some((c) => c.chemical.includes("FeSO4"))).toBe(true);
  });

  it("finds BAP stock by keyword", () => {
    const bap = getStockSolutionGuide("BAP");
    expect(bap).toBeDefined();
    expect(bap?.notes).toContain("NaOH");
  });
});
