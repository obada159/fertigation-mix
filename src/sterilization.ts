/**
 * Sterilization protocol calculator for tissue culture.
 * Calculates bleach dilutions, exposure times, and generates step-by-step SOPs.
 */

export type ExplantHardiness = 'soft' | 'medium' | 'woody' | 'hairy';
export type SOPFormat = 'text' | 'checklist';

export interface SterilizationInput {
  readonly explantType: ExplantHardiness;
  readonly explantDescription?: string;
  readonly bleachPercentNaOCl: number; // household bleach NaOCl % (usually 5-6%)
  readonly hasEndophyteRisk: boolean;
  readonly useTween: boolean;
}

export interface SterilizationResult {
  readonly bleachDilution: string;
  readonly finalNaOClPercent: number;
  readonly ethanolDipSeconds: number;
  readonly bleachSoakMinutes: number;
  readonly rinseCount: number;
  readonly steps: readonly SterilizationStepDetail[];
  readonly warnings: readonly string[];
  readonly sop: string;
}

export interface SterilizationStepDetail {
  readonly step: number;
  readonly action: string;
  readonly duration: string;
  readonly materials: readonly string[];
  readonly notes?: string;
}

export interface AutoclaveInput {
  readonly mediaVolumeMl: number;
  readonly vesselCount: number;
  readonly vesselType: 'jar' | 'flask' | 'tube';
  readonly includeWater: boolean;
  readonly includeTools: boolean;
}

export interface AutoclaveResult {
  readonly temperatureC: number;
  readonly pressurePsi: number;
  readonly timeMinutes: number;
  readonly cooldownMinutes: number;
  readonly loadDescription: string;
  readonly steps: readonly string[];
  readonly warnings: readonly string[];
}

// ── Pre-built SOPs ───────────────────────────────

export type SOPName =
  | 'media-preparation'
  | 'explant-sterilization'
  | 'aseptic-transfer'
  | 'subculture'
  | 'rooting-transfer'
  | 'acclimatization'
  | 'stock-solution-prep'
  | 'autoclave-operation'
  | 'sab-setup'
  | 'contamination-response';

export interface SOPDocument {
  readonly id: SOPName;
  readonly title: string;
  readonly version: string;
  readonly purpose: string;
  readonly materials: readonly string[];
  readonly ppe: readonly string[];
  readonly steps: readonly { readonly step: number; readonly action: string; readonly details: string; readonly criticalPoint?: string }[];
  readonly qualityChecks: readonly string[];
  readonly troubleshooting: readonly string[];
}

const SOPS: Record<SOPName, SOPDocument> = {
  'media-preparation': {
    id: 'media-preparation',
    title: 'Standard Operating Procedure: Culture Media Preparation',
    version: '1.0',
    purpose: 'Prepare sterile plant tissue culture media (MS-based) for use in initiation, multiplication, rooting, or maintenance cultures.',
    materials: [
      'MS basal salt premix powder (4.43 g/L) or individual stock solutions',
      'Sucrose (granulated white sugar)',
      'Agar (plant tissue culture grade or food grade)',
      'Distilled water (1 L per batch minimum)',
      'Growth regulators (as required by recipe)',
      'pH meter or test strips',
      '1N NaOH and 1N HCl for pH adjustment',
      'Glass culture vessels with lids',
      'Aluminum foil',
      'Magnetic stir bar and stir plate (or spoon)',
      'Scale (0.01g precision)',
      'Graduated cylinder or measuring cup',
    ],
    ppe: ['Lab coat or clean long-sleeve shirt', 'Heat-resistant gloves for handling hot media/autoclave'],
    steps: [
      { step: 1, action: 'Measure water', details: 'Pour 800 mL of distilled water into a clean beaker or pot.', criticalPoint: 'Use only distilled water. Tap water contains chlorine and minerals that alter media composition.' },
      { step: 2, action: 'Add MS salts', details: 'Add 4.43 g MS premix powder per liter of final volume. Stir until completely dissolved.', criticalPoint: 'If using stock solutions: add 100 mL macro (10x), 10 mL micro (100x), 5 mL iron (200x), 1 mL vitamin (1000x).' },
      { step: 3, action: 'Add sucrose', details: 'Add 30 g sucrose per liter. Stir until dissolved. This is the carbon/energy source for the plants.', criticalPoint: 'Use white granulated sugar only. Brown sugar, raw sugar, and artificial sweeteners will not work.' },
      { step: 4, action: 'Add growth regulators', details: 'Add growth regulator stock solutions as specified by your recipe (e.g., 1 mL BAP stock for 1 mg/L). Stir well.', criticalPoint: 'If using heat-sensitive regulators (IAA, 2,4-D, GA3), do NOT add now — add via filter sterilization AFTER autoclaving.' },
      { step: 5, action: 'Adjust pH', details: 'Check pH with meter or strips. Adjust to 5.8 (+/- 0.1) using drops of 1N NaOH (to raise) or 1N HCl (to lower). Add slowly — 1-2 drops at a time.', criticalPoint: 'pH MUST be adjusted BEFORE adding agar. Agar gels at low pH during cooling, making post-adjustment impossible.' },
      { step: 6, action: 'Bring to final volume', details: 'Add distilled water to bring total volume to 1000 mL.', criticalPoint: undefined },
      { step: 7, action: 'Add agar', details: 'Add 8 g agar per liter. Heat while stirring on stove or hotplate until solution turns from cloudy to clear (agar is fully dissolved). Do not boil vigorously.', criticalPoint: 'Agar must be fully dissolved before dispensing. Undissolved agar chunks create soft spots in the gel.' },
      { step: 8, action: 'Dispense into vessels', details: 'Pour hot media into glass jars, filling each 1/3 to 1/2 full. Cover loosely with aluminum foil or loosened lids (tight seal = pressure buildup = explosion).', criticalPoint: 'Leave lids LOOSE during autoclaving. Tight lids can shatter jars under pressure.' },
      { step: 9, action: 'Autoclave', details: 'Load vessels into pressure cooker. Autoclave at 121C (15 psi) for 15-20 minutes. Allow natural depressurization (30+ min). Do NOT open early.', criticalPoint: 'SAFETY: Never force-open a pressurized autoclave. Allow full natural depressurization. Use heat-resistant gloves.' },
      { step: 10, action: 'Cool and store', details: 'After autoclaving, let jars cool to room temperature on a clean surface. Once solidified, tighten lids and store at room temperature (out of direct light) or refrigerate. Use within 2-4 weeks.', criticalPoint: 'Do not move jars while media is still liquid — sloshing creates uneven surfaces that are hard to work with.' },
    ],
    qualityChecks: [
      'Media is clear and uniform (no cloudiness, precipitate, or undissolved agar)',
      'Media is firm when tapped gently (should jiggle slightly but not be liquid)',
      'No contamination visible after 3 days at room temperature (test a few jars)',
      'pH paper test of cooled media confirms pH 5.6-5.8',
    ],
    troubleshooting: [
      'Media too soft → Increase agar to 10 g/L or check that pH was above 5.0 before autoclaving',
      'Media has precipitate → Salts may have been added in wrong order. Remake from scratch',
      'Media turns pink/brown → Possible caramelization from over-autoclaving. Reduce time to 15 min',
      'Contamination in sealed jars → Autoclave may not be reaching 121C/15 psi. Test with autoclave tape',
    ],
  },
  'explant-sterilization': {
    id: 'explant-sterilization',
    title: 'Standard Operating Procedure: Explant Surface Sterilization',
    version: '1.0',
    purpose: 'Remove surface microorganisms from plant explants before introducing them to sterile culture media.',
    materials: [
      '70% isopropyl alcohol',
      'Household bleach (5-6% NaOCl)',
      'Distilled water (autoclaved/sterile) — at least 500 mL',
      'Tween-20 or a drop of dish soap',
      'Sterile beakers or cups (3 minimum)',
      'Timer',
      'Sterile forceps',
    ],
    ppe: ['Gloves (bleach is corrosive)', 'Eye protection if handling concentrated bleach'],
    steps: [
      { step: 1, action: 'Pre-wash explant', details: 'Rinse explant under running tap water for 5 minutes. If plant was outdoors, add a drop of dish soap and gently rub surfaces. Rinse soap off thoroughly.', criticalPoint: undefined },
      { step: 2, action: 'Trim to size', details: 'Using clean scissors, trim explant to 2-3 cm pieces. Remove any damaged, yellowed, or insect-eaten tissue.', criticalPoint: undefined },
      { step: 3, action: 'Ethanol dip', details: 'Submerge explant in 70% isopropyl alcohol for 30-60 seconds. Gently swirl. This kills most surface bacteria.', criticalPoint: 'Do not exceed 60 seconds — ethanol damages plant cells quickly. Soft tissues (leaves) need only 30 seconds.' },
      { step: 4, action: 'Prepare bleach solution', details: 'Mix 1 part household bleach (5% NaOCl) with 4 parts sterile water = 1% NaOCl final. Add 1-2 drops of Tween-20 or dish soap per 100 mL as a wetting agent.', criticalPoint: 'From this point forward, ALL steps must be done inside the SAB using sterile equipment.' },
      { step: 5, action: 'Bleach soak', details: 'Transfer explant to bleach solution. Soak for 10-15 minutes with gentle swirling every 2-3 minutes.', criticalPoint: 'Time varies by tissue: soft leaves = 8-10 min, stems = 10-12 min, woody/hairy tissue = 15-20 min. Adjust if you get too much contamination (increase) or dead tissue (decrease).' },
      { step: 6, action: 'Sterile rinse 1', details: 'Transfer to first beaker of sterile distilled water. Swirl gently for 1-2 minutes.', criticalPoint: 'Water MUST be autoclaved. Non-sterile water recontaminates the explant immediately.' },
      { step: 7, action: 'Sterile rinse 2', details: 'Transfer to second beaker of sterile distilled water. Swirl for 1-2 minutes.', criticalPoint: undefined },
      { step: 8, action: 'Sterile rinse 3', details: 'Transfer to third beaker of sterile distilled water. Swirl for 1-2 minutes. The explant is now ready for trimming and transfer to media.', criticalPoint: 'Three rinses is the minimum. For sensitive species, use 4-5 rinses.' },
    ],
    qualityChecks: [
      'Explant tissue is still green and turgid (not translucent or mushy from over-sterilization)',
      'No visible contamination after 5-7 days on media',
      'Contamination rate below 20% across a batch of 10+ explants',
    ],
    troubleshooting: [
      'High contamination (>30%) → Increase bleach to 15-20% or soak time to 15-20 min',
      'Tissue dies (turns white/translucent) → Reduce bleach concentration or soak time',
      'Persistent contamination from one species → Likely endophytic bacteria. Try antibiotic pre-treatment',
      'Hairy/fuzzy stems hard to sterilize → Use longer bleach soak (20 min) with extra Tween-20',
    ],
  },
  'aseptic-transfer': {
    id: 'aseptic-transfer',
    title: 'Standard Operating Procedure: Aseptic Transfer Technique',
    version: '1.0',
    purpose: 'Transfer plant material between culture vessels without introducing contamination.',
    materials: [
      'Still air box (SAB) or laminar flow hood',
      '70% isopropyl alcohol and spray bottle',
      'Scalpel with fresh blade',
      'Forceps (2 pairs recommended)',
      'Alcohol lamp or butane torch',
      'Sterile petri dish or aluminum foil (cutting surface)',
      'Prepared culture vessels with media',
    ],
    ppe: ['Clean clothing', 'Hair tied back or covered', 'No loose jewelry on hands/wrists'],
    steps: [
      { step: 1, action: 'Clean the SAB', details: 'Spray interior of SAB thoroughly with 70% alcohol. Wipe all surfaces. Wait 5 minutes for alcohol to evaporate and airborne particles to settle.', criticalPoint: 'Do this EVERY time you use the SAB, even if you just used it an hour ago.' },
      { step: 2, action: 'Arrange tools inside SAB', details: 'Place inside: alcohol lamp/torch, scalpel, forceps, cutting surface (sterile petri dish), and all culture vessels you need (both source and destination jars).', criticalPoint: 'Minimize reaching in and out of the SAB during work. Have everything ready before starting.' },
      { step: 3, action: 'Sanitize hands and arms', details: 'Wash hands with soap. Spray forearms and hands with 70% alcohol. Allow to dry before reaching into SAB.', criticalPoint: undefined },
      { step: 4, action: 'Flame-sterilize tools', details: 'Hold scalpel blade and forceps tips in flame for 5-10 seconds until they glow briefly. Allow to cool for 10-15 seconds before touching tissue.', criticalPoint: 'MUST re-flame between EVERY cut and between EVERY jar. This is the most important contamination prevention step.' },
      { step: 5, action: 'Open source vessel', details: 'Remove lid/foil from source jar. Set lid face-down on a clean surface inside the SAB (NOT on the table outside).', criticalPoint: 'Minimize time the jar is open. Work efficiently. Every second open = more contamination risk.' },
      { step: 6, action: 'Remove and trim tissue', details: 'Using sterile forceps, lift plant tissue from source jar. Place on sterile cutting surface. Use scalpel to divide into pieces (shoots, nodal segments, etc.) as needed.', criticalPoint: 'Make clean, single cuts. Do not saw back and forth — this crushes cells and increases browning.' },
      { step: 7, action: 'Transfer to destination vessel', details: 'Open destination jar. Using sterile forceps, place trimmed tissue onto fresh media surface. Do not push into the media. Close jar immediately.', criticalPoint: undefined },
      { step: 8, action: 'Seal and label', details: 'Ensure lid is secure. Wrap with parafilm or micropore tape if desired. Label with: plant name, date, subculture number, media type.', criticalPoint: 'Always label. Unlabeled jars are useless after 2 weeks.' },
    ],
    qualityChecks: [
      'Tools were flamed between every cut and every jar',
      'Jars were open for less than 30 seconds each',
      'All transfers done inside the SAB',
      'All jars labeled with date and contents',
    ],
    troubleshooting: [
      'Contamination appears 2-3 days after transfer → Likely airborne. Improve SAB cleaning or work faster',
      'All jars from one session contaminated → Tool was not properly sterilized. Flame longer (10 sec)',
      'Only jars at end of session contaminated → SAB air settled; particles accumulated during long session',
    ],
  },
  'subculture': {
    id: 'subculture',
    title: 'Standard Operating Procedure: Subculture / Multiplication',
    version: '1.0',
    purpose: 'Divide and transfer shoots to fresh media to multiply plant numbers (Stage II micropropagation).',
    materials: [
      'Source cultures with shoots (3-6 weeks old)',
      'Fresh multiplication media jars (same formulation as original)',
      'SAB, scalpel, forceps, alcohol lamp',
      '70% isopropyl alcohol',
    ],
    ppe: ['Clean clothing', 'Hair covered'],
    steps: [
      { step: 1, action: 'Evaluate source cultures', details: 'Select healthy cultures with shoots 1-3 cm tall. Skip any jars with contamination, excessive browning, or vitrified (glassy) shoots.', criticalPoint: 'Only subculture healthy material. Vitrified or weak shoots get worse with each subculture, not better.' },
      { step: 2, action: 'Set up SAB', details: 'Clean SAB, arrange tools and vessels inside. Follow Aseptic Transfer SOP for setup.', criticalPoint: undefined },
      { step: 3, action: 'Open source and extract clump', details: 'Open source jar, use forceps to gently remove the entire shoot clump. Place on sterile cutting surface.', criticalPoint: undefined },
      { step: 4, action: 'Separate shoots', details: 'Using sterile scalpel, divide the clump into individual shoots or small groups of 2-3 shoots. Each piece should be at least 0.5 cm tall with visible leaves.', criticalPoint: 'Do NOT cut shoots smaller than 0.5 cm — tiny pieces have very low survival rates. Bigger is better for beginners.' },
      { step: 5, action: 'Trim base', details: 'Remove any dead, brown, or calloused tissue from the base of each shoot. A clean, fresh-cut base establishes contact with the new media better.', criticalPoint: 'Re-flame scalpel between every 2-3 cuts.' },
      { step: 6, action: 'Transfer to fresh media', details: 'Place each shoot or shoot group into a fresh media jar. Press gently so the base contacts the media surface. 3-5 shoots per jar is typical.', criticalPoint: 'Do not overcrowd. Too many shoots in one jar means faster nutrient depletion and more competition.' },
      { step: 7, action: 'Seal, label, incubate', details: 'Seal jars, label with date and subculture number (e.g., "SC3" for third subculture). Place under grow lights (16h light / 8h dark, 22-25C).', criticalPoint: undefined },
    ],
    qualityChecks: [
      'Each jar contains 3-5 well-separated shoots',
      'No visibly contaminated or vitrified tissue was transferred',
      'Multiplication rate tracking: count shoots in vs shoots out per cycle',
      'Expected: 3-10x multiplication per 4-6 week cycle depending on species',
    ],
    troubleshooting: [
      'Low multiplication (<2x) → Increase cytokinin concentration by 0.5 mg/L',
      'Shoots getting smaller each subculture → Cytokinin may be too high. Reduce by 50% for one cycle',
      'Increasing vitrification → Increase agar to 10 g/L, reduce cytokinin, improve ventilation',
    ],
  },
  'rooting-transfer': {
    id: 'rooting-transfer',
    title: 'Standard Operating Procedure: Transfer to Rooting Media',
    version: '1.0',
    purpose: 'Transfer well-developed shoots to auxin-containing media to induce root formation (Stage III).',
    materials: [
      'Healthy shoots (2-4 cm tall with 2+ leaves)',
      'Rooting media: half-strength MS + 15g/L sucrose + 8g/L agar + auxin (NAA 0.5mg/L or IBA 1.0mg/L)',
      'SAB, scalpel, forceps, alcohol lamp',
    ],
    ppe: ['Clean clothing'],
    steps: [
      { step: 1, action: 'Select ready shoots', details: 'Choose shoots that are at least 2 cm tall with 2-3 well-developed leaves. These have the best rooting potential.', criticalPoint: 'Do NOT try to root tiny shoots (<1.5 cm). They lack the energy reserves for root initiation.' },
      { step: 2, action: 'Prepare in SAB', details: 'Follow standard aseptic setup. Have rooting media jars ready.', criticalPoint: undefined },
      { step: 3, action: 'Isolate individual shoots', details: 'Separate individual shoots from the multiplication clump. Remove any basal callus or dead tissue.', criticalPoint: undefined },
      { step: 4, action: 'Transfer to rooting media', details: 'Insert shoot base 2-3mm into the rooting media surface. The base should be in good contact with the media but the shoot should be upright.', criticalPoint: 'Only 1-3 shoots per rooting jar. Rooting is more successful with less crowding.' },
      { step: 5, action: 'Incubate', details: 'Place under grow lights. Reduce light intensity slightly for the first week if possible (partial shade). Roots typically appear in 1-4 weeks.', criticalPoint: undefined },
      { step: 6, action: 'Monitor root development', details: 'Check weekly for white root initials at the base of shoots. Once roots are 1-2 cm long and there are 2+ roots, the plant is ready for acclimatization.', criticalPoint: 'Do not rush. Plants with 3+ roots and roots longer than 1 cm have much higher acclimatization survival.' },
    ],
    qualityChecks: [
      'Roots appear within 2-4 weeks',
      'Root count: 2+ roots per plant',
      'Root length: at least 1 cm',
      'No excessive callus at the base (indicates too much auxin)',
    ],
    troubleshooting: [
      'No roots after 4 weeks → Increase auxin or try different auxin type (switch NAA to IBA or vice versa)',
      'Callus instead of roots → Reduce auxin concentration by 50%',
      'Shoots yellow/decline on rooting media → Check pH, try fresh media, or switch to hormone-free half-MS',
    ],
  },
  'acclimatization': {
    id: 'acclimatization',
    title: 'Standard Operating Procedure: Acclimatization (Hardening Off)',
    version: '1.0',
    purpose: 'Transition rooted in-vitro plantlets to ex-vitro conditions (soil, normal humidity, natural light).',
    materials: [
      'Rooted plantlets with 2+ roots at least 1 cm long',
      'Sterile or pasteurized potting mix (1:1 perlite:peat or perlite:coco coir)',
      'Small pots or cell trays',
      'Clear plastic bags, domes, or cut soda bottles (humidity chamber)',
      'Spray bottle with clean water',
      'Lukewarm running water (for agar washing)',
      'Dilute fungicide (optional but recommended)',
    ],
    ppe: ['Gloves (optional)'],
    steps: [
      { step: 1, action: 'Pre-acclimatize in jar (Day 1-3)', details: 'Loosen jar lids slightly. This slowly lowers humidity inside the jar, beginning the transition. Keep under grow lights.', criticalPoint: 'This step is often skipped but significantly improves survival rates.' },
      { step: 2, action: 'Remove plantlet from jar', details: 'Open jar, gently extract plantlet with forceps. Hold by the stem, not the roots.', criticalPoint: undefined },
      { step: 3, action: 'Wash off ALL agar', details: 'Hold plantlet under lukewarm running water and gently wash away all agar from the roots. Use fingers or a soft brush. Inspect roots — no agar residue should remain.', criticalPoint: 'CRITICAL: Agar left on roots will grow mold/bacteria in soil and kill the plant. This is the most common acclimatization mistake.' },
      { step: 4, action: 'Optional fungicide dip', details: 'Briefly dip roots in dilute fungicide solution (0.1% copper-based or 0.05% benomyl). This protects against soil-borne fungi during the vulnerable transition period.', criticalPoint: undefined },
      { step: 5, action: 'Plant in sterile mix', details: 'Fill small pot with pre-moistened sterile potting mix. Make a hole with a pencil, insert roots, and gently firm soil around the base. Water lightly.', criticalPoint: 'Use well-draining mix. Heavy soil or garden dirt will rot the delicate roots.' },
      { step: 6, action: 'Create humidity chamber', details: 'Cover plant with a clear plastic bag, dome, or cut 2L soda bottle. This maintains ~80-90% humidity around the plant. Place in bright indirect light (not direct sun).', criticalPoint: 'Direct sun + plastic dome = cooking the plant. Use bright indirect light only.' },
      { step: 7, action: 'Gradual humidity reduction (Day 4-14)', details: 'Day 4-5: poke 2-3 small holes in the dome/bag. Day 6-7: make holes larger or open bag slightly. Day 8-10: remove dome for 2 hours/day, then 4 hours, then full day. Day 11-14: dome fully removed.', criticalPoint: 'Go slowly. If leaves start wilting when dome is off, put it back on and slow down the transition.' },
      { step: 8, action: 'Normal care begins', details: 'Once the plant is growing new leaves in open air, acclimatization is complete. Begin normal watering and a very dilute fertilizer (1/4 strength).', criticalPoint: 'Do not over-water. The biggest killer after successful acclimatization is root rot from overwatering.' },
    ],
    qualityChecks: [
      'Survival rate target: 70%+ (beginners), 85%+ (experienced)',
      'New leaf growth visible within 2-3 weeks of planting',
      'No wilting when humidity dome is fully removed',
      'Roots visible at drainage holes within 3-4 weeks',
    ],
    troubleshooting: [
      'Mass wilting → Humidity dropped too fast. Re-cover and slow transition. Mist 3x daily.',
      'Root rot → Mix is too wet or agar was not fully removed. Repot in drier, more perlite-heavy mix.',
      'Leaves turn brown at edges → Too much direct light or salt damage from strong fertilizer. Move to shade, use 1/4 strength only.',
      'Fungal growth at base → Agar residue or non-sterile mix. Apply fungicide, improve drainage.',
    ],
  },
  'stock-solution-prep': {
    id: 'stock-solution-prep',
    title: 'Standard Operating Procedure: Stock Solution Preparation',
    version: '1.0',
    purpose: 'Prepare concentrated stock solutions for efficient and accurate media preparation.',
    materials: [
      'Analytical balance (0.01g for macro, 0.001g for micro)',
      'Volumetric flasks (100 mL, 500 mL, 1000 mL)',
      'Distilled water',
      'Individual chemical salts',
      'Labels and marker',
      'Amber bottles for iron stock',
      'Small tubes or vials for vitamin aliquots',
      'Freezer-safe containers',
    ],
    ppe: ['Gloves when handling chemicals', 'Eye protection'],
    steps: [
      { step: 1, action: 'Calculate amounts', details: 'Determine the concentration multiplier (10x, 100x, 1000x). Multiply each chemical amount by the concentration factor. Example: NH4NO3 at 1650 mg/L in MS → for 10x stock: 16.5 g/L.', criticalPoint: 'Double-check calculations. A 10x error in stock concentration means a 10x error in every batch of media you make.' },
      { step: 2, action: 'Weigh chemicals', details: 'Weigh each chemical on a calibrated scale. Use weighing paper or a small beaker. Record actual weights.', criticalPoint: 'For amounts under 0.01g (many micronutrients), make a sub-stock: dissolve 1g in 100 mL, then take 1 mL = 10 mg.' },
      { step: 3, action: 'Dissolve in order', details: 'Add chemicals one at a time to 80% of final volume of distilled water. Stir after each addition until dissolved before adding the next.', criticalPoint: 'Some salts will precipitate if mixed together at high concentration. Dissolve individually if unsure.' },
      { step: 4, action: 'Bring to final volume', details: 'Add distilled water to bring to the exact final volume (e.g., 1000 mL mark on volumetric flask).', criticalPoint: undefined },
      { step: 5, action: 'Label clearly', details: 'Label with: stock name, concentration (e.g., "MS Macro 10x"), date prepared, expiration date, your initials.', criticalPoint: undefined },
      { step: 6, action: 'Store properly', details: 'Macronutrients: 2-4C, 1-2 months. Micronutrients: 2-4C or -20C, 2-3 months. Vitamins: freeze at -20C in 1 mL aliquots, 6-12 months. Iron: 2-4C in amber bottle, 1-2 months.', criticalPoint: 'NEVER re-freeze thawed vitamin aliquots. Thaw one per media batch and discard any remainder.' },
    ],
    qualityChecks: [
      'Solutions are clear with no precipitate (warm and re-stir if precipitate forms)',
      'Labels are complete with name, concentration, date, and expiration',
      'pH of stock solutions is reasonable (macro stocks should be ~5-6)',
    ],
    troubleshooting: [
      'Precipitate forms → Chemicals may be incompatible at high concentration. Make separate stocks.',
      'Iron stock turns green/cloudy → Expired or light-degraded. Remake and store in amber/dark bottle.',
      'Media made from stocks has wrong pH → Check stock concentrations and dilution math.',
    ],
  },
  'autoclave-operation': {
    id: 'autoclave-operation',
    title: 'Standard Operating Procedure: Autoclave / Pressure Cooker Operation',
    version: '1.0',
    purpose: 'Safely operate an autoclave or pressure cooker to sterilize media, water, and tools.',
    materials: [
      'Pressure cooker (15 psi capable) or benchtop autoclave',
      'Autoclave tape (optional but recommended — confirms temperature was reached)',
      'Heat-resistant gloves',
      'Timer',
      'Trivet/rack (to keep jars off the bottom)',
    ],
    ppe: ['Heat-resistant gloves', 'Eye protection (steam release)', 'Long sleeves'],
    steps: [
      { step: 1, action: 'Load the autoclave', details: 'Place trivet/rack in bottom. Add 2-3 inches of water. Place jars on rack — do NOT let jars touch each other. Ensure lids are loosened (not tight). Attach autoclave tape to one jar.', criticalPoint: 'LOOSE LIDS. Tightly sealed jars WILL explode under pressure. This is a serious safety risk.' },
      { step: 2, action: 'Seal and heat', details: 'Close and lock autoclave lid per manufacturer instructions. Place on heat source (stove) at high heat. Wait for steam to vent continuously from the vent tube.', criticalPoint: 'Follow your specific pressure cooker manual for lid locking. Improperly locked lids can fail catastrophically.' },
      { step: 3, action: 'Vent steam', details: 'Let steam vent freely for 1-2 minutes to purge all air from the chamber. Air pockets prevent proper sterilization.', criticalPoint: 'Skipping the venting step means pockets of air remain at lower temperature. Media will not be sterile.' },
      { step: 4, action: 'Pressurize to 15 psi', details: 'Close the vent (place weight/rocker on vent tube). Pressure will build to 15 psi (~121C). Reduce heat to maintain a gentle, steady rocking of the weight.', criticalPoint: 'Too much heat = excessive pressure = safety risk. The weight should rock gently 1-4 times per minute.' },
      { step: 5, action: 'Time the sterilization', details: 'Start timer once 15 psi is reached: 15 minutes for up to 1L total media, 20 minutes for 1-2L, 30 minutes for 2-4L.', criticalPoint: undefined },
      { step: 6, action: 'Natural depressurization', details: 'Turn off heat. Allow pressure to drop to zero NATURALLY. This takes 30-45 minutes. Do NOT remove the weight or open the valve to speed this up.', criticalPoint: 'CRITICAL SAFETY: Releasing pressure quickly causes superheated liquids to flash-boil violently. Jars can explode. Burns are severe.' },
      { step: 7, action: 'Open and unload', details: 'Once pressure gauge reads zero, carefully open lid (direct steam away from your face). Using heat-resistant gloves, remove jars. Place on a clean, heat-resistant surface.', criticalPoint: 'Jars are still very hot (~80-90C). Handle with care. Do not place hot jars on a cold surface (thermal shock can crack glass).' },
      { step: 8, action: 'Verify sterilization', details: 'Check autoclave tape — stripe should have changed color (confirms 121C was reached). If tape did not change color, the cycle may not have been effective.', criticalPoint: undefined },
    ],
    qualityChecks: [
      'Autoclave tape changed color (temperature indicator)',
      'All jars intact (no cracks or broken seals)',
      'Media is clear (no burnt/caramelized appearance)',
      'Spot-check: leave 2-3 jars at room temp for 3 days — no contamination',
    ],
    troubleshooting: [
      'Tape did not change color → Cooker may not be reaching 15 psi. Test with a pressure gauge. Instant Pots reach ~11 psi max — NOT sufficient.',
      'Jars cracked → Thermal shock. Allow slow warm-up and cool-down. Use tempered glass.',
      'Media has precipitate after autoclaving → pH was too low before autoclaving, causing salt precipitation. Remake with pH 5.8.',
    ],
  },
  'sab-setup': {
    id: 'sab-setup',
    title: 'Standard Operating Procedure: Still Air Box Setup',
    version: '1.0',
    purpose: 'Set up and maintain a still air box (SAB) for sterile tissue culture transfers.',
    materials: [
      'Large clear plastic storage tub (50-80 L / 15-20 gallon)',
      '70% isopropyl alcohol in spray bottle',
      'Paper towels or lint-free cloths',
      'Box cutter or soldering iron (for making arm holes)',
      'Clear packing tape (to smooth arm hole edges)',
    ],
    ppe: [],
    steps: [
      { step: 1, action: 'Build the SAB (one-time)', details: 'Take a clear plastic tub and flip it upside down (open side facing down). Cut two arm holes on one long side, spaced about 20 cm apart, each roughly 10-12 cm in diameter. Smooth edges with tape to prevent cuts.', criticalPoint: 'Arm holes should be large enough for comfortable work but small enough to limit airflow. 10-12 cm diameter is ideal.' },
      { step: 2, action: 'Position the SAB', details: 'Place SAB on a clean table in a draft-free room. Close windows, turn off fans and AC. The SAB only works when air is STILL — any breeze carries contaminants inside.', criticalPoint: 'Drafts are the #1 enemy. Even a ceiling fan on low will increase contamination rates significantly.' },
      { step: 3, action: 'Clean before every use', details: 'Spray the entire interior liberally with 70% alcohol. Wipe all surfaces with a clean paper towel. Spray again and let it air-dry for 5 minutes. The alcohol kills surface microbes; the 5-minute wait lets airborne particles settle.', criticalPoint: 'Clean EVERY TIME, even if you just used it an hour ago. Spores settle continuously from the air.' },
      { step: 4, action: 'Load tools and vessels', details: 'Spray each item with 70% alcohol before placing inside: alcohol lamp, scalpel, forceps, cutting surface, culture jars. Arrange so everything is reachable without moving other items.', criticalPoint: 'Minimize reaching in and out. Each arm insertion pushes air (and contaminants) into the box.' },
      { step: 5, action: 'Wait 5 minutes', details: 'After loading, let the SAB sit undisturbed for 5 minutes. This allows air currents from loading to stop and particles to settle to the bottom.', criticalPoint: 'This patience step dramatically reduces contamination.' },
      { step: 6, action: 'Begin work', details: 'Spray hands and forearms with 70% alcohol. Insert arms smoothly (no sudden movements). Work efficiently and methodically. Keep movements slow and deliberate inside the SAB.', criticalPoint: 'Fast, jerky movements stir up settled particles. Move like you are underwater — slow and smooth.' },
    ],
    qualityChecks: [
      'Interior of SAB is visibly clean (no dust, debris, or water droplets)',
      'Room has no perceptible drafts or air currents',
      'All tools and vessels sprayed with alcohol before placement',
      'Contamination rate: target <20% for SAB work (compared to <5% for flow hoods)',
    ],
    troubleshooting: [
      'High contamination despite clean SAB → Check for drafts, pets in the room, or AC/fans',
      'Arm holes too small → Cut slightly larger. Discomfort leads to jerky movements which is worse.',
      'SAB fogs up from alcohol → Let dry longer. Open back slightly for ventilation during drying only.',
    ],
  },
  'contamination-response': {
    id: 'contamination-response',
    title: 'Standard Operating Procedure: Contamination Response',
    version: '1.0',
    purpose: 'Properly identify, contain, and dispose of contaminated tissue cultures to prevent spread.',
    materials: [
      'Autoclavable waste bags',
      'Permanent marker',
      'Bleach solution',
      'Autoclave/pressure cooker',
    ],
    ppe: ['Gloves', 'Mask (for fungal contamination)'],
    steps: [
      { step: 1, action: 'Identify contamination type', details: 'Bacterial: cloudy media, slimy film, foul smell (2-5 days). Fungal: fuzzy growth — white, green, black, or orange (3-7 days). Yeast: small creamy-white colonies on media surface (3-5 days). Photograph for records.', criticalPoint: 'Do NOT open contaminated jars to smell or examine more closely. Visual inspection through the glass only.' },
      { step: 2, action: 'Isolate immediately', details: 'Move contaminated jar away from clean cultures. Place in a separate area or plastic bag. Seal bag.', criticalPoint: 'Fungal contamination spreads via airborne spores. One open contaminated jar can infect an entire shelf.' },
      { step: 3, action: 'Record the event', details: 'Log: date, jar label, contamination type, when it appeared (days after inoculation), possible cause. Track contamination rates over time — should be <20%.', criticalPoint: 'Tracking contamination data helps you identify patterns (same species? same day? same batch of media?).' },
      { step: 4, action: 'Autoclave before disposal', details: 'Place sealed contaminated jars in the autoclave. Run a standard 15 psi / 121C / 20 min cycle. This kills all organisms and makes the waste safe to handle.', criticalPoint: 'NEVER pour contaminated media down the drain or throw jars in regular trash without autoclaving first.' },
      { step: 5, action: 'Dispose and clean', details: 'After autoclaving, jars can be washed and reused. Media can go in compost. Clean the area where contaminated jars sat with bleach solution.', criticalPoint: undefined },
      { step: 6, action: 'Root cause analysis', details: 'If contamination rate exceeds 20%: check SAB cleanliness, tool sterilization technique, media sterility (test blank jars), and explant source. Improve the weakest link.', criticalPoint: 'Most contamination comes from 3 sources: 1) poor SAB hygiene, 2) not flaming tools, 3) inadequate explant sterilization.' },
    ],
    qualityChecks: [
      'All contaminated cultures autoclaved before disposal',
      'Contamination logged with type, date, and suspected cause',
      'Contamination rate tracked per batch and per month',
      'Corrective action taken if rate exceeds 20%',
    ],
    troubleshooting: [
      'Contamination rate >30% → Systematic problem. Test media sterility first (incubate blank jars for 7 days).',
      'All jars from one session contaminated → Tool sterilization failure or SAB compromised.',
      'Contamination always from same species → Endophytic contamination. Try longer sterilization or antibiotics.',
    ],
  },
};

// ── Sterilization Calculator ─────────────────────

/**
 * Calculate a sterilization protocol based on explant characteristics.
 * @param input - Explant type, bleach concentration, and risk factors
 * @returns Complete sterilization protocol with step-by-step instructions
 */
export function calculateSterilization(input: SterilizationInput): SterilizationResult {
  const warnings: string[] = [];

  // Determine bleach dilution and timing based on explant hardiness
  let targetNaOClPercent: number;
  let soakMinutes: number;
  let ethanolSeconds: number;

  switch (input.explantType) {
    case 'soft':
      targetNaOClPercent = 0.5;
      soakMinutes = 8;
      ethanolSeconds = 30;
      break;
    case 'medium':
      targetNaOClPercent = 0.75;
      soakMinutes = 12;
      ethanolSeconds = 45;
      break;
    case 'woody':
      targetNaOClPercent = 1.0;
      soakMinutes = 15;
      ethanolSeconds = 60;
      break;
    case 'hairy':
      targetNaOClPercent = 1.0;
      soakMinutes = 20;
      ethanolSeconds = 60;
      break;
  }

  if (input.hasEndophyteRisk) {
    soakMinutes += 5;
    targetNaOClPercent = Math.min(targetNaOClPercent + 0.25, 1.5);
    warnings.push('Endophyte risk: increased bleach concentration and soak time. Consider antibiotic pre-treatment if contamination persists.');
  }

  // Calculate dilution from household bleach
  const dilutionFactor = targetNaOClPercent / input.bleachPercentNaOCl;
  const bleachMlPer100Ml = Math.round(dilutionFactor * 100);
  const waterMlPer100Ml = 100 - bleachMlPer100Ml;

  const bleachDilution = `${bleachMlPer100Ml} mL bleach + ${waterMlPer100Ml} mL sterile water per 100 mL`;

  const rinseCount = input.hasEndophyteRisk ? 4 : 3;

  // Build step-by-step
  const steps: SterilizationStepDetail[] = [
    {
      step: 1,
      action: 'Pre-wash',
      duration: '5 minutes',
      materials: ['Running tap water', 'Dish soap (optional)'],
      notes: 'Rinse under running water to remove dust and debris. Use a drop of dish soap for outdoor plants.',
    },
    {
      step: 2,
      action: 'Trim explant',
      duration: '2-3 minutes',
      materials: ['Clean scissors or scalpel'],
      notes: `Trim to 2-3 cm pieces. Remove damaged tissue. For ${input.explantType} tissue, use gentle handling.`,
    },
    {
      step: 3,
      action: 'Ethanol dip',
      duration: `${ethanolSeconds} seconds`,
      materials: ['70% isopropyl alcohol', 'Small beaker or cup'],
      notes: `Submerge in 70% ethanol for exactly ${ethanolSeconds} seconds. Swirl gently. ${ethanolSeconds > 45 ? 'Woody tissue can tolerate longer ethanol exposure.' : 'Soft tissue — do not exceed this time.'}`,
    },
    {
      step: 4,
      action: 'Bleach soak',
      duration: `${soakMinutes} minutes`,
      materials: [
        `Bleach solution: ${bleachDilution}`,
        ...(input.useTween ? ['1-2 drops Tween-20 or dish soap per 100 mL'] : []),
        'Timer',
      ],
      notes: `Soak in ${(targetNaOClPercent * 100).toFixed(0)}% NaOCl (=${bleachDilution}) for ${soakMinutes} minutes. Swirl gently every 2-3 minutes.${input.useTween ? ' Tween improves surface wetting for better sterilization.' : ''}`,
    },
    ...Array.from({ length: rinseCount }, (_, i) => ({
      step: 5 + i,
      action: `Sterile rinse ${i + 1}`,
      duration: '1-2 minutes',
      materials: ['Sterile (autoclaved) distilled water'],
      notes: i === 0 ? 'Transfer to sterile water inside the SAB. Swirl gently.' : `Rinse ${i + 1} of ${rinseCount}. Transfer to fresh sterile water.`,
    })),
  ];

  const totalTime = 5 + 3 + Math.ceil(ethanolSeconds / 60) + soakMinutes + rinseCount * 2;

  if (input.explantType === 'hairy') {
    warnings.push('Hairy tissue is difficult to sterilize. Consider removing excess hairs/trichomes before sterilization.');
  }

  // Generate SOP text
  const sopLines = [
    `STERILIZATION PROTOCOL — ${input.explantDescription || input.explantType + ' tissue'}`,
    `${'='.repeat(60)}`,
    '',
    `Bleach solution: ${bleachDilution}`,
    `Final NaOCl: ${(targetNaOClPercent * 100).toFixed(1)}%`,
    `Total time: ~${totalTime} minutes`,
    '',
    ...steps.map((s) => `Step ${s.step}: ${s.action} (${s.duration})\n  ${s.notes}\n  Materials: ${s.materials.join(', ')}\n`),
    ...(warnings.length > 0 ? ['\nWARNINGS:', ...warnings.map((w) => `  - ${w}`)] : []),
  ];

  return {
    bleachDilution,
    finalNaOClPercent: targetNaOClPercent,
    ethanolDipSeconds: ethanolSeconds,
    bleachSoakMinutes: soakMinutes,
    rinseCount,
    steps,
    warnings,
    sop: sopLines.join('\n'),
  };
}

/**
 * Calculate autoclave parameters based on load.
 * @param input - Media volume, vessel count, and load contents
 * @returns Autoclave settings and step-by-step instructions
 */
export function calculateAutoclave(input: AutoclaveInput): AutoclaveResult {
  const totalMediaMl = input.mediaVolumeMl * input.vesselCount;
  const warnings: string[] = [];

  // Time depends on total volume
  let timeMinutes: number;
  if (totalMediaMl <= 1000) timeMinutes = 15;
  else if (totalMediaMl <= 2000) timeMinutes = 20;
  else if (totalMediaMl <= 4000) timeMinutes = 30;
  else {
    timeMinutes = 40;
    warnings.push('Large load (>4L). Ensure your autoclave can fit all vessels with space between them.');
  }

  if (input.includeTools) timeMinutes = Math.max(timeMinutes, 20);
  if (input.includeWater) timeMinutes = Math.max(timeMinutes, 15);

  const cooldownMinutes = totalMediaMl <= 2000 ? 30 : 45;

  const loadItems: string[] = [];
  loadItems.push(`${input.vesselCount} ${input.vesselType}s with ${input.mediaVolumeMl} mL media each (${totalMediaMl} mL total)`);
  if (input.includeWater) loadItems.push('Sterile water for rinsing (in separate vessel)');
  if (input.includeTools) loadItems.push('Wrapped tools (scalpel, forceps) in aluminum foil');

  const steps = [
    `Add 5-8 cm (2-3 inches) of water to the bottom of the pressure cooker.`,
    `Place trivet/rack in bottom to keep vessels off the direct heat.`,
    `Load ${input.vesselCount} ${input.vesselType}s onto rack. Leave space between vessels for steam circulation.`,
    `Ensure all lids are LOOSENED (not tight). Cover tops with aluminum foil.`,
    ...(input.includeTools ? ['Place foil-wrapped tools alongside vessels.'] : []),
    ...(input.includeWater ? ['Place water container with loose lid next to media vessels.'] : []),
    `Close and lock pressure cooker lid per manufacturer instructions.`,
    `Heat on high. When steam vents continuously, let it vent for 1-2 minutes to purge air.`,
    `Close vent (place weight/rocker). Wait for pressure to reach 15 psi.`,
    `Reduce heat to maintain gentle rocking (1-4 rocks/minute). Start timer: ${timeMinutes} minutes.`,
    `After ${timeMinutes} minutes, turn off heat. Allow natural depressurization (~${cooldownMinutes} min).`,
    `Once pressure is zero, carefully open lid directing steam away from face.`,
    `Using heat-resistant gloves, remove vessels. Place on clean, heat-resistant surface.`,
    `Let cool to room temperature before tightening lids and storing.`,
  ];

  if (input.vesselType === 'tube' && input.vesselCount > 20) {
    warnings.push('Many small tubes: use a rack to keep them organized and prevent tipping.');
  }

  return {
    temperatureC: 121,
    pressurePsi: 15,
    timeMinutes,
    cooldownMinutes,
    loadDescription: loadItems.join('; '),
    steps,
    warnings,
  };
}

/**
 * Get a pre-built SOP by name.
 * @param name - SOP identifier
 * @returns Complete SOP document
 */
export function getSOP(name: SOPName): SOPDocument {
  return SOPS[name];
}

/**
 * Get all available SOP names and titles.
 * @returns Array of { id, title } for all SOPs
 */
export function getAllSOPs(): readonly { id: SOPName; title: string }[] {
  return (Object.entries(SOPS) as [SOPName, SOPDocument][]).map(([id, sop]) => ({
    id,
    title: sop.title,
  }));
}

/**
 * Generate a formatted SOP document as plain text.
 * @param name - SOP identifier
 * @param format - 'text' for narrative or 'checklist' for printable checklist
 * @returns Formatted SOP string
 */
export function formatSOP(name: SOPName, format: SOPFormat = 'text'): string {
  const sop = SOPS[name];
  const lines: string[] = [];

  lines.push(sop.title);
  lines.push('='.repeat(sop.title.length));
  lines.push(`Version: ${sop.version}`);
  lines.push('');
  lines.push(`PURPOSE: ${sop.purpose}`);
  lines.push('');

  lines.push('MATERIALS:');
  sop.materials.forEach((m) => lines.push(`  ${format === 'checklist' ? '[ ] ' : '- '}${m}`));
  lines.push('');

  if (sop.ppe.length > 0) {
    lines.push('PPE REQUIRED:');
    sop.ppe.forEach((p) => lines.push(`  ${format === 'checklist' ? '[ ] ' : '- '}${p}`));
    lines.push('');
  }

  lines.push('PROCEDURE:');
  sop.steps.forEach((s) => {
    if (format === 'checklist') {
      lines.push(`  [ ] Step ${s.step}: ${s.action}`);
      lines.push(`      ${s.details}`);
      if (s.criticalPoint) lines.push(`      ** CRITICAL: ${s.criticalPoint}`);
    } else {
      lines.push(`  Step ${s.step}: ${s.action}`);
      lines.push(`    ${s.details}`);
      if (s.criticalPoint) lines.push(`    CRITICAL POINT: ${s.criticalPoint}`);
    }
    lines.push('');
  });

  lines.push('QUALITY CHECKS:');
  sop.qualityChecks.forEach((q) => lines.push(`  ${format === 'checklist' ? '[ ] ' : '- '}${q}`));
  lines.push('');

  lines.push('TROUBLESHOOTING:');
  sop.troubleshooting.forEach((t) => lines.push(`  - ${t}`));

  return lines.join('\n');
}
