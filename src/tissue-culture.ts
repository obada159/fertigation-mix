/**
 * Tissue culture media database and preparation calculator.
 * Supports MS, B5, WPM, and White's media formulations with growth regulators.
 */

export type MediaType = 'ms' | 'b5' | 'wpm' | 'white';

export interface MediaComponent {
  readonly name: string;
  readonly formula: string;
  readonly mgPerLiter: number;
  readonly category: 'macronutrient' | 'micronutrient' | 'iron' | 'vitamin' | 'carbon' | 'gelling';
}

export interface MediaFormulation {
  readonly id: MediaType;
  readonly name: string;
  readonly author: string;
  readonly year: number;
  readonly components: readonly MediaComponent[];
  readonly notes: string;
}

export interface GrowthRegulator {
  readonly id: string;
  readonly name: string;
  readonly abbreviation: string;
  readonly type: 'auxin' | 'cytokinin' | 'gibberellin';
  readonly molecularWeight: number;
  readonly solvent: string;
  readonly heatStable: boolean;
  readonly typicalRange: { readonly min: number; readonly max: number };
}

export interface MediaRecipe {
  readonly base: MediaType;
  readonly strength: number;
  readonly sucrose: number;
  readonly agar: number;
  readonly ph: number;
  readonly growthRegulators: readonly { readonly id: string; readonly mgPerLiter: number }[];
  readonly volumeLiters: number;
}

export interface MediaPreparation {
  readonly recipe: MediaRecipe;
  readonly components: readonly { readonly name: string; readonly formula: string; readonly amount: string; readonly unit: string }[];
  readonly stockSolutions: readonly { readonly name: string; readonly mlToAdd: number; readonly concentration: string }[];
  readonly totalWeight: number;
  readonly instructions: readonly string[];
}

// --- Media formulations ---

const MS_MEDIUM: MediaFormulation = {
  id: 'ms',
  name: 'Murashige & Skoog Medium',
  author: 'Murashige & Skoog',
  year: 1962,
  notes: 'Most widely used plant tissue culture medium. High salt concentration suitable for most species.',
  components: [
    { name: 'Ammonium Nitrate', formula: 'NH4NO3', mgPerLiter: 1650, category: 'macronutrient' },
    { name: 'Potassium Nitrate', formula: 'KNO3', mgPerLiter: 1900, category: 'macronutrient' },
    { name: 'Calcium Chloride Dihydrate', formula: 'CaCl2-2H2O', mgPerLiter: 440, category: 'macronutrient' },
    { name: 'Magnesium Sulfate Heptahydrate', formula: 'MgSO4-7H2O', mgPerLiter: 370, category: 'macronutrient' },
    { name: 'Potassium Dihydrogen Phosphate', formula: 'KH2PO4', mgPerLiter: 170, category: 'macronutrient' },
    { name: 'Manganese Sulfate Tetrahydrate', formula: 'MnSO4-4H2O', mgPerLiter: 22.3, category: 'micronutrient' },
    { name: 'Zinc Sulfate Heptahydrate', formula: 'ZnSO4-7H2O', mgPerLiter: 8.6, category: 'micronutrient' },
    { name: 'Boric Acid', formula: 'H3BO3', mgPerLiter: 6.2, category: 'micronutrient' },
    { name: 'Potassium Iodide', formula: 'KI', mgPerLiter: 0.83, category: 'micronutrient' },
    { name: 'Sodium Molybdate Dihydrate', formula: 'Na2MoO4-2H2O', mgPerLiter: 0.25, category: 'micronutrient' },
    { name: 'Copper Sulfate Pentahydrate', formula: 'CuSO4-5H2O', mgPerLiter: 0.025, category: 'micronutrient' },
    { name: 'Cobalt Chloride Hexahydrate', formula: 'CoCl2-6H2O', mgPerLiter: 0.025, category: 'micronutrient' },
    { name: 'Ferrous Sulfate Heptahydrate', formula: 'FeSO4-7H2O', mgPerLiter: 27.8, category: 'iron' },
    { name: 'Disodium EDTA', formula: 'Na2EDTA', mgPerLiter: 37.3, category: 'iron' },
    { name: 'myo-Inositol', formula: 'myo-inositol', mgPerLiter: 100, category: 'vitamin' },
    { name: 'Nicotinic Acid', formula: 'nicotinic-acid', mgPerLiter: 0.5, category: 'vitamin' },
    { name: 'Pyridoxine HCl', formula: 'pyridoxine-HCl', mgPerLiter: 0.5, category: 'vitamin' },
    { name: 'Thiamine HCl', formula: 'thiamine-HCl', mgPerLiter: 0.1, category: 'vitamin' },
    { name: 'Glycine', formula: 'glycine', mgPerLiter: 2, category: 'vitamin' },
  ],
};

const B5_MEDIUM: MediaFormulation = {
  id: 'b5',
  name: 'Gamborg B5 Medium',
  author: 'Gamborg',
  year: 1968,
  notes: 'Lower ammonium content than MS. Suitable for legumes and cereal callus culture.',
  components: [
    { name: 'Potassium Nitrate', formula: 'KNO3', mgPerLiter: 2500, category: 'macronutrient' },
    { name: 'Ammonium Sulfate', formula: '(NH4)2SO4', mgPerLiter: 134, category: 'macronutrient' },
    { name: 'Calcium Chloride Dihydrate', formula: 'CaCl2-2H2O', mgPerLiter: 150, category: 'macronutrient' },
    { name: 'Magnesium Sulfate Heptahydrate', formula: 'MgSO4-7H2O', mgPerLiter: 250, category: 'macronutrient' },
    { name: 'Sodium Dihydrogen Phosphate Monohydrate', formula: 'NaH2PO4-H2O', mgPerLiter: 150, category: 'macronutrient' },
    { name: 'Manganese Sulfate Monohydrate', formula: 'MnSO4-H2O', mgPerLiter: 10, category: 'micronutrient' },
    { name: 'Zinc Sulfate Heptahydrate', formula: 'ZnSO4-7H2O', mgPerLiter: 2, category: 'micronutrient' },
    { name: 'Boric Acid', formula: 'H3BO3', mgPerLiter: 3, category: 'micronutrient' },
    { name: 'Potassium Iodide', formula: 'KI', mgPerLiter: 0.75, category: 'micronutrient' },
    { name: 'Sodium Molybdate Dihydrate', formula: 'Na2MoO4-2H2O', mgPerLiter: 0.25, category: 'micronutrient' },
    { name: 'Copper Sulfate Pentahydrate', formula: 'CuSO4-5H2O', mgPerLiter: 0.025, category: 'micronutrient' },
    { name: 'Cobalt Chloride Hexahydrate', formula: 'CoCl2-6H2O', mgPerLiter: 0.025, category: 'micronutrient' },
    { name: 'Ferrous Sulfate Heptahydrate', formula: 'FeSO4-7H2O', mgPerLiter: 27.8, category: 'iron' },
    { name: 'Disodium EDTA', formula: 'Na2EDTA', mgPerLiter: 37.3, category: 'iron' },
    { name: 'myo-Inositol', formula: 'myo-inositol', mgPerLiter: 100, category: 'vitamin' },
    { name: 'Nicotinic Acid', formula: 'nicotinic-acid', mgPerLiter: 1, category: 'vitamin' },
    { name: 'Pyridoxine HCl', formula: 'pyridoxine-HCl', mgPerLiter: 1, category: 'vitamin' },
    { name: 'Thiamine HCl', formula: 'thiamine-HCl', mgPerLiter: 10, category: 'vitamin' },
  ],
};

const WPM_MEDIUM: MediaFormulation = {
  id: 'wpm',
  name: 'Woody Plant Medium',
  author: 'Lloyd & McCown',
  year: 1980,
  notes: 'Reduced salt formulation for woody plant species. Lower nitrogen than MS.',
  components: [
    { name: 'Ammonium Nitrate', formula: 'NH4NO3', mgPerLiter: 400, category: 'macronutrient' },
    { name: 'Calcium Nitrate Tetrahydrate', formula: 'Ca(NO3)2-4H2O', mgPerLiter: 556, category: 'macronutrient' },
    { name: 'Calcium Chloride Dihydrate', formula: 'CaCl2-2H2O', mgPerLiter: 96, category: 'macronutrient' },
    { name: 'Potassium Dihydrogen Phosphate', formula: 'KH2PO4', mgPerLiter: 170, category: 'macronutrient' },
    { name: 'Potassium Sulfate', formula: 'K2SO4', mgPerLiter: 990, category: 'macronutrient' },
    { name: 'Magnesium Sulfate Heptahydrate', formula: 'MgSO4-7H2O', mgPerLiter: 370, category: 'macronutrient' },
    { name: 'Manganese Sulfate Monohydrate', formula: 'MnSO4-H2O', mgPerLiter: 22.3, category: 'micronutrient' },
    { name: 'Zinc Sulfate Heptahydrate', formula: 'ZnSO4-7H2O', mgPerLiter: 8.6, category: 'micronutrient' },
    { name: 'Boric Acid', formula: 'H3BO3', mgPerLiter: 6.2, category: 'micronutrient' },
    { name: 'Sodium Molybdate Dihydrate', formula: 'Na2MoO4-2H2O', mgPerLiter: 0.25, category: 'micronutrient' },
    { name: 'Copper Sulfate Pentahydrate', formula: 'CuSO4-5H2O', mgPerLiter: 0.025, category: 'micronutrient' },
    { name: 'Ferrous Sulfate Heptahydrate', formula: 'FeSO4-7H2O', mgPerLiter: 27.8, category: 'iron' },
    { name: 'Disodium EDTA', formula: 'Na2EDTA', mgPerLiter: 37.3, category: 'iron' },
    { name: 'myo-Inositol', formula: 'myo-inositol', mgPerLiter: 100, category: 'vitamin' },
    { name: 'Nicotinic Acid', formula: 'nicotinic-acid', mgPerLiter: 0.5, category: 'vitamin' },
    { name: 'Pyridoxine HCl', formula: 'pyridoxine-HCl', mgPerLiter: 0.5, category: 'vitamin' },
    { name: 'Thiamine HCl', formula: 'thiamine-HCl', mgPerLiter: 1, category: 'vitamin' },
    { name: 'Glycine', formula: 'glycine', mgPerLiter: 2, category: 'vitamin' },
  ],
};

const WHITE_MEDIUM: MediaFormulation = {
  id: 'white',
  name: "White's Medium",
  author: 'White',
  year: 1963,
  notes: 'Low salt medium for root culture and slow-growing tissues.',
  components: [
    { name: 'Calcium Nitrate Tetrahydrate', formula: 'Ca(NO3)2-4H2O', mgPerLiter: 300, category: 'macronutrient' },
    { name: 'Potassium Nitrate', formula: 'KNO3', mgPerLiter: 80, category: 'macronutrient' },
    { name: 'Potassium Chloride', formula: 'KCl', mgPerLiter: 65, category: 'macronutrient' },
    { name: 'Sodium Dihydrogen Phosphate Monohydrate', formula: 'NaH2PO4-H2O', mgPerLiter: 16.5, category: 'macronutrient' },
    { name: 'Magnesium Sulfate Heptahydrate', formula: 'MgSO4-7H2O', mgPerLiter: 720, category: 'macronutrient' },
    { name: 'Sodium Sulfate', formula: 'Na2SO4', mgPerLiter: 200, category: 'macronutrient' },
    { name: 'Manganese Sulfate Tetrahydrate', formula: 'MnSO4-4H2O', mgPerLiter: 7, category: 'micronutrient' },
    { name: 'Zinc Sulfate Heptahydrate', formula: 'ZnSO4-7H2O', mgPerLiter: 3, category: 'micronutrient' },
    { name: 'Boric Acid', formula: 'H3BO3', mgPerLiter: 1.5, category: 'micronutrient' },
    { name: 'Potassium Iodide', formula: 'KI', mgPerLiter: 0.75, category: 'micronutrient' },
    { name: 'Sodium Molybdate Dihydrate', formula: 'Na2MoO4-2H2O', mgPerLiter: 0.25, category: 'micronutrient' },
    { name: 'Copper Sulfate Pentahydrate', formula: 'CuSO4-5H2O', mgPerLiter: 0.01, category: 'micronutrient' },
    { name: 'Ferrous Sulfate Heptahydrate', formula: 'FeSO4-7H2O', mgPerLiter: 2.5, category: 'iron' },
    { name: 'Ferric Sulfate', formula: 'Fe2(SO4)3', mgPerLiter: 2.5, category: 'iron' },
    { name: 'myo-Inositol', formula: 'myo-inositol', mgPerLiter: 100, category: 'vitamin' },
    { name: 'Nicotinic Acid', formula: 'nicotinic-acid', mgPerLiter: 0.5, category: 'vitamin' },
    { name: 'Pyridoxine HCl', formula: 'pyridoxine-HCl', mgPerLiter: 0.1, category: 'vitamin' },
    { name: 'Thiamine HCl', formula: 'thiamine-HCl', mgPerLiter: 0.1, category: 'vitamin' },
    { name: 'Glycine', formula: 'glycine', mgPerLiter: 3, category: 'vitamin' },
  ],
};

const MEDIA_DB: Record<MediaType, MediaFormulation> = {
  ms: MS_MEDIUM,
  b5: B5_MEDIUM,
  wpm: WPM_MEDIUM,
  white: WHITE_MEDIUM,
};

// --- Growth regulators ---

const GROWTH_REGULATORS: readonly GrowthRegulator[] = [
  {
    id: 'bap',
    name: '6-Benzylaminopurine',
    abbreviation: 'BAP',
    type: 'cytokinin',
    molecularWeight: 225.25,
    solvent: 'NaOH',
    heatStable: true,
    typicalRange: { min: 0.1, max: 5.0 },
  },
  {
    id: 'kinetin',
    name: 'Kinetin',
    abbreviation: 'Kinetin',
    type: 'cytokinin',
    molecularWeight: 215.21,
    solvent: 'NaOH',
    heatStable: true,
    typicalRange: { min: 0.1, max: 2.0 },
  },
  {
    id: 'tdz',
    name: 'Thidiazuron',
    abbreviation: 'TDZ',
    type: 'cytokinin',
    molecularWeight: 220.25,
    solvent: 'DMSO',
    heatStable: true,
    typicalRange: { min: 0.01, max: 2.0 },
  },
  {
    id: '2,4-d',
    name: '2,4-Dichlorophenoxyacetic acid',
    abbreviation: '2,4-D',
    type: 'auxin',
    molecularWeight: 221.04,
    solvent: 'ethanol',
    heatStable: false,
    typicalRange: { min: 0.1, max: 5.0 },
  },
  {
    id: 'naa',
    name: '1-Naphthaleneacetic acid',
    abbreviation: 'NAA',
    type: 'auxin',
    molecularWeight: 186.21,
    solvent: 'NaOH',
    heatStable: true,
    typicalRange: { min: 0.1, max: 5.0 },
  },
  {
    id: 'iba',
    name: 'Indole-3-butyric acid',
    abbreviation: 'IBA',
    type: 'auxin',
    molecularWeight: 203.24,
    solvent: 'NaOH/ethanol',
    heatStable: true,
    typicalRange: { min: 0.1, max: 5.0 },
  },
  {
    id: 'iaa',
    name: 'Indole-3-acetic acid',
    abbreviation: 'IAA',
    type: 'auxin',
    molecularWeight: 175.18,
    solvent: 'NaOH/ethanol',
    heatStable: false,
    typicalRange: { min: 0.01, max: 3.0 },
  },
  {
    id: 'ga3',
    name: 'Gibberellic acid',
    abbreviation: 'GA3',
    type: 'gibberellin',
    molecularWeight: 346.37,
    solvent: 'ethanol',
    heatStable: false,
    typicalRange: { min: 0.1, max: 10.0 },
  },
];

// --- Public API ---

/**
 * Get a media formulation by type.
 * @param type - Media type identifier (ms, b5, wpm, white)
 * @returns Complete media formulation with all components
 */
export function getMediaFormulation(type: MediaType): MediaFormulation {
  return MEDIA_DB[type];
}

/**
 * Get all available media formulations.
 * @returns Array of all 4 media formulations
 */
export function getAllMedia(): MediaFormulation[] {
  return Object.values(MEDIA_DB);
}

/**
 * Get a growth regulator by ID.
 * @param id - Growth regulator identifier
 * @returns Growth regulator data or undefined if not found
 */
export function getGrowthRegulator(id: string): GrowthRegulator | undefined {
  return GROWTH_REGULATORS.find((gr) => gr.id === id);
}

/**
 * Get all available growth regulators.
 * @returns Array of all plant growth regulators
 */
export function getAllGrowthRegulators(): GrowthRegulator[] {
  return [...GROWTH_REGULATORS];
}

/**
 * Calculate exact preparation amounts for a tissue culture media recipe.
 * @param recipe - Media recipe specification (base, strength, supplements, volume)
 * @returns Detailed preparation instructions with component amounts and stock solutions
 */
export function calculateMediaPreparation(recipe: MediaRecipe): MediaPreparation {
  const formulation = MEDIA_DB[recipe.base];
  const components: { name: string; formula: string; amount: string; unit: string }[] = [];
  const stockSolutions: { name: string; mlToAdd: number; concentration: string }[] = [];
  let totalWeight = 0;

  // Calculate each component amount scaled by strength and volume
  for (const comp of formulation.components) {
    const amount = comp.mgPerLiter * recipe.strength * recipe.volumeLiters;
    const amountMg = Number(amount.toFixed(3));
    totalWeight += amountMg / 1000;

    if (amountMg >= 1) {
      components.push({
        name: comp.name,
        formula: comp.formula,
        amount: amountMg >= 1000 ? (amountMg / 1000).toFixed(3) : amountMg.toFixed(3),
        unit: amountMg >= 1000 ? 'g' : 'mg',
      });
    } else {
      components.push({
        name: comp.name,
        formula: comp.formula,
        amount: amountMg.toFixed(3),
        unit: 'mg',
      });
    }
  }

  // Add sucrose
  if (recipe.sucrose > 0) {
    const sucroseGrams = recipe.sucrose * recipe.volumeLiters;
    totalWeight += sucroseGrams;
    components.push({
      name: 'Sucrose',
      formula: 'C12H22O11',
      amount: sucroseGrams.toFixed(1),
      unit: 'g',
    });
  }

  // Add agar
  if (recipe.agar > 0) {
    const agarGrams = recipe.agar * recipe.volumeLiters;
    totalWeight += agarGrams;
    components.push({
      name: 'Agar',
      formula: 'agar',
      amount: agarGrams.toFixed(1),
      unit: 'g',
    });
  }

  // Calculate stock solution additions for micronutrients (100x stock)
  const microComponents = formulation.components.filter((c) => c.category === 'micronutrient');
  if (microComponents.length > 0) {
    const mlMicro = recipe.strength * recipe.volumeLiters * 10; // 100x stock = 10 mL/L
    stockSolutions.push({
      name: 'Micronutrient Stock (100x)',
      mlToAdd: Number(mlMicro.toFixed(1)),
      concentration: '100x',
    });
  }

  // Iron stock (200x)
  const ironComponents = formulation.components.filter((c) => c.category === 'iron');
  if (ironComponents.length > 0) {
    const mlIron = recipe.strength * recipe.volumeLiters * 5; // 200x stock = 5 mL/L
    stockSolutions.push({
      name: 'Iron Stock (200x)',
      mlToAdd: Number(mlIron.toFixed(1)),
      concentration: '200x',
    });
  }

  // Vitamin stock (1000x)
  const vitaminComponents = formulation.components.filter((c) => c.category === 'vitamin');
  if (vitaminComponents.length > 0) {
    const mlVitamin = recipe.strength * recipe.volumeLiters * 1; // 1000x stock = 1 mL/L
    stockSolutions.push({
      name: 'Vitamin Stock (1000x)',
      mlToAdd: Number(mlVitamin.toFixed(1)),
      concentration: '1000x',
    });
  }

  // Growth regulator stock solutions
  for (const gr of recipe.growthRegulators) {
    const grData = getGrowthRegulator(gr.id);
    if (!grData) continue;
    // Assume 1 mg/mL stock concentration
    const mlToAdd = gr.mgPerLiter * recipe.volumeLiters;
    stockSolutions.push({
      name: `${grData.abbreviation} Stock (1 mg/mL)`,
      mlToAdd: Number(mlToAdd.toFixed(2)),
      concentration: '1 mg/mL in ' + grData.solvent,
    });
  }

  // Build instructions
  const instructions: string[] = [];
  const volMl = recipe.volumeLiters * 1000;
  instructions.push(`Prepare ${volMl} mL of ${recipe.strength === 1 ? 'full' : recipe.strength + 'x'}-strength ${formulation.name}.`);
  instructions.push(`Dissolve macronutrient salts in approximately ${Math.round(volMl * 0.8)} mL of distilled water.`);
  instructions.push('Add stock solutions for micronutrients, iron, and vitamins.');

  if (recipe.growthRegulators.length > 0) {
    const heatSensitive = recipe.growthRegulators
      .map((gr) => getGrowthRegulator(gr.id))
      .filter((gr) => gr && !gr.heatStable)
      .map((gr) => gr!.abbreviation);

    instructions.push('Add growth regulators from stock solutions.');
    if (heatSensitive.length > 0) {
      instructions.push(`WARNING: ${heatSensitive.join(', ')} are heat-sensitive. Add after autoclaving via filter sterilization.`);
    }
  }

  if (recipe.sucrose > 0) {
    instructions.push(`Add ${(recipe.sucrose * recipe.volumeLiters).toFixed(1)} g sucrose and dissolve completely.`);
  }

  instructions.push(`Adjust pH to ${recipe.ph} using 1N NaOH or 1N HCl.`);
  instructions.push(`Bring volume to ${volMl} mL with distilled water.`);

  if (recipe.agar > 0) {
    instructions.push(`Add ${(recipe.agar * recipe.volumeLiters).toFixed(1)} g agar, heat to dissolve.`);
  }

  instructions.push('Autoclave at 121 C (15 psi) for 15-20 minutes.');

  return {
    recipe,
    components,
    stockSolutions,
    totalWeight: Number(totalWeight.toFixed(2)),
    instructions,
  };
}
