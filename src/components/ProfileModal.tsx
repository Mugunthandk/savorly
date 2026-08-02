import React, { useState } from 'react';
import { User, DeliveryAddress, Allergen, DietaryRestriction } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { ShieldCheck, MapPin, User as UserIcon, Award, Plus, Check, X, AlertTriangle } from 'lucide-react';

interface ProfileModalProps {
  user: User;
  onSelectUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  onClose: () => void;
}

const ALL_ALLERGENS: { id: Allergen; label: string }[] = [
  { id: 'peanuts', label: 'Peanuts & Groundnuts' },
  { id: 'dairy', label: 'Dairy & Lactose' },
  { id: 'gluten', label: 'Gluten & Wheat' },
  { id: 'tree-nuts', label: 'Tree Nuts (Cashews, Almonds)' },
  { id: 'shellfish', label: 'Crab & Shellfish' },
  { id: 'soy', label: 'Soy' },
  { id: 'egg', label: 'Eggs' }
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onSelectUser,
  onUpdateUser,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'allergies'>('profile');
  const [newAddressLabel, setNewAddressLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddressText, setNewAddressText] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  const handleToggleAllergen = (allergen: Allergen) => {
    let updatedAllergies: Allergen[];
    if (user.allergies.includes(allergen)) {
      updatedAllergies = user.allergies.filter(a => a !== allergen);
    } else {
      updatedAllergies = [...user.allergies, allergen];
    }
    onUpdateUser({
      ...user,
      allergies: updatedAllergies
    });
  };

  const handleAddAddress = () => {
    if (!newAddressText.trim()) return;
    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      label: newAddressLabel,
      fullAddress: newAddressText,
      landmark: newLandmark || 'Near landmark',
      city: 'Chennai',
      pinCode: '600001',
      receiverName: user.name,
      receiverPhone: user.phone
    };
    onUpdateUser({
      ...user,
      savedAddresses: [...user.savedAddresses, newAddr],
      activeAddressId: newAddr.id
    });
    setNewAddressText('');
    setNewLandmark('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181613] border border-white/15 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-[#211e19] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-[#ff6814]" />
            <div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-800 uppercase tracking-wider">
                {user.tier} Member
              </span>
              <h2 className="font-serif font-bold text-xl text-white mt-0.5">{user.name}</h2>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toolbar */}
        <div className="flex border-b border-white/10 px-6 pt-2 gap-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'profile' ? 'border-[#ff6814] text-white' : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            Demo Profiles
          </button>
          <button
            onClick={() => setActiveTab('allergies')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'allergies' ? 'border-[#ff6814] text-white' : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            Dietary Guardian
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'addresses' ? 'border-[#ff6814] text-white' : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            Chennai Addresses
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-300">
                Switch demo accounts to test how Savorly adapts to different dietary constraints (Pure Veg vs Peanut Allergy vs High Protein).
              </p>

              <div className="space-y-2">
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => onSelectUser(u)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-colors ${
                      user.id === u.id
                        ? 'bg-[#ff6814]/20 border-[#ff6814] text-white'
                        : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-sm text-stone-100">{u.name}</h4>
                        <p className="text-xs text-amber-300">
                          {u.dietaryRestrictions.includes('pure-veg') && '🌱 Pure Veg'}
                          {u.dietaryRestrictions.includes('peanut-allergy') && '⚠️ Peanut Allergy'}
                          {u.dietaryRestrictions.includes('high-protein') && '💪 High Protein Focus'}
                        </p>
                      </div>
                    </div>
                    {user.id === u.id && (
                      <span className="text-xs font-bold text-[#ff6814] bg-[#ff6814]/10 px-3 py-1 rounded-full">
                        Active Profile
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'allergies' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  <strong>Dietary Guardian Protection:</strong> Check your allergies below. Savorly will issue warnings before adding unsafe dishes to cart.
                </span>
              </div>

              <div className="space-y-2">
                {ALL_ALLERGENS.map((a) => {
                  const isChecked = user.allergies.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => handleToggleAllergen(a.id)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                        isChecked
                          ? 'bg-amber-950/80 border-amber-500 text-amber-200 font-bold'
                          : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      <span>{a.label}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isChecked ? 'border-amber-400 bg-amber-400 text-stone-950' : 'border-stone-500'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="space-y-2">
                {user.savedAddresses.map((addr) => (
                  <div key={addr.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-stone-300">
                    <div>
                      <strong className="text-white text-sm block">{addr.label}</strong>
                      <p>{addr.fullAddress}</p>
                      <span className="text-[10px] text-stone-400">{addr.landmark} • {addr.city}</span>
                    </div>
                    {user.activeAddressId === addr.id && (
                      <span className="text-[10px] bg-[#ff6814] text-white px-2 py-0.5 rounded font-bold">Default</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Address Form */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/10 space-y-3 pt-3">
                <p className="text-xs font-bold text-white">Add New Chennai Address</p>
                <input
                  type="text"
                  placeholder="Full Address (e.g. Plot 10, OMR Road, Perungudi)"
                  value={newAddressText}
                  onChange={(e) => setNewAddressText(e.target.value)}
                  className="w-full bg-stone-800 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Landmark (e.g. Near Toll Gate)"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  className="w-full bg-stone-800 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
                <button
                  onClick={handleAddAddress}
                  className="w-full py-2.5 rounded-xl bg-[#ff6814] text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save New Address</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
