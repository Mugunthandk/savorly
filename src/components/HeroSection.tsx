import React from 'react';
import { Sparkles, ShieldCheck, Thermometer, Clock, Flame, ChevronRight } from 'lucide-react';
import { CRAVING_MOODS } from '../data/mockData';

interface HeroSectionProps {
  onSelectMood: (moodId: string) => void;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const CHENNAI_ZONES = [
  'All Chennai',
  'Anna Nagar',
  'T. Nagar',
  'Velachery',
  'Adyar',
  'OMR',
  'Nungambakkam',
  'Besant Nagar'
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectMood,
  selectedZone,
  setSelectedZone,
  activeFilter,
  setActiveFilter
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#181613] via-[#12110e] to-[#0f0e0d] border-b border-white/5 pb-8 pt-6">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff6814]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Banner Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
          
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chennai's Most Precise Gourmet Delivery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Every craving, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#ff6814] to-orange-400">
                beautifully delivered.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Curated fine dining, thermal-sealed freshness guarantee, quiet night deliveries, and real-time allergen safety protection tailored to your profile.
            </p>

            {/* Craving Mood Selector Quick Chips */}
            <div className="pt-2">
              <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-2 flex items-center justify-center lg:justify-start gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#ff6814]" />
                What's your mood right now?
              </p>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {CRAVING_MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => onSelectMood(mood.title)}
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#ff6814]/20 border border-white/10 hover:border-[#ff6814]/40 text-stone-200 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 group"
                  >
                    <span>{mood.icon}</span>
                    <span>{mood.title}</span>
                    <ChevronRight className="w-3 h-3 text-stone-400 group-hover:text-[#ff6814] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Highlights Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#1c1a17]/90 border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-serif text-white">98/100</h2>
              <p className="text-xs text-stone-300 font-medium leading-snug">Average Freshness Score</p>
              <p className="text-[10px] text-stone-400">Insulated thermal sealing on every package.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c1a17]/90 border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-serif text-white">22 Mins</h2>
              <p className="text-xs text-stone-300 font-medium leading-snug">Chennai Express Delivery</p>
              <p className="text-[10px] text-stone-400">Hot food timer clock with live GPS tracking.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1c1a17]/90 border border-white/10 space-y-2 col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#ff6814]/20 flex items-center justify-center text-[#ff6814]">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Thermal Lock Guarantee</h3>
                  <p className="text-[11px] text-stone-300">Serviced hot at ~65°C using ceramic & deg insulation</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Filter Toolbar: Chennai Zones & Dietary Toggle */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Zone Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full no-scrollbar py-1">
            <span className="text-xs text-stone-400 font-medium shrink-0 mr-1">Zone:</span>
            {CHENNAI_ZONES.map((zone) => {
              const zoneKey = zone === 'All Chennai' ? 'all' : zone;
              const isSelected = selectedZone === zoneKey;
              return (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zoneKey)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#ff6814] text-white shadow-md shadow-[#ff6814]/20'
                      : 'bg-white/5 hover:bg-white/10 text-stone-300 border border-white/5'
                  }`}
                >
                  {zone}
                </button>
              );
            })}
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveFilter(activeFilter === 'pure-veg' ? 'all' : 'pure-veg')}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                activeFilter === 'pure-veg'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full border border-emerald-400 p-0.5 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
              </span>
              <span>Pure Veg</span>
            </button>

            <button
              onClick={() => setActiveFilter(activeFilter === 'bestsellers' ? 'all' : 'bestsellers')}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                activeFilter === 'bestsellers'
                  ? 'bg-amber-950 border-amber-500 text-amber-300'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Bestsellers</span>
            </button>

            <button
              onClick={() => setActiveFilter(activeFilter === 'high-protein' ? 'all' : 'high-protein')}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                activeFilter === 'high-protein'
                  ? 'bg-orange-950 border-orange-500 text-orange-300'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
              }`}
            >
              <span>💪 High Protein</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
