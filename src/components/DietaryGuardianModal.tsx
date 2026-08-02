import React from 'react';
import { ShieldAlert, Check, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { MenuItem, User } from '../types';

interface DietaryGuardianModalProps {
  item: MenuItem;
  user: User;
  safeAlternatives: MenuItem[];
  onCancel: () => void;
  onSelectAlternative: (alternative: MenuItem) => void;
  onProceedAnyway: () => void;
}

export const DietaryGuardianModal: React.FC<DietaryGuardianModalProps> = ({
  item,
  user,
  safeAlternatives,
  onCancel,
  onSelectAlternative,
  onProceedAnyway
}) => {
  const matchedAllergens = item.allergens.filter(a => user.allergies.includes(a));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1e1715] border border-amber-600/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Warning Icon Banner */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-800">
            Dietary Guardian Alert
          </span>
          <h2 className="font-serif font-bold text-2xl text-white pt-1">
            Allergen Detected!
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            Hey <strong className="text-white">{user.name}</strong>, this dish contains{' '}
            <strong className="text-amber-300 uppercase underline">{matchedAllergens.join(', ')}</strong>, which matches your registered allergy profile!
          </p>
        </div>

        {/* Dish Card Summary */}
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-800/40 flex items-center gap-3">
          <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
          <div>
            <h3 className="font-serif font-bold text-sm text-white">{item.name}</h3>
            <p className="text-xs text-amber-400 font-semibold">Contains: {item.allergens.join(', ')}</p>
          </div>
        </div>

        {/* Recommended Safe Alternatives */}
        {safeAlternatives.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Recommended Safe Alternatives (100% {matchedAllergens.join(', ')}-Free):</span>
            </p>

            <div className="space-y-2">
              {safeAlternatives.slice(0, 2).map((alt) => (
                <button
                  key={alt.id}
                  onClick={() => onSelectAlternative(alt)}
                  className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-emerald-950/40 border border-white/10 hover:border-emerald-500/40 text-left flex items-center justify-between text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={alt.image} alt={alt.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-stone-200 group-hover:text-emerald-300">{alt.name}</p>
                      <span className="text-[10px] text-stone-400">₹{alt.price} • {alt.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onCancel}
            className="w-full py-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            Cancel & Pick Safe Dish
          </button>

          <button
            onClick={onProceedAnyway}
            className="w-full py-2.5 rounded-xl bg-stone-900 border border-white/10 text-stone-400 hover:text-white text-xs font-medium transition-colors"
          >
            I understand, add dish anyway
          </button>
        </div>

      </div>
    </div>
  );
};
