import {
  PrescriptionInput,
  PhytoPrescription,
  PrescribedPlantItem,
  PlantSpecies,
  HealthConcern,
  HealthConcernId,
} from '../types';
import { MEDICINAL_PLANTS } from '../data/plants';
import { HEALTH_CONCERNS } from '../data/healthConcerns';

export function calculateRoomMetrics(input: PrescriptionInput) {
  const isMetric = input.dimensions.unit === 'metric';
  let lengthM = input.dimensions.length;
  let widthM = input.dimensions.width;
  let heightM = input.dimensions.height;

  if (!isMetric) {
    lengthM = lengthM * 0.3048;
    widthM = widthM * 0.3048;
    heightM = heightM * 0.3048;
  }

  const areaSqM = lengthM * widthM;
  const areaSqFt = areaSqM * 10.7639;
  const volumeCubicM = areaSqM * heightM;
  const volumeCubicFt = volumeCubicM * 35.3147;

  return {
    areaSqM: Math.round(areaSqM * 10) / 10,
    areaSqFt: Math.round(areaSqFt),
    volumeCubicM: Math.round(volumeCubicM * 10) / 10,
    volumeCubicFt: Math.round(volumeCubicFt),
  };
}

export function generatePhytoPrescription(input: PrescriptionInput): PhytoPrescription {
  const metrics = calculateRoomMetrics(input);
  const profile = input.userProfile;
  const appliedPersonalizations: string[] = [];

  // Determine active health concerns (combining direct selections + profile conditions & symptoms)
  const combinedConcernIds = new Set<HealthConcernId>(input.primaryConcerns);

  if (profile) {
    // Map chronic conditions to concern IDs
    if (profile.chronicConditions.includes('asthma')) {
      combinedConcernIds.add('asthma_respiratory');
    }
    if (profile.chronicConditions.includes('copd') || profile.chronicConditions.includes('allergic_rhinitis') || profile.chronicConditions.includes('eczema_xerosis')) {
      combinedConcernIds.add('dry_mucosa_sinusitis');
    }
    if (profile.chronicConditions.includes('sleep_apnea')) {
      combinedConcernIds.add('insomnia_nocturnal_hypoxia');
    }
    if (profile.chronicConditions.includes('migraines')) {
      combinedConcernIds.add('sick_building_syndrome');
    }
    if (profile.chronicConditions.includes('hypertension_stress')) {
      combinedConcernIds.add('stress_anxiety_cortisol');
    }
    if (profile.chronicConditions.includes('multiple_chemical_sensitivity')) {
      combinedConcernIds.add('voc_chemical_sensitivity');
    }

    // Map symptoms
    if (profile.specificSymptoms.includes('nocturnal_waking') || profile.specificSymptoms.includes('morning_headache')) {
      combinedConcernIds.add('insomnia_nocturnal_hypoxia');
    }
    if (profile.specificSymptoms.includes('wheezing_cough')) {
      combinedConcernIds.add('asthma_respiratory');
    }
    if (profile.specificSymptoms.includes('throat_scratchiness') || profile.specificSymptoms.includes('epistaxis')) {
      combinedConcernIds.add('dry_mucosa_sinusitis');
    }
    if (profile.specificSymptoms.includes('brain_fog_slump')) {
      combinedConcernIds.add('cognitive_fatigue_focus');
    }
    if (profile.specificSymptoms.includes('eye_stinging')) {
      combinedConcernIds.add('sick_building_syndrome');
    }
  }

  const selectedConcerns: HealthConcern[] = HEALTH_CONCERNS.filter(c =>
    combinedConcernIds.has(c.id)
  );

  // Determine patient safety & sensitivities
  const isPediatric = (profile && profile.age < 12) || input.hasSmallChildren;
  const isGeriatric = Boolean(profile && profile.age >= 65);
  const strictPetFilter = input.hasCats || input.hasDogs || Boolean(profile?.knownSensitivities.includes('pet_dander'));
  const hasMoldSensitivity = input.hasMoldSensitivity || Boolean(profile?.knownSensitivities.includes('mold_fungal_spores'));
  const hasLatexAllergy = Boolean(profile?.knownSensitivities.includes('natural_latex'));
  const hasFragranceSens = Boolean(profile?.knownSensitivities.includes('strong_fragrance_terpenes'));
  const hasPollenSens = Boolean(profile?.knownSensitivities.includes('pollen_floral'));
  const hasContactDermatitis = Boolean(profile?.knownSensitivities.includes('contact_dermatitis_sap'));

  // Personalization logging
  if (profile) {
    if (isPediatric) {
      appliedPersonalizations.push(`Pediatric safety protocol (age ${profile.age}): Filtered rigid foliage points and sap irritants; selected soft, non-toxic, high-transpiration fronds.`);
    }
    if (isGeriatric) {
      appliedPersonalizations.push(`Geriatric respiratory protocol (age ${profile.age}): Elevated nocturnal CAM oxygen bio-load to compensate for reduced vital lung compliance.`);
    }
    if (hasLatexAllergy) {
      appliedPersonalizations.push('Latex allergy contraindication: Strictly excluded Ficus elastica (Rubber Plant) to prevent cross-reactive IgE reactions.');
    }
    if (hasFragranceSens) {
      appliedPersonalizations.push('Fragrance/terpene intolerance: Excluded aromatic herbs (Rosemary) in favor of odorless broadleaf oxygenators.');
    }
    if (hasPollenSens) {
      appliedPersonalizations.push('Floral pollen sensitivity: Directed mandatory excision of blooming spadices / favored non-flowering air purifiers.');
    }
    if (hasMoldSensitivity) {
      appliedPersonalizations.push('Fungal spore protocol: Mandated inorganic LECA hydroculture and 1-inch gravel barrier to eliminate surface mold hyphae.');
    }
  }

  // Target bio-load calculation:
  // Base NASA benchmark: 1 plant per ~9.3 m² (100 sq ft) for ambient air.
  // Clinical remediation benchmark: 1 plant per 4.5–6.0 m² depending on concern severity.
  const concernSeverityMultiplier = 1 + (selectedConcerns.length * 0.12) + (isGeriatric ? 0.15 : 0);
  const baseCount = Math.max(2, Math.round((metrics.areaSqM / 6.5) * concernSeverityMultiplier));
  const targetPlantCount = Math.min(10, Math.max(2, baseCount));

  // Score candidate plants
  const scoredPlants = MEDICINAL_PLANTS.map(plant => {
    let score = 0;

    // Safety & Allergy exclusions
    if (hasLatexAllergy && plant.id === 'rubber_plant') {
      return { plant, score: -2000 };
    }

    if (hasFragranceSens && plant.id === 'rosemary_medicinal') {
      return { plant, score: -2000 };
    }

    if (hasContactDermatitis && plant.id === 'english_ivy') {
      score -= 800;
    }

    if (strictPetFilter) {
      if ((input.hasCats || profile?.knownSensitivities.includes('pet_dander')) && !plant.petToxicity.safeForCats) {
        score -= 1000;
      }
      if ((input.hasDogs || profile?.knownSensitivities.includes('pet_dander')) && !plant.petToxicity.safeForDogs) {
        score -= 1000;
      }
    }

    if (isPediatric && !plant.childSafety.safe) {
      score -= 60;
    }

    if (hasPollenSens && plant.id === 'peace_lily') {
      score -= 25; // penalize floral spadix
    }

    // Light suitability
    const supportsLight = plant.lightRequirement.includes(input.lightExposure);
    if (!supportsLight) {
      score -= 40;
    } else {
      score += 15;
    }

    // Age-specific adjustments
    if (isGeriatric) {
      if (plant.photosynthesisPathway === 'CAM') score += 25;
      if (plant.transpirationRateScore >= 8) score += 20;
      if (plant.careDifficulty === 'Very Easy') score += 15;
    }

    if (isPediatric) {
      if (plant.id === 'spider_plant' || plant.id === 'boston_fern') score += 30;
      if (plant.id === 'snake_plant') score -= 20; // spiky rigid leaf tips
    }

    // Room type synergies
    if (input.roomType === 'bedroom') {
      if (plant.photosynthesisPathway === 'CAM') score += 35;
      score += plant.nocturnalOxygenScore * 2.5;
    } else if (input.roomType === 'home_office') {
      score += plant.daytimeOxygenScore * 2.5;
      score += plant.phytoncideOutputScore * 2;
    } else if (input.roomType === 'nursery') {
      if (plant.petToxicity.safeForCats && plant.petToxicity.safeForDogs) score += 25;
      score += plant.transpirationRateScore * 2.0;
    }

    // Health concern matches
    selectedConcerns.forEach(concern => {
      if (concern.recommendedPlantIds.includes(plant.id)) {
        score += 30;
      }

      if (concern.id === 'insomnia_nocturnal_hypoxia' && plant.photosynthesisPathway === 'CAM') {
        score += 35;
      }
      if (concern.id === 'asthma_respiratory') {
        score += (plant.vocRemoval.formaldehyde / 100) + (plant.transpirationRateScore * 2.5);
      }
      if (concern.id === 'sick_building_syndrome') {
        score += (plant.vocRemoval.benzene / 80) + (plant.vocRemoval.xyleneToluene / 80);
      }
      if (concern.id === 'dry_mucosa_sinusitis') {
        score += plant.transpirationRateScore * 4;
      }
      if (concern.id === 'stress_anxiety_cortisol' || concern.id === 'cognitive_fatigue_focus') {
        if (!hasFragranceSens) {
          score += plant.phytoncideOutputScore * 3.5;
        } else {
          score += plant.daytimeOxygenScore * 3;
        }
      }
      if (concern.id === 'voc_chemical_sensitivity') {
        score += plant.totalNasaEfficacyScore * 0.4;
      }
    });

    return { plant, score };
  });

  // Sort and select top candidates
  let availableCandidates = scoredPlants
    .filter(item => item.score > -500)
    .sort((a, b) => b.score - a.score);

  // Fallback: If safety filters eliminated too many plants, ensure at least non-toxic safe plants are selected
  if (availableCandidates.length < 2) {
    availableCandidates = scoredPlants
      .filter(item => item.plant.petToxicity.safeForCats && item.plant.petToxicity.safeForDogs)
      .sort((a, b) => b.score - a.score);
  }

  // Pick top 2 to 4 unique species
  const distinctSpeciesCount = Math.min(4, Math.max(2, Math.floor(targetPlantCount / 2) + 1));
  const chosenCandidates = availableCandidates.slice(0, distinctSpeciesCount);

  // Allocate quantities to meet targetPlantCount
  const prescribedItems: PrescribedPlantItem[] = [];
  let remainingCount = targetPlantCount;

  chosenCandidates.forEach((cand, idx) => {
    let qty = 1;
    if (idx === 0) {
      qty = Math.max(1, Math.min(3, remainingCount - (chosenCandidates.length - 1)));
    } else {
      qty = Math.max(1, Math.floor(remainingCount / (chosenCandidates.length - idx)));
    }
    remainingCount = Math.max(0, remainingCount - qty);

    const isCam = cand.plant.photosynthesisPathway === 'CAM';
    let placement = cand.plant.recommendedRoomPlacement;
    if (input.roomType === 'bedroom' && isCam) {
      placement = 'Bedside table or shelf within 1.5m of pillow line for concentrated nocturnal O₂ inhalation.';
    } else if (input.roomType === 'home_office' && cand.plant.id === 'rosemary_medicinal') {
      placement = 'Directly adjacent to keyboard/monitor workstation for continuous active terpenoid diffusion.';
    } else if (cand.plant.transpirationRateScore >= 8) {
      placement = 'Central room node away from direct draft vents to maximize evaporative humidity plume.';
    }

    if (isPediatric && cand.plant.id === 'snake_plant') {
      placement = 'Elevated dresser or wall bracket (>1.2m height) to keep rigid leaf tips away from toddler reach.';
    }

    let waterDosage = `Water every ${cand.plant.wateringFrequencyDays} days. Ensure thorough soil drainage.`;
    if (hasMoldSensitivity) {
      waterDosage = `Sub-irrigation (bottom water) every ${cand.plant.wateringFrequencyDays} days or use mineral hydroculture (LECA) to prevent surface fungal spores.`;
    }

    let safetyAlert = strictPetFilter && (!cand.plant.petToxicity.safeForCats || !cand.plant.petToxicity.safeForDogs)
      ? `Contains ${cand.plant.petToxicity.toxicPrinciple}. Place strictly on high hanging mounts out of pet reach.`
      : undefined;

    if (hasPollenSens && cand.plant.id === 'peace_lily') {
      safetyAlert = 'Pollen Allergy Alert: Snip the white central floral spadix prior to anther maturation to prevent pollen dispersal.';
    }

    prescribedItems.push({
      plant: cand.plant,
      quantity: qty,
      potSizeInches: cand.plant.optimalPotDiameterInches,
      primaryIndication: selectedConcerns[0]?.name || 'Broad-Spectrum Atmospheric Purification',
      placementLocation: placement,
      waterDosage,
      lightPlacementAdvice: `Requires ${cand.plant.lightRequirement.map(l => l.replace('_', ' ')).join(' or ')}.`,
      safetyAlert,
    });
  });

  // Calculate environmental impacts
  let totalVocMicrogramsPerHour = 0;
  let totalDaytimeO2 = 0;
  let totalNighttimeO2 = 0;
  let transpirationSum = 0;

  prescribedItems.forEach(item => {
    const q = item.quantity;
    totalVocMicrogramsPerHour += (
      item.plant.vocRemoval.formaldehyde +
      item.plant.vocRemoval.benzene +
      item.plant.vocRemoval.trichloroethylene +
      item.plant.vocRemoval.xyleneToluene +
      item.plant.vocRemoval.ammonia
    ) * q;

    totalDaytimeO2 += item.plant.daytimeOxygenScore * 3.8 * q;
    totalNighttimeO2 += item.plant.nocturnalOxygenScore * 3.2 * q;
    transpirationSum += item.plant.transpirationRateScore * q;
  });

  const totalO2 = totalDaytimeO2 + totalNighttimeO2;
  const nocturnalO2Pct = totalO2 > 0 ? Math.round((totalNighttimeO2 / totalO2) * 100) : 30;

  // Relative humidity delta calculation (based on room volume and transpiration)
  const estimatedMoistureMlPerDay = transpirationSum * 90;
  const humidityDeltaPercent = Math.min(12, Math.max(3, Math.round((estimatedMoistureMlPerDay / (metrics.volumeCubicM * 10)) * 10) / 10));

  // CADR equivalent CFM
  const cadrEquivalent = Math.round((totalVocMicrogramsPerHour / 120) * 1.8);

  // Baseline vs Projected Air Quality Index
  const baselineAqi = input.ventilation === 'low_sealed' ? 48 : input.ventilation === 'standard_hvac' ? 62 : 72;
  const aqiBoost = Math.min(42, Math.round((targetPlantCount / (metrics.areaSqM / 5)) * 25));
  const projectedAqi = Math.min(98, baselineAqi + aqiBoost);

  const rxId = `RX-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateGenerated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const precautions: string[] = [];
  if (strictPetFilter) {
    precautions.push('Household with pets / pet dander sensitivity: All prescribed flora are ASPCA non-toxic certified.');
  }
  if (isPediatric) {
    precautions.push('Pediatric safety standard: Selected flora have soft non-toxic fronds with zero low-reach rigid spines or latex sap.');
  }
  if (hasMoldSensitivity) {
    precautions.push('Clinical mold allergy protocol: Apply 1-inch decorative pea gravel or expanded clay LECA over topsoil to suppress Aspergillus and Penicillium mold spore release.');
  }
  if (hasLatexAllergy) {
    precautions.push('Latex hypersensitivity constraint: All Euphorbiaceae and Moraceae latex-producing flora excluded.');
  }
  if (hasFragranceSens) {
    precautions.push('Fragrance sensitivity protocol: Pure neutral-aroma foliage prescribed; strong essential oil emitters excluded.');
  }
  if (input.ventilation === 'low_sealed') {
    precautions.push('Sealed low-ventilation room: Stomata respiration requires monthly wiping of leaf surfaces with a clean damp micro-fiber cloth.');
  }

  const patientProfileSummary = profile
    ? {
        profileId: profile.id,
        patientName: profile.name,
        age: profile.age,
        ageBracket: (profile.age < 12 ? 'Pediatric' : profile.age >= 65 ? 'Geriatric' : 'Adult') as 'Pediatric' | 'Adult' | 'Geriatric',
        relationshipTag: profile.relationshipTag,
        matchedConditions: profile.chronicConditions,
        reportedSymptoms: profile.specificSymptoms,
        activeSensitivities: profile.knownSensitivities,
      }
    : undefined;

  return {
    rxId,
    dateGenerated,
    patientRoomName: input.patientRoomName.trim() || 'Primary Living Space',
    roomType: input.roomType,
    patientProfileSummary,
    appliedPersonalizations,
    roomAreaSqMeters: metrics.areaSqM,
    roomAreaSqFeet: metrics.areaSqFt,
    roomVolumeCubicMeters: metrics.volumeCubicM,
    roomVolumeCubicFeet: metrics.volumeCubicFt,
    primaryConcerns: selectedConcerns,
    safetyConstraints: {
      petSafeStrict: strictPetFilter,
      childSafeStrict: isPediatric,
      moldSafeSoilProtocol: hasMoldSensitivity,
      latexAllergySafe: hasLatexAllergy,
      fragranceFreeStrict: hasFragranceSens,
      pollenAntherSafe: hasPollenSens,
    },
    prescribedPlants: prescribedItems,
    totalPlantCount: prescribedItems.reduce((acc, curr) => acc + curr.quantity, 0),
    metrics: {
      baselineAirQualityScore: baselineAqi,
      projectedAirQualityScore: projectedAqi,
      vocClearanceRateMicrogramsPerHour: Math.round(totalVocMicrogramsPerHour),
      oxygenGenerationDailyLiters: Math.round(totalO2),
      nighttimeOxygenContributionPercent: nocturnalO2Pct,
      relativeHumidityDeltaPercent: humidityDeltaPercent,
      cadrEquivalentCfm: cadrEquivalent,
    },
    clinicalCareProtocol: {
      wateringSchedule: hasMoldSensitivity
        ? 'Bottom-irrigation or semi-hydroponic LECA sub-watering to prevent surface fungal proliferation.'
        : 'Deep saturation followed by 70% dry-down cycle to optimize root-zone oxygenation and symbiotic microbial health.',
      dustCleaningProtocol: 'Gently wipe leaf adaxial surfaces bi-weekly using distilled water. Unclogged stomata accelerate gas exchange by up to 34%.',
      soilSubstrateRecommendation: 'High-porosity aerated mix: 40% organic compost/coco coir, 30% coarse perlite, 20% horticultural pumice, 10% activated biochar for catalytic toxin adsorption.',
      ventilationSynergyTip: 'Pair botanical nodes with gentle low-speed air circulation (e.g. ceiling fan on lowest reverse setting) to continuously transport volatile molecules across the plant boundary layer.',
    },
    precautions,
  };
}

