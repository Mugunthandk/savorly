import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Sparkles, QrCode, Users, Tag, Clock, 
  MapPin, ChevronDown, User as UserIcon, AlertCircle, RefreshCw, Flame
} from 'lucide-react';
import { User, CartItem, DeliveryAddress } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface NavbarProps {
  user: User;
  onSelectUser: (user: User) => void;
  activeView: 'explore' | 'scan' | 'group' | 'offers' | 'orders';
  setActiveView: (view: 'explore' | 'scan' | 'group' | 'offers' | 'orders') => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenConcierge: () => void;
  onOpenSurprise: () => void;
  onOpenProfile: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeAddress?: DeliveryAddress;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onSelectUser,
  activeView,
  setActiveView,
  cartItems,
  onOpenCart,
  onOpenConcierge,
  onOpenSurprise,
  onOpenProfile,
  searchQuery,
  setSearchQuery,
  activeAddress
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#12110e]/90 backdrop-blur-md border-b border-white/10">
      {/* Top Banner Alert for Active Dietary Guardian */}
      {user.allergies.length > 0 && (
        <div className="bg-amber-950/80 text-amber-200 text-xs px-4 py-1.5 flex items-center justify-between border-b border-amber-800/40">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-center">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-100">Dietary Guardian Active:</strong> Protection enabled for <strong>{user.allergies.join(', ')}</strong> ({user.name})
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-6 shrink-0">
            <button 
              onClick={() => setActiveView('explore')} 
              className="text-left group focus:outline-none"
              id="brand-logo-btn"
            >
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff6814] to-[#f95700] flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-[#ff6814]/20 group-hover:scale-105 transition-transform">
                  S
                </span>
                <div>
                  <span className="font-serif text-2xl font-bold tracking-tight text-white block leading-none">
                    SAVORLY
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-amber-400/80 font-medium block mt-0.5">
                    Chennai • Epicurean
                  </span>
                </div>
              </div>
            </button>

            {/* Address Selector Pill */}
            <button 
              onClick={onOpenProfile}
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-stone-300 transition-colors"
              title="Change Delivery Location"
              id="location-picker-btn"
            >
              <MapPin className="w-3.5 h-3.5 text-[#ff6814]" />
              <div className="text-left">
                <span className="text-stone-400 text-[10px] block leading-none">Deliver to ({activeAddress?.label || 'Home'})</span>
                <span className="font-medium text-stone-200 text-xs truncate max-w-[160px] block">
                  {activeAddress?.fullAddress || 'Anna Nagar West, Chennai'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-stone-400 ml-1" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search biryani, pizza, filter coffee, restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1a17] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#ff6814] focus:ring-1 focus:ring-[#ff6814] transition-all"
              id="navbar-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Craving Concierge AI Button */}
            <button
              onClick={onOpenConcierge}
              className="relative group px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-[#ff6814]/30 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-[#ff6814]/40 text-amber-200 text-xs font-medium flex items-center gap-2 shadow-lg shadow-[#ff6814]/10 transition-all active:scale-95"
              id="craving-concierge-btn"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Craving Concierge</span>
              <span className="sm:hidden">Concierge</span>
              <span className="bg-[#ff6814] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                AI
              </span>
            </button>

            {/* Surprise Me Wheel */}
            <button
              onClick={onOpenSurprise}
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 text-xs transition-colors"
              title="Random Meal Spinner"
              id="surprise-me-btn"
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Surprise Me</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative px-3.5 py-2 rounded-full bg-[#1c1a17] hover:bg-[#25221e] border border-white/10 text-white flex items-center gap-2 text-xs font-medium transition-colors"
              id="navbar-cart-btn"
            >
              <ShoppingBag className="w-4 h-4 text-[#ff6814]" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-[#ff6814] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 transition-colors"
                id="user-profile-menu-btn"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#ff6814]"
                />
                <span className="hidden md:inline text-xs font-medium text-stone-200 max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400 hidden sm:inline" />
              </button>

              {/* User Switcher Drawer Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1c1a17] border border-white/15 rounded-2xl shadow-2xl p-3 z-50 divide-y divide-white/10">
                  <div className="pb-2.5">
                    <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                      Switch Demo Profile
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Test dietary restrictions & allergy warnings
                    </p>
                  </div>

                  <div className="py-2 space-y-1.5">
                    {DEMO_USERS.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSelectUser(u);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                          user.id === u.id 
                            ? 'bg-[#ff6814]/20 border border-[#ff6814]/40 text-white' 
                            : 'hover:bg-white/5 text-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <p className="font-medium text-stone-200 leading-none">{u.name}</p>
                            <span className="text-[10px] text-amber-400/90 block mt-0.5">
                              {u.dietaryRestrictions.includes('pure-veg') && '🌱 Pure Veg'}
                              {u.dietaryRestrictions.includes('peanut-allergy') && '⚠️ Peanut Allergy'}
                              {u.dietaryRestrictions.includes('high-protein') && '💪 High Protein'}
                            </span>
                          </div>
                        </div>
                        {user.id === u.id && (
                          <span className="text-[10px] font-bold text-[#ff6814] bg-[#ff6814]/10 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2.5 space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenProfile();
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-stone-300 hover:bg-white/5 hover:text-white"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-stone-400" />
                      <span>Manage Address & Allergies</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Secondary Navigation Row (Tabs) */}
        <div className="flex items-center justify-between border-t border-white/5 py-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={() => setActiveView('explore')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'explore'
                  ? 'bg-[#ff6814] text-white shadow-md shadow-[#ff6814]/20'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
              id="tab-explore-btn"
            >
              <span>Explore Food</span>
            </button>

            <button
              onClick={() => setActiveView('scan')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'scan'
                  ? 'bg-[#ff6814] text-white shadow-md shadow-[#ff6814]/20'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
              id="tab-scan-btn"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan & Dine-In</span>
            </button>

            <button
              onClick={() => setActiveView('group')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'group'
                  ? 'bg-[#ff6814] text-white shadow-md shadow-[#ff6814]/20'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
              id="tab-group-btn"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Group Order</span>
            </button>

            <button
              onClick={() => setActiveView('offers')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'offers'
                  ? 'bg-[#ff6814] text-white shadow-md shadow-[#ff6814]/20'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
              id="tab-offers-btn"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Offers & Rewards</span>
            </button>

            <button
              onClick={() => setActiveView('orders')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'orders'
                  ? 'bg-[#ff6814] text-white shadow-md shadow-[#ff6814]/20'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
              id="tab-orders-btn"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Orders & Tracking</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-[11px] text-stone-400 border-l border-white/10 pl-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Avg Delivery: <strong>22 Mins</strong>
            </span>
            <span className="text-stone-500">•</span>
            <span className="text-amber-300 font-medium">
              Savor Points: <strong>{user.savorPoints} pts</strong>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
