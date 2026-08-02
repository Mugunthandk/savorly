import React, { useState } from 'react';
import { Flame, Sparkles, X, ShoppingBag, RefreshCw } from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/mockData';

interface SurpriseMeModalProps {
  onClose: () => void;
  onAddToCart: (item: MenuItem) => void;
}

export const SurpriseMeModal: React.FC<SurpriseMeModalProps> = ({ onClose, onAddToCart }) => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    setIsSpinning(true);
    setSelectedItem(null);

    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * MENU_ITEMS.length);
      setSelectedItem(MENU_ITEMS[randomIdx]);
      setIsSpinning(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181613] border border-orange-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800 uppercase tracking-widest">
            Serendipity Engine
          </span>
          <button onClick={onClose} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 className="font-serif font-bold text-2xl text-white">Surprise Me!</h2>
          <p className="text-xs text-stone-300 mt-1">Can't decide what to eat? Let Savorly pick a top-rated bestseller dish for you!</p>
        </div>

        {/* Wheel Graphic */}
        <div className="py-4">
          <div className={`w-32 h-32 rounded-full border-4 border-dashed border-[#ff6814] flex items-center justify-center mx-auto transition-transform duration-1000 ${
            isSpinning ? 'rotate-[720deg] scale-110' : ''
          }`}>
            <Flame className="w-12 h-12 text-[#ff6814]" />
          </div>
        </div>

        {selectedItem && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-3 animate-in fade-in zoom-in duration-300">
            <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-32 rounded-xl object-cover" />
            <div>
              <h3 className="font-serif font-bold text-lg text-white">{selectedItem.name}</h3>
              <p className="text-xs text-amber-300 font-semibold">{selectedItem.restaurantName} • ₹{selectedItem.price}</p>
              <p className="text-[11px] text-stone-300 mt-1 line-clamp-2">{selectedItem.description}</p>
            </div>

            <button
              onClick={() => {
                onAddToCart(selectedItem);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-[#ff6814] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Surprise Dish to Cart</span>
            </button>
          </div>
        )}

        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-[#ff6814] to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ff6814]/20"
          id="spin-surprise-me-btn"
        >
          {isSpinning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSpinning ? 'Spinning Savorly Wheel...' : 'Spin for Surprise Meal!'}</span>
        </button>

      </div>
    </div>
  );
};
