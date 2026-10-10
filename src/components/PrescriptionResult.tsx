import React from 'react';
import { PhytoPrescription, PrescribedPlantItem } from '../types';
import {
  Printer,
  Sparkles,
  ShieldCheck,
  Droplets,
  Wind,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Info,
  Maximize2,
  Layers,
  HeartPulse,
} from 'lucide-react';

interface PrescriptionResultProps {
  prescription: PhytoPrescription;
  onModify: () => void;
  onViewSpatialVisualizer: () => void;
}

export const PrescriptionResult: React.FC<PrescriptionResultProps> = ({
  prescription,
  onModify,
  onViewSpatialVisualizer,
}) => {
  const {
    rxId,
    dateGenerated,
    patientRoomName,
    roomType,
    roomAreaSqMeters,
    roomAreaSqFeet,
    roomVolumeCubicMeters,
    primaryConcerns,
    prescribedPlants,
    totalPlantCount,
    metrics,
    clinicalCareProtocol,
    precautions,
  } = prescription;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden on print) */}
      <div className="no-print bg-white border border-[#E3E8DE] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-[#526658]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[#1B2A20]">Official Phyto-Prescription Formulated</span>
          <span className="text-[#6B7E70]">· Rx ID: {rxId}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onModify}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-[#D5E0D0] text-[#526658] hover:text-[#1B2A20] hover:bg-[#F8FAF6] transition-colors"
          >
            Adjust Parameters
          </button>
          <button
            onClick={onViewSpatialVisualizer}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#EBF4EE] text-[#2D6A4F] hover:bg-[#D8EBE0] transition-colors flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Interactive Floor Plan</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-[#2D6A4F] text-white hover:bg-[#1B4332] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Clinical Rx</span>
          </button>
        </div>
      </div>

      {/* THE CLINICAL PRESCRIPTION DOCUMENT */}
      <div className="bg-white border-2 border-[#DCE4D6] rounded-2xl p-6 md:p-10 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-[#1B2A20] pb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl font-bold tracking-tight text-[#1B2A20]">
                PhytoRx
              </span>
              <span className="text-[11px] font-mono tracking-widest uppercase bg-[#1B2A20] text-white px-2 py-0.5 rounded">
                CLINICAL BOTANICAL Rx
              </span>
            </div>
            <p className="text-xs text-[#526658] mt-1">
              Phytoremediation & Diurnal Oxygen Prescription Protocol · NASA Clean Air Benchmark
            </p>
          </div>

          {/* Rx Meta Details */}
          <div className="font-mono text-xs text-right space-y-0.5">
            <div>
              <span className="text-[#6B7E70]">PRESCRIPTION ID: </span>
              <strong className="text-[#1B2A20]">{rxId}</strong>
            </div>
            <div>
              <span className="text-[#6B7E70]">DATE ISSUED: </span>
              <span className="text-[#1B2A20]">{dateGenerated}</span>
            </div>
            <div>
              <span className="text-[#6B7E70]">TARGET ENVIRONMENT: </span>
              <span className="text-[#1B2A20] uppercase font-semibold">{patientRoomName}</span>
            </div>
            {prescription.patientProfileSummary && (
              <div>
                <span className="text-[#6B7E70]">PATIENT IDENTIFIER: </span>
                <span className="text-[#2D6A4F] uppercase font-bold">
                  {prescription.patientProfileSummary.patientName} (Age {prescription.patientProfileSummary.age} · {prescription.patientProfileSummary.ageBracket})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Patient Profile Diagnostic Banner */}
        {prescription.patientProfileSummary && (
          <div className="my-5 p-4 bg-[#F5F8F4] border border-[#D5E3D4] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#1B4332] uppercase">
                  Patient Clinical Profile: {prescription.patientProfileSummary.patientName}
                </span>
                <span className="text-[10px] font-mono bg-[#2D6A4F] text-white px-1.5 py-0.2 rounded">
                  {prescription.patientProfileSummary.relationshipTag}
                </span>
              </div>
              <div className="text-xs text-[#526658]">
                <strong>Conditions: </strong>
                {prescription.patientProfileSummary.matchedConditions.length > 0
                  ? prescription.patientProfileSummary.matchedConditions.map((c) => c.replace('_', ' ')).join(', ')
                  : 'None declared'}
                <span className="mx-2">·</span>
                <strong>Sensitivities: </strong>
                {prescription.patientProfileSummary.activeSensitivities.length > 0
                  ? prescription.patientProfileSummary.activeSensitivities.map((s) => s.replace('_', ' ')).join(', ')
                  : 'None declared'}
              </div>
            </div>

            {/* Safety tags */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {prescription.safetyConstraints.latexAllergySafe && (
                <span className="text-[10px] font-mono bg-white text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-semibold">
                  ✓ Latex-Safe
                </span>
              )}
              {prescription.safetyConstraints.fragranceFreeStrict && (
                <span className="text-[10px] font-mono bg-white text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-semibold">
                  ✓ Fragrance-Free
                </span>
              )}
              {prescription.safetyConstraints.moldSafeSoilProtocol && (
                <span className="text-[10px] font-mono bg-white text-teal-800 border border-teal-300 px-2 py-0.5 rounded font-semibold">
                  ✓ Inorganic LECA
                </span>
              )}
              {prescription.safetyConstraints.childSafeStrict && (
                <span className="text-[10px] font-mono bg-white text-sky-800 border border-sky-300 px-2 py-0.5 rounded font-semibold">
                  ✓ Child Fronds
                </span>
              )}
            </div>
          </div>
        )}

        {/* Applied Profile Personalizations */}
        {prescription.appliedPersonalizations && prescription.appliedPersonalizations.length > 0 && (
          <div className="mb-6 p-4 bg-[#FAFBF8] border border-[#DEE7DB] rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] block mb-2 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Patient Profile Customizations Applied to this Rx:
            </span>
            <ul className="space-y-1.5 text-xs text-[#405646]">
              {prescription.appliedPersonalizations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Clinical Patient & Room Envelope Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#E3E8DE] bg-[#F9FAF8] px-4 rounded-lg my-6">
          <div>
            <span className="text-[10px] font-mono text-[#6B7E70] uppercase block">Room Enclosure</span>
            <span className="text-xs font-semibold text-[#1B2A20] capitalize">
              {roomType.replace('_', ' ')}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#6B7E70] uppercase block">Volumetric Envelope</span>
            <span className="text-xs font-semibold text-[#1B2A20] font-mono">
              {roomAreaSqMeters} m² ({roomVolumeCubicMeters} m³)
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#6B7E70] uppercase block">Total Bio-Load</span>
            <span className="text-xs font-semibold text-[#2D6A4F] font-mono">
              {totalPlantCount} Therapeutic Pots
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#6B7E70] uppercase block">CADR Equivalent</span>
            <span className="text-xs font-semibold text-[#1B2A20] font-mono">
              ~{metrics.cadrEquivalentCfm} CFM Botanical
            </span>
          </div>
        </div>

        {/* Targeted Clinical Indications */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] block mb-2 font-mono">
            Clinical Indications & Biomarker Targets:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {primaryConcerns.map((c) => (
              <div key={c.id} className="p-3 bg-[#F4F8F4] border border-[#DEEADE] rounded-lg">
                <div className="text-xs font-bold text-[#1B2A20] flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>{c.name}</span>
                </div>
                <div className="text-[11px] text-[#526658] mt-1">
                  <strong>Phyto-Mechanism:</strong> {c.recommendedPhytoMechanism}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Prognosis Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Air Quality Index Delta */}
          <div className="p-4 bg-[#F8FAF7] border border-[#E2ECE0] rounded-xl">
            <div className="text-xs font-semibold text-[#526658] flex items-center justify-between">
              <span>Indoor Air Quality Prognosis</span>
              <Wind className="w-4 h-4 text-[#2D6A4F]" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-serif text-3xl font-bold text-[#1B4332]">
                {metrics.projectedAirQualityScore}/100
              </span>
              <span className="text-xs font-mono text-emerald-700 font-semibold">
                (+{metrics.projectedAirQualityScore - metrics.baselineAirQualityScore} pts)
              </span>
            </div>
            <div className="text-[11px] text-[#6B7E70] mt-1">
              Baseline: {metrics.baselineAirQualityScore} AQI → Clean Air Target
            </div>
          </div>

          {/* Daily Oxygen Synthesis */}
          <div className="p-4 bg-[#F8FAF7] border border-[#E2ECE0] rounded-xl">
            <div className="text-xs font-semibold text-[#526658] flex items-center justify-between">
              <span>Diurnal Oxygen Generation</span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-serif text-3xl font-bold text-[#1B4332]">
                {metrics.oxygenGenerationDailyLiters} L/day
              </span>
              <span className="text-xs font-mono text-[#2D6A4F] font-semibold">
                ({metrics.nighttimeOxygenContributionPercent}% CAM nocturnal)
              </span>
            </div>
            <div className="text-[11px] text-[#6B7E70] mt-1">
              Mitigates night hypoxia and suppresses CO₂ spikes.
            </div>
          </div>

          {/* VOC Clearance & Humidity */}
          <div className="p-4 bg-[#F8FAF7] border border-[#E2ECE0] rounded-xl">
            <div className="text-xs font-semibold text-[#526658] flex items-center justify-between">
              <span>VOC Scavenging Velocity</span>
              <Droplets className="w-4 h-4 text-sky-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-serif text-3xl font-bold text-[#1B4332]">
                {metrics.vocClearanceRateMicrogramsPerHour} μg/hr
              </span>
              <span className="text-xs font-mono text-sky-700 font-semibold">
                (+{metrics.relativeHumidityDeltaPercent}% RH)
              </span>
            </div>
            <div className="text-[11px] text-[#6B7E70] mt-1">
              Formaldehyde, benzene, and solvent degradation.
            </div>
          </div>
        </div>

        {/* PRESCRIBED BOTANICAL SCHEDULE */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between border-b border-[#E3E8DE] pb-2">
            <h4 className="font-serif text-base font-bold text-[#1B2A20] uppercase tracking-wide">
              Prescribed Botanical Regimen & Administration Dosage
            </h4>
            <span className="text-xs font-mono text-[#526658]">
              {prescribedPlants.length} Distinct Therapeutic Species
            </span>
          </div>

          <div className="space-y-4">
            {prescribedPlants.map((item, idx) => {
              const isCam = item.plant.photosynthesisPathway === 'CAM';
              return (
                <div
                  key={item.plant.id}
                  className="p-5 border border-[#DDE5D9] rounded-xl bg-white hover:border-[#CADAC5] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Plant Title & Quantity */}
                    <div className="flex items-start gap-3.5">
                      <span className="w-7 h-7 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="font-serif text-base font-bold text-[#1B2A20]">
                            {item.plant.commonName}
                          </h5>
                          <span className="text-xs font-mono bg-[#EBF4EE] text-[#2D6A4F] px-2 py-0.5 rounded font-bold">
                            Qty: {item.quantity} pot{item.quantity > 1 ? 's' : ''} ({item.potSizeInches}&quot; pot)
                          </span>
                          {isCam && (
                            <span className="text-[11px] font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-semibold">
                              CAM Nocturnal O₂ Producer
                            </span>
                          )}
                        </div>
                        <p className="text-xs italic text-[#526658] font-serif mt-0.5">
                          {item.plant.scientificName} · Family: {item.plant.botanicalFamily}
                        </p>
                      </div>
                    </div>

                    {/* ASPCA Safety Badge */}
                    <div className="text-right shrink-0">
                      {item.plant.petToxicity.safeForCats && item.plant.petToxicity.safeForDogs ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          ASPCA 100% Pet-Safe
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Elevate / Pet Caution
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Placement & Administration Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#F0F4EC] text-xs">
                    <div>
                      <span className="font-semibold text-[#1B2A20] block">Placement Coordinates:</span>
                      <p className="text-[#526658] mt-0.5 leading-relaxed">
                        {item.placementLocation}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-[#1B2A20] block">Irrigation & Substrate:</span>
                      <p className="text-[#526658] mt-0.5 leading-relaxed">
                        {item.waterDosage}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-[#1B2A20] block">Photobiology Requirements:</span>
                      <p className="text-[#526658] mt-0.5 leading-relaxed">
                        {item.lightPlacementAdvice}
                      </p>
                    </div>
                  </div>

                  {/* Safety Alert if applicable */}
                  {item.safetyAlert && (
                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.safetyAlert}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CLINICAL MAINTENANCE & STERILE CARE PROTOCOL */}
        <div className="bg-[#FAFBF9] border border-[#E2EBE0] rounded-xl p-5 mb-8">
          <h4 className="font-serif text-sm font-bold text-[#1B2A20] uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
            Clinical Maintenance & Gas-Exchange Optimization Protocol
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-semibold text-[#1B2A20]">1. Foliar Dust Clearance Protocol:</span>
              <p className="text-[#526658] mt-0.5 leading-relaxed">
                {clinicalCareProtocol.dustCleaningProtocol}
              </p>
            </div>
            <div>
              <span className="font-semibold text-[#1B2A20]">2. Root Rhizosphere Substrate:</span>
              <p className="text-[#526658] mt-0.5 leading-relaxed">
                {clinicalCareProtocol.soilSubstrateRecommendation}
              </p>
            </div>
            <div>
              <span className="font-semibold text-[#1B2A20]">3. Hydration Administration:</span>
              <p className="text-[#526658] mt-0.5 leading-relaxed">
                {clinicalCareProtocol.wateringSchedule}
              </p>
            </div>
            <div>
              <span className="font-semibold text-[#1B2A20]">4. Convective Airflow Synergy:</span>
              <p className="text-[#526658] mt-0.5 leading-relaxed">
                {clinicalCareProtocol.ventilationSynergyTip}
              </p>
            </div>
          </div>
        </div>

        {/* Precautions & Clinical Disclaimers */}
        {precautions.length > 0 && (
          <div className="border-t border-[#E3E8DE] pt-4 mb-6">
            <span className="text-[11px] font-mono text-[#6B7E70] uppercase block mb-1">
              Safety Constraints Enforced:
            </span>
            <ul className="list-disc list-inside space-y-1 text-xs text-[#526658]">
              {precautions.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Document Footer & Prescriber Certification */}
        <div className="border-t-2 border-[#1B2A20] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7E70] gap-4">
          <div className="font-mono text-[11px]">
            <span>VALIDATION: Wolverton NASA Clean Air Protocol (1989) · CAM Photosynthetic Dynamics</span>
            <div className="text-[#8A9B8F] text-[10px]">
              This phyto-prescription is designed as an environmental air optimization adjuvant.
            </div>
          </div>

          <div className="text-right font-serif">
            <span className="text-[#1B2A20] font-bold block text-sm">PhytoRx Clinical Engine</span>
            <span className="text-[11px] italic text-[#526658]">Approved Environmental Bio-Remediation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
