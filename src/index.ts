export type {
  EC,
  PH,
  Percentage,
  Nutrient,
  MixTarget,
  StockSolution,
  MixResult,
  CompatibilityResult,
  CalculatorConfig,
} from "./types.js";

export { getNutrientById, getAllNutrients } from "./nutrients.js";
export { checkCompatibility as checkNutrientCompatibility } from "./nutrients.js";
export {
  checkCompatibility as checkStockCompatibility,
  calculateMix,
} from "./mixer.js";

export type {
  MediaType,
  MediaComponent,
  MediaFormulation,
  GrowthRegulator,
  MediaRecipe,
  MediaPreparation,
} from "./tissue-culture.js";
export {
  getMediaFormulation,
  getAllMedia,
  getGrowthRegulator,
  getAllGrowthRegulators,
  calculateMediaPreparation,
} from "./tissue-culture.js";

export { ecToPpm, ppmToEc, convertUnit } from "./converter.js";

export type { PhAdjustment } from "./ph-adjust.js";
export { calculatePhAdjustment } from "./ph-adjust.js";

// --- v3.0.0: Guide, Sterilization, and SOP modules ---

export type {
  DifficultyLevel,
  CultureStage,
  EquipmentItem,
  SterilizationStep,
  SterilizationProtocol,
  BeginnerPlant,
  WalkthroughStep,
  TroubleshootingEntry,
  StockSolutionGuide,
} from "./guide.js";
export {
  getEquipmentList,
  estimateSetupCost,
  getBeginnerPlants,
  getPlantProtocol,
  getWalkthrough,
  getTroubleshooting,
  getStockSolutionGuides,
  getStockSolutionGuide,
} from "./guide.js";

export type {
  ExplantHardiness,
  SOPFormat,
  SterilizationInput,
  SterilizationResult,
  SterilizationStepDetail,
  AutoclaveInput,
  AutoclaveResult,
  SOPName,
  SOPDocument,
} from "./sterilization.js";
export {
  calculateSterilization,
  calculateAutoclave,
  getSOP,
  getAllSOPs,
  formatSOP,
} from "./sterilization.js";
