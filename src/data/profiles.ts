import {
  UserProfile,
  ChronicConditionId,
  SpecificSymptomId,
  KnownSensitivityId,
} from '../types';

export interface ConditionOption {
  id: ChronicConditionId;
  label: string;
  category: 'Respiratory' | 'Circadian' | 'Immune' | 'Neurological';
  description: string;
  mappedConcernId?: string;
}

export interface SymptomOption {
  id: SpecificSymptomId;
  label: string;
  description: string;
}

export interface SensitivityOption {
  id: KnownSensitivityId;
  label: string;
  clinicalImpact: string;
  contraindicatedFlora: string[];
}

export const CHRONIC_CONDITIONS_LIST: ConditionOption[] = [
  {
    id: 'asthma',
    label: 'Bronchial Asthma',
    category: 'Respiratory',
    description: 'Hyperreactive airway bronchospasm triggered by synthetic chemical off-gassing and dry air.',
    mappedConcernId: 'asthma_respiratory',
  },
  {
    id: 'copd',
    label: 'COPD / Chronic Bronchitis',
    category: 'Respiratory',
    description: 'Airflow limitation and mucous membrane hypersensitivity requiring sustained sterile humidity.',
    mappedConcernId: 'dry_mucosa_sinusitis',
  },
  {
    id: 'sleep_apnea',
    label: 'Obstructive Sleep Apnea (OSA) / Nocturnal Desaturation',
    category: 'Circadian',
    description: 'Nocturnal intermittent hypoxia aggravated by bedroom carbon dioxide accumulation.',
    mappedConcernId: 'insomnia_nocturnal_hypoxia',
  },
  {
    id: 'allergic_rhinitis',
    label: 'Allergic Rhinitis / Chronic Sinusitis',
    category: 'Immune',
    description: 'Inflammation of the nasal mucosa triggered by particulate dust, allergens, and dry unconditioned air.',
    mappedConcernId: 'dry_mucosa_sinusitis',
  },
  {
    id: 'eczema_xerosis',
    label: 'Atopic Eczema & Xerosis (Severe Dry Skin)',
    category: 'Immune',
    description: 'Compromised skin barrier aggravated by indoor air with relative humidity below 35%.',
    mappedConcernId: 'dry_mucosa_sinusitis',
  },
  {
    id: 'migraines',
    label: 'Chronic Migraines / Sick Building Syndrome',
    category: 'Neurological',
    description: 'Frontal tension headaches provoked by aromatic solvents (benzene, toluene) and monitor off-gassing.',
    mappedConcernId: 'sick_building_syndrome',
  },
  {
    id: 'hypertension_stress',
    label: 'Hypertension & Elevated Salivary Cortisol',
    category: 'Neurological',
    description: 'Sympathetic autonomic overactivation and high resting stress levels.',
    mappedConcernId: 'stress_anxiety_cortisol',
  },
  {
    id: 'multiple_chemical_sensitivity',
    label: 'Multiple Chemical Sensitivity (MCS)',
    category: 'Immune',
    description: 'Extreme somatic reactivity to trace volatile synthetic chemicals, adhesives, and paints.',
    mappedConcernId: 'voc_chemical_sensitivity',
  },
];

export const SYMPTOMS_LIST: SymptomOption[] = [
  {
    id: 'nocturnal_waking',
    label: 'Frequent Nighttime Awakenings',
    description: 'Fragmented sleep cycles from elevated bedroom CO₂ or low ambient oxygen partial pressure.',
  },
  {
    id: 'morning_headache',
    label: 'Morning Dull Headache / Cephalalgia',
    description: 'Waking with frontal head pressure linked to sleeping in sealed rooms with >1,000 ppm CO₂.',
  },
  {
    id: 'throat_scratchiness',
    label: 'Dry Scratchy Throat & Vocal Strain',
    description: 'Desiccated pharyngeal mucosa from low relative humidity (<30% RH) in climate-controlled spaces.',
  },
  {
    id: 'wheezing_cough',
    label: 'Nocturnal Wheezing & Spasmodic Cough',
    description: 'Bronchial irritation from volatile organic compounds (formaldehyde, benzene).',
  },
  {
    id: 'brain_fog_slump',
    label: 'Afternoon Brain Fog & Cognitive Slump',
    description: 'Decline in executive function and focus caused by stagnant indoor air during sedentary work.',
  },
  {
    id: 'eye_stinging',
    label: 'Ocular Stinging, Conjunctival Redness',
    description: 'Surface irritation from solvent vapors off-gassed by carpet adhesives and computer equipment.',
  },
  {
    id: 'epistaxis',
    label: 'Dry Air Nosebleeds (Epistaxis)',
    description: 'Nasal capillary fragility aggravated by dry unconditioned winter heating or heavy AC.',
  },
];

export const SENSITIVITIES_LIST: SensitivityOption[] = [
  {
    id: 'pollen_floral',
    label: 'Floral Pollen & Anther Allergy',
    clinicalImpact: 'May trigger sneezing from blooming flowers; requires snipping floral spadix of Peace Lily or substituting non-flowering foliage.',
    contraindicatedFlora: ['peace_lily (unless blooms excised)'],
  },
  {
    id: 'mold_fungal_spores',
    label: 'Mold & Fungal Spores (Aspergillus / Cladosporium)',
    clinicalImpact: 'Requires 100% sterile inorganic potting (LECA / pea gravel topsoil) and sub-irrigation to eliminate surface mold hyphae.',
    contraindicatedFlora: ['organic damp soil without gravel barrier'],
  },
  {
    id: 'strong_fragrance_terpenes',
    label: 'Strong Plant Fragrances & Essential Oils',
    clinicalImpact: 'Sensory or bronchospastic intolerance to intense volatile terpenes; excludes aromatic rosemary and lavender in favor of odorless broadleaf foliage.',
    contraindicatedFlora: ['rosemary_medicinal'],
  },
  {
    id: 'natural_latex',
    label: 'Natural Rubber Latex Allergy',
    clinicalImpact: 'Cross-reactive IgE response to plant latex sap; strictly contraindicates Rubber Plant (Ficus elastica).',
    contraindicatedFlora: ['rubber_plant'],
  },
  {
    id: 'contact_dermatitis_sap',
    label: 'Contact Dermatitis & Sap Sensitivity',
    clinicalImpact: 'Skin irritation from plant saponins or hederagenin; avoids English Ivy and requires hanging/elevated placement.',
    contraindicatedFlora: ['english_ivy'],
  },
  {
    id: 'pet_dander',
    label: 'Household Pet Presence / Dander',
    clinicalImpact: 'Enforces ASPCA strict non-toxic flora to safeguard household pets and avoid pet chewing reactions.',
    contraindicatedFlora: [],
  },
];

export const INITIAL_USER_PROFILES: UserProfile[] = [
  {
    id: 'profile_eleanor',
    name: 'Eleanor Vance',
    age: 69,
    relationshipTag: 'Elderly Parent',
    chronicConditions: ['copd', 'sleep_apnea', 'allergic_rhinitis'],
    specificSymptoms: ['nocturnal_waking', 'throat_scratchiness', 'morning_headache'],
    knownSensitivities: ['strong_fragrance_terpenes', 'natural_latex'],
    clinicalNotes: 'Geriatric patient with reduced nocturnal lung vital capacity. Requires maximum nighttime CAM oxygenation, sterile high transpiration to soothe airways, and strictly fragrance-free non-latex flora.',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-09T14:30:00Z',
  },
  {
    id: 'profile_maya',
    name: 'Maya Chen',
    age: 5,
    relationshipTag: 'Child',
    chronicConditions: ['asthma', 'allergic_rhinitis', 'eczema_xerosis'],
    specificSymptoms: ['wheezing_cough', 'throat_scratchiness'],
    knownSensitivities: ['mold_fungal_spores', 'pollen_floral'],
    clinicalNotes: 'Pediatric asthma profile. Strict child safety required (no sharp leaf points or rigid tips at low reach). Mandatory sub-irrigation/LECA to prevent fungal spore triggers.',
    createdAt: '2026-10-03T10:15:00Z',
    updatedAt: '2026-10-09T16:00:00Z',
  },
  {
    id: 'profile_david',
    name: 'David Rossi',
    age: 38,
    relationshipTag: 'Self',
    chronicConditions: ['migraines', 'multiple_chemical_sensitivity', 'hypertension_stress'],
    specificSymptoms: ['morning_headache', 'brain_fog_slump', 'eye_stinging'],
    knownSensitivities: ['contact_dermatitis_sap'],
    clinicalNotes: 'Works 10+ hours daily in home office. Significant VOC buildup from electronics and paint. Needs high CADR solvent clearance and day-active oxygen generation.',
    createdAt: '2026-10-05T12:00:00Z',
    updatedAt: '2026-10-10T05:00:00Z',
  },
];
