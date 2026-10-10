import React, { useState } from 'react';
import { PhytoPrescription, PrescribedPlantItem } from '../types';
import { Sun, Moon, Wind, Sparkles, Droplets, ShieldCheck, Info } from 'lucide-react';

interface RoomVisualizerProps {
  prescription: PhytoPrescription;
}

export const RoomVisualizer: React.FC<RoomVisualizerProps> = ({ prescription }) => {
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>(
    prescription.roomType === 'bedroom' ? 'night' : 'day'
  );
  const [activeOverlay, setActiveOverlay] = useState<'oxygen' | 'voc' | 'humidity'>('oxygen');
  const [selectedPlant, setSelectedPlant] = useState<PrescribedPlantItem | null>(
    prescription.prescribedPlants[0] || null
  );

  const { roomType, roomAreaSqMeters, roomAreaSqFeet, prescribedPlants } = prescription;

  // Calculate coordinates for plant nodes inside room container
  const getNodeCoordinates = (index: number, total: number, plant: PrescribedPlantItem) => {
    const isCam = plant.plant.photosynthesisPathway === 'CAM';

    // Position intelligently based on room type
    if (roomType === 'bedroom') {
      if (isCam && index === 0) return { x: 26, y: 32, label: 'Bedside O₂ Node' };
      if (isCam && index === 1) return { x: 74, y: 32, label: 'Secondary Bedside Node' };
      if (index === 2) return { x: 80, y: 75, label: 'Window Transpiration Node' };
      return { x: 25, y: 78, label: 'Doorway Air Circulation' };
    }

    if (roomType === 'home_office') {
      if (plant.plant.id === 'rosemary_medicinal') return { x: 38, y: 44, label: 'Cognitive Workstation Node' };
      if (index === 0) return { x: 65, y: 44, label: 'Desk Oxygen Companion' };
      if (index === 1) return { x: 82, y: 72, label: 'Window Sunlight Zone' };
      return { x: 22, y: 78, label: 'Air Intake Scrubber' };
    }

    // Default distribution
    const positions = [
      { x: 22, y: 30, label: 'Northwest Air Zone' },
      { x: 78, y: 30, label: 'Northeast Window Zone' },
      { x: 80, y: 75, label: 'Southeast Microclimate' },
      { x: 22, y: 75, label: 'Southwest Air Exchange' },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="bg-[#FCFDFB] border border-[#E3E8DE] rounded-xl overflow-hidden shadow-xs">
      {/* Top Controls Header */}
      <div className="px-6 py-4 bg-white border-b border-[#E3E8DE] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-[#1B2A20]">
              Interactive Phytotopography & Micro-Zone Simulator
            </h3>
            <span className="text-xs font-mono text-[#2D6A4F] bg-[#EBF4EE] px-2 py-0.5 rounded">
              {roomAreaSqMeters} m² / {roomAreaSqFeet} sq ft
            </span>
          </div>
          <p className="text-xs text-[#526658] mt-0.5">
            Spatial distribution of botanical CADR biofilters according to room convection and diurnal cycles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Day / Night Cycle */}
          <div className="flex items-center p-1 bg-[#F1F4EE] rounded-lg">
            <button
              onClick={() => setTimeOfDay('day')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                timeOfDay === 'day'
                  ? 'bg-white text-[#1B2A20] shadow-xs'
                  : 'text-[#526658] hover:text-[#1B2A20]'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Day (C3 Active)</span>
            </button>
            <button
              onClick={() => setTimeOfDay('night')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                timeOfDay === 'night'
                  ? 'bg-[#182C25] text-white shadow-xs'
                  : 'text-[#526658] hover:text-[#1B2A20]'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-teal-300" />
              <span>Night (CAM Active)</span>
            </button>
          </div>

          {/* Micro-flow Overlay */}
          <div className="flex items-center p-1 bg-[#F1F4EE] rounded-lg">
            <button
              onClick={() => setActiveOverlay('oxygen')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeOverlay === 'oxygen'
                  ? 'bg-[#2D6A4F] text-white shadow-xs'
                  : 'text-[#526658] hover:text-[#1B2A20]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>O₂ Plume</span>
            </button>
            <button
              onClick={() => setActiveOverlay('voc')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeOverlay === 'voc'
                  ? 'bg-[#2D6A4F] text-white shadow-xs'
                  : 'text-[#526658] hover:text-[#1B2A20]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VOC Scrubber</span>
            </button>
            <button
              onClick={() => setActiveOverlay('humidity')}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeOverlay === 'humidity'
                  ? 'bg-[#2D6A4F] text-white shadow-xs'
                  : 'text-[#526658] hover:text-[#1B2A20]'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Humidity Mist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Floor Plan Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Floor Plan Canvas */}
        <div className="lg:col-span-8 p-6 flex flex-col items-center justify-center">
          <div
            className={`relative w-full max-w-xl aspect-4/3 rounded-xl border-2 transition-colors duration-500 overflow-hidden ${
              timeOfDay === 'night'
                ? 'bg-[#0E1B15] border-[#223E32] text-slate-100'
                : 'bg-[#F5F8F3] border-[#DCE4D6] text-slate-800'
            }`}
          >
            {/* Ambient Lighting Rays / Night Glow */}
            {timeOfDay === 'day' ? (
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/60 via-amber-50/20 to-transparent pointer-events-none" />
            ) : (
              <div className="absolute inset-0 bg-radial from-teal-900/15 via-transparent to-black/30 pointer-events-none" />
            )}

            {/* Architectural Markings: Room Boundaries */}
            <div className="absolute inset-4 border border-dashed border-current/20 rounded-lg pointer-events-none flex flex-col justify-between p-2 text-[10px] font-mono opacity-50">
              <div className="flex justify-between">
                <span>WALL: 01 (EXTERIOR)</span>
                <span>WINDOW LIGHT AXIS</span>
              </div>
              <div className="flex justify-between">
                <span>DOOR AIRWAY (0.7 ACH)</span>
                <span>VOLUMETRIC ENVELOPE</span>
              </div>
            </div>

            {/* Window at Top-Right */}
            <div className="absolute top-0 right-12 w-32 h-2.5 bg-sky-300 border-x-2 border-b border-sky-400 flex items-center justify-center">
              <span className="text-[9px] font-mono uppercase text-sky-900 tracking-wider">Window</span>
            </div>

            {/* Door at Bottom-Left */}
            <div className="absolute bottom-0 left-12 w-20 h-2 bg-amber-400 border-x-2 border-t border-amber-600 flex items-center justify-center">
              <span className="text-[8px] font-mono uppercase text-amber-950 font-bold">Door</span>
            </div>

            {/* Convection Air Current Arrows */}
            <div className="absolute bottom-6 left-20 pointer-events-none opacity-40 flex items-center gap-1 text-[10px] text-teal-600">
              <Wind className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-[9px]">Gentle HVAC Convection Vector</span>
            </div>

            {/* Furniture Mockup based on Room Type */}
            {roomType === 'bedroom' && (
              <div
                className={`absolute top-14 left-1/2 -translate-x-1/2 w-48 h-40 rounded-lg border flex flex-col items-center justify-between p-2 shadow-xs transition-colors ${
                  timeOfDay === 'night'
                    ? 'bg-[#172A22] border-[#294B3D]'
                    : 'bg-white border-[#D6DFD0]'
                }`}
              >
                <div className="w-full flex justify-around">
                  <div className={`w-14 h-7 rounded border ${timeOfDay === 'night' ? 'bg-[#213B30] border-[#2E5343]' : 'bg-[#EBF1E8] border-[#CFDBC8]'}`} />
                  <div className={`w-14 h-7 rounded border ${timeOfDay === 'night' ? 'bg-[#213B30] border-[#2E5343]' : 'bg-[#EBF1E8] border-[#CFDBC8]'}`} />
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                    Occupant Sleep Zone
                  </span>
                  <div className="text-[9px] opacity-40">Hypoxia Sensitivity Area</div>
                </div>
                <div className="w-full h-1 bg-current opacity-10 rounded" />
              </div>
            )}

            {roomType === 'home_office' && (
              <div
                className={`absolute top-16 left-1/2 -translate-x-1/2 w-52 h-28 rounded-lg border flex flex-col items-center justify-center p-2 shadow-xs transition-colors ${
                  timeOfDay === 'night'
                    ? 'bg-[#172A22] border-[#294B3D]'
                    : 'bg-white border-[#D6DFD0]'
                }`}
              >
                <div className="w-16 h-3 rounded bg-slate-400 opacity-60 mb-2" />
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                  Ergonomic Workstation
                </span>
                <span className="text-[9px] opacity-40">CO₂ Accumulation Zone (Brain Fog Risk)</span>
              </div>
            )}

            {(roomType === 'living_room' || roomType === 'clinic_recovery' || roomType === 'nursery') && (
              <div
                className={`absolute top-16 left-1/2 -translate-x-1/2 w-56 h-32 rounded-lg border flex flex-col items-center justify-center p-2 shadow-xs transition-colors ${
                  timeOfDay === 'night'
                    ? 'bg-[#172A22] border-[#294B3D]'
                    : 'bg-white border-[#D6DFD0]'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                  {roomType === 'nursery' ? 'Crib & Pediatric Air Space' : 'Primary Bio-Remediation Core'}
                </span>
                <span className="text-[9px] opacity-40">Living Air Quality Focus</span>
              </div>
            )}

            {/* Plant Nodes */}
            {prescribedPlants.map((item, idx) => {
              const coords = getNodeCoordinates(idx, prescribedPlants.length, item);
              const isSelected = selectedPlant?.plant.id === item.plant.id;
              const isCam = item.plant.photosynthesisPathway === 'CAM';
              const isNightActive = isCam && timeOfDay === 'night';
              const isDayActive = !isCam && timeOfDay === 'day';

              return (
                <div
                  key={item.plant.id}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  {/* Halo effect for active gas exchange */}
                  <div
                    className={`absolute -inset-4 rounded-full transition-all duration-700 pointer-events-none ${
                      activeOverlay === 'oxygen'
                        ? isNightActive
                          ? 'bg-emerald-400/25 ring-8 ring-emerald-400/10 animate-pulse'
                          : isDayActive
                          ? 'bg-green-400/20 ring-6 ring-green-400/10'
                          : 'opacity-10'
                        : activeOverlay === 'voc'
                        ? 'bg-cyan-400/20 ring-6 ring-cyan-400/10'
                        : 'bg-blue-400/20 ring-6 ring-blue-400/10'
                    }`}
                  />

                  {/* Clickable Node */}
                  <button
                    onClick={() => setSelectedPlant(item)}
                    className={`relative group flex items-center justify-center w-10 h-10 rounded-full border-2 transition-transform transform hover:scale-110 shadow-sm ${
                      isSelected
                        ? 'border-white bg-[#2D6A4F] text-white ring-3 ring-[#2D6A4F]/40'
                        : timeOfDay === 'night'
                        ? 'border-[#3D6954] bg-[#163024] text-emerald-200'
                        : 'border-[#408560] bg-[#EBF4EE] text-[#1B2A20]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold">
                      {idx + 1}
                    </span>

                    {/* Plant Quantity Badge if > 1 */}
                    {item.quantity > 1 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                        {item.quantity}
                      </span>
                    )}

                    {/* Subtle CAM indicator */}
                    {isCam && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-teal-500 text-white text-[8px] flex items-center justify-center font-mono">
                        C
                      </span>
                    )}
                  </button>

                  {/* Micro label */}
                  <div className="absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded shadow-xs ${
                        timeOfDay === 'night'
                          ? 'bg-black/75 text-emerald-300'
                          : 'bg-white/90 text-[#1B2A20] border border-[#E3E8DE]'
                      }`}
                    >
                      {item.plant.commonName.split('(')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Micro legend */}
          <div className="w-full max-w-xl mt-3 flex items-center justify-between text-xs text-[#526658]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                CAM Nocturnal O₂ Active
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                C3 Daytime Engine
              </span>
            </div>
            <span className="font-mono text-[11px]">
              Tap any numbered node (1–{prescribedPlants.length}) to inspect telemetry
            </span>
          </div>
        </div>

        {/* Selected Plant Microclimate Telemetry Card */}
        <div className="lg:col-span-4 p-6 bg-white border-t lg:border-t-0 lg:border-l border-[#E3E8DE] flex flex-col justify-between">
          {selectedPlant ? (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#2D6A4F] font-semibold">
                  Micro-Zone Telemetry
                </span>
                <span className="text-xs font-mono text-[#6B7E70]">
                  Pot: {selectedPlant.potSizeInches}&quot; ({selectedPlant.quantity}x units)
                </span>
              </div>

              <h4 className="font-serif text-lg font-bold text-[#1B2A20] mt-1">
                {selectedPlant.plant.commonName}
              </h4>
              <p className="text-xs italic text-[#526658] font-serif">
                {selectedPlant.plant.scientificName} · {selectedPlant.plant.botanicalFamily}
              </p>

              {/* Photosynthesis badge & status */}
              <div className="mt-3 p-2.5 bg-[#F8FAF7] border border-[#E5EBE1] rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#293E30]">Photosynthetic Pathway:</span>
                  <span className="font-mono font-bold text-[#2D6A4F]">
                    {selectedPlant.plant.photosynthesisPathway} (
                    {selectedPlant.plant.photosynthesisPathway === 'CAM'
                      ? 'Crassulacean Acid'
                      : 'Calvin Cycle C3'}
                    )
                  </span>
                </div>
                <p className="text-[11px] text-[#526658] mt-1 leading-relaxed">
                  {selectedPlant.plant.photosynthesisPathway === 'CAM'
                    ? 'Stomata open at night: Inhales accumulated bedroom CO₂ in darkness and releases continuous medical oxygen during your sleep cycle.'
                    : 'High daytime gas-exchange rate: Drives rapid moisture transpiration and VOC breakdown during active daylight hours.'}
                </p>
              </div>

              {/* Phytoremediation Metrics */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#526658]">Nocturnal O₂ Delivery:</span>
                  <span className="font-mono font-semibold text-[#1B2A20]">
                    {selectedPlant.plant.nocturnalOxygenScore}/10 rating
                  </span>
                </div>
                <div className="w-full bg-[#EBF0E6] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2D6A4F] h-full"
                    style={{ width: `${selectedPlant.plant.nocturnalOxygenScore * 10}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#526658]">Formaldehyde Breakdown:</span>
                  <span className="font-mono font-semibold text-[#1B2A20]">
                    {selectedPlant.plant.vocRemoval.formaldehyde} μg/hr / pot
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#526658]">Transpiration Mist Score:</span>
                  <span className="font-mono font-semibold text-[#1B2A20]">
                    {selectedPlant.plant.transpirationRateScore}/10 ({selectedPlant.plant.transpirationRateScore >= 8 ? 'High Natural Humidifier' : 'Moderate Moisture'})
                  </span>
                </div>
              </div>

              {/* Exact Placement Prescription */}
              <div className="mt-4 p-3 bg-[#EBF4EE] rounded-lg border border-[#D5E5D9]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4332]">
                  <Info className="w-3.5 h-3.5" />
                  <span>Clinical Placement Directive:</span>
                </div>
                <p className="text-xs text-[#2D6A4F] mt-1 leading-relaxed">
                  {selectedPlant.placementLocation}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#6B7E70]">
              Select a plant node on the room floor plan to inspect its biological parameters.
            </div>
          )}

          {/* Quick Care Summary */}
          {selectedPlant && (
            <div className="mt-4 pt-3 border-t border-[#E3E8DE] text-[11px] text-[#526658] flex justify-between">
              <span>{selectedPlant.waterDosage.split('.')[0]}</span>
              <span className="font-medium text-[#1B2A20]">
                {selectedPlant.plant.careDifficulty} Care
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
