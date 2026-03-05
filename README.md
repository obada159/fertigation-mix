# fertigation-mix

**[Live Demo](https://che0md.tech/fertigation-mix)**

[![CI](https://github.com/AdametherzLab/fertigation-mix/actions/workflows/ci.yml/badge.svg)](https://github.com/AdametherzLab/fertigation-mix/actions) [![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Precision nutrient solution calculator for hydroponics and tissue culture. Calculate exact dilution ratios to hit target EC/pH values, prepare tissue culture media formulations, and convert between EC/PPM scales. Zero runtime dependencies.

## Features

- **Fertigation calculator** -- EC targeting with dilution ratio solving for stock solutions
- **Nutrient database** -- 11 common fertilizers with N-P-K-Ca-Mg-S-Fe profiles, EC coefficients, and solubility data
- **Compatibility checking** -- Detects nutrient lockout combinations before mixing
- **Tissue culture media** -- MS, B5, WPM, and White's formulations with exact mg/L values
- **Growth regulators** -- 8 PGRs (auxins, cytokinins, gibberellins) with molecular weights and solvent info
- **Media preparation calculator** -- Exact amounts, stock solution volumes, and step-by-step instructions
- **EC/PPM converter** -- US 500, US 700, and EU scale conversions
- **pH adjustment calculator** -- Acid/base amount estimation with buffer capacity support
- **TypeScript-first** -- Full type safety with branded types, zero runtime dependencies

## Installation

```bash
npm install @adametherzlab/fertigation-mix
# or
bun add @adametherzlab/fertigation-mix
```

## Tissue Culture Media

Prepare standard plant tissue culture media with precise component amounts.

```typescript
import {
  getMediaFormulation,
  calculateMediaPreparation,
  getGrowthRegulator,
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

### Tissue Culture

| Function | Returns |
|---|---|
| `getMediaFormulation(type)` | `MediaFormulation` |
| `getAllMedia()` | `MediaFormulation[]` (4 media) |
| `calculateMediaPreparation(recipe)` | `MediaPreparation` |
| `getGrowthRegulator(id)` | `GrowthRegulator \| undefined` |
| `getAllGrowthRegulators()` | `GrowthRegulator[]` (8 PGRs) |

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
