import { describe, it, expect } from "bun:test";
import {
  getNutrientById,
  getAllNutrients,
  checkNutrientCompatibility,
  checkStockCompatibility,
  calculateMix,
  getMediaFormulation,
  getAllMedia,
  getGrowthRegulator,
  getAllGrowthRegulators,
  calculateMediaPreparation,
  ecToPpm,
  ppmToEc,
  convertUnit,
  calculatePhAdjustment,
  type Nutrient,
  type StockSolution,
  type MixTarget,
  type MixResult,
  type CompatibilityResult,
  type EC,
  type PH,
  type MediaRecipe,
} from "../src/index.ts";

// ──────────────────────────────────────────────
// Nutrient database tests
// ──────────────────────────────────────────────

describe("nutrient database", () => {
  it("lookup returns correct profile for Calcium Nitrate", () => {
    const calciumNitrate = getNutrientById("calcium-nitrate");
    expect(calciumNitrate).toBeDefined();
    expect(calciumNitrate?.name).toBe("Calcium Nitrate");
    expect(calciumNitrate?.n).toBeGreaterThan(0);
    expect(calciumNitrate?.ca).toBeGreaterThan(0);
    expect(calciumNitrate?.p).toBeUndefined();
    expect(calciumNitrate?.k).toBeUndefined();
  });

  it("returns undefined for unknown nutrient", () => {
    expect(getNutrientById("nonexistent")).toBeUndefined();
  });

  it("getAllNutrients returns all 11 nutrients", () => {
    const all = getAllNutrients();
    expect(all.length).toBe(11);
  });

  it("calcium-chloride exists with correct ca percentage", () => {
    const cacl = getNutrientById("calcium-chloride");
    expect(cacl).toBeDefined();
    expect(cacl?.ca).toBe(36.1);
    expect(cacl?.ecPerGram).toBe(1.0);
    expect(cacl?.solubility).toBe(745);
  });

  it("iron-chelate-edta has fe property", () => {
    const fe = getNutrientById("iron-chelate-edta");
    expect(fe).toBeDefined();
    expect(fe?.fe).toBe(13.0);
    expect(fe?.ecPerGram).toBe(0.2);
  });

  it("ammonium-nitrate has correct N percentage", () => {
    const an = getNutrientById("ammonium-nitrate");
    expect(an).toBeDefined();
    expect(an?.n).toBe(35.0);
  });

  it("potassium-chloride exists", () => {
    const kcl = getNutrientById("potassium-chloride");
    expect(kcl).toBeDefined();
    expect(kcl?.k).toBe(52.4);
  });

  it("urea has very low EC contribution", () => {
    const urea = getNutrientById("urea");
    expect(urea).toBeDefined();
    expect(urea?.n).toBe(46.0);
    expect(urea?.ecPerGram).toBe(0.01);
  });
});

// ──────────────────────────────────────────────
// Compatibility tests
// ──────────────────────────────────────────────

describe("compatibility checking", () => {
  it("identifies Ca-NO3 and MgSO4 as incompatible", () => {
    const result = checkNutrientCompatibility([
      "calcium-nitrate",
      "magnesium-sulfate",
    ]);
    expect(result.compatible).toBe(false);
    expect(result.incompatibilities).toHaveLength(1);
  });

  it("flags Ca-NO3 and single superphosphate as incompatible", () => {
    const result = checkNutrientCompatibility([
      "calcium-nitrate",
      "single-superphosphate",
    ]);
    expect(result.compatible).toBe(false);
    expect(result.incompatibilities.length).toBeGreaterThan(0);
    expect(result.incompatibilities[0]).toContain("cannot be mixed");
  });

  it("potassium-nitrate is compatible with everything", () => {
    const result = checkNutrientCompatibility([
      "potassium-nitrate",
      "magnesium-sulfate",
    ]);
    expect(result.compatible).toBe(true);
  });

  it("new nutrients have no incompatibilities", () => {
    const result = checkNutrientCompatibility([
      "calcium-chloride",
      "iron-chelate-edta",
      "ammonium-nitrate",
    ]);
    expect(result.compatible).toBe(true);
  });
});

// ──────────────────────────────────────────────
// Mixer / calculateMix tests
// ──────────────────────────────────────────────

describe("calculateMix", () => {
  it("produces EC estimate within tolerance of target", () => {
    const stocks: StockSolution[] = [
      {
        id: "stock1",
        dilutionFactor: 1,
        constituents: [{ nutrientId: "calcium-nitrate", gramsPerLiter: 100 }],
      },
      {
        id: "stock2",
        dilutionFactor: 1,
        constituents: [{ nutrientId: "potassium-nitrate", gramsPerLiter: 100 }],
      },
    ];
    const target: MixTarget = {
      ecTarget: 1.5 as EC,
      phTarget: 6.0 as PH,
    };
    const result = calculateMix(target, stocks);
    expect(result.ecEstimate).toBeCloseTo(1.5, 1);
    expect(Object.keys(result.dilutionRatios)).toHaveLength(2);
    expect(result.warnings.length).toBeGreaterThanOrEqual(0);
  });

  it("includes conflict warning for incompatible nutrients", () => {
    const stocks: StockSolution[] = [
      {
        id: "stock1",
        dilutionFactor: 1,
        constituents: [{ nutrientId: "calcium-nitrate", gramsPerLiter: 100 }],
      },
      {
        id: "stock2",
        dilutionFactor: 1,
        constituents: [{ nutrientId: "magnesium-sulfate", gramsPerLiter: 100 }],
      },
    ];
    const target: MixTarget = {
      ecTarget: 1.0 as EC,
      phTarget: 6.0 as PH,
    };
    const result = calculateMix(target, stocks);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain("incompatibilities");
  });

  it("throws for empty stocks", () => {
    expect(() =>
      calculateMix({ ecTarget: 1.0 as EC }, [])
    ).toThrow("At least one stock solution required");
  });

  it("throws for negative EC target", () => {
    const stocks: StockSolution[] = [{
      id: "s1",
      dilutionFactor: 1,
      constituents: [{ nutrientId: "calcium-nitrate", gramsPerLiter: 100 }],
    }];
    expect(() =>
      calculateMix({ ecTarget: -1 as EC }, stocks)
    ).toThrow("EC target must be positive");
  });

  it("works with new nutrients (ammonium-nitrate)", () => {
    const stocks: StockSolution[] = [{
      id: "stock-an",
      dilutionFactor: 1,
      constituents: [{ nutrientId: "ammonium-nitrate", gramsPerLiter: 50 }],
    }];
    const target: MixTarget = { ecTarget: 1.0 as EC };
    const result = calculateMix(target, stocks);
    expect(result.ecEstimate).toBeCloseTo(1.0, 1);
    expect(result.finalConcentrations.n).toBeGreaterThan(0);
  });
});

// ──────────────────────────────────────────────
// Tissue culture media tests
// ──────────────────────────────────────────────

describe("tissue culture media", () => {
  it("MS medium has correct number of components", () => {
    const ms = getMediaFormulation("ms");
    expect(ms.id).toBe("ms");
    expect(ms.name).toContain("Murashige");
    expect(ms.year).toBe(1962);
    expect(ms.components.length).toBe(19);
  });

  it("MS medium NH4NO3 is 1650 mg/L", () => {
    const ms = getMediaFormulation("ms");
    const nh4no3 = ms.components.find((c) => c.formula === "NH4NO3");
    expect(nh4no3).toBeDefined();
    expect(nh4no3?.mgPerLiter).toBe(1650);
  });

  it("B5 medium has higher thiamine than MS", () => {
    const ms = getMediaFormulation("ms");
    const b5 = getMediaFormulation("b5");
    const msThiamine = ms.components.find((c) => c.formula === "thiamine-HCl");
    const b5Thiamine = b5.components.find((c) => c.formula === "thiamine-HCl");
    expect(b5Thiamine!.mgPerLiter).toBeGreaterThan(msThiamine!.mgPerLiter);
  });

  it("WPM medium has lower NH4NO3 than MS", () => {
    const ms = getMediaFormulation("ms");
    const wpm = getMediaFormulation("wpm");
    const msNH4 = ms.components.find((c) => c.formula === "NH4NO3")!.mgPerLiter;
    const wpmNH4 = wpm.components.find((c) => c.formula === "NH4NO3")!.mgPerLiter;
    expect(wpmNH4).toBeLessThan(msNH4);
  });

  it("White's medium includes ferric sulfate", () => {
    const white = getMediaFormulation("white");
    const fe2 = white.components.find((c) => c.formula === "Fe2(SO4)3");
    expect(fe2).toBeDefined();
    expect(fe2?.mgPerLiter).toBe(2.5);
  });

  it("getAllMedia returns 4 formulations", () => {
    const all = getAllMedia();
    expect(all.length).toBe(4);
    const ids = all.map((m) => m.id);
    expect(ids).toContain("ms");
    expect(ids).toContain("b5");
    expect(ids).toContain("wpm");
    expect(ids).toContain("white");
  });

  it("calculates full-strength MS preparation for 1L", () => {
    const recipe: MediaRecipe = {
      base: "ms",
      strength: 1.0,
      sucrose: 30,
      agar: 8,
      ph: 5.8,
      growthRegulators: [],
      volumeLiters: 1,
    };
    const prep = calculateMediaPreparation(recipe);
    expect(prep.components.length).toBeGreaterThan(0);
    expect(prep.totalWeight).toBeGreaterThan(30); // at least sucrose + agar
    expect(prep.instructions.length).toBeGreaterThan(3);
  });

  it("half-strength reduces component amounts", () => {
    const full: MediaRecipe = { base: "ms", strength: 1.0, sucrose: 30, agar: 8, ph: 5.8, growthRegulators: [], volumeLiters: 1 };
    const half: MediaRecipe = { base: "ms", strength: 0.5, sucrose: 30, agar: 8, ph: 5.8, growthRegulators: [], volumeLiters: 1 };
    const fullPrep = calculateMediaPreparation(full);
    const halfPrep = calculateMediaPreparation(half);
    expect(halfPrep.totalWeight).toBeLessThan(fullPrep.totalWeight);
  });

  it("includes growth regulator stock solutions", () => {
    const recipe: MediaRecipe = {
      base: "ms",
      strength: 1.0,
      sucrose: 30,
      agar: 8,
      ph: 5.8,
      growthRegulators: [{ id: "bap", mgPerLiter: 1.0 }],
      volumeLiters: 1,
    };
    const prep = calculateMediaPreparation(recipe);
    const bapStock = prep.stockSolutions.find((s) => s.name.includes("BAP"));
    expect(bapStock).toBeDefined();
    expect(bapStock?.mlToAdd).toBe(1.0);
  });

  it("warns about heat-sensitive PGRs", () => {
    const recipe: MediaRecipe = {
      base: "ms",
      strength: 1.0,
      sucrose: 30,
      agar: 0,
      ph: 5.8,
      growthRegulators: [{ id: "2,4-d", mgPerLiter: 2.0 }],
      volumeLiters: 1,
    };
    const prep = calculateMediaPreparation(recipe);
    const heatWarning = prep.instructions.find((i) => i.includes("heat-sensitive"));
    expect(heatWarning).toBeDefined();
    expect(heatWarning).toContain("2,4-D");
  });
});

// ──────────────────────────────────────────────
// Growth regulator tests
// ──────────────────────────────────────────────

describe("growth regulators", () => {
  it("BAP is a cytokinin", () => {
    const bap = getGrowthRegulator("bap");
    expect(bap).toBeDefined();
    expect(bap?.type).toBe("cytokinin");
    expect(bap?.molecularWeight).toBe(225.25);
    expect(bap?.heatStable).toBe(true);
  });

  it("GA3 is a gibberellin and not heat-stable", () => {
    const ga3 = getGrowthRegulator("ga3");
    expect(ga3).toBeDefined();
    expect(ga3?.type).toBe("gibberellin");
    expect(ga3?.heatStable).toBe(false);
  });

  it("getAllGrowthRegulators returns 8 entries", () => {
    const all = getAllGrowthRegulators();
    expect(all.length).toBe(8);
  });

  it("returns undefined for unknown PGR", () => {
    expect(getGrowthRegulator("nonexistent")).toBeUndefined();
  });
});

// ──────────────────────────────────────────────
// EC/PPM converter tests
// ──────────────────────────────────────────────

describe("EC/PPM converter", () => {
  it("converts EC to PPM with us500 scale", () => {
    expect(ecToPpm(2.0)).toBe(1000);
  });

  it("converts EC to PPM with us700 scale", () => {
    expect(ecToPpm(2.0, "us700")).toBe(1400);
  });

  it("converts EC to PPM with eu scale", () => {
    expect(ecToPpm(2.0, "eu")).toBe(1280);
  });

  it("converts PPM back to EC", () => {
    expect(ppmToEc(1000)).toBe(2.0);
    expect(ppmToEc(1400, "us700")).toBe(2.0);
  });

  it("roundtrip: EC -> PPM -> EC", () => {
    const ec = 1.8;
    const ppm = ecToPpm(ec, "us500");
    const backToEc = ppmToEc(ppm, "us500");
    expect(backToEc).toBeCloseTo(ec, 10);
  });

  it("throws for negative EC", () => {
    expect(() => ecToPpm(-1)).toThrow("non-negative");
  });

  it("converts mgL to ppm (identity)", () => {
    expect(convertUnit(150, "mgL", "ppm")).toBe(150);
  });

  it("converts mgL to mmolL with molar mass", () => {
    // 40 mg/L of Ca (MW=40.08) should be ~1 mmol/L
    const result = convertUnit(40.08, "mgL", "mmolL", 40.08);
    expect(result).toBeCloseTo(1.0, 2);
  });
});

// ──────────────────────────────────────────────
// pH adjustment tests
// ──────────────────────────────────────────────

describe("pH adjustment", () => {
  it("acidify when current pH > target", () => {
    const result = calculatePhAdjustment(7.0, 5.8, 10);
    expect(result.direction).toBe("acidify");
    expect(result.acid.mlPerLiter).toBeGreaterThan(0);
    expect(result.base.mlPerLiter).toBe(0);
  });

  it("basify when current pH < target", () => {
    const result = calculatePhAdjustment(4.5, 5.8, 10);
    expect(result.direction).toBe("basify");
    expect(result.base.mlPerLiter).toBeGreaterThan(0);
    expect(result.acid.mlPerLiter).toBe(0);
  });

  it("no change when pH is at target", () => {
    const result = calculatePhAdjustment(5.8, 5.8, 10);
    expect(result.direction).toBe("none");
    expect(result.acid.mlPerLiter).toBe(0);
    expect(result.base.mlPerLiter).toBe(0);
  });

  it("warns for extreme target pH", () => {
    const result = calculatePhAdjustment(7.0, 3.0, 10);
    expect(result.warning).toBeDefined();
    expect(result.warning).toContain("outside");
  });

  it("buffer capacity increases amount needed", () => {
    const normal = calculatePhAdjustment(7.0, 5.8, 10, 1.0);
    const buffered = calculatePhAdjustment(7.0, 5.8, 10, 2.0);
    expect(buffered.acid.mlPerLiter).toBeGreaterThan(normal.acid.mlPerLiter);
  });

  it("scales with volume", () => {
    const small = calculatePhAdjustment(7.0, 5.8, 1);
    const large = calculatePhAdjustment(7.0, 5.8, 10);
    expect(large.acid.mlPerLiter).toBeGreaterThan(small.acid.mlPerLiter);
  });
});
