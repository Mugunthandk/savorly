import React, { useState, useRef } from 'react';
import { QrCode, Camera, Upload, BellRing, GlassWater, Receipt, Check, Sparkles, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { DineInSession, MenuItem, User } from '../types';
import { RESTAURANTS, MENU_ITEMS } from '../data/mockData';

interface ScanAndOrderModalProps {
  user: User;
  activeDineIn: DineInSession | null;
  onStartSession: (session: DineInSession) => void;
  onClose: () => void;
  onAddToCart: (item: MenuItem) => void;
}

export const ScanAndOrderModal: React.FC<ScanAndOrderModalProps> = ({
  user,
  activeDineIn,
  onStartSession,
  onClose,
  onAddToCart
}) => {
  const [scannerActive, setScannerActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tableGuestCount, setTableGuestCount] = useState(2);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDemoScan = (restId: string, tableNo: string) => {
    const rest = RESTAURANTS.find(r => r.id === restId) || RESTAURANTS[1];
    const newSession: DineInSession = {
      restaurantId: rest.id,
      restaurantName: rest.name,
      tableNumber: tableNo,
      sessionCode: `TAB-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [],
      waiterCalled: false,
      waterRequested: false,
      billRequested: false,
      status: 'active'
    };
    onStartSession(newSession);
    triggerToast(`Connected to ${rest.name} - Table ${tableNo}!`);
  };

  const currentRestItems = activeDineIn 
    ? MENU_ITEMS.filter(m => m.restaurantId === activeDineIn.restaurantId)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181613] border border-white/15 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-[#211e19] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ff6814] flex items-center justify-center text-white shadow-lg shadow-[#ff6814]/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-800 uppercase tracking-wider">
                Dine-In Tech
              </span>
              <h2 className="font-serif font-bold text-xl text-white mt-0.5">
                Scan QR & Table Ordering
              </h2>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-950 border-b border-emerald-500 text-emerald-200 text-xs px-4 py-2 flex items-center justify-center gap-2 font-semibold">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Active Session Display */}
          {activeDineIn ? (
            <div className="space-y-6">
              
              {/* Active Table Status Banner */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#ff6814] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                    T{activeDineIn.tableNumber}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">{activeDineIn.restaurantName}</h3>
                    <p className="text-xs text-amber-300">
                      Table {activeDineIn.tableNumber} • Code: <strong className="font-mono">{activeDineIn.sessionCode}</strong>
                    </p>
                  </div>
                </div>

                {/* Table Service Action Triggers */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerToast("Waiter notified! Captain on the way to Table " + activeDineIn.tableNumber)}
                    className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 flex items-center gap-1.5"
                    title="Call Waiter"
                  >
                    <BellRing className="w-4 h-4 text-amber-400" />
                    <span>Call Waiter</span>
                  </button>

                  <button
                    onClick={() => triggerToast("Complementary water bottle requested for Table " + activeDineIn.tableNumber)}
                    className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-semibold hover:bg-blue-500/30 flex items-center gap-1.5"
                    title="Request Water"
                  >
                    <GlassWater className="w-4 h-4 text-blue-400" />
                    <span>Water</span>
                  </button>

                  <button
                    onClick={() => triggerToast("Bill print request sent to cashier desk.")}
                    className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 flex items-center gap-1.5"
                    title="Get Bill"
                  >
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <span>Get Bill</span>
                  </button>
                </div>
              </div>

              {/* Dietary Guardian Warning if Profile Has Allergies */}
              {user.allergies.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-600/40 text-amber-200 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Dietary Protection:</strong> Table menu items containing {user.allergies.join(', ')} are flagged for {user.name}.
                  </span>
                </div>
              )}

              {/* Digital Table Menu */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-white">Digital Table Menu</h3>
                  <span className="text-xs text-stone-400">Order directly to kitchen</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentRestItems.map((item) => {
                    const hasAllergen = user.allergies.some(a => item.allergens.includes(a));
                    return (
                      <div key={item.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-stone-200 truncate">{item.name}</p>
                          <p className="text-xs text-[#ff6814] font-semibold">₹{item.price}</p>
                          {hasAllergen && (
                            <span className="text-[9px] text-amber-400 font-bold block">⚠️ Contains {item.allergens.join(', ')}</span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            onAddToCart(item);
                            triggerToast(`Added ${item.name} to Table ${activeDineIn.tableNumber} order!`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#ff6814] hover:bg-[#ee5703] text-white text-xs font-bold shrink-0"
                        >
                          Order
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* No Active Session: Camera Scan or Quick Demo Buttons */
            <div className="space-y-6 text-center">
              
              <div className="p-8 rounded-3xl bg-stone-900/80 border-2 border-dashed border-white/20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#ff6814]/20 border border-[#ff6814]/40 flex items-center justify-center text-[#ff6814] mx-auto animate-pulse">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Point Camera at Table QR Code</h3>
                  <p className="text-xs text-stone-400 max-w-md mx-auto mt-1">
                    Scan the QR stand on your restaurant table to view the contactless digital menu, call waiters, and pay directly.
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setScannerActive(true);
                      setTimeout(() => {
                        setScannerActive(false);
                        handleDemoScan('rest-madras-tiffin', '12');
                      }, 2000);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#ff6814] hover:bg-[#ee5703] text-white text-xs font-bold shadow-lg shadow-[#ff6814]/20 flex items-center gap-2"
                    id="simulate-camera-scan-btn"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{scannerActive ? 'Scanning Table QR...' : 'Open Web Scanner'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Demo Table Buttons */}
              <div className="space-y-3 pt-2">
                <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
                  Or Test Quick Demo Table Sessions:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <button
                    onClick={() => handleDemoScan('rest-madras-tiffin', '12')}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ff6814]/40 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">Heritage Tiffin</span>
                      <h4 className="font-serif font-bold text-sm text-white">Madras Tiffin Room</h4>
                      <p className="text-xs text-amber-300">Table 12 • T. Nagar</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#ff6814]" />
                  </button>

                  <button
                    onClick={() => handleDemoScan('rest-napoli-pizza', '04')}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ff6814]/40 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <span className="text-[10px] text-orange-400 font-bold uppercase">Gourmet Italian</span>
                      <h4 className="font-serif font-bold text-sm text-white">Napoli Pizza House</h4>
                      <p className="text-xs text-amber-300">Table 04 • Adyar</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#ff6814]" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
