import React from 'react';
import { Leaf, Activity, Maximize2, BookOpen, ShieldCheck, FileText, User } from 'lucide-react';
import { PhytoPrescription, UserProfile } from '../types';

export type ActiveTab = 'engine' | 'profiles' | 'spatial' | 'simulator' | 'compendium' | 'safety';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activePrescription: PhytoPrescription | null;
  activeProfile?: UserProfile;
  profiles: UserProfile[];
  onSelectProfileId: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  activePrescription,
  activeProfile,
  profiles,
  onSelectProfileId,
}) => {
  return (
    <header className="no-print bg-white border-b border-[#E3E8DE] sticky top-0 z-40 shadow-xs">
      {/* Top Clinical Stripe */}
      <div className="bg-[#1B2A20] text-[#DCE7E1] px-4 py-1.5 text-[11px] font-mono flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>PHYTOMEDICAL AIR REMEDIATION ARCHITECTURE</span>
          <span className="text-white/40">·</span>
          <span>NASA WOLVERTON BENCHMARK (1989)</span>
          <span className="text-white/40">·</span>
          <span>CAM STOMATA DYNAMICS</span>
        </div>

        {/* Quick Profile Switcher in top bar */}
        {activeProfile && (
          <div className="flex items-center gap-2">
            <span className="text-white/60">ACTIVE PATIENT:</span>
            <select
              value={activeProfile.id}
              onChange={(e) => onSelectProfileId(e.target.value)}
              className="bg-[#263D30] text-emerald-200 text-[11px] font-mono px-2 py-0.5 rounded border border-[#3E5C4B] focus:outline-none"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Age {p.age} · {p.relationshipTag})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Brand & Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center shadow-xs">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1B2A20]">
                PhytoRx
              </span>
              <span className="text-[10px] font-mono bg-[#EBF4EE] text-[#2D6A4F] px-1.5 py-0.5 rounded font-semibold border border-[#D8E6DC]">
                CLINICAL v2.4
              </span>
            </div>
            <p className="text-xs text-[#526658]">
              Medicinal Plant Prescriptions for Room Volume & Air Quality
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => onSelectTab('engine')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'engine'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#526658] hover:text-[#1B2A20] hover:bg-[#F3F6F1]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Prescription Rx</span>
          </button>

          <button
            onClick={() => onSelectTab('profiles')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'profiles'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#526658] hover:text-[#1B2A20] hover:bg-[#F3F6F1]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Patient Profiles ({profiles.length})</span>
          </button>

          <button
            onClick={() => onSelectTab('spatial')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'spatial'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#526658] hover:text-[#1B2A20] hover:bg-[#F3F6F1]'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
            <span>Spatial Layout</span>
          </button>

          <button
            onClick={() => onSelectTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#526658] hover:text-[#1B2A20] hover:bg-[#F3F6F1]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>24h Atmosphere</span>
          </button>

          <button
            onClick={() => onSelectTab('compendium')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'compendium'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#526658] hover:text-[#1B2A20] hover:bg-[#F3F6F1]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Pharmacopeia</span>
          </button>

          <button
            onClick={() => onSelectTab('safety')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'safety'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#526658] hover:text-[#1B2A20] hover:bg-[#F3F6F1]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Safety Protocols</span>
          </button>
        </nav>
      </div>

      {/* Active Prescription Quick Bar if available */}
      {activePrescription && (
        <div className="bg-[#F8FAF7] border-t border-[#E3E8DE] px-4 sm:px-6 py-2 text-xs text-[#526658] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#2D6A4F] font-bold">Active Rx: {activePrescription.rxId}</span>
            <span aria-hidden="true">·</span>
            {activePrescription.patientProfileSummary && (
              <>
                <span className="text-[#1B2A20] font-semibold">
                  Patient: {activePrescription.patientProfileSummary.patientName} ({activePrescription.patientProfileSummary.ageBracket}, {activePrescription.patientProfileSummary.age} yrs)
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{activePrescription.patientRoomName} ({activePrescription.roomAreaSqMeters} m²)</span>
            <span aria-hidden="true">·</span>
            <span>{activePrescription.totalPlantCount} Prescribed Pots</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-[#6B7E70]">
            <span>O₂: +{activePrescription.metrics.oxygenGenerationDailyLiters} L/day</span>
            <span>VOC: {activePrescription.metrics.vocClearanceRateMicrogramsPerHour} μg/hr</span>
            <span>AQI: {activePrescription.metrics.projectedAirQualityScore}/100</span>
          </div>
        </div>
      )}
    </header>
  );
};

