export type RoomType = 'bedroom' | 'home_office' | 'living_room' | 'nursery' | 'clinic_recovery';

export type LightExposure = 'low_indirect' | 'medium_indirect' | 'bright_indirect' | 'direct_sun' | 'windowless';

export type VentilationLevel = 'low_sealed' | 'standard_hvac' | 'high_ventilated';

export type UnitSystem = 'metric' | 'imperial';

export interface RoomDimensions {
  length: number; // meters or feet
  width: number;
  height: number;
  unit: UnitSystem;
}

export type HealthConcernId = 
  | 'insomnia_nocturnal_hypoxia'
  | 'asthma_respiratory'
  | 'sick_building_syndrome'
  | 'stress_anxiety_cortisol'
  | 'dry_mucosa_sinusitis'
  | 'voc_chemical_sensitivity'
  | 'cognitive_fatigue_focus';

export interface HealthConcern {
  id: HealthConcernId;
  name: string;
  category: 'Respiratory' | 'Sleep & Circadian' | 'Neurological' | 'Environmental';
  description: string;
  clinicalSymptoms: string[];
  primaryBioTarget: string;
  recommendedPhytoMechanism: string;
  recommendedPlantIds: string[];
  contraindications?: string[];
}

export interface VocRemovalProfile {
  formaldehyde: number; // microgram per hour per standard 8-inch pot
  benzene: number;
  trichloroethylene: number;
  xyleneToluene: number;
  ammonia: number;
  carbonMonoxide: number;
}

export interface PlantSpecies {
  id: string;
  commonName: string;
  scientificName: string;
  botanicalFamily: string;
  photosynthesisPathway: 'CAM' | 'C3' | 'C4'; // CAM produces O2 at night!
  nocturnalOxygenScore: number; // 1-10
  daytimeOxygenScore: number; // 1-10
  transpirationRateScore: number; // 1-10 (humidification capacity)
  phytoncideOutputScore: number; // 1-10 (stress reduction / antimicrobial VOCs)
  vocRemoval: VocRemovalProfile;
  totalNasaEfficacyScore: number; // 1-100 NASA Clean Air rating
  lightRequirement: LightExposure[];
  careDifficulty: 'Very Easy' | 'Moderate' | 'Demanding';
  wateringFrequencyDays: number;
  petToxicity: {
    safeForCats: boolean;
    safeForDogs: boolean;
    toxicPrinciple?: string; // e.g. "Insoluble calcium oxalates"
    clinicalNotes: string;
  };
  childSafety: {
    safe: boolean;
    warningNotes?: string;
  };
  optimalPotDiameterInches: number;
  recommendedRoomPlacement: string;
  therapeuticBenefits: string[];
  allergensAndPrecautions: string[];
  imageUrl: string;
  overview: string;
}

export type KnownSensitivityId =
  | 'pollen_floral'
  | 'mold_fungal_spores'
  | 'strong_fragrance_terpenes'
  | 'natural_latex'
  | 'contact_dermatitis_sap'
  | 'pet_dander';

export type ChronicConditionId =
  | 'asthma'
  | 'copd'
  | 'sleep_apnea'
  | 'allergic_rhinitis'
  | 'eczema_xerosis'
  | 'migraines'
  | 'hypertension_stress'
  | 'multiple_chemical_sensitivity';

export type SpecificSymptomId =
  | 'nocturnal_waking'
  | 'morning_headache'
  | 'throat_scratchiness'
  | 'wheezing_cough'
  | 'brain_fog_slump'
  | 'eye_stinging'
  | 'epistaxis';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  relationshipTag: 'Self' | 'Child' | 'Elderly Parent' | 'Partner' | 'Clinical Patient';
  chronicConditions: ChronicConditionId[];
  customConditions?: string[];
  specificSymptoms: SpecificSymptomId[];
  customSymptoms?: string[];
  knownSensitivities: KnownSensitivityId[];
  customSensitivities?: string[];
  clinicalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionInput {
  userProfile?: UserProfile;
  patientRoomName: string;
  roomType: RoomType;
  dimensions: RoomDimensions;
  lightExposure: LightExposure;
  ventilation: VentilationLevel;
  primaryConcerns: HealthConcernId[];
  hasCats: boolean;
  hasDogs: boolean;
  hasSmallChildren: boolean;
  hasMoldSensitivity: boolean;
  occupantCount: number;
}

export interface PrescribedPlantItem {
  plant: PlantSpecies;
  quantity: number;
  potSizeInches: number;
  primaryIndication: string;
  placementLocation: string;
  waterDosage: string;
  lightPlacementAdvice: string;
  safetyAlert?: string;
}

export interface PhytoPrescription {
  rxId: string;
  dateGenerated: string;
  patientRoomName: string;
  roomType: RoomType;
  patientProfileSummary?: {
    profileId: string;
    patientName: string;
    age: number;
    ageBracket: 'Pediatric' | 'Adult' | 'Geriatric';
    relationshipTag: string;
    matchedConditions: string[];
    reportedSymptoms: string[];
    activeSensitivities: string[];
  };
  appliedPersonalizations: string[];
  roomAreaSqMeters: number;
  roomAreaSqFeet: number;
  roomVolumeCubicMeters: number;
  roomVolumeCubicFeet: number;
  primaryConcerns: HealthConcern[];
  safetyConstraints: {
    petSafeStrict: boolean;
    childSafeStrict: boolean;
    moldSafeSoilProtocol: boolean;
    latexAllergySafe: boolean;
    fragranceFreeStrict: boolean;
    pollenAntherSafe: boolean;
  };
  prescribedPlants: PrescribedPlantItem[];
  totalPlantCount: number;
  metrics: {
    baselineAirQualityScore: number; // 0-100
    projectedAirQualityScore: number; // 0-100
    vocClearanceRateMicrogramsPerHour: number;
    oxygenGenerationDailyLiters: number;
    nighttimeOxygenContributionPercent: number;
    relativeHumidityDeltaPercent: number;
    cadrEquivalentCfm: number; // Clean Air Delivery Rate in cubic feet per min
  };
  clinicalCareProtocol: {
    wateringSchedule: string;
    dustCleaningProtocol: string;
    soilSubstrateRecommendation: string;
    ventilationSynergyTip: string;
  };
  precautions: string[];
}
