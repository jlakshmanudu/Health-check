import React, { useState, useEffect } from 'react';
import {
  PrescriptionInput,
  HealthConcernId,
  RoomType,
  LightExposure,
  VentilationLevel,
  UnitSystem,
  UserProfile,
} from '../types';
import { HEALTH_CONCERNS } from '../data/healthConcerns';
import {
  Sparkles,
  Home,
  Sun,
  Wind,
  ShieldAlert,
  Cat,
  Baby,
  Activity,
  Check,
  RotateCcw,
  Maximize2,
  BookmarkCheck,
  User,
  HeartPulse,
} from 'lucide-react';

interface PrescriptionIntakeProps {
  onGenerate: (input: PrescriptionInput) => void;
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfileId: (id: string) => void;
  initialValues?: Partial<PrescriptionInput>;
}

export const PrescriptionIntake: React.FC<PrescriptionIntakeProps> = ({
  onGenerate,
  profiles,
  activeProfileId,
  onSelectProfileId,
}) => {
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const [patientRoomName, setPatientRoomName] = useState(
    activeProfile ? `${activeProfile.name.split(' ')[0]}'s Quarters` : 'Master Bedroom'
  );
  const [roomType, setRoomType] = useState<RoomType>('bedroom');
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [length, setLength] = useState<number>(4.5);
  const [width, setWidth] = useState<number>(3.8);
  const [height, setHeight] = useState<number>(2.6);
  const [lightExposure, setLightExposure] = useState<LightExposure>('medium_indirect');
  const [ventilation, setVentilation] = useState<VentilationLevel>('standard_hvac');
  const [selectedConcerns, setSelectedConcerns] = useState<HealthConcernId[]>([
    'insomnia_nocturnal_hypoxia',
    'dry_mucosa_sinusitis',
  ]);
  const [hasCats, setHasCats] = useState(false);
  const [hasDogs, setHasDogs] = useState(false);
  const [hasSmallChildren, setHasSmallChildren] = useState(Boolean(activeProfile && activeProfile.age < 12));
  const [hasMoldSensitivity, setHasMoldSensitivity] = useState(
    Boolean(activeProfile && activeProfile.knownSensitivities.includes('mold_fungal_spores'))
  );
  const [occupants, setOccupants] = useState(2);

  // When active profile changes, auto-align clinical concerns
  useEffect(() => {
    if (activeProfile) {
      setPatientRoomName(`${activeProfile.name.split(' ')[0]}'s Primary Room`);
      setHasSmallChildren(activeProfile.age < 12);
      setHasMoldSensitivity(activeProfile.knownSensitivities.includes('mold_fungal_spores'));

      const autoConcerns = new Set<HealthConcernId>(selectedConcerns);
      if (activeProfile.chronicConditions.includes('asthma')) autoConcerns.add('asthma_respiratory');
      if (activeProfile.chronicConditions.includes('copd')) autoConcerns.add('dry_mucosa_sinusitis');
      if (activeProfile.chronicConditions.includes('sleep_apnea')) autoConcerns.add('insomnia_nocturnal_hypoxia');
      if (activeProfile.chronicConditions.includes('migraines')) autoConcerns.add('sick_building_syndrome');
      if (activeProfile.chronicConditions.includes('multiple_chemical_sensitivity')) autoConcerns.add('voc_chemical_sensitivity');
      if (activeProfile.chronicConditions.includes('hypertension_stress')) autoConcerns.add('stress_anxiety_cortisol');

      setSelectedConcerns(Array.from(autoConcerns));
    }
  }, [activeProfileId]);

  // Quick Presets
  const applyPreset = (presetType: 'bedroom_insomnia' | 'renovated_cat' | 'home_office_fatigue') => {
    if (presetType === 'bedroom_insomnia') {
      setPatientRoomName('Master Bedroom');
      setRoomType('bedroom');
      setUnit('metric');
      setLength(4.2);
      setWidth(3.6);
      setHeight(2.6);
      setLightExposure('medium_indirect');
      setVentilation('low_sealed');
      setSelectedConcerns(['insomnia_nocturnal_hypoxia', 'dry_mucosa_sinusitis']);
      setHasCats(false);
      setHasDogs(false);
      setHasSmallChildren(false);
      setHasMoldSensitivity(false);
      setOccupants(2);
    } else if (presetType === 'renovated_cat') {
      setPatientRoomName('Living Suite & Nursery');
      setRoomType('living_room');
      setUnit('metric');
      setLength(6.0);
      setWidth(4.5);
      setHeight(2.7);
      setLightExposure('bright_indirect');
      setVentilation('standard_hvac');
      setSelectedConcerns(['voc_chemical_sensitivity', 'asthma_respiratory']);
      setHasCats(true);
      setHasDogs(false);
      setHasSmallChildren(true);
      setHasMoldSensitivity(true);
      setOccupants(3);
    } else if (presetType === 'home_office_fatigue') {
      setPatientRoomName('Executive Study');
      setRoomType('home_office');
      setUnit('metric');
      setLength(3.8);
      setWidth(3.2);
      setHeight(2.5);
      setLightExposure('medium_indirect');
      setVentilation('low_sealed');
      setSelectedConcerns(['cognitive_fatigue_focus', 'sick_building_syndrome']);
      setHasCats(false);
      setHasDogs(true);
      setHasSmallChildren(false);
      setHasMoldSensitivity(false);
      setOccupants(1);
    }
  };

  const toggleConcern = (id: HealthConcernId) => {
    if (selectedConcerns.includes(id)) {
      if (selectedConcerns.length > 1) {
        setSelectedConcerns(selectedConcerns.filter((c) => c !== id));
      }
    } else {
      setSelectedConcerns([...selectedConcerns, id]);
    }
  };

  // Volumetric math preview
  const area = Math.round(length * width * 10) / 10;
  const volume = Math.round(area * height * 10) / 10;
  const areaSqFt = unit === 'metric' ? Math.round(area * 10.7639) : Math.round(area);
  const volumeCubicFt = unit === 'metric' ? Math.round(volume * 35.3147) : Math.round(volume);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      userProfile: activeProfile,
      patientRoomName,
      roomType,
      dimensions: {
        length,
        width,
        height,
        unit,
      },
      lightExposure,
      ventilation,
      primaryConcerns: selectedConcerns,
      hasCats,
      hasDogs,
      hasSmallChildren,
      hasMoldSensitivity,
      occupantCount: occupants,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Active Patient Profile Strip */}
      <div className="bg-white border-2 border-[#2D6A4F] rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EBF4EE] text-[#2D6A4F] flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base font-bold text-[#1B2A20]">
                Prescribing for: {activeProfile?.name || 'Selected Patient'}
              </span>
              <span className="text-[10px] font-mono bg-[#EBF4EE] text-[#2D6A4F] px-2 py-0.5 rounded font-bold">
                Age {activeProfile?.age} · {activeProfile?.relationshipTag}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#526658] mt-0.5">
              <span>{activeProfile?.chronicConditions.length} chronic conditions linked</span>
              <span aria-hidden="true">·</span>
              <span>{activeProfile?.knownSensitivities.length} sensitivities active</span>
            </div>
          </div>
        </div>

        {/* Change Profile Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs text-[#6B7E70] font-mono">SWITCH PROFILE:</label>
          <select
            value={activeProfileId}
            onChange={(e) => onSelectProfileId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-[#D5E0D0] bg-[#FAFBF9] text-[#1B2A20] font-medium focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.age} yrs · {p.relationshipTag})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Banner */}
      <div className="bg-white border border-[#E3E8DE] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-[#526658]">
          <BookmarkCheck className="w-4 h-4 text-[#2D6A4F]" />
          <span className="font-medium text-[#1B2A20]">Clinical Case Archetypes:</span>
          <span className="text-[#6B7E70]">Instant configuration presets</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPreset('bedroom_insomnia')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#F3F7F1] text-[#2D6A4F] hover:bg-[#E3EFE0] transition-colors border border-[#DEEADE]"
          >
            Nocturnal Hypoxia (Bedroom)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('renovated_cat')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#F3F7F1] text-[#2D6A4F] hover:bg-[#E3EFE0] transition-colors border border-[#DEEADE]"
          >
            Renovation VOCs + Pet Safe (Cat)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('home_office_fatigue')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#F3F7F1] text-[#2D6A4F] hover:bg-[#E3EFE0] transition-colors border border-[#DEEADE]"
          >
            Brain Fog & SBS (Home Office)
          </button>
        </div>
      </div>

      {/* SECTION 1: HEALTH CONCERNS */}
      <div className="bg-white border border-[#E3E8DE] rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#E3E8DE]">
          <Activity className="w-5 h-5 text-[#2D6A4F]" />
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1B2A20]">
              Step 1: Clinical Health Concerns & Symptomatology
            </h3>
            <p className="text-xs text-[#526658] mt-0.5">
              Select all target conditions to customize biological metabolic pathways (e.g. CAM nocturnal oxygenation, formaldehyde clearance).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
          {HEALTH_CONCERNS.map((concern) => {
            const isSelected = selectedConcerns.includes(concern.id);
            return (
              <div
                key={concern.id}
                onClick={() => toggleConcern(concern.id)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-150 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#2D6A4F] bg-[#F4FAF6] shadow-xs'
                    : 'border-[#E5ECE0] bg-white hover:border-[#CAD8C3]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-serif text-sm font-bold text-[#1B2A20] leading-snug">
                      {concern.name}
                    </span>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white'
                          : 'border-[#CAD8C3] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <p className="text-xs text-[#526658] mt-2 line-clamp-2 leading-relaxed">
                    {concern.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-black/5 text-[11px] text-[#2D6A4F]">
                  <span className="font-semibold">Target Bio-Mechanism: </span>
                  <span className="text-[#405646]">{concern.primaryBioTarget.split('&')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: ROOM DIMENSIONS & ATMOSPHERE */}
      <div className="bg-white border border-[#E3E8DE] rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#E3E8DE]">
          <Home className="w-5 h-5 text-[#2D6A4F]" />
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1B2A20]">
              Step 2: Room Dimensions & Environmental Envelope
            </h3>
            <p className="text-xs text-[#526658] mt-0.5">
              Accurate room geometry defines total atmospheric volume for calculating minimum and therapeutic botanical bio-load.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {/* Room Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1B2A20]">
              Room Label / Clinical ID
            </label>
            <input
              type="text"
              value={patientRoomName}
              onChange={(e) => setPatientRoomName(e.target.value)}
              placeholder="e.g. Master Bedroom"
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#D5E0D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40"
            />
          </div>

          {/* Room Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1B2A20]">
              Room Classification
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as RoomType)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#D5E0D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40"
            >
              <option value="bedroom">Bedroom (Nocturnal O₂ Focus)</option>
              <option value="home_office">Home Office / Study (Cognitive / CO₂)</option>
              <option value="living_room">Living Room (High Airflow)</option>
              <option value="nursery">Pediatric Nursery (Non-toxic)</option>
              <option value="clinic_recovery">Patient Recovery / Clinic</option>
            </select>
          </div>

          {/* Unit System */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1B2A20]">
              Measurement System
            </label>
            <div className="flex rounded-lg border border-[#D5E0D0] p-1 bg-[#F8FAF6]">
              <button
                type="button"
                onClick={() => setUnit('metric')}
                className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${
                  unit === 'metric'
                    ? 'bg-[#2D6A4F] text-white shadow-xs'
                    : 'text-[#526658] hover:text-[#1B2A20]'
                }`}
              >
                Meters (m)
              </button>
              <button
                type="button"
                onClick={() => setUnit('imperial')}
                className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${
                  unit === 'imperial'
                    ? 'bg-[#2D6A4F] text-white shadow-xs'
                    : 'text-[#526658] hover:text-[#1B2A20]'
                }`}
              >
                Feet (ft)
              </button>
            </div>
          </div>
        </div>

        {/* Dimension Sliders & Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 p-4 bg-[#F8FAF6] rounded-xl border border-[#E5ECE0]">
          {/* Length */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#1B2A20]">
              <span>Length</span>
              <span className="font-mono text-[#2D6A4F]">
                {length} {unit === 'metric' ? 'm' : 'ft'}
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min={unit === 'metric' ? 1.5 : 5}
              max={unit === 'metric' ? 15 : 50}
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value) || 1)}
              className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-[#D5E0D0] bg-white"
            />
          </div>

          {/* Width */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#1B2A20]">
              <span>Width</span>
              <span className="font-mono text-[#2D6A4F]">
                {width} {unit === 'metric' ? 'm' : 'ft'}
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min={unit === 'metric' ? 1.5 : 5}
              max={unit === 'metric' ? 15 : 50}
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 1)}
              className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-[#D5E0D0] bg-white"
            />
          </div>

          {/* Height */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#1B2A20]">
              <span>Ceiling Height</span>
              <span className="font-mono text-[#2D6A4F]">
                {height} {unit === 'metric' ? 'm' : 'ft'}
              </span>
            </div>
            <input
              type="number"
              step="0.1"
              min={unit === 'metric' ? 1.8 : 6}
              max={unit === 'metric' ? 5.0 : 16}
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 1)}
              className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-[#D5E0D0] bg-white"
            />
          </div>
        </div>

        {/* Volumetric Output Strip */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-[#526658] px-2 font-mono">
          <span className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
            Floor Area: <strong className="text-[#1B2A20]">{area} {unit === 'metric' ? 'm²' : 'sq ft'}</strong> ({areaSqFt} sq ft)
          </span>
          <span>
            Total Air Volume: <strong className="text-[#1B2A20]">{volume} {unit === 'metric' ? 'm³' : 'cu ft'}</strong> ({volumeCubicFt} cu ft)
          </span>
        </div>

        {/* Lighting & Ventilation Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 pt-5 border-t border-[#E3E8DE]">
          {/* Light Exposure */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1B2A20] flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              Daylight Illumination
            </label>
            <select
              value={lightExposure}
              onChange={(e) => setLightExposure(e.target.value as LightExposure)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5E0D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40"
            >
              <option value="low_indirect">Low Indirect Light (North window / shaded)</option>
              <option value="medium_indirect">Medium Indirect Light (East window)</option>
              <option value="bright_indirect">Bright Indirect Light (South/West diffused)</option>
              <option value="direct_sun">Direct Sunlight (Unfiltered sun &gt;4 hrs)</option>
              <option value="windowless">Windowless (Fluorescent/LED only)</option>
            </select>
          </div>

          {/* Ventilation */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1B2A20] flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-teal-600" />
              Ventilation / Air Exchange
            </label>
            <select
              value={ventilation}
              onChange={(e) => setVentilation(e.target.value as VentilationLevel)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5E0D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40"
            >
              <option value="low_sealed">Sealed / Low Airflow (0.35 ACH)</option>
              <option value="standard_hvac">Standard HVAC Circulation (0.75 ACH)</option>
              <option value="high_ventilated">High Fresh Air Ventilation (1.4+ ACH)</option>
            </select>
          </div>

          {/* Occupants */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1B2A20]">
              Regular Sleeping / Working Occupants
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setOccupants(num)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    occupants === num
                      ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                      : 'bg-white text-[#526658] border-[#D5E0D0] hover:bg-[#F8FAF6]'
                  }`}
                >
                  {num} {num === 1 ? 'Person' : 'People'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: SAFETY & VULNERABILITIES */}
      <div className="bg-white border border-[#E3E8DE] rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#E3E8DE]">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1B2A20]">
              Step 3: Biological Safety & Household Vulnerabilities
            </h3>
            <p className="text-xs text-[#526658] mt-0.5">
              ASPCA animal toxicity cross-checking and allergen-free hydroculture protocols.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Cat Filter */}
          <div
            onClick={() => setHasCats(!hasCats)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-colors flex items-center justify-between ${
              hasCats ? 'bg-amber-50/70 border-amber-500' : 'bg-white border-[#E5ECE0]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Cat className={`w-5 h-5 ${hasCats ? 'text-amber-700' : 'text-[#6B7E70]'}`} />
              <div>
                <span className="text-xs font-bold text-[#1B2A20] block">Has Feline (Cats)</span>
                <span className="text-[11px] text-[#6B7E70]">Enforce ASPCA Cat Safe</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hasCats}
              onChange={() => {}}
              className="accent-[#2D6A4F] w-4 h-4"
            />
          </div>

          {/* Dog Filter */}
          <div
            onClick={() => setHasDogs(!hasDogs)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-colors flex items-center justify-between ${
              hasDogs ? 'bg-amber-50/70 border-amber-500' : 'bg-white border-[#E5ECE0]'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className={`w-5 h-5 ${hasDogs ? 'text-amber-700' : 'text-[#6B7E70]'}`} />
              <div>
                <span className="text-xs font-bold text-[#1B2A20] block">Has Canine (Dogs)</span>
                <span className="text-[11px] text-[#6B7E70]">Enforce ASPCA Dog Safe</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hasDogs}
              onChange={() => {}}
              className="accent-[#2D6A4F] w-4 h-4"
            />
          </div>

          {/* Small Children */}
          <div
            onClick={() => setHasSmallChildren(!hasSmallChildren)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-colors flex items-center justify-between ${
              hasSmallChildren ? 'bg-sky-50/70 border-sky-500' : 'bg-white border-[#E5ECE0]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Baby className={`w-5 h-5 ${hasSmallChildren ? 'text-sky-700' : 'text-[#6B7E70]'}`} />
              <div>
                <span className="text-xs font-bold text-[#1B2A20] block">Children &lt; 5 yrs</span>
                <span className="text-[11px] text-[#6B7E70]">No spine/irritant sap</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hasSmallChildren}
              onChange={() => {}}
              className="accent-[#2D6A4F] w-4 h-4"
            />
          </div>

          {/* Mold Spore Sensitivity */}
          <div
            onClick={() => setHasMoldSensitivity(!hasMoldSensitivity)}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-colors flex items-center justify-between ${
              hasMoldSensitivity ? 'bg-emerald-50/70 border-emerald-500' : 'bg-white border-[#E5ECE0]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Wind className={`w-5 h-5 ${hasMoldSensitivity ? 'text-emerald-700' : 'text-[#6B7E70]'}`} />
              <div>
                <span className="text-xs font-bold text-[#1B2A20] block">Mold / Spore Allergy</span>
                <span className="text-[11px] text-[#6B7E70]">Prescribe LECA / Gravel</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hasMoldSensitivity}
              onChange={() => {}}
              className="accent-[#2D6A4F] w-4 h-4"
            />
          </div>
        </div>
      </div>

      {/* Submit Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-[#526658]">
          <span>NASA Clean Air & CAM Stomata Algorithmic Formulation</span>
          <span className="mx-2">·</span>
          <span>Volumetric Bio-Load Calculated in Real-Time</span>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-medium rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>Formulate Phyto-Prescription</span>
        </button>
      </div>
    </form>
  );
};
