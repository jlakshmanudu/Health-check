import React, { useState } from 'react';
import { MEDICINAL_PLANTS } from '../data/plants';
import { PlantSpecies } from '../types';
import {
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Moon,
  Sun,
  Droplets,
  Wind,
  Check,
  BookOpen,
} from 'lucide-react';

export const BotanicalCompendium: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pathwayFilter, setPathwayFilter] = useState<'all' | 'CAM' | 'C3'>('all');
  const [petSafeOnly, setPetSafeOnly] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantSpecies | null>(MEDICINAL_PLANTS[0]);

  const filteredPlants = MEDICINAL_PLANTS.filter((plant) => {
    const matchesSearch =
      plant.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.botanicalFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.therapeuticBenefits.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPathway = pathwayFilter === 'all' || plant.photosynthesisPathway === pathwayFilter;
    const matchesPet = !petSafeOnly || (plant.petToxicity.safeForCats && plant.petToxicity.safeForDogs);

    return matchesSearch && matchesPathway && matchesPet;
  });

  return (
    <div className="space-y-6">
      {/* Compendium Header & Filters */}
      <div className="bg-white border border-[#E3E8DE] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E3E8DE]">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2D6A4F]" />
              <h3 className="font-serif text-lg font-bold text-[#1B2A20]">
                Clinical Botanical Pharmacopeia
              </h3>
            </div>
            <p className="text-xs text-[#526658] mt-1">
              Peer-reviewed database of phytoremediation species, NASA Clean Air scores, and diurnal stomatal conductance.
            </p>
          </div>

          {/* Quick Pet Safe toggle */}
          <button
            onClick={() => setPetSafeOnly(!petSafeOnly)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors ${
              petSafeOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-[#526658] border-[#D5E0D0] hover:text-[#1B2A20]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ASPCA Pet-Safe Only</span>
            {petSafeOnly && <Check className="w-3.5 h-3.5 text-emerald-700 ml-1" />}
          </button>
        </div>

        {/* Search & Pathway Segments */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8A9B8F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by common name, Latin binominal, family, or symptom..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#D5E0D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40"
            />
          </div>

          <div className="flex items-center p-1 bg-[#F1F4EE] rounded-lg shrink-0">
            <button
              onClick={() => setPathwayFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathwayFilter === 'all'
                  ? 'bg-white text-[#1B2A20] shadow-xs'
                  : 'text-[#526658] hover:text-[#1B2A20]'
              }`}
            >
              All Pathways
            </button>
            <button
              onClick={() => setPathwayFilter('CAM')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathwayFilter === 'CAM'
                  ? 'bg-white text-[#1B2A20] shadow-xs'
                  : 'text-[#526658] hover:text-[#1B2A20]'
              }`}
            >
              CAM (Nocturnal O₂)
            </button>
            <button
              onClick={() => setPathwayFilter('C3')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathwayFilter === 'C3'
                  ? 'bg-white text-[#1B2A20] shadow-xs'
                  : 'text-[#526658] hover:text-[#1B2A20]'
              }`}
            >
              C3 (Daytime Engine)
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Plant List on Left, Detailed Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs text-[#6B7E70] font-mono px-1">
            Displaying {filteredPlants.length} species matching criteria
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredPlants.map((plant) => {
              const isSelected = selectedPlant?.id === plant.id;
              const isPetSafe = plant.petToxicity.safeForCats && plant.petToxicity.safeForDogs;

              return (
                <div
                  key={plant.id}
                  onClick={() => setSelectedPlant(plant)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-[#2D6A4F] bg-[#F3F8F4] shadow-xs ring-1 ring-[#2D6A4F]/20'
                      : 'border-[#E3E8DE] bg-white hover:border-[#CAD8C3]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#1B2A20]">
                        {plant.commonName}
                      </h4>
                      <p className="text-xs italic text-[#526658] font-serif mt-0.5">
                        {plant.scientificName}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-bold text-[#2D6A4F]">
                        {plant.totalNasaEfficacyScore}/100
                      </span>
                      <span className="text-[10px] text-[#6B7E70] block">NASA Score</span>
                    </div>
                  </div>

                  {/* Micro Metadata Strip (Zero-pill compliant: unboxed text with dot separators) */}
                  <div className="flex items-center gap-2 text-[11px] text-[#526658] mt-3 pt-2.5 border-t border-black/5 font-mono">
                    <span className={plant.photosynthesisPathway === 'CAM' ? 'text-teal-700 font-semibold' : ''}>
                      {plant.photosynthesisPathway} Pathway
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={isPetSafe ? 'text-emerald-700' : 'text-amber-700'}>
                      {isPetSafe ? 'ASPCA Pet-Safe' : 'Toxic to Pets'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{plant.careDifficulty} Care</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-depth Clinical Dossier */}
        <div className="lg:col-span-7">
          {selectedPlant ? (
            <div className="bg-white border border-[#E3E8DE] rounded-xl p-6 shadow-xs sticky top-4 space-y-6">
              {/* Header Dossier */}
              <div className="border-b border-[#E3E8DE] pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#2D6A4F] font-semibold">
                    Pharmacopeia Monograph
                  </span>
                  <span className="text-xs font-mono text-[#6B7E70]">
                    Family: {selectedPlant.botanicalFamily}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#1B2A20] mt-1">
                  {selectedPlant.commonName}
                </h3>
                <p className="text-sm italic text-[#526658] font-serif mt-0.5">
                  {selectedPlant.scientificName}
                </p>

                <p className="text-xs text-[#405646] mt-3 leading-relaxed">
                  {selectedPlant.overview}
                </p>
              </div>

              {/* Photosynthesis & Oxygen Kinetics */}
              <div className="p-4 bg-[#F8FAF7] border border-[#E5ECE0] rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedPlant.photosynthesisPathway === 'CAM' ? (
                      <Moon className="w-4 h-4 text-teal-700" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-600" />
                    )}
                    <span className="text-xs font-bold text-[#1B2A20]">
                      {selectedPlant.photosynthesisPathway} Metabolic Stomata Dynamics
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#2D6A4F]">
                    {selectedPlant.photosynthesisPathway === 'CAM' ? 'Nocturnal Stomata Open' : 'Daylight Transpiration'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#E5ECE0] text-xs">
                  <div>
                    <span className="text-[#6B7E70] block">Night O₂ Delivery Score:</span>
                    <span className="font-mono font-bold text-[#1B2A20] text-sm">
                      {selectedPlant.nocturnalOxygenScore} / 10
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6B7E70] block">Day O₂ Synthesis Score:</span>
                    <span className="font-mono font-bold text-[#1B2A20] text-sm">
                      {selectedPlant.daytimeOxygenScore} / 10
                    </span>
                  </div>
                </div>
              </div>

              {/* NASA Removal Rates Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B2A20] mb-3 font-mono">
                  NASA Clean Air Volatile Removal Capacity (μg/hr / 8&quot; pot)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#FAFBF9] border border-[#E8EEE5] rounded-lg">
                    <span className="text-[10px] text-[#6B7E70] block font-mono">FORMALDEHYDE (HCHO)</span>
                    <span className="font-mono text-sm font-bold text-[#2D6A4F]">
                      {selectedPlant.vocRemoval.formaldehyde} μg/hr
                    </span>
                  </div>
                  <div className="p-3 bg-[#FAFBF9] border border-[#E8EEE5] rounded-lg">
                    <span className="text-[10px] text-[#6B7E70] block font-mono">BENZENE (C₆H₆)</span>
                    <span className="font-mono text-sm font-bold text-[#2D6A4F]">
                      {selectedPlant.vocRemoval.benzene} μg/hr
                    </span>
                  </div>
                  <div className="p-3 bg-[#FAFBF9] border border-[#E8EEE5] rounded-lg">
                    <span className="text-[10px] text-[#6B7E70] block font-mono">XYLENE / TOLUENE</span>
                    <span className="font-mono text-sm font-bold text-[#2D6A4F]">
                      {selectedPlant.vocRemoval.xyleneToluene} μg/hr
                    </span>
                  </div>
                  <div className="p-3 bg-[#FAFBF9] border border-[#E8EEE5] rounded-lg">
                    <span className="text-[10px] text-[#6B7E70] block font-mono">TRICHLOROETHYLENE</span>
                    <span className="font-mono text-sm font-bold text-[#2D6A4F]">
                      {selectedPlant.vocRemoval.trichloroethylene} μg/hr
                    </span>
                  </div>
                  <div className="p-3 bg-[#FAFBF9] border border-[#E8EEE5] rounded-lg">
                    <span className="text-[10px] text-[#6B7E70] block font-mono">CARBON MONOXIDE (CO)</span>
                    <span className="font-mono text-sm font-bold text-[#2D6A4F]">
                      {selectedPlant.vocRemoval.carbonMonoxide} μg/hr
                    </span>
                  </div>
                  <div className="p-3 bg-[#FAFBF9] border border-[#E8EEE5] rounded-lg">
                    <span className="text-[10px] text-[#6B7E70] block font-mono">AMMONIA (NH₃)</span>
                    <span className="font-mono text-sm font-bold text-[#2D6A4F]">
                      {selectedPlant.vocRemoval.ammonia} μg/hr
                    </span>
                  </div>
                </div>
              </div>

              {/* Therapeutic Clinical Benefits */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B2A20] mb-2 font-mono">
                  Clinical Evidence & Therapeutic Actions:
                </h4>
                <ul className="space-y-2 text-xs text-[#405646]">
                  {selectedPlant.therapeuticBenefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#2D6A4F] font-bold mt-0.5">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ASPCA Animal Toxicology & Safety Profile */}
              <div
                className={`p-4 rounded-xl border ${
                  selectedPlant.petToxicity.safeForCats && selectedPlant.petToxicity.safeForDogs
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedPlant.petToxicity.safeForCats && selectedPlant.petToxicity.safeForDogs ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                  )}
                  <span className="text-xs font-bold text-[#1B2A20]">
                    ASPCA Toxicology Evaluation:
                  </span>
                </div>
                <p className="text-xs text-[#526658] mt-1.5 leading-relaxed">
                  {selectedPlant.petToxicity.clinicalNotes}
                </p>
                {selectedPlant.petToxicity.toxicPrinciple && (
                  <div className="text-[11px] font-mono text-amber-900 mt-1">
                    <strong>Active Toxin Principle: </strong>
                    {selectedPlant.petToxicity.toxicPrinciple}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
