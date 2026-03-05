/**
 * pH adjustment calculator for nutrient solutions.
 * Estimates acid/base amounts to reach target pH.
 */

export interface PhAdjustment {
  readonly acid: { readonly name: string; readonly mlPerLiter: number };
  readonly base: { readonly name: string; readonly mlPerLiter: number };
  readonly direction: 'acidify' | 'basify' | 'none';
  readonly warning?: string;
}

interface AcidBase {
  readonly name: string;
  readonly mlPerPhUnit: number;
}

const COMMON_ACIDS: readonly AcidBase[] = [
  { name: 'Phosphoric acid (85%)', mlPerPhUnit: 0.1 },
  { name: 'Nitric acid (61%)', mlPerPhUnit: 0.08 },
  { name: 'Sulfuric acid (98%)', mlPerPhUnit: 0.05 },
  { name: 'Citric acid (50%)', mlPerPhUnit: 0.3 },
];

const COMMON_BASES: readonly AcidBase[] = [
  { name: 'KOH (1N)', mlPerPhUnit: 0.5 },
  { name: 'NaOH (1N)', mlPerPhUnit: 0.4 },
];

/**
 * Calculate pH adjustment amounts to reach target pH.
 * @param currentPh - Current pH of the solution
 * @param targetPh - Desired pH value
 * @param volumeLiters - Solution volume in liters
 * @param bufferCapacity - Buffer capacity multiplier (default 1.0, higher = more buffered solution)
 * @returns pH adjustment recommendation with acid/base amounts
 */
export function calculatePhAdjustment(
  currentPh: number,
  targetPh: number,
  volumeLiters: number,
  bufferCapacity: number = 1.0,
): PhAdjustment {
  let warning: string | undefined;

  if (currentPh < 0 || currentPh > 14 || targetPh < 0 || targetPh > 14) {
    warning = 'pH values must be between 0 and 14';
  }

  if (targetPh < 4 || targetPh > 9) {
    warning = 'Target pH is outside the safe range for plant growth (4.0-9.0)';
  }

  const phDelta = Math.abs(currentPh - targetPh);

  if (phDelta < 0.05) {
    return {
      acid: { name: COMMON_ACIDS[0].name, mlPerLiter: 0 },
      base: { name: COMMON_BASES[0].name, mlPerLiter: 0 },
      direction: 'none',
      warning,
    };
  }

  const acid = COMMON_ACIDS[0];
  const base = COMMON_BASES[0];

  if (currentPh > targetPh) {
    // Need to acidify
    const mlPerLiter = acid.mlPerPhUnit * phDelta * bufferCapacity;
    return {
      acid: { name: acid.name, mlPerLiter: Number((mlPerLiter * volumeLiters).toFixed(3)) },
      base: { name: base.name, mlPerLiter: 0 },
      direction: 'acidify',
      warning,
    };
  } else {
    // Need to basify
    const mlPerLiter = base.mlPerPhUnit * phDelta * bufferCapacity;
    return {
      acid: { name: acid.name, mlPerLiter: 0 },
      base: { name: base.name, mlPerLiter: Number((mlPerLiter * volumeLiters).toFixed(3)) },
      direction: 'basify',
      warning,
    };
  }
}
