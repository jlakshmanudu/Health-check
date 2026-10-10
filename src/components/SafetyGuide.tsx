import React from 'react';
import { ShieldCheck, Wind, AlertTriangle, Layers, Droplets, CheckCircle2 } from 'lucide-react';

export const SafetyGuide: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-[#E3E8DE] rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-[#2D6A4F]" />
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1B2A20]">
              Clinical Safety & Environmental Sanitation Protocol
            </h3>
            <p className="text-xs text-[#526658] mt-0.5">
              Evidence-based guidelines for preventing soil mold spores, protecting domestic pets, and maintaining maximum foliar gas exchange.
            </p>
          </div>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Protocol 1: Soil Mold & Allergens */}
        <div className="bg-white border border-[#E3E8DE] rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#2D6A4F] font-bold text-sm">
            <Wind className="w-4 h-4" />
            <span>1. Mold Spore Suppression Protocol</span>
          </div>
          <p className="text-xs text-[#526658] leading-relaxed">
            Asthma and allergy patients frequently worry about damp potting soil harboring airborne mold (such as <em>Aspergillus</em> and <em>Penicillium</em>). Follow these clinical precautions:
          </p>
          <ul className="space-y-2 text-xs text-[#405646]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Topsoil Barrier:</strong> Cover the top 1 inch (2.5 cm) of soil with decorative horticultural gravel or expanded clay pebbles (LECA). This prevents fungal spores from entering ambient air currents.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Sub-Irrigation (Bottom Watering):</strong> Pour water directly into the saucer, allowing the plant to capillary-draw hydration upwards while keeping the soil surface dry.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Hydroculture / LECA Alternative:</strong> Grow plants in semi-hydroponic clay pebbles with nutrient water instead of organic dirt. This provides 100% mold-free gas exchange.</span>
            </li>
          </ul>
        </div>

        {/* Protocol 2: ASPCA Toxicology */}
        <div className="bg-white border border-[#E3E8DE] rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#2D6A4F] font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>2. ASPCA Animal Toxicology Protocol</span>
          </div>
          <p className="text-xs text-[#526658] leading-relaxed">
            Many common air-filtering plants belong to the Araceae family and contain microscopic needle-like insoluble calcium oxalate crystals (raphides).
          </p>
          <ul className="space-y-2 text-xs text-[#405646]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>100% Non-Toxic Champions:</strong> Areca Palm, Boston Fern, Spider Plant, Lady Palm, Bamboo Palm, Cast-Iron Plant, and Moth Orchid are completely safe for dogs and cats.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Mandatory Elevation:</strong> If keeping Snake Plants or Peace Lilies in pet homes, mount them strictly on high floating shelves or macrame ceiling hooks where pets cannot reach.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>True Lilies vs Peace Lilies:</strong> Peace Lilies (<em>Spathiphyllum</em>) cause oral irritation due to oxalates, but unlike True Lilies (<em>Lilium</em>), they do not cause acute feline kidney failure.</span>
            </li>
          </ul>
        </div>

        {/* Protocol 3: Stomata Dust Cleaning */}
        <div className="bg-white border border-[#E3E8DE] rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#2D6A4F] font-bold text-sm">
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>3. Stomata Dust Cleaning & Gas Velocity</span>
          </div>
          <p className="text-xs text-[#526658] leading-relaxed">
            Plants breathe through microscopic surface pores called stomata. In residential spaces, airborne fine dust and electrostatic particles quickly settle over leaves, choking oxygen synthesis.
          </p>
          <ul className="space-y-2 text-xs text-[#405646]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Bi-Weekly Microfiber Wipe:</strong> Dampen a soft cloth with distilled water and gently support the leaf underside while wiping the top face.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Avoid Commercial Leaf Shine:</strong> Never spray silicone or wax leaf shiners; these clog stomatal pores and degrade phytoremediation capacity by over 50%.</span>
            </li>
          </ul>
        </div>

        {/* Protocol 4: NASA Rhizosphere Microbes */}
        <div className="bg-white border border-[#E3E8DE] rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#2D6A4F] font-bold text-sm">
            <Layers className="w-4 h-4 text-teal-700" />
            <span>4. The Rhizosphere Microbial Bioreactor</span>
          </div>
          <p className="text-xs text-[#526658] leading-relaxed">
            The pioneering NASA Clean Air Study by Dr. B.C. Wolverton demonstrated that a significant portion of indoor chemical removal happens at the root zone via symbiotic bacteria.
          </p>
          <ul className="space-y-2 text-xs text-[#405646]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Biochar Inoculation:</strong> Incorporating 10% activated horticultural charcoal/biochar into potting soil adsorbs ambient toxic gas molecules and concentrates them for root bacteria to consume.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Root Aeration:</strong> Never allow waterlogged soggy soil. Aerated root systems foster beneficial aerobic degraders rather than anaerobic rot organisms.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
