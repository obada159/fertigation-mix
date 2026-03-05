# fertigation-mix

**[Live Demo](https://che0md.tech/fertigation-mix)**

[![CI](https://github.com/AdametherzLab/fertigation-mix/actions/workflows/ci.yml/badge.svg)](https://github.com/AdametherzLab/fertigation-mix/actions) [![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Complete tissue culture and hydroponics toolkit. Step-by-step walkthrough for beginners, 10 pre-built SOPs, sterilization calculator, 8 beginner plant protocols, media formulations (MS/B5/WPM/White's), EC/pH tools, and fertigation calculator. Zero runtime dependencies. Written so a high school student can do tissue culture.

## Features

- **Beginner walkthrough** -- 10-step guided process from workspace setup to acclimatization
- **10 pre-built SOPs** -- Media prep, sterilization, aseptic transfer, subculture, rooting, acclimatization, stock solutions, autoclave, SAB setup, contamination response
- **Sterilization calculator** -- Auto-calculates bleach dilution, soak time, and ethanol duration based on tissue type
- **8 beginner plant protocols** -- African Violet, Pothos, Mint, Strawberry, Philodendron, Banana, Orchid, Potato with media recipes and tips
- **Equipment guide** -- Budget list with DIY alternatives and cost estimates ($100-300 starter setup)
- **Troubleshooting database** -- 8 common problems with symptoms, causes, solutions, and prevention
- **Stock solution guides** -- 7 recipes (macro/micro/iron/vitamin/PGR stocks) with shelf life and storage
- **Tissue culture media** -- MS, B5, WPM, and White's formulations with exact mg/L values
- **Growth regulators** -- 8 PGRs (auxins, cytokinins, gibberellins) with molecular weights and solvent info
- **Media preparation calculator** -- Exact amounts, stock solution volumes, and step-by-step instructions
- **Fertigation calculator** -- EC targeting with dilution ratio solving for stock solutions
- **Nutrient database** -- 11 common fertilizers with N-P-K-Ca-Mg-S-Fe profiles
- **EC/PPM converter** -- US 500, US 700, and EU scale conversions
- **pH adjustment calculator** -- Acid/base amount estimation with buffer capacity
- **TypeScript-first** -- Full type safety with branded types, zero runtime dependencies

## Installation

```bash
npm install @adametherzlab/fertigation-mix
# or
bun add @adametherzlab/fertigation-mix
```

## Beginner Walkthrough

Follow the step-by-step tissue culture guide from start to finish.

```typescript
import {
  getWalkthrough,
  getEquipmentList,
  estimateSetupCost,
  getBeginnerPlants,
  getPlantProtocol,
  getTroubleshooting,
} from "@adametherzlab/fertigation-mix";

// Get the complete 10-step walkthrough
const steps = getWalkthrough();
steps.forEach(s => {
  console.log(`Step ${s.stepNumber}: ${s.title}`);
  console.log(`  ${s.instruction}`);
  console.log(`  Details: ${s.details}`);
  if (s.commonMistake) console.log(`  Mistake to avoid: ${s.commonMistake}`);
});

// Filter by stage
const initiationSteps = getWalkthrough("initiation");     // Steps 1-6
const multiplicationSteps = getWalkthrough("multiplication"); // Steps 7-8
const rootingSteps = getWalkthrough("rooting");            // Step 9
const acclimatizationSteps = getWalkthrough("acclimatization"); // Step 10

// Equipment list with DIY alternatives
const essentials = getEquipmentList("essential"); // Must-have items
const all = getEquipmentList();                   // Everything
essentials.forEach(e => {
  console.log(`${e.name}: $${e.estimatedCostUsd.min}-${e.estimatedCostUsd.max}`);
  if (e.diyAlternative) console.log(`  DIY: ${e.diyAlternative}`);
});

// Budget estimate
const cost = estimateSetupCost(false); // essentials + recommended only
console.log(`Starter setup: $${cost.min}-$${cost.max} (${cost.items} items)`);

// Beginner plant protocols
const potato = getPlantProtocol("Potato");
console.log(potato?.successRate);          // "90-95% — extremely easy"
console.log(potato?.mediaRecommendation);  // "Full-strength MS + 30g/L sucrose..."
console.log(potato?.tips);                 // 6 practical tips

// All beginner-level plants
const easyPlants = getBeginnerPlants("beginner"); // 6 plants
const allPlants = getBeginnerPlants();             // 8 plants

// Troubleshooting
const contamination = getTroubleshooting("contamination");
contamination.forEach(t => {
  console.log(t.problem);
  console.log("Symptoms:", t.symptoms);
  console.log("Solutions:", t.solutions);
});
```

Available plants: African Violet, Pothos, Mint, Strawberry, Philodendron, Banana, Orchid, Potato.

## SOPs (Standard Operating Procedures)

10 pre-built, print-ready SOPs with materials lists, step-by-step procedures, critical control points, quality checks, and troubleshooting.

```typescript
import { getAllSOPs, getSOP, formatSOP } from "@adametherzlab/fertigation-mix";

// List all available SOPs
const sops = getAllSOPs();
sops.forEach(s => console.log(`${s.id}: ${s.title}`));

// Get a specific SOP
const mediaSOP = getSOP("media-preparation");
console.log(mediaSOP.materials);     // Required materials list
console.log(mediaSOP.ppe);           // Safety equipment
console.log(mediaSOP.steps);         // Step-by-step with critical points
console.log(mediaSOP.qualityChecks); // How to verify success
console.log(mediaSOP.troubleshooting); // When things go wrong

// Print-ready formats
const textSOP = formatSOP("explant-sterilization", "text");
const checklist = formatSOP("aseptic-transfer", "checklist"); // With [ ] checkboxes
console.log(checklist);
```

Available SOPs: `media-preparation`, `explant-sterilization`, `aseptic-transfer`, `subculture`, `rooting-transfer`, `acclimatization`, `stock-solution-prep`, `autoclave-operation`, `sab-setup`, `contamination-response`.

## Sterilization Calculator

Auto-calculates bleach dilution and protocol based on your tissue type.

```typescript
import { calculateSterilization, calculateAutoclave } from "@adametherzlab/fertigation-mix";

// Calculate sterilization for a soft leaf explant
const protocol = calculateSterilization({
  explantType: "soft",                  // soft | medium | woody | hairy
  explantDescription: "African Violet leaf",
  bleachPercentNaOCl: 5.25,            // Your bleach bottle's NaOCl %
  hasEndophyteRisk: false,
  useTween: true,
});

console.log(protocol.bleachDilution);     // "10 mL bleach + 90 mL sterile water per 100 mL"
console.log(protocol.bleachSoakMinutes);  // 8
console.log(protocol.ethanolDipSeconds);  // 30
console.log(protocol.steps);             // Full step-by-step array
console.log(protocol.sop);              // Formatted SOP text

// Autoclave parameters based on your load
const autoclave = calculateAutoclave({
  mediaVolumeMl: 250,
  vesselCount: 8,
  vesselType: "jar",
  includeWater: true,
  includeTools: true,
});

console.log(autoclave.timeMinutes);    // 20
console.log(autoclave.pressurePsi);    // 15
console.log(autoclave.steps);          // Step-by-step instructions
```

## Tissue Culture Media

Prepare standard plant tissue culture media with precise component amounts.

```typescript
import {
  getMediaFormulation,
  calculateMediaPreparation,
  getGrowthRegulator,
  getStockSolutionGuides,
  type MediaRecipe,
} from "@adametherzlab/fertigation-mix";

// Look up MS medium formulation
const ms = getMediaFormulation("ms");
console.log(ms.name);       // "Murashige & Skoog Medium"
console.log(ms.components);  // 19 components with exact mg/L values

// Prepare 1L of half-strength MS with BAP for shoot multiplication
const recipe: MediaRecipe = {
  base: "ms",
  strength: 0.5,
  sucrose: 30,      // g/L
  agar: 8,          // g/L (0 for liquid)
  ph: 5.8,
  growthRegulators: [{ id: "bap", mgPerLiter: 1.0 }],
  volumeLiters: 1,
};

const prep = calculateMediaPreparation(recipe);
console.log(prep.components);      // Each salt with exact amount in mg or g
console.log(prep.stockSolutions);  // Stock solution mL to add
console.log(prep.instructions);    // Step-by-step preparation protocol

// Stock solution preparation guides
const guides = getStockSolutionGuides();
guides.forEach(g => {
  console.log(`${g.name} (${g.concentration})`);
  console.log(`  Storage: ${g.storageTemp}, Shelf life: ${g.shelfLife}`);
});
```

Available media: `ms` (Murashige & Skoog 1962), `b5` (Gamborg 1968), `wpm` (Woody Plant, Lloyd & McCown 1980), `white` (White 1963).

Available growth regulators: BAP, Kinetin, TDZ, 2,4-D, NAA, IBA, IAA, GA3.

## Fertigation Calculator

Calculate stock solution dilution ratios to achieve target EC.

```typescript
import {
  getNutrientById,
  checkNutrientCompatibility,
  calculateMix,
  type StockSolution,
  type MixTarget,
} from "@adametherzlab/fertigation-mix";

// Check compatibility before mixing
const compat = checkNutrientCompatibility(["calcium-nitrate", "potassium-nitrate"]);
console.log(compat.compatible); // true

// Define stock solutions
const stocks: StockSolution[] = [
  {
    id: "StockA",
    dilutionFactor: 100,
    constituents: [
      { nutrientId: "calcium-nitrate", gramsPerLiter: 150 },
      { nutrientId: "potassium-nitrate", gramsPerLiter: 100 },
    ],
  },
];

// Calculate mix for target EC
const result = calculateMix({ ecTarget: 2.0 }, stocks);
console.log(result.dilutionRatios);       // { StockA: 0.xxx }
console.log(result.finalConcentrations);  // { n, p, k, ca, mg, s }
console.log(result.ecEstimate);           // 2.0 mS/cm
```

## EC/PPM Converter

Convert between electrical conductivity and parts per million across standard scales.

```typescript
import { ecToPpm, ppmToEc, convertUnit } from "@adametherzlab/fertigation-mix";

ecToPpm(2.0);            // 1000 (US 500 scale, default)
ecToPpm(2.0, "us700");   // 1400 (Truncheon scale)
ecToPpm(2.0, "eu");      // 1280 (European scale)

ppmToEc(1000);           // 2.0

// Unit conversion with molar mass
convertUnit(40, "mgL", "mmolL", 40.08);  // ~1.0 mmol/L
```

## pH Adjustment

Estimate acid or base additions to reach target pH.

```typescript
import { calculatePhAdjustment } from "@adametherzlab/fertigation-mix";

const adj = calculatePhAdjustment(7.0, 5.8, 10); // current pH, target pH, volume (L)
console.log(adj.direction);        // "acidify"
console.log(adj.acid.name);        // "Phosphoric acid (85%)"
console.log(adj.acid.mlPerLiter);  // estimated mL needed
```

## API Reference

### Beginner Guide (v3.0)

| Function | Returns |
|---|---|
| `getWalkthrough(stage?)` | `WalkthroughStep[]` (10 steps, all 4 stages) |
| `getEquipmentList(budget?)` | `EquipmentItem[]` (18 items with DIY alternatives) |
| `estimateSetupCost(includeOptional?)` | `{ min, max, items }` |
| `getBeginnerPlants(difficulty?)` | `BeginnerPlant[]` (8 species with protocols) |
| `getPlantProtocol(name)` | `BeginnerPlant \| undefined` |
| `getTroubleshooting(keyword?)` | `TroubleshootingEntry[]` (8 problems) |
| `getStockSolutionGuides()` | `StockSolutionGuide[]` (7 recipes) |
| `getStockSolutionGuide(keyword)` | `StockSolutionGuide \| undefined` |

### SOPs and Sterilization (v3.0)

| Function | Returns |
|---|---|
| `getAllSOPs()` | `{ id, title }[]` (10 SOPs) |
| `getSOP(name)` | `SOPDocument` |
| `formatSOP(name, format?)` | `string` (text or checklist) |
| `calculateSterilization(input)` | `SterilizationResult` |
| `calculateAutoclave(input)` | `AutoclaveResult` |

### Tissue Culture

| Function | Returns |
|---|---|
| `getMediaFormulation(type)` | `MediaFormulation` |
| `getAllMedia()` | `MediaFormulation[]` (4 media) |
| `calculateMediaPreparation(recipe)` | `MediaPreparation` |
| `getGrowthRegulator(id)` | `GrowthRegulator \| undefined` |
| `getAllGrowthRegulators()` | `GrowthRegulator[]` (8 PGRs) |

### Nutrient Database

| Function | Returns |
|---|---|
| `getNutrientById(id)` | `Nutrient \| undefined` |
| `getAllNutrients()` | `readonly Nutrient[]` (11 fertilizers) |
| `checkNutrientCompatibility(ids)` | `CompatibilityResult` |

### Fertigation Mixer

| Function | Returns |
|---|---|
| `calculateMix(target, stocks, config?)` | `MixResult` |
| `checkStockCompatibility(stocks)` | `CompatibilityResult` |

### Converters

| Function | Returns |
|---|---|
| `ecToPpm(ec, scale?)` | `number` |
| `ppmToEc(ppm, scale?)` | `number` |
| `convertUnit(value, from, to, molarMass?)` | `number` |
| `calculatePhAdjustment(current, target, volume, buffer?)` | `PhAdjustment` |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT -- [AdametherzLab](https://github.com/AdametherzLab)
