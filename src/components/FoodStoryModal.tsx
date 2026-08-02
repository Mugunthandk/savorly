import React from 'react';
import { BookOpen, X, Sparkles, MapPin, ChefHat } from 'lucide-react';
import { MenuItem } from '../types';

interface FoodStoryModalProps {
  item: MenuItem;
  onClose: () => void;
}

export const FoodStoryModal: React.FC<FoodStoryModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181613] border border-amber-500/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        
        {/* Banner */}
        <div className="relative h-48 bg-stone-900">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181613] via-transparent to-black/60" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800 uppercase tracking-wider">
              Artisanal Heritage Story
            </span>
            <h2 className="font-serif font-bold text-2xl text-white mt-1">{item.name}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>{item.restaurantName} • Sourced Ingredients</span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed font-serif text-sm italic border-l-2 border-[#ff6814] pl-4 py-1">
            "{item.foodStory || item.description}"
          </p>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-stone-300">
            <p className="font-bold text-white flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-amber-400" />
              <span>Chef's Craft Guarantee</span>
            </p>
            <p className="text-stone-400">
              No artificial colors, zero trans-fats, and 100% authentic regional spices sourced straight from certified organic farmers.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#ff6814] text-white font-bold text-xs"
          >
            Back to Menu
          </button>
        </div>

      </div>
    </div>
  );
};
