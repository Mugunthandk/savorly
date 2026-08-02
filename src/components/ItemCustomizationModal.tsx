import React, { useState } from 'react';
import { X, Check, Plus, Minus, ChefHat } from 'lucide-react';
import { MenuItem, SelectedCustomisation } from '../types';

interface ItemCustomizationModalProps {
  item: MenuItem;
  onClose: () => void;
  onConfirm: (selectedCustomisations: SelectedCustomisation[], quantity: number, notes: string) => void;
}

export const ItemCustomizationModal: React.FC<ItemCustomizationModalProps> = ({
  item,
  onClose,
  onConfirm
}) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedCustomisation[]>(() => {
    // Pre-select required defaults
    const defaults: SelectedCustomisation[] = [];
    item.customisations?.forEach(group => {
      if (group.required && group.options.length > 0) {
        defaults.push({
          groupId: group.id,
          groupTitle: group.title,
          optionId: group.options[0].id,
          optionName: group.options[0].name,
          price: group.options[0].price
        });
      }
    });
    return defaults;
  });

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const toggleOption = (groupId: string, groupTitle: string, optionId: string, optionName: string, price: number, required: boolean) => {
    setSelectedOptions(prev => {
      if (required) {
        // Replace choice for this group
        const filtered = prev.filter(o => o.groupId !== groupId);
        return [...filtered, { groupId, groupTitle, optionId, optionName, price }];
      } else {
        // Toggle optional check
        const exists = prev.some(o => o.groupId === groupId && o.optionId === optionId);
        if (exists) {
          return prev.filter(o => !(o.groupId === groupId && o.optionId === optionId));
        } else {
          return [...prev, { groupId, groupTitle, optionId, optionName, price }];
        }
      }
    });
  };

  const extraTotal = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
  const unitPrice = item.price + extraTotal;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1c1a17] border border-white/15 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header Image Banner */}
        <div className="relative h-48 bg-stone-900">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a17] via-transparent to-black/60" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white border border-white/20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[10px] font-bold text-[#ff6814] bg-[#ff6814]/10 border border-[#ff6814]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Customise Your Dish
            </span>
            <h2 className="font-serif font-bold text-2xl text-white mt-1">{item.name}</h2>
            <p className="text-xs text-stone-300">Base Price: ₹{item.price}</p>
          </div>
        </div>

        {/* Options List */}
        <div className="p-6 space-y-6 max-h-[50vh] overflow-y-auto">
          {item.customisations?.map((group) => (
            <div key={group.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-stone-200">{group.title}</h3>
                <span className="text-[10px] uppercase font-bold text-stone-400">
                  {group.required ? 'Required (Pick 1)' : 'Optional Add-on'}
                </span>
              </div>

              <div className="space-y-2">
                {group.options.map((opt) => {
                  const isSelected = selectedOptions.some(
                    s => s.groupId === group.id && s.optionId === opt.id
                  );
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleOption(group.id, group.title, opt.id, opt.name, opt.price, group.required)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#ff6814]/15 border-[#ff6814] text-white'
                          : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#ff6814] bg-[#ff6814]' : 'border-stone-500'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="font-medium">{opt.name}</span>
                      </div>
                      <span className="text-stone-400 font-semibold">
                        {opt.price > 0 ? `+₹${opt.price}` : 'Free'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Cooking Notes */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-amber-400" />
              <span>Special Chef Request / Cooking Notes</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Less spicy, extra sauce on side, no onions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-stone-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#ff6814]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#141210] border-t border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-stone-900 p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-white hover:bg-stone-700"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-white px-2">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-[#ff6814] flex items-center justify-center text-white hover:bg-[#ee5703]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onConfirm(selectedOptions, quantity, notes)}
            className="flex-1 py-3 px-6 rounded-xl bg-[#ff6814] hover:bg-[#ee5703] text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-[#ff6814]/20 transition-all"
            id="confirm-customisation-btn"
          >
            <span>Add Item to Order</span>
            <span>₹{totalPrice}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
