import { describe, it, expect } from "bun:test";
import {
  calculateSterilization,
  calculateAutoclave,
  getSOP,
  getAllSOPs,
  formatSOP,
  type SterilizationInput,
  type AutoclaveInput,
} from "../src/index.ts";

// ──────────────────────────────────────────────
// Sterilization calculator tests
// ──────────────────────────────────────────────

describe("sterilization calculator", () => {
  it("soft tissue gets shorter soak and lower bleach", () => {
    const input: SterilizationInput = {
      explantType: "soft",
      bleachPercentNaOCl: 5,
      hasEndophyteRisk: false,
      useTween: false,
    };
    const result = calculateSterilization(input);
    expect(result.bleachSoakMinutes).toBeLessThanOrEqual(10);
    expect(result.ethanolDipSeconds).toBeLessThanOrEqual(30);
    expect(result.finalNaOClPercent).toBeLessThanOrEqual(0.5);
  });

  it("woody tissue gets longer soak and higher bleach", () => {
    const input: SterilizationInput = {
      explantType: "woody",
      bleachPercentNaOCl: 5,
      hasEndophyteRisk: false,
      useTween: false,
    };
    const result = calculateSterilization(input);
    expect(result.bleachSoakMinutes).toBeGreaterThanOrEqual(15);
    expect(result.ethanolDipSeconds).toBeGreaterThanOrEqual(60);
  });

  it("endophyte risk increases soak time and adds warning", () => {
    const base: SterilizationInput = {
      explantType: "medium",
      bleachPercentNaOCl: 5,
      hasEndophyteRisk: false,
      useTween: false,
    };
    const risky: SterilizationInput = { ...base, hasEndophyteRisk: true };

    const baseResult = calculateSterilization(base);
    const riskyResult = calculateSterilization(risky);

    expect(riskyResult.bleachSoakMinutes).toBeGreaterThan(baseResult.bleachSoakMinutes);
    expect(riskyResult.warnings.length).toBeGreaterThan(0);
    expect(riskyResult.rinseCount).toBeGreaterThan(baseResult.rinseCount);
  });

  it("hairy tissue adds specific warning", () => {
    const input: SterilizationInput = {
      explantType: "hairy",
      bleachPercentNaOCl: 6,
      hasEndophyteRisk: false,
      useTween: true,
    };
    const result = calculateSterilization(input);
    expect(result.warnings.some((w) => w.toLowerCase().includes("hairy"))).toBe(true);
  });

  it("generates step-by-step with correct count", () => {
    const input: SterilizationInput = {
      explantType: "medium",
      bleachPercentNaOCl: 5,
      hasEndophyteRisk: false,
      useTween: false,
    };
    const result = calculateSterilization(input);
    // Pre-wash + trim + ethanol + bleach + 3 rinses = 7 steps
    expect(result.steps.length).toBe(7);
    expect(result.steps[0].action).toBe("Pre-wash");
  });

  it("Tween is mentioned in bleach step when enabled", () => {
    const input: SterilizationInput = {
      explantType: "medium",
      bleachPercentNaOCl: 5,
      hasEndophyteRisk: false,
      useTween: true,
    };
    const result = calculateSterilization(input);
    const bleachStep = result.steps.find((s) => s.action === "Bleach soak");
    expect(bleachStep?.materials.some((m) => m.includes("Tween") || m.includes("soap"))).toBe(true);
  });

  it("generates SOP text", () => {
    const input: SterilizationInput = {
      explantType: "soft",
      explantDescription: "African Violet leaf",
      bleachPercentNaOCl: 5.25,
      hasEndophyteRisk: false,
      useTween: true,
    };
    const result = calculateSterilization(input);
    expect(result.sop).toContain("African Violet leaf");
    expect(result.sop).toContain("Step 1");
    expect(result.sop.length).toBeGreaterThan(100);
  });

  it("bleach dilution math is correct", () => {
    const input: SterilizationInput = {
      explantType: "medium",
      bleachPercentNaOCl: 5, // 5% NaOCl household bleach
      hasEndophyteRisk: false,
      useTween: false,
    };
    const result = calculateSterilization(input);
    // 0.75% target from 5% bleach = 15% dilution = 15mL bleach + 85mL water
    expect(result.finalNaOClPercent).toBe(0.75);
    expect(result.bleachDilution).toContain("15 mL bleach");
  });
});

// ──────────────────────────────────────────────
// Autoclave calculator tests
// ──────────────────────────────────────────────

describe("autoclave calculator", () => {
  it("small load gets 15 min cycle", () => {
    const input: AutoclaveInput = {
      mediaVolumeMl: 200,
      vesselCount: 3,
      vesselType: "jar",
      includeWater: false,
      includeTools: false,
    };
    const result = calculateAutoclave(input);
    expect(result.timeMinutes).toBe(15);
    expect(result.temperatureC).toBe(121);
    expect(result.pressurePsi).toBe(15);
  });

  it("large load gets longer cycle", () => {
    const input: AutoclaveInput = {
      mediaVolumeMl: 500,
      vesselCount: 10,
      vesselType: "jar",
      includeWater: true,
      includeTools: true,
    };
    const result = calculateAutoclave(input);
    expect(result.timeMinutes).toBeGreaterThan(15);
  });

  it("includes tools in load description when specified", () => {
    const input: AutoclaveInput = {
      mediaVolumeMl: 200,
      vesselCount: 5,
      vesselType: "flask",
      includeWater: false,
      includeTools: true,
    };
    const result = calculateAutoclave(input);
    expect(result.loadDescription).toContain("tools");
    expect(result.steps.some((s) => s.includes("foil-wrapped tools"))).toBe(true);
  });

  it("very large load adds warning", () => {
    const input: AutoclaveInput = {
      mediaVolumeMl: 500,
      vesselCount: 20,
      vesselType: "jar",
      includeWater: true,
      includeTools: true,
    };
    const result = calculateAutoclave(input);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("generates step-by-step instructions", () => {
    const input: AutoclaveInput = {
      mediaVolumeMl: 250,
      vesselCount: 4,
      vesselType: "jar",
      includeWater: false,
      includeTools: false,
    };
    const result = calculateAutoclave(input);
    expect(result.steps.length).toBeGreaterThanOrEqual(10);
    expect(result.steps[0]).toContain("water");
    expect(result.steps.some((s) => s.includes("15 psi"))).toBe(true);
  });
});

// ──────────────────────────────────────────────
// SOP system tests
// ──────────────────────────────────────────────

describe("SOP system", () => {
  it("getAllSOPs returns all 10 SOPs", () => {
    const all = getAllSOPs();
    expect(all.length).toBe(10);
    all.forEach((s) => {
      expect(s.id).toBeTruthy();
      expect(s.title).toBeTruthy();
    });
  });

  it("getSOP returns complete document", () => {
    const sop = getSOP("media-preparation");
    expect(sop.id).toBe("media-preparation");
    expect(sop.title).toContain("Media Preparation");
    expect(sop.steps.length).toBeGreaterThan(5);
    expect(sop.materials.length).toBeGreaterThan(0);
    expect(sop.qualityChecks.length).toBeGreaterThan(0);
    expect(sop.troubleshooting.length).toBeGreaterThan(0);
  });

  it("each SOP has critical points identified", () => {
    const sop = getSOP("media-preparation");
    const hasCriticalPoints = sop.steps.some((s) => s.criticalPoint !== undefined);
    expect(hasCriticalPoints).toBe(true);
  });

  it("autoclave SOP covers safety warnings", () => {
    const sop = getSOP("autoclave-operation");
    const safety = sop.steps.filter((s) => s.criticalPoint?.toLowerCase().includes("safety"));
    expect(safety.length).toBeGreaterThan(0);
  });

  it("formatSOP produces text output", () => {
    const text = formatSOP("explant-sterilization", "text");
    expect(text).toContain("PURPOSE:");
    expect(text).toContain("MATERIALS:");
    expect(text).toContain("PROCEDURE:");
    expect(text).toContain("Step 1:");
    expect(text.length).toBeGreaterThan(500);
  });

  it("formatSOP checklist mode adds checkboxes", () => {
    const checklist = formatSOP("aseptic-transfer", "checklist");
    expect(checklist).toContain("[ ]");
    expect(checklist).toContain("QUALITY CHECKS:");
  });

  it("acclimatization SOP covers humidity dome", () => {
    const sop = getSOP("acclimatization");
    const domeStep = sop.steps.find(
      (s) => s.details.toLowerCase().includes("humidity") || s.details.toLowerCase().includes("dome")
    );
    expect(domeStep).toBeDefined();
  });

  it("contamination response SOP covers disposal", () => {
    const sop = getSOP("contamination-response");
    expect(sop.purpose).toContain("contaminated");
    const autoclaveStep = sop.steps.find((s) => s.details.toLowerCase().includes("autoclave"));
    expect(autoclaveStep).toBeDefined();
  });

  it("all 10 SOPs can be individually retrieved", () => {
    const all = getAllSOPs();
    all.forEach((entry) => {
      const sop = getSOP(entry.id);
      expect(sop).toBeDefined();
      expect(sop.steps.length).toBeGreaterThan(0);
      expect(sop.purpose.length).toBeGreaterThan(20);
    });
  });
});
