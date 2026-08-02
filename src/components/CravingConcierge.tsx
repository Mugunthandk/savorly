import React, { useState } from 'react';
import { Sparkles, X, Flame, ChefHat, ShoppingBag, Clock, ShieldCheck, ArrowRight, RefreshCw, Check } from 'lucide-react';
import { MenuItem, User } from '../types';
import { CRAVING_MOODS } from '../data/mockData';

interface CravingConciergeProps {
  user: User;
  availableDishes: MenuItem[];
  onClose: () => void;
  onAddBundleToCart: (items: { menuItem: MenuItem; quantity: number }[]) => void;
}

export const CravingConcierge: React.FC<CravingConciergeProps> = ({
  user,
  availableDishes,
  onClose,
  onAddBundleToCart
}) => {
  const [selectedMood, setSelectedMood] = useState('Monsoon & Comfort');
  const [budget, setBudget] = useState(750);
  const [customNotes, setCustomNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setRecommendation(null);

    try {
      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          budget,
          dietary: user.dietaryRestrictions,
          userNotes: customNotes,
          availableDishes: availableDishes.map(d => ({
            id: d.id,
            name: d.name,
            price: d.price,
            category: d.category,
            isVeg: d.isVeg,
            allergens: d.allergens
          }))
        })
      });

      const data = await response.json();
      setRecommendation(data);
    } catch (e) {
      console.error(e);
      setRecommendation({
        title: "Chef's Signature Gourmet Bundle",
        reasoning: "Crafted specifically for your current craving with zero preservatives.",
        pairings: [
          { name: "Seeraga Samba Mutton Biryani", quantity: 1, reason: "Aromatic slow-cooked rice." },
          { name: "Chilled Elaneer Payasam", quantity: 1, reason: "Refreshing coconut dessert." }
        ],
        estimatedCost: 530,
        estimatedPreparationMinutes: 22,
        chefTip: "Eat hot within 30 minutes of delivery."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyBundle = () => {
    if (!recommendation?.pairings) return;

    const bundleItemsToCart: { menuItem: MenuItem; quantity: number }[] = [];

    recommendation.pairings.forEach((p: any) => {
      // Find matching item in menu or pick closest
      const match = availableDishes.find(d => 
        d.name.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(d.name.toLowerCase())
      ) || availableDishes[0];

      if (match) {
        bundleItemsToCart.push({ menuItem: match, quantity: p.quantity || 1 });
      }
    });

    onAddBundleToCart(bundleItemsToCart);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181613] border border-amber-500/30 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950/80 via-[#261d15] to-[#181613] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff6814] flex items-center justify-center text-white shadow-lg shadow-[#ff6814]/30">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800 uppercase tracking-widest">
                AI Sommelier
              </span>
              <h2 className="font-serif font-bold text-xl text-white mt-0.5">Craving Concierge</h2>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Mood Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#ff6814]" />
              <span>Select Your Current Vibe or Mood:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CRAVING_MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMood(m.title)}
                  className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                    selectedMood === m.title
                      ? 'bg-[#ff6814]/20 border-[#ff6814] text-white shadow-lg shadow-[#ff6814]/10'
                      : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg block mb-1">{m.icon}</span>
                  <p className="font-bold">{m.title}</p>
                  <p className="text-[10px] text-stone-400 line-clamp-1">{m.tagline}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Slider */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-300">
              <span>Budget Target:</span>
              <span className="text-[#ff6814] font-bold text-sm">₹{budget}</span>
            </div>
            <input
              type="range"
              min="300"
              max="2000"
              step="50"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[#ff6814] bg-stone-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>₹300 (Single Meal)</span>
              <span>₹1000 (Gourmet Combo)</span>
              <span>₹2000 (Feast)</span>
            </div>
          </div>

          {/* Custom Notes */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="text-xs font-semibold text-stone-300">Any specific craving notes?</label>
            <input
              type="text"
              placeholder="e.g., Extra hot chettinad pepper, sweet ending, low carbs..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full bg-stone-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#ff6814]"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-[#ff6814] to-orange-500 text-white font-bold text-sm shadow-xl shadow-[#ff6814]/20 flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-98 disabled:opacity-50"
            id="generate-concierge-bundle-btn"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Culinary Experience...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Curate My Perfect Meal Combo</span>
              </>
            )}
          </button>

          {/* Recommendation Output Display */}
          {recommendation && (
            <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-900/60 px-2 py-0.5 rounded-md uppercase">
                    Chef Curated Meal Bundle
                  </span>
                  <h3 className="font-serif font-bold text-xl text-white mt-1">
                    {recommendation.title}
                  </h3>
                </div>
                <span className="text-lg font-bold text-[#ff6814]">
                  ~₹{recommendation.estimatedCost}
                </span>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed italic border-l-2 border-[#ff6814] pl-3 py-1">
                "{recommendation.reasoning}"
              </p>

              {/* Pairings List */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-stone-200">Recommended Items in this Bundle:</p>
                <div className="space-y-1.5">
                  {recommendation.pairings?.map((item: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-amber-200">{item.quantity || 1}x {item.name}</span>
                        <p className="text-[10px] text-stone-400">{item.reason}</p>
                      </div>
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef Tip & Time */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-white/10 gap-2">
                <span className="flex items-center gap-1 text-amber-300">
                  <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                  Tip: {recommendation.chefTip}
                </span>
                <span className="flex items-center gap-1 text-stone-300">
                  <Clock className="w-3.5 h-3.5 text-[#ff6814]" />
                  ~{recommendation.estimatedPreparationMinutes || 25} mins prep
                </span>
              </div>

              {/* Add Bundle to Cart CTA */}
              <button
                onClick={handleApplyBundle}
                className="w-full py-3 rounded-xl bg-[#ff6814] hover:bg-[#ee5703] text-white font-bold text-xs shadow-lg shadow-[#ff6814]/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                id="add-concierge-bundle-to-cart-btn"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Complete Bundle to Cart</span>
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
