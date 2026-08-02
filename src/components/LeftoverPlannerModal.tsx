import React from 'react';
import { ChefHat, X, Thermometer, ShieldCheck, Clock } from 'lucide-react';
import { Order } from '../types';

interface LeftoverPlannerModalProps {
  order: Order;
  onClose: () => void;
}

export const LeftoverPlannerModal: React.FC<LeftoverPlannerModalProps> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181613] border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white">Smart Reheating & Storage Guide</h2>
              <p className="text-[10px] text-stone-400">{order.restaurantName} • {order.orderNumber}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {order.reheatInstructions?.map((guide, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between text-xs font-bold text-amber-300">
                <span>{guide.dishName}</span>
                <span className="text-[10px] bg-amber-950 px-2 py-0.5 rounded text-amber-400">{guide.method}</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">{guide.tempTime}</p>
            </div>
          ))}

          {(!order.reheatInstructions || order.reheatInstructions.length === 0) && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-stone-300">
              <p><strong>General Biryani/Rice:</strong> Sprinkle 1 tsp water, cover with microwave safe lid, heat 90 seconds at 80% power.</p>
              <p><strong>Pizzas:</strong> Reheat on dry skillet/tawa over medium heat for 3 mins to restore crispy bottom crust!</p>
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Savorly Zero Waste Commitment: Store leftovers at 4°C in airtight containers within 2 hours.</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#ff6814] text-white font-bold text-xs"
        >
          Got It!
        </button>

      </div>
    </div>
  );
};
