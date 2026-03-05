/**
 * Tissue Culture Walkthrough Guide — beginner-friendly protocols,
 * equipment lists, sterilization steps, and troubleshooting.
 * Written so a high school student can follow along.
 */

// ── Types ────────────────────────────────────────

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type CultureStage = 'initiation' | 'multiplication' | 'rooting' | 'acclimatization';

export interface EquipmentItem {
  readonly name: string;
  readonly purpose: string;
  readonly budget: 'essential' | 'recommended' | 'optional';
  readonly diyAlternative?: string;
  readonly estimatedCostUsd: { readonly min: number; readonly max: number };
}

export interface SterilizationStep {
  readonly step: number;
  readonly action: string;
  readonly details: string;
  readonly durationMinutes: number;
  readonly warnings?: readonly string[];
}

export interface SterilizationProtocol {
  readonly name: string;
  readonly steps: readonly SterilizationStep[];
  readonly totalTimeMinutes: number;
  readonly notes: readonly string[];
}

export interface BeginnerPlant {
  readonly name: string;
  readonly scientificName: string;
  readonly difficulty: DifficultyLevel;
  readonly explantType: string;
  readonly mediaRecommendation: string;
  readonly growthRegulators: readonly { readonly id: string; readonly mgPerLiter: number; readonly purpose: string }[];
  readonly successRate: string;
  readonly timeToShootsWeeks: number;
  readonly timeToRootsWeeks: number;
  readonly tips: readonly string[];
}

export interface WalkthroughStep {
  readonly stage: CultureStage;
  readonly stepNumber: number;
  readonly title: string;
  readonly instruction: string;
  readonly details: string;
  readonly safetyNote?: string;
  readonly commonMistake?: string;
  readonly timeEstimate?: string;
}

export interface TroubleshootingEntry {
  readonly problem: string;
  readonly symptoms: readonly string[];
  readonly causes: readonly string[];
  readonly solutions: readonly string[];
  readonly prevention: string;
}

export interface StockSolutionGuide {
  readonly name: string;
  readonly concentration: string;
  readonly components: readonly { readonly chemical: string; readonly gramsPerLiter: number }[];
  readonly storageTemp: string;
  readonly shelfLife: string;
  readonly notes: string;
}

// ── Equipment Database ───────────────────────────

const EQUIPMENT: readonly EquipmentItem[] = [
  {
    name: 'Still Air Box (SAB)',
    purpose: 'Provides a clean workspace for transfers. The cheapest way to work sterile.',
    budget: 'essential',
    diyAlternative: 'Clear plastic storage tub ($8-15) with two arm holes cut in one side. Wipe inside with 70% isopropyl alcohol before each use.',
    estimatedCostUsd: { min: 8, max: 25 },
  },
  {
    name: 'Pressure Cooker / Autoclave',
    purpose: 'Sterilizes media, tools, and water at 121C (15 psi) to kill all microorganisms.',
    budget: 'essential',
    diyAlternative: 'A standard kitchen pressure cooker (15 psi capable) works. Presto 23-quart is popular. Must reach 15 psi — Instant Pots do NOT reach 15 psi and are not sufficient.',
    estimatedCostUsd: { min: 40, max: 120 },
  },
  {
    name: 'Glass Jars with Lids',
    purpose: 'Culture vessels where your plants grow. Baby food jars, mason jars, or recycled jam jars all work.',
    budget: 'essential',
    diyAlternative: 'Recycled glass jars with plastic lids. Poke a small hole in lid and cover with micropore tape for gas exchange.',
    estimatedCostUsd: { min: 5, max: 20 },
  },
  {
    name: 'Scalpel + Forceps',
    purpose: 'Precision cutting and handling of plant tissue. Must be flame-sterilized between cuts.',
    budget: 'essential',
    estimatedCostUsd: { min: 5, max: 15 },
  },
  {
    name: 'Alcohol Lamp or Butane Torch',
    purpose: 'Flame-sterilize metal tools between cuts. Essential to prevent cross-contamination.',
    budget: 'essential',
    diyAlternative: 'A cheap butane kitchen torch ($8) or even a candle in a pinch (though a torch is much better).',
    estimatedCostUsd: { min: 8, max: 25 },
  },
  {
    name: '70% Isopropyl Alcohol',
    purpose: 'Surface disinfectant for hands, work area, and outside of vessels. 70% is more effective than 90%.',
    budget: 'essential',
    estimatedCostUsd: { min: 3, max: 8 },
  },
  {
    name: 'Bleach (Sodium Hypochlorite)',
    purpose: 'Primary sterilizing agent for plant explants. Household bleach (5-6% NaOCl) diluted to 10-20%.',
    budget: 'essential',
    estimatedCostUsd: { min: 2, max: 5 },
  },
  {
    name: 'Distilled Water',
    purpose: 'For making media and rinsing explants. Tap water has minerals and chlorine that interfere.',
    budget: 'essential',
    diyAlternative: 'Grocery store distilled water ($1/gallon) works fine. Do not use "purified" or "spring" water.',
    estimatedCostUsd: { min: 1, max: 5 },
  },
  {
    name: 'pH Test Strips or Meter',
    purpose: 'Media pH must be 5.6-5.8 before autoclaving. pH changes what nutrients the plant can absorb.',
    budget: 'essential',
    diyAlternative: 'pH test strips ($5-10 for 100) are accurate enough for beginners. A digital pH meter ($15-30) is more precise.',
    estimatedCostUsd: { min: 5, max: 30 },
  },
  {
    name: 'Digital Scale (0.01g)',
    purpose: 'Weighing media components, sucrose, agar. Precision matters for micronutrients.',
    budget: 'essential',
    estimatedCostUsd: { min: 10, max: 30 },
  },
  {
    name: 'MS Premix Powder',
    purpose: 'Pre-mixed Murashige & Skoog basal salts. Much easier than weighing 19 individual chemicals.',
    budget: 'recommended',
    estimatedCostUsd: { min: 15, max: 40 },
  },
  {
    name: 'Agar Powder',
    purpose: 'Gelling agent that solidifies the media so explants sit on top. Plant-grade or food-grade both work.',
    budget: 'essential',
    estimatedCostUsd: { min: 8, max: 20 },
  },
  {
    name: 'Sucrose (Table Sugar)',
    purpose: 'Carbon/energy source for the plant. Regular white granulated sugar works — plants cannot photosynthesize well in vitro.',
    budget: 'essential',
    diyAlternative: 'Regular grocery store white sugar. Do NOT use brown sugar, honey, or artificial sweeteners.',
    estimatedCostUsd: { min: 2, max: 5 },
  },
  {
    name: 'Micropore Tape',
    purpose: 'Covers vent holes in jar lids. Allows gas exchange while blocking contaminants.',
    budget: 'recommended',
    diyAlternative: '3M Micropore medical tape from any pharmacy. Surgical tape also works.',
    estimatedCostUsd: { min: 3, max: 8 },
  },
  {
    name: 'Grow Light',
    purpose: 'Provides consistent 16h/8h light cycle for cultures. Plants need light to develop normally.',
    budget: 'recommended',
    diyAlternative: 'A bright windowsill with indirect light works for many species. A $15 LED shop light is better.',
    estimatedCostUsd: { min: 15, max: 50 },
  },
  {
    name: 'Laminar Flow Hood',
    purpose: 'Professional-grade sterile workspace with HEPA-filtered air. Dramatically reduces contamination.',
    budget: 'optional',
    diyAlternative: 'A still air box is sufficient for beginners. DIY flow hoods can be built for $50-100 with a HEPA filter and fan.',
    estimatedCostUsd: { min: 50, max: 2000 },
  },
  {
    name: 'NaOH and HCl Solutions',
    purpose: 'For adjusting media pH. 1N NaOH raises pH, 1N HCl lowers it.',
    budget: 'recommended',
    diyAlternative: 'Baking soda solution (NaHCO3) can substitute for NaOH in a pinch. White vinegar can substitute for HCl.',
    estimatedCostUsd: { min: 5, max: 15 },
  },
  {
    name: 'Parafilm',
    purpose: 'Seals culture vessels to prevent contamination while allowing minimal gas exchange.',
    budget: 'optional',
    estimatedCostUsd: { min: 8, max: 20 },
  },
];

// ── Beginner Plants ──────────────────────────────

const BEGINNER_PLANTS: readonly BeginnerPlant[] = [
  {
    name: 'African Violet',
    scientificName: 'Saintpaulia ionantha',
    difficulty: 'beginner',
    explantType: 'Leaf section (1-2 cm piece including midrib)',
    mediaRecommendation: 'Full-strength MS + 30g/L sucrose + 8g/L agar, pH 5.8',
    growthRegulators: [
      { id: 'bap', mgPerLiter: 1.0, purpose: 'Promotes shoot multiplication from leaf tissue' },
      { id: 'naa', mgPerLiter: 0.1, purpose: 'Low auxin helps adventitious shoot formation' },
    ],
    successRate: '80-90% for clean explants',
    timeToShootsWeeks: 4,
    timeToRootsWeeks: 3,
    tips: [
      'Use young, healthy leaves from the middle ring of the plant — not the oldest or newest.',
      'Cut leaf into 1 cm squares including a piece of the midrib vein.',
      'Place cut side down on the media surface.',
      'Shoots will form at the cut edges in 3-6 weeks.',
      'Once shoots are 1-2 cm, transfer to rooting media (half-strength MS + 0.5 mg/L NAA).',
    ],
  },
  {
    name: 'Pothos',
    scientificName: 'Epipremnum aureum',
    difficulty: 'beginner',
    explantType: 'Nodal segment (stem piece with one node/aerial root bump)',
    mediaRecommendation: 'Full-strength MS + 30g/L sucrose + 8g/L agar, pH 5.8',
    growthRegulators: [
      { id: 'bap', mgPerLiter: 0.5, purpose: 'Encourages axillary bud break and shoot growth' },
    ],
    successRate: '85-95% — very forgiving',
    timeToShootsWeeks: 2,
    timeToRootsWeeks: 2,
    tips: [
      'Pothos is extremely forgiving — great first tissue culture project.',
      'Use stem segments with a visible node (the bump where a leaf attaches).',
      'The node contains axillary buds that will grow into new shoots.',
      'Roots often form spontaneously without extra auxin.',
      'Can skip rooting media entirely — transfer directly to soil once shoots are 3 cm.',
    ],
  },
  {
    name: 'Mint',
    scientificName: 'Mentha spp.',
    difficulty: 'beginner',
    explantType: 'Shoot tip or nodal segment (2-3 cm)',
    mediaRecommendation: 'Full-strength MS + 30g/L sucrose + 8g/L agar, pH 5.8',
    growthRegulators: [
      { id: 'bap', mgPerLiter: 1.0, purpose: 'Promotes multiple shoot formation' },
      { id: 'naa', mgPerLiter: 0.1, purpose: 'Supports balanced growth' },
    ],
    successRate: '75-85%',
    timeToShootsWeeks: 2,
    timeToRootsWeeks: 2,
    tips: [
      'Mint grows aggressively in culture — expect rapid multiplication.',
      'Use shoot tips from actively growing stems for best results.',
      'Sterilization can be tricky due to hairy stems — use slightly longer bleach soak (15 min).',
      'Roots easily on hormone-free half-strength MS.',
      'Acclimatization is easy — mint adapts quickly to soil.',
    ],
  },
  {
    name: 'Strawberry',
    scientificName: 'Fragaria x ananassa',
    difficulty: 'beginner',
    explantType: 'Runner tip or crown meristem',
    mediaRecommendation: 'Full-strength MS + 30g/L sucrose + 7g/L agar, pH 5.7',
    growthRegulators: [
      { id: 'bap', mgPerLiter: 0.5, purpose: 'Shoot multiplication from meristem' },
      { id: 'iba', mgPerLiter: 0.1, purpose: 'Supports root initiation' },
    ],
    successRate: '70-80%',
    timeToShootsWeeks: 4,
    timeToRootsWeeks: 4,
    tips: [
      'Runner tips are the easiest explant — they are already juvenile tissue.',
      'Sterilize carefully: runners often carry soil bacteria.',
      'Use a 2-step bleach treatment: 10% bleach for 10 min, then fresh 10% for 5 min.',
      'Multiplication rate of 3-5x per subculture cycle.',
      'Root on half-strength MS with 1 mg/L IBA.',
    ],
  },
  {
    name: 'Philodendron',
    scientificName: 'Philodendron spp.',
    difficulty: 'beginner',
    explantType: 'Nodal segment or shoot tip',
    mediaRecommendation: 'Full-strength MS + 30g/L sucrose + 8g/L agar, pH 5.8',
    growthRegulators: [
      { id: 'bap', mgPerLiter: 2.0, purpose: 'Strong cytokinin push for shoot proliferation' },
      { id: 'naa', mgPerLiter: 0.2, purpose: 'Balances auxin:cytokinin ratio' },
    ],
    successRate: '75-85%',
    timeToShootsWeeks: 4,
    timeToRootsWeeks: 4,
    tips: [
      'Popular for tissue culture because of high value and easy multiplication.',
      'Use nodal segments from healthy, pest-free mother plants.',
      'Higher BAP (2-3 mg/L) gives more shoots per explant.',
      'Some species produce phenolic browning — add activated charcoal (2 g/L) if tissue turns brown.',
      'Root on half-strength MS with 0.5 mg/L NAA.',
    ],
  },
  {
    name: 'Banana',
    scientificName: 'Musa spp.',
    difficulty: 'intermediate',
    explantType: 'Shoot tip from sucker (sword sucker preferred)',
    mediaRecommendation: 'Full-strength MS + 30g/L sucrose + 8g/L agar + 100mg/L ascorbic acid, pH 5.8',
    growthRegulators: [
      { id: 'bap', mgPerLiter: 5.0, purpose: 'High cytokinin needed for banana shoot multiplication' },
      { id: 'iaa', mgPerLiter: 1.0, purpose: 'Balanced auxin supports healthy growth' },
    ],
    successRate: '65-80% (sterilization is the hard part)',
    timeToShootsWeeks: 6,
    timeToRootsWeeks: 4,
    tips: [
      'Commercial tissue culture crop — over 1 billion banana TC plants produced yearly.',
      'Sterilization is the biggest challenge: banana suckers carry many endophytic bacteria.',
      'Peel back outer layers to expose the white inner shoot tip.',
      'Aggressive sterilization: 20% bleach for 20 min after ethanol wash.',
      'Expect browning — include ascorbic acid (100 mg/L) and subculture to fresh media frequently.',
      'Roots easily on half-strength MS without growth regulators.',
    ],
  },
  {
    name: 'Orchid (Phalaenopsis)',
    scientificName: 'Phalaenopsis spp.',
    difficulty: 'intermediate',
    explantType: 'Flower stem node or seed pod (asymbiotic germination)',
    mediaRecommendation: 'Half-strength MS + 20g/L sucrose + 7g/L agar + 1g/L activated charcoal, pH 5.6',
    growthRegulators: [
      { id: 'bap', mgPerLiter: 2.0, purpose: 'Node activation and protocorm-like body formation' },
      { id: 'naa', mgPerLiter: 0.5, purpose: 'Supports PLB development' },
    ],
    successRate: '50-70% (contamination and slow growth are challenges)',
    timeToShootsWeeks: 12,
    timeToRootsWeeks: 8,
    tips: [
      'Orchids are a classic tissue culture subject — this is how most commercial orchids are produced.',
      'Seed germination in vitro is the most rewarding method (thousands of seedlings from one pod).',
      'Flower stalk nodes can produce keikis (baby plants) when cultured with BAP.',
      'Growth is SLOW — expect months, not weeks. Patience is essential.',
      'Keep cultures in low light (1000-2000 lux) initially.',
      'Activated charcoal absorbs toxic phenolics but also absorbs some growth regulators.',
    ],
  },
  {
    name: 'Potato',
    scientificName: 'Solanum tuberosum',
    difficulty: 'beginner',
    explantType: 'Nodal segment from sprout or stem',
    mediaRecommendation: 'Full-strength MS + 30g/L sucrose + 8g/L agar, pH 5.8',
    growthRegulators: [],
    successRate: '90-95% — extremely easy',
    timeToShootsWeeks: 2,
    timeToRootsWeeks: 1,
    tips: [
      'Potato is probably the EASIEST plant to tissue culture — great for absolute beginners.',
      'Use nodal segments from sprouts growing on a potato.',
      'No growth regulators needed at all — potato nodes grow shoots and roots on plain MS media.',
      'Each node produces a new plantlet in 1-2 weeks.',
      'Multiplication is simply cutting the new plant into nodal segments and reculturing.',
      'Used worldwide for virus-free seed potato production.',
    ],
  },
];

// ── Walkthrough Steps ────────────────────────────

const WALKTHROUGH: readonly WalkthroughStep[] = [
  // Stage 0: Preparation (before initiation)
  {
    stage: 'initiation',
    stepNumber: 1,
    title: 'Prepare Your Workspace',
    instruction: 'Set up your still air box or laminar flow hood. Clean everything.',
    details: 'Wipe the inside of your still air box with 70% isopropyl alcohol. Let it dry for 5 minutes. Place your alcohol lamp/torch, scalpel, forceps, sterile petri dish, and bleach solution inside the box. Everything that goes inside the box should be wiped with alcohol first.',
    safetyNote: 'Work in a draft-free room. Turn off fans and close windows. Even tiny air currents carry contaminant spores.',
    commonMistake: 'Not cleaning the SAB properly, or opening it during transfers. Every time you reach in, you introduce contaminants.',
    timeEstimate: '10-15 minutes',
  },
  {
    stage: 'initiation',
    stepNumber: 2,
    title: 'Prepare Culture Media',
    instruction: 'Mix MS salts, sucrose, and agar in distilled water. Adjust pH to 5.8. Autoclave.',
    details: 'For 1 liter: dissolve 4.43g MS premix powder in 800mL distilled water while stirring. Add 30g sucrose (regular white sugar) and stir until dissolved. Adjust pH to 5.8 using drops of 1N NaOH (if too low) or 1N HCl (if too high). Add 8g agar and bring volume to 1000mL. Heat gently while stirring until agar dissolves (solution turns from cloudy to clear). Pour into glass jars (fill 1/3 to 1/2 full). Loosely cap with aluminum foil. Autoclave at 121C / 15 psi for 15-20 minutes.',
    safetyNote: 'The pressure cooker is the most dangerous equipment. NEVER open it while pressurized. Let it depressurize naturally (30+ minutes). Use oven mitts — jars will be extremely hot.',
    commonMistake: 'Adding agar before adjusting pH. Agar gels around pH 4-5 during cooling, making pH adjustment impossible. Always adjust pH BEFORE adding agar.',
    timeEstimate: '45-60 minutes (plus 30 min cooling)',
  },
  {
    stage: 'initiation',
    stepNumber: 3,
    title: 'Select and Prepare Your Explant',
    instruction: 'Choose healthy plant material. Clean it thoroughly before sterilization.',
    details: 'Pick young, actively growing tissue from a healthy, pest-free mother plant. Rinse under running tap water for 5 minutes to remove dust and loose debris. If the plant has been outside, wash with a drop of dish soap, then rinse well. Trim to roughly 2-3 cm pieces.',
    commonMistake: 'Using old, woody, or stressed plant tissue. Young tissue is more responsive and regenerates faster. Avoid tissue with insect damage, disease spots, or yellowing.',
    timeEstimate: '10-15 minutes',
  },
  {
    stage: 'initiation',
    stepNumber: 4,
    title: 'Surface Sterilize the Explant',
    instruction: 'Dip in ethanol, then soak in dilute bleach, then rinse with sterile water.',
    details: 'Step 1: Dip in 70% ethanol for 30-60 seconds (kills surface bacteria). Step 2: Transfer to 10-20% household bleach (0.5-1% NaOCl) for 10-15 minutes. Gently swirl every 2-3 minutes. Adding 1-2 drops of Tween-20 or dish soap helps the bleach wet the surface. Step 3: Rinse 3 times with sterile distilled water (autoclaved). Each rinse should be at least 1 minute with gentle swirling.',
    safetyNote: 'Do all transfers inside the SAB. The sterile water must be autoclaved beforehand — regular distilled water is NOT sterile.',
    commonMistake: 'Too much bleach or too long = dead tissue. Too little bleach or too short = contamination. Start with 10% for 10 min and adjust based on results.',
    timeEstimate: '20-25 minutes',
  },
  {
    stage: 'initiation',
    stepNumber: 5,
    title: 'Transfer Explant to Media',
    instruction: 'Inside the SAB, trim the explant to final size and place on media surface.',
    details: 'Flame-sterilize your scalpel and forceps (hold in flame for 5-10 seconds, let cool for 10 seconds). Pick up the rinsed explant with forceps. On a sterile surface (petri dish or foil), trim away any bleach-damaged edges (they will look translucent/white). Cut to final size: 1-2 cm for leaf pieces, 2-3 cm for stem segments. Place cut-side down on the media surface. Do NOT push the explant into the media — just set it on top. Recap the jar immediately.',
    safetyNote: 'Re-flame your tools between EVERY cut. This is non-negotiable — one contaminated cut infects the whole jar.',
    commonMistake: 'Touching the inside of the jar lid, or leaving jars open too long. Speed matters: the less time the jar is open, the less chance of contamination.',
    timeEstimate: '5-10 minutes per jar',
  },
  {
    stage: 'initiation',
    stepNumber: 6,
    title: 'Label and Incubate',
    instruction: 'Label each jar with species, date, and media type. Place under grow lights.',
    details: 'Use a permanent marker or label tape to write: plant name, date, media type, and any growth regulators used. Place jars on a shelf with grow lights set to 16 hours on / 8 hours off. Room temperature (22-25C / 72-77F) is ideal. Do NOT place in direct sunlight — it will overheat the jars and cook your cultures. Check daily for the first week for signs of contamination.',
    commonMistake: 'Forgetting to label jars. After 2 weeks, you will not remember what is in each jar. Label immediately.',
    timeEstimate: '5 minutes',
  },
  // Multiplication stage
  {
    stage: 'multiplication',
    stepNumber: 7,
    title: 'Monitor for Contamination (Week 1-2)',
    instruction: 'Check cultures daily. Remove any contaminated jars immediately.',
    details: 'Bacterial contamination: cloudy, slimy film on media surface — usually appears in 2-5 days. Fungal contamination: fuzzy, cotton-like growth (white, green, or black) — usually appears in 3-7 days. If you see contamination, do NOT open the jar. Seal it in a plastic bag, autoclave it, then discard. Contamination spreads via airborne spores — one open contaminated jar can infect your entire collection.',
    commonMistake: 'Trying to "save" a contaminated culture by cutting away the clean part. This rarely works and risks spreading contamination.',
    timeEstimate: '2 minutes per day',
  },
  {
    stage: 'multiplication',
    stepNumber: 8,
    title: 'Subculture for Multiplication',
    instruction: 'Once shoots form, divide them and transfer to fresh media to multiply.',
    details: 'After 3-6 weeks (species-dependent), you should see new shoots growing from your explant. When shoots reach 1-2 cm, it is time to subculture. Prepare fresh media with the same formulation. Inside the SAB, open the jar, remove the clump of shoots with sterile forceps, and separate individual shoots or small clumps (2-3 shoots each) with a sterile scalpel. Transfer each piece to a fresh jar of media. Each subculture cycle multiplies your plants by 3-10x.',
    commonMistake: 'Waiting too long to subculture — shoots exhaust the media and growth slows. Also: cutting shoots too small (<0.5 cm) reduces survival rate.',
    timeEstimate: '30-45 minutes for a batch of 10 jars',
  },
  // Rooting stage
  {
    stage: 'rooting',
    stepNumber: 9,
    title: 'Transfer to Rooting Media',
    instruction: 'Move healthy shoots to rooting media with auxin to initiate root formation.',
    details: 'Once shoots are 2-4 cm tall with at least 2-3 leaves, transfer to rooting media. Rooting media is typically half-strength MS (2.21g/L MS premix instead of 4.43g/L) with 15g/L sucrose, 8g/L agar, and an auxin like NAA (0.5 mg/L) or IBA (1.0 mg/L). Some easy species (potato, pothos) root on plain half-strength MS without any hormones. Roots should appear in 1-4 weeks depending on species.',
    commonMistake: 'Using full-strength cytokinin media for rooting. Cytokinins INHIBIT root formation. You need auxin for roots, cytokinin for shoots.',
    timeEstimate: '20-30 minutes',
  },
  // Acclimatization stage
  {
    stage: 'acclimatization',
    stepNumber: 10,
    title: 'Acclimatize to Soil (Hardening Off)',
    instruction: 'Gradually transition rooted plantlets from the jar to the real world.',
    details: 'This is the most critical stage — in vitro plants have never experienced dry air, soil microbes, or fluctuating temperatures. Step 1: Open the jar lid slightly for 2-3 days to let the plant start adjusting to lower humidity. Step 2: Gently remove the plantlet and wash ALL agar off the roots under lukewarm running water (agar in soil causes fungal rot). Step 3: Plant in a sterile, well-draining potting mix (perlite + peat 1:1 works well). Step 4: Cover with a clear plastic bag or dome to maintain humidity (~80%). Step 5: Over 7-14 days, gradually open the bag/dome more each day to reduce humidity. Step 6: Once the plant is growing new leaves in open air, it has successfully acclimatized.',
    safetyNote: 'Do not skip the humidity dome step. Plants from tissue culture have no waxy cuticle on their leaves (it develops in response to dry air). Without a dome, they will wilt and die within hours.',
    commonMistake: 'Removing the humidity dome too quickly. This is the #1 killer of tissue culture plants. Take at least 7-10 days to transition.',
    timeEstimate: '7-14 days total (5 min/day)',
  },
];

// ── Troubleshooting Database ─────────────────────

const TROUBLESHOOTING: readonly TroubleshootingEntry[] = [
  {
    problem: 'Bacterial Contamination',
    symptoms: [
      'Cloudy or milky appearance in the media',
      'Slimy film on media surface or around the explant',
      'Foul smell when jar is opened',
      'Usually appears within 2-5 days of culture',
    ],
    causes: [
      'Inadequate surface sterilization of the explant',
      'Non-sterile tools, water, or media',
      'Endophytic bacteria living inside the plant tissue (hardest to prevent)',
      'Opening jars outside the SAB or for too long',
    ],
    solutions: [
      'Discard contaminated cultures immediately (autoclave before disposing)',
      'Increase bleach concentration to 15-20% or soak time to 15 minutes',
      'Add 2 drops of Tween-20 to bleach solution for better surface penetration',
      'For persistent endophytes: add antibiotics to media (not recommended for beginners)',
    ],
    prevention: 'Proper surface sterilization, sterile technique, and working inside a clean SAB. Always flame tools between cuts.',
  },
  {
    problem: 'Fungal Contamination',
    symptoms: [
      'Fuzzy or cottony growth on media surface (white, green, black, or orange)',
      'Spreading hyphal threads visible on the media',
      'Usually appears within 3-7 days',
      'Can spread to neighboring jars via airborne spores',
    ],
    causes: [
      'Airborne fungal spores entering during transfer',
      'Contaminated work area or tools',
      'Mother plant was harboring fungal pathogens',
      'Jar seals not tight enough',
    ],
    solutions: [
      'Seal and autoclave contaminated jars immediately',
      'Improve SAB cleaning — wipe with 70% alcohol AND let dry completely',
      'Work more quickly during transfers to minimize open-jar time',
      'Use parafilm or micropore tape to improve jar seals',
    ],
    prevention: 'Work in a thoroughly cleaned SAB, keep jar lids on as much as possible, and check jar seals. Clean the mother plant before taking explants.',
  },
  {
    problem: 'Tissue Browning (Oxidation)',
    symptoms: [
      'Explant tissue turns brown or black within days',
      'Brown coloring leaches into the surrounding media',
      'Tissue becomes soft and dies',
    ],
    causes: [
      'Phenolic compounds released from cut surfaces (a wound response)',
      'More common in woody plants, some tropical species, and mature tissue',
      'Excessive light exposure on fresh cultures',
    ],
    solutions: [
      'Add activated charcoal (1-2 g/L) to the media — it absorbs toxic phenolics',
      'Add antioxidants: ascorbic acid (100 mg/L) or citric acid (150 mg/L) to the media',
      'Subculture to fresh media every 5-7 days until browning stops',
      'Keep new cultures in darkness for 2-3 days after initiation',
    ],
    prevention: 'Use young, actively growing tissue. Make clean, sharp cuts (dull tools crush cells). Pre-soak explants in antioxidant solution before placing on media.',
  },
  {
    problem: 'Vitrification (Hyperhydricity)',
    symptoms: [
      'Shoots appear glassy, translucent, or water-soaked',
      'Leaves are thick, brittle, and abnormally shaped',
      'Plants are fragile and break easily',
      'Poor survival during acclimatization',
    ],
    causes: [
      'Excess cytokinin concentration',
      'Too much humidity in the jar (poor gas exchange)',
      'Liquid media or very soft gel',
      'Excessive subculture cycles',
    ],
    solutions: [
      'Reduce cytokinin concentration by 50%',
      'Increase agar concentration (try 10 g/L instead of 8 g/L)',
      'Improve ventilation: larger holes in lid covered with micropore tape',
      'Add 1-2 g/L activated charcoal',
    ],
    prevention: 'Use the minimum effective cytokinin concentration. Ensure good gas exchange through lid venting. Do not subculture the same line indefinitely.',
  },
  {
    problem: 'No Shoot Growth',
    symptoms: [
      'Explant remains alive but does not produce new shoots',
      'Tissue stays green but static for 4+ weeks',
      'Explant forms callus (undifferentiated cell mass) instead of shoots',
    ],
    causes: [
      'Insufficient or wrong type of cytokinin',
      'Wrong auxin:cytokinin ratio (too much auxin favors callus/roots)',
      'Explant too old or taken from wrong part of plant',
      'Media pH incorrect (should be 5.6-5.8)',
    ],
    solutions: [
      'Increase BAP concentration by 0.5-1.0 mg/L',
      'Try a different cytokinin (TDZ is more potent than BAP)',
      'Reduce or eliminate auxin from multiplication media',
      'Use younger explants from actively growing parts of the plant',
      'Verify pH — if too high or low, nutrients become unavailable',
    ],
    prevention: 'Start with published protocols for your species. Keep the auxin:cytokinin ratio favoring cytokinin for shoot induction.',
  },
  {
    problem: 'No Root Formation',
    symptoms: [
      'Shoots are healthy but fail to produce roots after 3-4 weeks on rooting media',
      'Base of shoots remains white without root initials',
    ],
    causes: [
      'Residual cytokinin from multiplication media inhibiting root formation',
      'Insufficient auxin in rooting media',
      'Shoots are too small or juvenility is lost',
    ],
    solutions: [
      'Culture on hormone-free media for 1-2 weeks before rooting (cytokinin wash-out)',
      'Increase auxin (try IBA at 1-2 mg/L or NAA at 0.5-1.0 mg/L)',
      'Use half-strength MS media for rooting (lower salts promote rooting)',
      'Try a quick auxin dip: soak shoot bases in 100 mg/L IBA for 5 minutes, then transfer to hormone-free media',
    ],
    prevention: 'Use half-strength media for rooting. Allow shoots to grow to at least 2 cm before attempting rooting. Keep auxin:cytokinin ratio strongly favoring auxin.',
  },
  {
    problem: 'Poor Acclimatization Survival',
    symptoms: [
      'Plantlets wilt rapidly after removal from jars',
      'Leaves dry out and curl even with humidity dome',
      'Root rot after planting in soil',
    ],
    causes: [
      'Humidity dropped too quickly (no cuticle on in vitro leaves)',
      'Agar residue on roots (promotes fungal rot in soil)',
      'Planting mix too wet or not well-draining',
      'Plantlets were vitrified or too small when transferred',
    ],
    solutions: [
      'Wash ALL agar off roots before planting',
      'Use a well-draining mix: 1:1 perlite:peat or 1:1 perlite:coco coir',
      'Extend the humidity dome period to 2-3 weeks',
      'Mist leaves 2-3 times daily during the first week',
      'Only acclimatize healthy, well-rooted plantlets (2+ cm roots)',
    ],
    prevention: 'Gradual transition over 10-14 days. Keep humidity dome on for at least 7 days. Never skip the agar wash step. Use sterile or pasteurized potting mix.',
  },
  {
    problem: 'Media Does Not Solidify',
    symptoms: [
      'Media remains liquid after cooling',
      'Media is too soft and shoots sink in',
    ],
    causes: [
      'Agar concentration too low',
      'pH too low (below 5.0) — acid degrades agar during autoclaving',
      'Agar was not fully dissolved before autoclaving',
      'Over-autoclaving (excessive time or temperature)',
    ],
    solutions: [
      'Increase agar to 8-10 g/L',
      'Check and correct pH BEFORE autoclaving (should be 5.6-5.8)',
      'Heat media on stove while stirring until agar dissolves completely (solution turns clear)',
      'Do not autoclave longer than 20 minutes at 121C',
    ],
    prevention: 'Always adjust pH before adding agar. Dissolve agar by heating while stirring. Standard: 8 g/L agar for solid media.',
  },
];

// ── Stock Solution Preparation Guides ────────────

const STOCK_SOLUTION_GUIDES: readonly StockSolutionGuide[] = [
  {
    name: 'MS Macronutrient Stock (10x)',
    concentration: '10x',
    components: [
      { chemical: 'NH4NO3 (Ammonium Nitrate)', gramsPerLiter: 16.5 },
      { chemical: 'KNO3 (Potassium Nitrate)', gramsPerLiter: 19.0 },
      { chemical: 'CaCl2-2H2O (Calcium Chloride)', gramsPerLiter: 4.4 },
      { chemical: 'MgSO4-7H2O (Magnesium Sulfate)', gramsPerLiter: 3.7 },
      { chemical: 'KH2PO4 (Potassium Phosphate)', gramsPerLiter: 1.7 },
    ],
    storageTemp: '2-4C (refrigerator)',
    shelfLife: '1-2 months refrigerated, 6 months frozen',
    notes: 'Use 100 mL per liter of media. Dissolve salts one at a time in 800 mL water, then bring to 1 L. If precipitate forms, warm to 35C and stir.',
  },
  {
    name: 'MS Micronutrient Stock (100x)',
    concentration: '100x',
    components: [
      { chemical: 'MnSO4-4H2O (Manganese Sulfate)', gramsPerLiter: 2.23 },
      { chemical: 'ZnSO4-7H2O (Zinc Sulfate)', gramsPerLiter: 0.86 },
      { chemical: 'H3BO3 (Boric Acid)', gramsPerLiter: 0.62 },
      { chemical: 'KI (Potassium Iodide)', gramsPerLiter: 0.083 },
      { chemical: 'Na2MoO4-2H2O (Sodium Molybdate)', gramsPerLiter: 0.025 },
      { chemical: 'CuSO4-5H2O (Copper Sulfate)', gramsPerLiter: 0.0025 },
      { chemical: 'CoCl2-6H2O (Cobalt Chloride)', gramsPerLiter: 0.0025 },
    ],
    storageTemp: '2-4C (refrigerator) or -20C (freezer)',
    shelfLife: '2-3 months refrigerated, 12 months frozen',
    notes: 'Use 10 mL per liter of media. Dissolve in order listed. CuSO4 and CoCl2 amounts are very small — a precision scale (0.001g) is needed, or make a sub-stock first.',
  },
  {
    name: 'Iron/EDTA Stock (200x)',
    concentration: '200x',
    components: [
      { chemical: 'FeSO4-7H2O (Ferrous Sulfate)', gramsPerLiter: 5.56 },
      { chemical: 'Na2EDTA (Disodium EDTA)', gramsPerLiter: 7.46 },
    ],
    storageTemp: '2-4C (refrigerator), in dark/amber bottle',
    shelfLife: '1-2 months refrigerated (light-sensitive)',
    notes: 'Use 5 mL per liter of media. Dissolve Na2EDTA first in warm water, then add FeSO4 slowly while stirring. Solution should turn amber-yellow. Store in amber bottle or wrap in foil — iron degrades in light.',
  },
  {
    name: 'Vitamin Stock (1000x)',
    concentration: '1000x',
    components: [
      { chemical: 'myo-Inositol', gramsPerLiter: 100 },
      { chemical: 'Nicotinic Acid (Vitamin B3)', gramsPerLiter: 0.5 },
      { chemical: 'Pyridoxine HCl (Vitamin B6)', gramsPerLiter: 0.5 },
      { chemical: 'Thiamine HCl (Vitamin B1)', gramsPerLiter: 0.1 },
      { chemical: 'Glycine', gramsPerLiter: 2.0 },
    ],
    storageTemp: '-20C (freezer)',
    shelfLife: '6-12 months frozen, 1 month refrigerated',
    notes: 'Use 1 mL per liter of media. Best stored as 1 mL aliquots in small tubes — thaw one per batch, never re-freeze. myo-Inositol dissolves slowly; use warm water and stir for several minutes.',
  },
  {
    name: 'BAP Stock (1 mg/mL)',
    concentration: '1 mg/mL',
    components: [
      { chemical: 'BAP (6-Benzylaminopurine)', gramsPerLiter: 1.0 },
    ],
    storageTemp: '2-4C (refrigerator)',
    shelfLife: '3-6 months refrigerated',
    notes: 'BAP does not dissolve in water alone. Add 1g BAP to a few drops of 1N NaOH, stir until dissolved, then slowly add water to 1 L. For 1 mg/L in media, add 1 mL of this stock per liter.',
  },
  {
    name: 'NAA Stock (1 mg/mL)',
    concentration: '1 mg/mL',
    components: [
      { chemical: 'NAA (1-Naphthaleneacetic acid)', gramsPerLiter: 1.0 },
    ],
    storageTemp: '2-4C (refrigerator)',
    shelfLife: '3-6 months refrigerated',
    notes: 'Dissolve in a few drops of 1N NaOH first, then bring to volume with water. NAA is heat-stable and can be autoclaved with the media.',
  },
  {
    name: 'IBA Stock (1 mg/mL)',
    concentration: '1 mg/mL',
    components: [
      { chemical: 'IBA (Indole-3-butyric acid)', gramsPerLiter: 1.0 },
    ],
    storageTemp: '2-4C (refrigerator)',
    shelfLife: '3-6 months refrigerated',
    notes: 'Dissolve in a few drops of 1N NaOH or 70% ethanol, then bring to volume. IBA is heat-stable. Commonly used for rooting at 0.5-2.0 mg/L.',
  },
];

// ── Public API ───────────────────────────────────

/**
 * Get the complete equipment list for tissue culture.
 * @param budgetFilter - Optional: filter by 'essential', 'recommended', or 'optional'
 * @returns Array of equipment items with DIY alternatives and cost estimates
 */
export function getEquipmentList(budgetFilter?: EquipmentItem['budget']): readonly EquipmentItem[] {
  if (budgetFilter) return EQUIPMENT.filter((e) => e.budget === budgetFilter);
  return EQUIPMENT;
}

/**
 * Calculate the estimated total cost for a beginner setup.
 * @param includeOptional - Whether to include optional equipment (default: false)
 * @returns Object with min and max total cost estimates
 */
export function estimateSetupCost(includeOptional: boolean = false): { min: number; max: number; items: number } {
  const items = includeOptional ? EQUIPMENT : EQUIPMENT.filter((e) => e.budget !== 'optional');
  const min = items.reduce((sum, e) => sum + e.estimatedCostUsd.min, 0);
  const max = items.reduce((sum, e) => sum + e.estimatedCostUsd.max, 0);
  return { min, max, items: items.length };
}

/**
 * Get beginner-friendly plant protocols.
 * @param difficulty - Optional: filter by difficulty level
 * @returns Array of plant protocols with media, hormones, and tips
 */
export function getBeginnerPlants(difficulty?: DifficultyLevel): readonly BeginnerPlant[] {
  if (difficulty) return BEGINNER_PLANTS.filter((p) => p.difficulty === difficulty);
  return BEGINNER_PLANTS;
}

/**
 * Get a specific plant protocol by name.
 * @param name - Plant common name (case-insensitive)
 * @returns Plant protocol or undefined
 */
export function getPlantProtocol(name: string): BeginnerPlant | undefined {
  return BEGINNER_PLANTS.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

/**
 * Get the complete tissue culture walkthrough — all steps from start to finish.
 * @param stage - Optional: filter by culture stage
 * @returns Ordered array of walkthrough steps
 */
export function getWalkthrough(stage?: CultureStage): readonly WalkthroughStep[] {
  if (stage) return WALKTHROUGH.filter((s) => s.stage === stage);
  return WALKTHROUGH;
}

/**
 * Get troubleshooting entries for common problems.
 * @param keyword - Optional: search for a specific problem keyword
 * @returns Array of troubleshooting entries with causes, solutions, and prevention
 */
export function getTroubleshooting(keyword?: string): readonly TroubleshootingEntry[] {
  if (!keyword) return TROUBLESHOOTING;
  const lower = keyword.toLowerCase();
  return TROUBLESHOOTING.filter(
    (t) =>
      t.problem.toLowerCase().includes(lower) ||
      t.symptoms.some((s) => s.toLowerCase().includes(lower)) ||
      t.causes.some((c) => c.toLowerCase().includes(lower)),
  );
}

/**
 * Get stock solution preparation guides.
 * @returns Array of stock solution recipes with storage instructions
 */
export function getStockSolutionGuides(): readonly StockSolutionGuide[] {
  return STOCK_SOLUTION_GUIDES;
}

/**
 * Get a specific stock solution guide by name keyword.
 * @param keyword - Search keyword (e.g., "macronutrient", "iron", "BAP")
 * @returns Matching stock solution guide or undefined
 */
export function getStockSolutionGuide(keyword: string): StockSolutionGuide | undefined {
  const lower = keyword.toLowerCase();
  return STOCK_SOLUTION_GUIDES.find((s) => s.name.toLowerCase().includes(lower));
}
