import React, { useState } from 'react';
import { UserProfile, ChronicConditionId, SpecificSymptomId, KnownSensitivityId } from '../types';
import {
  CHRONIC_CONDITIONS_LIST,
  SYMPTOMS_LIST,
  SENSITIVITIES_LIST,
} from '../data/profiles';
import {
  User,
  UserPlus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Activity,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Clock,
  Check,
} from 'lucide-react';

interface UserProfileManagerProps {
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onSaveProfile: (profile: UserProfile) => void;
  onDeleteProfile: (id: string) => void;
  onApplyAndPrescribe: (profile: UserProfile) => void;
}

export const UserProfileManager: React.FC<UserProfileManagerProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onSaveProfile,
  onDeleteProfile,
  onApplyAndPrescribe,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editProfileId, setEditProfileId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(35);
  const [relationshipTag, setRelationshipTag] = useState<UserProfile['relationshipTag']>('Self');
  const [selectedConditions, setSelectedConditions] = useState<ChronicConditionId[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SpecificSymptomId[]>([]);
  const [selectedSensitivities, setSelectedSensitivities] = useState<KnownSensitivityId[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState('');

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleStartNew = () => {
    setEditProfileId(null);
    setName('');
    setAge(30);
    setRelationshipTag('Self');
    setSelectedConditions([]);
    setSelectedSymptoms([]);
    setSelectedSensitivities([]);
    setClinicalNotes('');
    setIsEditing(true);
  };

  const handleStartEdit = (profile: UserProfile) => {
    setEditProfileId(profile.id);
    setName(profile.name);
    setAge(profile.age);
    setRelationshipTag(profile.relationshipTag);
    setSelectedConditions([...profile.chronicConditions]);
    setSelectedSymptoms([...profile.specificSymptoms]);
    setSelectedSensitivities([...profile.knownSensitivities]);
    setClinicalNotes(profile.clinicalNotes || '');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const profileToSave: UserProfile = {
      id: editProfileId || `profile_${Date.now()}`,
      name: name.trim(),
      age: Number(age) || 30,
      relationshipTag,
      chronicConditions: selectedConditions,
      specificSymptoms: selectedSymptoms,
      knownSensitivities: selectedSensitivities,
      clinicalNotes: clinicalNotes.trim(),
      createdAt: editProfileId ? activeProfile?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveProfile(profileToSave);
    setIsEditing(false);
  };

  const toggleCondition = (id: ChronicConditionId) => {
    setSelectedConditions((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleSymptom = (id: SpecificSymptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSensitivity = (id: KnownSensitivityId) => {
    setSelectedSensitivities((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Profiles Carousel / Selector */}
      <div className="bg-white border border-[#E3E8DE] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E3E8DE]">
          <div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#2D6A4F]" />
              <h3 className="font-serif text-lg font-bold text-[#1B2A20]">
                Patient & Household Health Profiles
              </h3>
            </div>
            <p className="text-xs text-[#526658] mt-1">
              Select or configure medical profiles (chronic conditions, age bracket, and sensitivities) to dynamically refine botanical prescriptions.
            </p>
          </div>

          <button
            onClick={handleStartNew}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#2D6A4F] text-white hover:bg-[#1B4332] transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Patient Profile</span>
          </button>
        </div>

        {/* Profile Card Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
          {profiles.map((profile) => {
            const isActive = profile.id === activeProfileId;
            const ageCategory = profile.age < 12 ? 'Pediatric' : profile.age >= 65 ? 'Geriatric' : 'Adult';

            return (
              <div
                key={profile.id}
                onClick={() => onSelectProfile(profile.id)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-[#2D6A4F] bg-[#F4FAF6] shadow-xs ring-1 ring-[#2D6A4F]/20'
                    : 'border-[#E3E8DE] bg-white hover:border-[#CAD8C3]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif text-base font-bold text-[#1B2A20]">
                          {profile.name}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <span className="text-xs text-[#526658]">
                        Age {profile.age} · {ageCategory} · {profile.relationshipTag}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(profile);
                        }}
                        className="p-1 text-[#6B7E70] hover:text-[#1B2A20] rounded hover:bg-black/5"
                        title="Edit Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {profiles.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProfile(profile.id);
                          }}
                          className="p-1 text-[#6B7E70] hover:text-rose-600 rounded hover:bg-black/5"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary of conditions & sensitivities */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {profile.chronicConditions.slice(0, 2).map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-mono text-[#2D6A4F] bg-[#EBF4EE] px-1.5 py-0.5 rounded"
                      >
                        {c.replace('_', ' ')}
                      </span>
                    ))}
                    {profile.knownSensitivities.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded"
                      >
                        {s.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[11px]">
                  <span className={isActive ? 'text-[#2D6A4F] font-bold' : 'text-[#6B7E70]'}>
                    {isActive ? '● Active Profile' : 'Click to Activate'}
                  </span>
                  <span className="font-mono text-[#8A9B8F] text-[10px]">
                    {profile.specificSymptoms.length} reported symptoms
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FORM: Create / Edit Profile Modal or Drawer */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white border-2 border-[#2D6A4F] rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E3E8DE]">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#1B2A20]">
                {editProfileId ? `Edit Profile: ${name || 'Patient'}` : 'Create Clinical Patient Profile'}
              </h4>
              <p className="text-xs text-[#526658]">
                Provide clinical parameters to automatically calibrate oxygen requirements, contraindications, and humidity.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-[#6B7E70] hover:text-[#1B2A20]"
            >
              Cancel
            </button>
          </div>

          {/* Demographics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1B2A20]">Patient / User Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5E0D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1B2A20]">Age (Years)</label>
              <input
                type="number"
                min={1}
                max={110}
                required
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5E0D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40"
              />
              <span className="text-[10px] text-[#6B7E70]">
                {age < 12 ? 'Pediatric protocol (soft fronds)' : age >= 65 ? 'Geriatric protocol (CAM O₂ boost)' : 'Adult protocol'}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#1B2A20]">Household Role</label>
              <select
                value={relationshipTag}
                onChange={(e) => setRelationshipTag(e.target.value as UserProfile['relationshipTag'])}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5E0D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40"
              >
                <option value="Self">Self</option>
                <option value="Child">Child (Pediatric)</option>
                <option value="Elderly Parent">Elderly Parent (Geriatric)</option>
                <option value="Partner">Partner</option>
                <option value="Clinical Patient">Clinical Patient</option>
              </select>
            </div>
          </div>

          {/* Chronic Conditions Checklist */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#1B2A20] block mb-2 font-mono flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-[#2D6A4F]" />
              Diagnosed Chronic Conditions (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {CHRONIC_CONDITIONS_LIST.map((c) => {
                const isSelected = selectedConditions.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => toggleCondition(c.id)}
                    className={`cursor-pointer p-2.5 rounded-lg border transition-colors flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#EBF4EE] border-[#2D6A4F] text-[#1B2A20]'
                        : 'bg-white border-[#E3E8DE] hover:border-[#CAD8C3]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{c.label}</span>
                      <span className="text-[10px] text-[#526658] line-clamp-1">{c.description}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border mt-0.5 ${
                        isSelected ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white' : 'border-[#CAD8C3]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specific Symptoms Checklist */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#1B2A20] block mb-2 font-mono flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-700" />
              Reported Symptoms & Air Quality Complaints
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {SYMPTOMS_LIST.map((s) => {
                const isSelected = selectedSymptoms.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleSymptom(s.id)}
                    className={`cursor-pointer p-2.5 rounded-lg border transition-colors flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#EBF4EE] border-[#2D6A4F] text-[#1B2A20]'
                        : 'bg-white border-[#E3E8DE] hover:border-[#CAD8C3]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-semibold block">{s.label}</span>
                      <span className="text-[10px] text-[#526658] line-clamp-1">{s.description}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border mt-0.5 ${
                        isSelected ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white' : 'border-[#CAD8C3]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Known Sensitivities Checklist */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-2 font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Known Sensitivities & Allergies (Enforces strict botanical exclusions)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {SENSITIVITIES_LIST.map((sens) => {
                const isSelected = selectedSensitivities.includes(sens.id);
                return (
                  <div
                    key={sens.id}
                    onClick={() => toggleSensitivity(sens.id)}
                    className={`cursor-pointer p-2.5 rounded-lg border transition-colors flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-50 border-amber-500 text-amber-950'
                        : 'bg-white border-[#E3E8DE] hover:border-[#CAD8C3]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{sens.label}</span>
                      <span className="text-[10px] text-amber-800 line-clamp-1">{sens.clinicalImpact}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border mt-0.5 ${
                        isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-[#CAD8C3]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#1B2A20]">Clinical Background & Physician Directives</label>
            <textarea
              rows={2}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="e.g. Needs high nocturnal oxygenation, history of skin contact dermatitis, sensitive to winter dry air."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#D5E0D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40"
            />
          </div>

          {/* Save Action */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#E3E8DE]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#D5E0D0] text-[#526658] hover:text-[#1B2A20]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#2D6A4F] text-white hover:bg-[#1B4332] shadow-xs"
            >
              Save Patient Profile
            </button>
          </div>
        </form>
      ) : null}

      {/* ACTIVE PROFILE CLINICAL DOSSIER */}
      {activeProfile && !isEditing && (
        <div className="bg-white border border-[#E3E8DE] rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8DE]">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif text-xl font-bold text-[#1B2A20]">
                  {activeProfile.name}
                </h4>
                <span className="text-xs font-mono bg-[#EBF4EE] text-[#2D6A4F] px-2 py-0.5 rounded font-bold">
                  {activeProfile.age < 12 ? 'Pediatric' : activeProfile.age >= 65 ? 'Geriatric' : 'Adult'} ({activeProfile.age} yrs)
                </span>
                <span className="text-xs font-mono text-[#6B7E70]">
                  · {activeProfile.relationshipTag}
                </span>
              </div>
              <p className="text-xs text-[#526658] mt-1">
                Active clinical profile applied to prescription formulation and air exchange modeling.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStartEdit(activeProfile)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D5E0D0] text-[#526658] hover:text-[#1B2A20] hover:bg-[#F8FAF6]"
              >
                Edit Clinical Data
              </button>
              <button
                onClick={() => onApplyAndPrescribe(activeProfile)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#2D6A4F] text-white hover:bg-[#1B4332] shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Formulate Rx for {activeProfile.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>

          {/* Grid of Profile Data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Chronic Conditions */}
            <div className="p-4 bg-[#F8FAF7] border border-[#E5ECE0] rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B2A20] uppercase font-mono">
                <HeartPulse className="w-4 h-4 text-[#2D6A4F]" />
                <span>Chronic Diagnoses ({activeProfile.chronicConditions.length})</span>
              </div>
              {activeProfile.chronicConditions.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-[#405646]">
                  {activeProfile.chronicConditions.map((c) => {
                    const match = CHRONIC_CONDITIONS_LIST.find((item) => item.id === c);
                    return (
                      <li key={c} className="flex items-start gap-1.5">
                        <span className="text-[#2D6A4F] font-bold">·</span>
                        <span><strong>{match?.label || c}:</strong> {match?.description}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-[#6B7E70]">No chronic pulmonary or circadian conditions reported.</p>
              )}
            </div>

            {/* Specific Symptoms */}
            <div className="p-4 bg-[#F8FAF7] border border-[#E5ECE0] rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B2A20] uppercase font-mono">
                <Activity className="w-4 h-4 text-[#2D6A4F]" />
                <span>Reported Symptoms ({activeProfile.specificSymptoms.length})</span>
              </div>
              {activeProfile.specificSymptoms.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-[#405646]">
                  {activeProfile.specificSymptoms.map((s) => {
                    const match = SYMPTOMS_LIST.find((item) => item.id === s);
                    return (
                      <li key={s} className="flex items-start gap-1.5">
                        <span className="text-[#2D6A4F] font-bold">·</span>
                        <span>{match?.label || s}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-[#6B7E70]">No acute symptoms reported.</p>
              )}
            </div>

            {/* Known Sensitivities & Contraindications */}
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 uppercase font-mono">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Active Sensitivities ({activeProfile.knownSensitivities.length})</span>
              </div>
              {activeProfile.knownSensitivities.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-amber-900">
                  {activeProfile.knownSensitivities.map((sens) => {
                    const match = SENSITIVITIES_LIST.find((item) => item.id === sens);
                    return (
                      <li key={sens} className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-700 mt-0.5" />
                        <span><strong>{match?.label || sens}:</strong> {match?.clinicalImpact}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-[#6B7E70]">No plant, mold, or latex allergies declared.</p>
              )}
            </div>
          </div>

          {/* Clinical Notes if any */}
          {activeProfile.clinicalNotes && (
            <div className="p-3 bg-[#FAFBF9] border border-[#E3E8DE] rounded-lg text-xs text-[#526658]">
              <strong className="text-[#1B2A20] block mb-0.5">Physician & Background Notes:</strong>
              {activeProfile.clinicalNotes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
