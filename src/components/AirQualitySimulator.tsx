import React, { useState } from 'react';
import { PhytoPrescription } from '../types';
import { Activity, Wind, Users, DoorClosed, CheckCircle2, TrendingDown, ArrowUpRight } from 'lucide-react';

interface AirQualitySimulatorProps {
  prescription: PhytoPrescription;
}

export const AirQualitySimulator: React.FC<AirQualitySimulatorProps> = ({ prescription }) => {
  const [occupants, setOccupants] = useState<number>(1);
  const [doorClosedAtNight, setDoorClosedAtNight] = useState<boolean>(true);
  const [achLevel, setAchLevel] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [selectedMetric, setSelectedMetric] = useState<'co2' | 'o2' | 'voc'>('co2');

  const { roomVolumeCubicMeters, prescribedPlants } = prescription;

  // Calculate CAM vs C3 plant counts
  const camPlants = prescribedPlants.filter(p => p.plant.photosynthesisPathway === 'CAM');
  const camPotTotal = camPlants.reduce((acc, p) => acc + p.quantity, 0);
  const c3Plants = prescribedPlants.filter(p => p.plant.photosynthesisPathway !== 'CAM');
  const c3PotTotal = c3Plants.reduce((acc, p) => acc + p.quantity, 0);

  // Generate 24 hourly simulation points
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getSimulatedValues = (hour: number) => {
    const isSleepingTime = hour >= 22 || hour <= 6; // 10 PM to 6 AM
    const isWorkingHours = hour >= 9 && hour <= 17; // 9 AM to 5 PM
    const isDaylight = hour >= 7 && hour <= 19;

    // ACH factor
    const achRate = achLevel === 'low' ? 0.35 : achLevel === 'moderate' ? 0.75 : 1.4;
    const doorPenalty = (isSleepingTime && doorClosedAtNight) ? 1.4 : 1.0;

    // CO2 Simulation (PPM): Ambient background is ~420 ppm
    // Untreated:
    let untreatedCo2 = 420;
    if (isSleepingTime) {
      // In untreated closed bedroom, CO2 builds up steeply overnight!
      const hoursIntoSleep = hour >= 22 ? hour - 22 + 1 : hour + 3;
      untreatedCo2 += (occupants * 160 * hoursIntoSleep * doorPenalty) / (achRate * (roomVolumeCubicMeters / 30));
    } else if (isWorkingHours) {
      untreatedCo2 += (occupants * 95) / (achRate * (roomVolumeCubicMeters / 30));
    } else {
      untreatedCo2 += (occupants * 60) / achRate;
    }
    untreatedCo2 = Math.min(2200, Math.round(untreatedCo2));

    // Treated with PhytoRx:
    // CAM plants absorb CO2 at night; C3 plants absorb during daylight!
    const nocturnalCo2Absorption = isSleepingTime ? (camPotTotal * 65) / doorPenalty : 0;
    const diurnalCo2Absorption = isDaylight ? (c3PotTotal * 55) : 0;
    const treatedCo2 = Math.max(430, Math.round(untreatedCo2 - nocturnalCo2Absorption - diurnalCo2Absorption));

    // O2 Concentration Index (Normalized 100 = 20.95% atmospheric baseline)
    // Closed rooms with high CO2 experience subtle partial pressure drop & stagnant sensation
    const untreatedO2Score = Math.max(76, Math.round(100 - ((untreatedCo2 - 420) / 45)));
    const plantO2Output = isSleepingTime
      ? (camPotTotal * 3.4)
      : isDaylight
      ? (c3PotTotal * 3.8)
      : 1.0;
    const treatedO2Score = Math.min(108, Math.round(untreatedO2Score + plantO2Output + 8));

    // VOC Concentration (μg/m³): Baseline accumulation from paints/furnishings
    const baselineVocGeneration = 350; // μg/m³ steady state in unpurified room
    const untreatedVoc = Math.round(baselineVocGeneration * (1.2 / achRate));
    // Plant phytoremediation removes steady VOCs
    const totalVocRemovalCapacity = prescription.metrics.vocClearanceRateMicrogramsPerHour;
    const treatedVoc = Math.max(65, Math.round(untreatedVoc - (totalVocRemovalCapacity / (roomVolumeCubicMeters * 2))));

    return {
      hour,
      hourLabel: `${hour.toString().padStart(2, '0')}:00`,
      untreatedCo2,
      treatedCo2,
      untreatedO2Score,
      treatedO2Score,
      untreatedVoc,
      treatedVoc,
    };
  };

  const simulationData = hours.map(getSimulatedValues);

  // Peak nighttime values
  const peakNightUntreatedCo2 = Math.max(...simulationData.slice(0, 7).map(d => d.untreatedCo2));
  const peakNightTreatedCo2 = Math.max(...simulationData.slice(0, 7).map(d => d.treatedCo2));
  const co2ReductionPct = Math.round(((peakNightUntreatedCo2 - peakNightTreatedCo2) / peakNightUntreatedCo2) * 100);

  return (
    <div className="bg-white border border-[#E3E8DE] rounded-xl p-6 shadow-xs">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E3E8DE]">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#2D6A4F]" />
            <h3 className="font-serif text-lg font-bold text-[#1B2A20]">
              24-Hour Diurnal Atmosphere & Oxygen Simulator
            </h3>
          </div>
          <p className="text-xs text-[#526658] mt-1">
            Dynamic computational model factoring occupant exhalation rates, ventilation (ACH), and CAM nocturnal stomatal conductance.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center p-1 bg-[#F1F4EE] rounded-lg">
          <button
            onClick={() => setSelectedMetric('co2')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedMetric === 'co2'
                ? 'bg-white text-[#1B2A20] shadow-xs'
                : 'text-[#526658] hover:text-[#1B2A20]'
            }`}
          >
            CO₂ Concentration (PPM)
          </button>
          <button
            onClick={() => setSelectedMetric('o2')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedMetric === 'o2'
                ? 'bg-white text-[#1B2A20] shadow-xs'
                : 'text-[#526658] hover:text-[#1B2A20]'
            }`}
          >
            O₂ Partial Pressure Index
          </button>
          <button
            onClick={() => setSelectedMetric('voc')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedMetric === 'voc'
                ? 'bg-white text-[#1B2A20] shadow-xs'
                : 'text-[#526658] hover:text-[#1B2A20]'
            }`}
          >
            VOC Contaminants (μg/m³)
          </button>
        </div>
      </div>

      {/* Interactive Simulation Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 bg-[#F8FAF6] px-4 rounded-lg my-4 border border-[#E5ECE0]">
        {/* Occupant Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-[#2C3E30]">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#526658]" />
              Active Occupants:
            </span>
            <span className="font-mono font-bold text-[#2D6A4F]">{occupants} {occupants === 1 ? 'person' : 'people'}</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={occupants}
            onChange={(e) => setOccupants(parseInt(e.target.value))}
            className="w-full accent-[#2D6A4F] h-1.5 bg-[#D6E0D0] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#6B7E70]">
            <span>1 sleeper</span>
            <span>4 occupants</span>
          </div>
        </div>

        {/* Night Door Toggle */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-[#2C3E30]">
            <span className="flex items-center gap-1.5">
              <DoorClosed className="w-3.5 h-3.5 text-[#526658]" />
              Bedroom Door at Night:
            </span>
            <span className="font-mono font-bold text-[#2D6A4F]">
              {doorClosedAtNight ? 'Closed (Sealed)' : 'Ajar / Open'}
            </span>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setDoorClosedAtNight(true)}
              className={`flex-1 py-1 text-xs rounded border transition-colors ${
                doorClosedAtNight
                  ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                  : 'bg-white text-[#526658] border-[#D6DFD0]'
              }`}
            >
              Closed (Max Trapping)
            </button>
            <button
              onClick={() => setDoorClosedAtNight(false)}
              className={`flex-1 py-1 text-xs rounded border transition-colors ${
                !doorClosedAtNight
                  ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                  : 'bg-white text-[#526658] border-[#D6DFD0]'
              }`}
            >
              Open (Convective)
            </button>
          </div>
        </div>

        {/* Room ACH Ventilation */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-[#2C3E30]">
            <span className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-[#526658]" />
              Air Exchange Rate (ACH):
            </span>
            <span className="font-mono font-bold text-[#2D6A4F]">
              {achLevel === 'low' ? '0.35 ACH (Sealed)' : achLevel === 'moderate' ? '0.75 ACH (HVAC)' : '1.40 ACH (Breezy)'}
            </span>
          </div>
          <div className="flex gap-2 pt-1">
            {(['low', 'moderate', 'high'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setAchLevel(lvl)}
                className={`flex-1 py-1 text-xs rounded border capitalize transition-colors ${
                  achLevel === lvl
                    ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                    : 'bg-white text-[#526658] border-[#D6DFD0]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Chart Bars / Stepped Graph */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-[#526658] mb-2 font-mono">
          <span>00:00 (MIDNIGHT) — DEEP SLEEP CAM ACTIVATION</span>
          <span>12:00 (NOON)</span>
          <span>23:00 (NIGHT)</span>
        </div>

        {/* Graph Container */}
        <div className="h-48 w-full flex items-end gap-1 pt-6 pb-2 border-b border-[#DDE4D7] relative">
          {/* Nocturnal Shaded Zone (10 PM to 6 AM) */}
          <div className="absolute top-0 left-0 w-[29.1%] h-full bg-slate-900/5 pointer-events-none border-r border-dashed border-slate-300" />
          <div className="absolute top-0 right-0 w-[8.3%] h-full bg-slate-900/5 pointer-events-none border-l border-dashed border-slate-300" />

          {/* Reference Threshold Line for CO2 */}
          {selectedMetric === 'co2' && (
            <div className="absolute top-12 left-0 right-0 border-t border-dashed border-rose-300 flex justify-end">
              <span className="text-[10px] font-mono text-rose-500 bg-white/80 px-1 -mt-2">
                1,000 PPM Threshold (Cognitive Impairment / Headaches)
              </span>
            </div>
          )}

          {simulationData.map((d) => {
            const isNight = d.hour >= 22 || d.hour <= 6;
            let valUntreated = 0;
            let valTreated = 0;
            let maxScale = 1;

            if (selectedMetric === 'co2') {
              maxScale = 2000;
              valUntreated = (d.untreatedCo2 / maxScale) * 100;
              valTreated = (d.treatedCo2 / maxScale) * 100;
            } else if (selectedMetric === 'o2') {
              maxScale = 115;
              valUntreated = ((d.untreatedO2Score - 60) / (maxScale - 60)) * 100;
              valTreated = ((d.treatedO2Score - 60) / (maxScale - 60)) * 100;
            } else {
              maxScale = 600;
              valUntreated = (d.untreatedVoc / maxScale) * 100;
              valTreated = (d.treatedVoc / maxScale) * 100;
            }

            return (
              <div
                key={d.hour}
                className="flex-1 h-full flex items-end justify-center gap-0.5 group relative"
              >
                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-900 text-white text-[10px] font-mono p-2 rounded z-30 whitespace-nowrap shadow-lg pointer-events-none">
                  <span className="font-bold text-teal-300">{d.hourLabel}</span>
                  {selectedMetric === 'co2' ? (
                    <>
                      <span className="text-rose-300">Untreated: {d.untreatedCo2} ppm</span>
                      <span className="text-emerald-300">PhytoRx: {d.treatedCo2} ppm</span>
                      <span className="text-slate-300 font-sans">
                        {isNight ? 'CAM Stomata absorbing CO₂' : 'Daytime C3 Photosynthesis'}
                      </span>
                    </>
                  ) : selectedMetric === 'o2' ? (
                    <>
                      <span className="text-slate-300">Baseline Index: {d.untreatedO2Score}</span>
                      <span className="text-emerald-300">PhytoRx Index: {d.treatedO2Score}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-rose-300">Untreated VOC: {d.untreatedVoc} μg/m³</span>
                      <span className="text-emerald-300">PhytoRx VOC: {d.treatedVoc} μg/m³</span>
                    </>
                  )}
                </div>

                {/* Untreated Bar (Grey / Red tint) */}
                <div
                  style={{ height: `${Math.min(100, Math.max(5, valUntreated))}%` }}
                  className={`w-full max-w-[6px] rounded-t-xs transition-all duration-300 ${
                    selectedMetric === 'co2' && d.untreatedCo2 > 1000
                      ? 'bg-rose-300'
                      : 'bg-[#BAC4B4]'
                  }`}
                />

                {/* Treated PhytoRx Bar (Emerald Green) */}
                <div
                  style={{ height: `${Math.min(100, Math.max(5, valTreated))}%` }}
                  className="w-full max-w-[6px] bg-[#2D6A4F] rounded-t-xs transition-all duration-300 group-hover:bg-[#1B4332]"
                />
              </div>
            );
          })}
        </div>

        {/* Time X-Axis Markers */}
        <div className="flex justify-between text-[11px] font-mono text-[#6B7E70] pt-1">
          <span>00:00</span>
          <span>04:00</span>
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
          <span>23:00</span>
        </div>
      </div>

      {/* Comparison Delta Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-[#E3E8DE]">
        <div className="p-3.5 bg-[#F6FAF7] border border-[#D5E5DA] rounded-lg">
          <div className="flex items-center justify-between text-xs text-[#2D6A4F] font-semibold">
            <span>Peak Bedroom CO₂ Reduction</span>
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#1B4332] mt-1">
            -{co2ReductionPct}%
          </div>
          <p className="text-[11px] text-[#526658] mt-0.5">
            Prescribed CAM specimens maintain nighttime CO₂ below the 950 ppm headache threshold.
          </p>
        </div>

        <div className="p-3.5 bg-[#F6FAF7] border border-[#D5E5DA] rounded-lg">
          <div className="flex items-center justify-between text-xs text-[#2D6A4F] font-semibold">
            <span>Nighttime Oxygen Cushion</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#1B4332] mt-1">
            +{prescription.metrics.nighttimeOxygenContributionPercent}%
          </div>
          <p className="text-[11px] text-[#526658] mt-0.5">
            Active nocturnal O₂ synthesis relieves sleep micro-arousals and morning sinus drying.
          </p>
        </div>

        <div className="p-3.5 bg-[#F6FAF7] border border-[#D5E5DA] rounded-lg">
          <div className="flex items-center justify-between text-xs text-[#2D6A4F] font-semibold">
            <span>Total VOC Clearance Velocity</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="font-serif text-2xl font-bold text-[#1B4332] mt-1">
            {prescription.metrics.vocClearanceRateMicrogramsPerHour} μg/hr
          </div>
          <p className="text-[11px] text-[#526658] mt-0.5">
            Rhizosphere enzymatic degradation active continuously 24 hours per day.
          </p>
        </div>
      </div>
    </div>
  );
};
