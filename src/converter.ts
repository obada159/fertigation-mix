/**
 * EC/PPM converter and unit conversion utilities for nutrient solutions.
 */

type ScaleType = 'us500' | 'us700' | 'eu';
type ConcentrationUnit = 'mgL' | 'ppm' | 'mmolL' | 'meqL';

const SCALE_FACTORS: Record<ScaleType, number> = {
  us500: 500,
  us700: 700,
  eu: 640,
};

/**
 * Convert electrical conductivity (mS/cm) to parts per million.
 * @param ec - EC value in mS/cm
 * @param scale - Conversion scale: us500 (Hanna), us700 (Truncheon), eu (European). Default: us500
 * @returns PPM value
 */
export function ecToPpm(ec: number, scale: ScaleType = 'us500'): number {
  if (ec < 0) throw new RangeError('EC value must be non-negative');
  return ec * SCALE_FACTORS[scale];
}

/**
 * Convert parts per million to electrical conductivity (mS/cm).
 * @param ppm - PPM value
 * @param scale - Conversion scale: us500 (Hanna), us700 (Truncheon), eu (European). Default: us500
 * @returns EC value in mS/cm
 */
export function ppmToEc(ppm: number, scale: ScaleType = 'us500'): number {
  if (ppm < 0) throw new RangeError('PPM value must be non-negative');
  return ppm / SCALE_FACTORS[scale];
}

/**
 * Convert between concentration units.
 * @param value - Input value
 * @param from - Source unit
 * @param to - Target unit
 * @param molarMass - Molar mass in g/mol (required for mmolL and meqL conversions)
 * @returns Converted value
 */
export function convertUnit(
  value: number,
  from: ConcentrationUnit,
  to: ConcentrationUnit,
  molarMass?: number,
): number {
  if (from === to) return value;

  // mgL and ppm are equivalent
  if ((from === 'mgL' && to === 'ppm') || (from === 'ppm' && to === 'mgL')) {
    return value;
  }

  // Convert to mg/L first as the base unit
  let mgL: number;
  switch (from) {
    case 'mgL':
    case 'ppm':
      mgL = value;
      break;
    case 'mmolL':
      if (!molarMass) throw new Error('Molar mass required for mmol/L conversion');
      mgL = value * molarMass;
      break;
    case 'meqL':
      if (!molarMass) throw new Error('Molar mass required for meq/L conversion');
      mgL = value * molarMass;
      break;
  }

  // Convert from mg/L to target
  switch (to) {
    case 'mgL':
    case 'ppm':
      return mgL;
    case 'mmolL':
      if (!molarMass) throw new Error('Molar mass required for mmol/L conversion');
      return mgL / molarMass;
    case 'meqL':
      if (!molarMass) throw new Error('Molar mass required for meq/L conversion');
      return mgL / molarMass;
  }
}
