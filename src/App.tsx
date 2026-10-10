/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { PrescriptionIntake } from './components/PrescriptionIntake';
import { PrescriptionResult } from './components/PrescriptionResult';
import { RoomVisualizer } from './components/RoomVisualizer';
import { AirQualitySimulator } from './components/AirQualitySimulator';
import { BotanicalCompendium } from './components/BotanicalCompendium';
import { SafetyGuide } from './components/SafetyGuide';
import { UserProfileManager } from './components/UserProfileManager';
import { PhytoPrescription, PrescriptionInput, UserProfile } from './types';
import { generatePhytoPrescription } from './utils/engine';
import { INITIAL_USER_PROFILES } from './data/profiles';
import { Sparkles, ArrowRight, Activity, ShieldCheck, HeartPulse } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('engine');
  const [viewState, setViewState] = useState<'form' | 'result'>('result');

  // User Profiles State with LocalStorage Persistence
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('phytorx_patient_profiles');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore local storage error
    }
    return INITIAL_USER_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem('phytorx_active_profile_id');
      if (savedId) return savedId;
    } catch (e) {
      // Ignore
    }
    return INITIAL_USER_PROFILES[0].id;
  });

  // Save to LocalStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('phytorx_patient_profiles', JSON.stringify(profiles));
    } catch (e) {
      // Ignore
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem('phytorx_active_profile_id', activeProfileId);
    } catch (e) {
      // Ignore
    }
  }, [activeProfileId]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  // Initial default prescription tailored to active profile
  const [currentPrescription, setCurrentPrescription] = useState<PhytoPrescription>(() => {
    const prof = INITIAL_USER_PROFILES[0];
    const initialInput: PrescriptionInput = {
      userProfile: prof,
      patientRoomName: `${prof.name.split(' ')[0]}'s Bedroom Suite`,
      roomType: 'bedroom',
      dimensions: {
        length: 4.5,
        width: 3.8,
        height: 2.6,
        unit: 'metric',
      },
      lightExposure: 'medium_indirect',
      ventilation: 'low_sealed',
      primaryConcerns: ['insomnia_nocturnal_hypoxia', 'dry_mucosa_sinusitis'],
      hasCats: false,
      hasDogs: false,
      hasSmallChildren: false,
      hasMoldSensitivity: false,
      occupantCount: 2,
    };
    return generatePhytoPrescription(initialInput);
  });

  const handleGenerate = (input: PrescriptionInput) => {
    const rx = generatePhytoPrescription(input);
    setCurrentPrescription(rx);
    setViewState('result');
    setActiveTab('engine');
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfiles((prev) => {
      const existing = prev.find((p) => p.id === updatedProfile.id);
      if (existing) {
        return prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p));
      }
      return [...prev, updatedProfile];
    });
    setActiveProfileId(updatedProfile.id);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter((p) => p.id !== id);
    setProfiles(remaining);
    if (activeProfileId === id) {
      setActiveProfileId(remaining[0].id);
    }
  };

  const handleApplyAndPrescribe = (profile: UserProfile) => {
    setActiveProfileId(profile.id);
    // Generate new prescription with active profile
    const input: PrescriptionInput = {
      userProfile: profile,
      patientRoomName: `${profile.name.split(' ')[0]}'s Main Suite`,
      roomType: profile.age < 12 ? 'nursery' : 'bedroom',
      dimensions: {
        length: 4.5,
        width: 3.8,
        height: 2.6,
        unit: 'metric',
      },
      lightExposure: 'medium_indirect',
      ventilation: 'standard_hvac',
      primaryConcerns: profile.age < 12 ? ['asthma_respiratory'] : ['insomnia_nocturnal_hypoxia'],
      hasCats: false,
      hasDogs: false,
      hasSmallChildren: profile.age < 12,
      hasMoldSensitivity: profile.knownSensitivities.includes('mold_fungal_spores'),
      occupantCount: 2,
    };
    const newRx = generatePhytoPrescription(input);
    setCurrentPrescription(newRx);
    setViewState('result');
    setActiveTab('engine');
  };

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-[#1B2A20] flex flex-col font-sans">
      {/* Clinical App Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activePrescription={currentPrescription}
        activeProfile={activeProfile}
        profiles={profiles}
        onSelectProfileId={setActiveProfileId}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* PATIENT PROFILES TAB */}
        {activeTab === 'profiles' && (
          <UserProfileManager
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelectProfile={setActiveProfileId}
            onSaveProfile={handleSaveProfile}
            onDeleteProfile={handleDeleteProfile}
            onApplyAndPrescribe={handleApplyAndPrescribe}
          />
        )}

        {/* PRESCRIPTION ENGINE TAB */}
        {activeTab === 'engine' && (
          <div>
            {/* View toggle header when in prescription tab */}
            <div className="no-print flex items-center justify-between mb-6 pb-3 border-b border-[#E3E8DE]">
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-[#1B2A20]">
                  {viewState === 'result' ? 'Prescribed Clinical Botanical Schedule' : 'Clinical Botanical Intake'}
                </span>
                <span className="text-xs text-[#526658]">
                  {viewState === 'result' ? '· Evidence-based bio-remediation document' : '· Volumetric air exchange & symptom evaluation'}
                </span>
              </div>

              <div className="flex items-center p-1 bg-[#EBF0E6] rounded-lg">
                <button
                  onClick={() => setViewState('result')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    viewState === 'result'
                      ? 'bg-white text-[#1B2A20] shadow-xs'
                      : 'text-[#526658] hover:text-[#1B2A20]'
                  }`}
                >
                  View Prescription (Rx)
                </button>
                <button
                  onClick={() => setViewState('form')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    viewState === 'form'
                      ? 'bg-white text-[#1B2A20] shadow-xs'
                      : 'text-[#526658] hover:text-[#1B2A20]'
                  }`}
                >
                  New Assessment Form
                </button>
              </div>
            </div>

            {viewState === 'result' ? (
              <PrescriptionResult
                prescription={currentPrescription}
                onModify={() => setViewState('form')}
                onViewSpatialVisualizer={() => setActiveTab('spatial')}
              />
            ) : (
              <PrescriptionIntake
                onGenerate={handleGenerate}
                profiles={profiles}
                activeProfileId={activeProfileId}
                onSelectProfileId={setActiveProfileId}
              />
            )}
          </div>
        )}

        {/* SPATIAL FLOOR PLAN TAB */}
        {activeTab === 'spatial' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E8DE]">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1B2A20]">
                  Room Architecture & Spatial Botanical Placement
                </h2>
                <p className="text-xs text-[#526658] mt-0.5">
                  Micro-climate positioning according to natural light axes, air convection currents, and occupant breathing zones.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('engine')}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D5E0D0] text-[#526658] hover:text-[#1B2A20] hover:bg-white"
              >
                Back to Prescription
              </button>
            </div>

            <RoomVisualizer prescription={currentPrescription} />
          </div>
        )}

        {/* 24-HOUR SIMULATOR TAB */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E8DE]">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1B2A20]">
                  24-Hour Diurnal Atmosphere & Oxygen Simulator
                </h2>
                <p className="text-xs text-[#526658] mt-0.5">
                  Dynamic mathematical modeling comparing untreated rooms vs PhytoRx botanical remediation over night and day cycles.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('engine')}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D5E0D0] text-[#526658] hover:text-[#1B2A20] hover:bg-white"
              >
                Back to Prescription
              </button>
            </div>

            <AirQualitySimulator prescription={currentPrescription} />
          </div>
        )}

        {/* BOTANICAL PHARMACOPEIA TAB */}
        {activeTab === 'compendium' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E8DE]">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1B2A20]">
                  Botanical Pharmacopeia & NASA Study Compendium
                </h2>
                <p className="text-xs text-[#526658] mt-0.5">
                  Detailed scientific monographs, toxin clearance rates, ASPCA toxicology classifications, and physiological pathways.
                </p>
              </div>
            </div>

            <BotanicalCompendium />
          </div>
        )}

        {/* CLINICAL SAFETY PROTOCOLS TAB */}
        {activeTab === 'safety' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E8DE]">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1B2A20]">
                  Clinical Safety Protocols & Environmental Sanitation
                </h2>
                <p className="text-xs text-[#526658] mt-0.5">
                  Guidance on preventing soil mold spores, feline/canine oxalate safety, and stomatal cleaning.
                </p>
              </div>
            </div>

            <SafetyGuide />
          </div>
        )}
      </main>

      {/* Clinical Footer */}
      <footer className="no-print bg-white border-t border-[#E3E8DE] py-6 mt-12 text-xs text-[#6B7E70]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-[#1B2A20]">PhytoRx Clinical</span>
            <span>·</span>
            <span>NASA Wolverton Clean Air Study (NASA-TM-101768)</span>
            <span>·</span>
            <span>Crassulacean Acid Metabolism Stomatal Dynamics</span>
          </div>

          <div className="text-right text-[11px]">
            Designed for respiratory wellness, sleep hypoxia mitigation, and indoor atmospheric remediation.
          </div>
        </div>
      </footer>
    </div>
  );
}
