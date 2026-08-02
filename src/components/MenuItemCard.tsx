import React from 'react';
import { Plus, Minus, Flame, AlertTriangle, BookOpen, Sparkles, Check } from 'lucide-react';
import { MenuItem, User } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  user: User;
  quantityInCart: number;
  onAdd: (item: MenuItem) => void;
  onUpdateQuantity: (item: MenuItem, delta: number) => void;
  onOpenStory: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  user,
  quantityInCart,
  onAdd,
  onUpdateQuantity,
  onOpenStory
}) => {
  // Check if item contains any of user's registered allergies
  const hasUserAllergens = user.allergies.some(allergen => item.allergens.includes(allergen));

  return (
    <div 
      className={`relative bg-[#1c1a17] rounded-2xl border p-4 flex flex-col sm:flex-row gap-4 transition-all ${
        hasUserAllergens 
          ? 'border-amber-700/50 bg-amber-950/20' 
          : 'border-white/10 hover:border-white/20'
      }`}
      id={`menu-item-card-${item.id}`}
    >
      {/* Left Details */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          {/* Veg/Non-Veg Icon */}
          <div className={`w-4 h-4 rounded-sm border p-0.5 flex items-center justify-center shrink-0 ${
            item.isVeg ? 'border-emerald-500' : 'border-rose-500'
          }`}>
            <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </div>

          {/* Badges */}
          {item.bestseller && (
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Bestseller
            </span>
          )}

          {item.chefSpecial && (
            <span className="bg-orange-500/20 text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-500/30">
              Chef Special
            </span>
          )}

          {/* Spice Level Chilies */}
          {item.spiceLevel > 0 && (
            <div className="flex items-center gap-0.5 text-xs text-rose-400" title={`Spice level: ${item.spiceLevel}/3`}>
              {Array.from({ length: item.spiceLevel }).map((_, i) => (
                <Flame key={i} className="w-3 h-3 fill-rose-500" />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
          {item.name}
        </h3>

        {/* Price */}
        <div className="text-base font-bold text-[#ff6814]">
          ₹{item.price}
        </div>

        {/* Description */}
        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed font-light">
          {item.description}
        </p>

        {/* Nutrition & Allergen Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] bg-white/5 text-stone-300 px-2 py-0.5 rounded-md border border-white/5">
            🔥 {item.calories} kcal
          </span>
          <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 font-semibold">
            💪 {item.protein}g Protein
          </span>

          {item.allergens.length > 0 && (
            <span className={`text-[10px] px-2 py-0.5 rounded-md border ${
              hasUserAllergens 
                ? 'bg-amber-950 text-amber-300 border-amber-500 font-bold animate-pulse' 
                : 'bg-stone-900 text-stone-400 border-stone-800'
            }`}>
              Contains: {item.allergens.join(', ')}
            </span>
          )}
        </div>

        {/* User Allergen Warning Banner */}
        {hasUserAllergens && (
          <div className="mt-2 p-2 rounded-xl bg-amber-950/80 border border-amber-600/50 text-amber-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Allergen Warning:</strong> Contains <strong>{item.allergens.filter(a => user.allergies.includes(a)).join(', ')}</strong> matching your profile!
            </span>
          </div>
        )}

        {/* Food Story Button */}
        {item.foodStory && (
          <button
            onClick={() => onOpenStory(item)}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 pt-1 hover:underline"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Artisanal Story Behind Dish</span>
          </button>
        )}
      </div>

      {/* Right Image & Action Button */}
      <div className="w-full sm:w-32 shrink-0 flex flex-col items-center justify-between gap-3">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-900">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Add / Quantity Button */}
        {quantityInCart === 0 ? (
          <button
            onClick={() => onAdd(item)}
            className="w-full py-2 rounded-xl bg-[#ff6814] hover:bg-[#ee5703] text-white font-bold text-xs shadow-lg shadow-[#ff6814]/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            id={`add-to-cart-${item.id}`}
          >
            <Plus className="w-4 h-4" />
            <span>ADD</span>
          </button>
        ) : (
          <div className="w-full bg-[#282420] border border-[#ff6814] rounded-xl flex items-center justify-between p-1 text-white text-xs font-bold">
            <button
              onClick={() => onUpdateQuantity(item, -1)}
              className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-white"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span>{quantityInCart}</span>
            <button
              onClick={() => onUpdateQuantity(item, 1)}
              className="w-7 h-7 rounded-lg bg-[#ff6814] hover:bg-[#ee5703] flex items-center justify-center text-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
