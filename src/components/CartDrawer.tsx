import React, { useState } from 'react';
import { 
  X, Trash2, Plus, Minus, Tag, Sparkles, VolumeX, Gift, 
  ChevronRight, ShieldCheck, Heart, AlertTriangle 
} from 'lucide-react';
import { CartItem, Coupon, User } from '../types';
import { DEMO_COUPONS } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  restaurantName: string | null;
  user: User;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onClearCart: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  driverTip: number;
  setDriverTip: (tip: number) => void;
  quietDelivery: { noDoorbell: boolean; leaveAtGate: boolean; silentText: boolean };
  setQuietDelivery: React.Dispatch<React.SetStateAction<{ noDoorbell: boolean; leaveAtGate: boolean; silentText: boolean }>>;
  celebrationMode: { occasion: string; cardMessage: string; candles: boolean };
  setCelebrationMode: React.Dispatch<React.SetStateAction<{ occasion: string; cardMessage: string; candles: boolean }>>;
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  restaurantName,
  user,
  onUpdateQuantity,
  onClearCart,
  appliedCoupon,
  onApplyCoupon,
  driverTip,
  setDriverTip,
  quietDelivery,
  setQuietDelivery,
  celebrationMode,
  setCelebrationMode,
  onOpenCheckout
}) => {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [showCelebrationForm, setShowCelebrationForm] = useState(false);

  if (!isOpen) return null;

  const itemTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  // Calculate Discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercentage) {
      discountAmount = Math.round((itemTotal * appliedCoupon.discountPercentage) / 100);
      if (appliedCoupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscount);
      }
    } else if (appliedCoupon.flatDiscount) {
      discountAmount = appliedCoupon.flatDiscount;
    }
  }

  const deliveryFee = itemTotal >= 399 ? 0 : 40;
  const taxesAndPacking = Math.round(itemTotal * 0.05) + 20;
  const grandTotal = Math.max(0, itemTotal - discountAmount + deliveryFee + taxesAndPacking + driverTip);
  const savorPointsEarned = Math.floor(grandTotal / 10);

  const handleApplyCouponCode = (code: string) => {
    const found = DEMO_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (found) {
      if (itemTotal >= found.minOrderValue) {
        onApplyCoupon(found);
      } else {
        alert(`Minimum order value for ${found.code} is ₹${found.minOrderValue}`);
      }
    } else {
      alert('Invalid Promo Code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="bg-[#181613] border-l border-white/10 w-full max-w-md h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 bg-[#211e19] border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold text-[#ff6814] uppercase tracking-wider">
              {restaurantName ? `Ordering from ${restaurantName}` : 'Your Cart'}
            </span>
            <h2 className="font-serif font-bold text-xl text-white">Your Order</h2>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-stone-400 hover:text-rose-400 p-2 text-xs flex items-center gap-1"
                title="Clear Cart"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-500 mx-auto">
                <Trash2 className="w-10 h-10" />
              </div>
              <p className="font-serif font-bold text-lg text-white">Your cart is currently empty</p>
              <p className="text-xs text-stone-400">Explore Chennai's finest dishes and add your favorites.</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#ff6814] text-white font-bold text-xs shadow-lg"
              >
                Explore Restaurants
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                {cartItems.map((cartItem) => (
                  <div key={cartItem.cartItemId} className="p-3.5 rounded-2xl bg-[#1e1c18] border border-white/10 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-sm border p-0.5 flex items-center justify-center ${
                            cartItem.menuItem.isVeg ? 'border-emerald-500' : 'border-rose-500'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cartItem.menuItem.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          </span>
                          <h4 className="font-serif font-bold text-sm text-white">{cartItem.menuItem.name}</h4>
                        </div>

                        {/* Selected Customisations */}
                        {cartItem.selectedCustomisations.length > 0 && (
                          <div className="text-[11px] text-stone-400 mt-1 space-x-1">
                            {cartItem.selectedCustomisations.map((c) => (
                              <span key={c.optionId} className="bg-white/5 px-1.5 py-0.5 rounded">
                                {c.optionName} (+₹{c.price})
                              </span>
                            ))}
                          </div>
                        )}

                        {cartItem.itemNotes && (
                          <p className="text-[10px] text-amber-300 italic mt-0.5">Note: "{cartItem.itemNotes}"</p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-sm text-[#ff6814]">₹{cartItem.totalPrice}</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[10px] text-stone-400">₹{cartItem.unitPrice} each</span>
                      <div className="flex items-center gap-2 bg-stone-900 px-2 py-1 rounded-xl border border-white/10">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.cartItemId, -1)}
                          className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-1">{cartItem.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.cartItemId, 1)}
                          className="w-6 h-6 rounded bg-[#ff6814] flex items-center justify-center text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Applier */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>Apply Coupon Code</span>
                  </span>
                  {appliedCoupon && (
                    <button
                      onClick={() => onApplyCoupon(null)}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Remove ({appliedCoupon.code})
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Coupon <strong>{appliedCoupon.code}</strong> applied! Saved ₹{discountAmount}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. FIRST50, SAVE20"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-stone-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-[#ff6814]"
                    />
                    <button
                      onClick={() => handleApplyCouponCode(couponCodeInput)}
                      className="px-4 py-2 rounded-xl bg-[#ff6814] text-white text-xs font-bold"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Popular Coupons Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {DEMO_COUPONS.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleApplyCouponCode(c.code)}
                      className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 px-2 py-1 rounded-md"
                    >
                      {c.code} ({c.badge})
                    </button>
                  ))}
                </div>
              </div>

              {/* Quiet Delivery Preferences */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/10 space-y-2">
                <p className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                  <VolumeX className="w-4 h-4 text-amber-400" />
                  <span>Quiet Delivery Preferences</span>
                </p>

                <div className="space-y-1.5 text-xs text-stone-300 pt-1">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Do not ring doorbell</span>
                    <input
                      type="checkbox"
                      checked={quietDelivery.noDoorbell}
                      onChange={(e) => setQuietDelivery({ ...quietDelivery, noDoorbell: e.target.checked })}
                      className="accent-[#ff6814]"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Leave package at security gate</span>
                    <input
                      type="checkbox"
                      checked={quietDelivery.leaveAtGate}
                      onChange={(e) => setQuietDelivery({ ...quietDelivery, leaveAtGate: e.target.checked })}
                      className="accent-[#ff6814]"
                    />
                  </label>
                </div>
              </div>

              {/* Celebration Mode Toggle */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span>Celebration Mode (Birthday/Surprise)</span>
                  </span>
                  <button
                    onClick={() => setShowCelebrationForm(!showCelebrationForm)}
                    className="text-[11px] text-[#ff6814] font-bold"
                  >
                    {showCelebrationForm ? 'Hide' : 'Add Free Note & Candles'}
                  </button>
                </div>

                {showCelebrationForm && (
                  <div className="space-y-2 pt-2 border-t border-amber-500/20">
                    <input
                      type="text"
                      placeholder="Occasion (e.g. Birthday, Anniversary)"
                      value={celebrationMode.occasion}
                      onChange={(e) => setCelebrationMode({ ...celebrationMode, occasion: e.target.value })}
                      className="w-full bg-stone-900 border border-white/10 rounded-xl p-2 text-xs text-white"
                    />
                    <textarea
                      placeholder="Handwritten Card Message for recipient..."
                      value={celebrationMode.cardMessage}
                      onChange={(e) => setCelebrationMode({ ...celebrationMode, cardMessage: e.target.value })}
                      className="w-full bg-stone-900 border border-white/10 rounded-xl p-2 text-xs text-white h-16"
                    />
                    <label className="flex items-center justify-between text-xs text-amber-200">
                      <span>Add Complimentary Birthday Candles</span>
                      <input
                        type="checkbox"
                        checked={celebrationMode.candles}
                        onChange={(e) => setCelebrationMode({ ...celebrationMode, candles: e.target.checked })}
                        className="accent-[#ff6814]"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Driver Tip */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-white/10 space-y-2">
                <p className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Tip Delivery Captain</span>
                </p>

                <div className="flex gap-2">
                  {[0, 30, 50, 100].map((t) => (
                    <button
                      key={t}
                      onClick={() => setDriverTip(t)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        driverTip === t
                          ? 'bg-[#ff6814] text-white border-[#ff6814]'
                          : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      {t === 0 ? 'No tip' : `₹${t}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Details Breakdown */}
              <div className="p-4 rounded-2xl bg-[#141210] border border-white/10 space-y-2 text-xs text-stone-300">
                <p className="font-serif font-bold text-sm text-white mb-2">Order Cost Breakdown</p>
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span>₹{itemTotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Eco Packaging</span>
                  <span>₹{taxesAndPacking}</span>
                </div>
                {driverTip > 0 && (
                  <div className="flex justify-between text-rose-400">
                    <span>Driver Tip</span>
                    <span>₹{driverTip}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Grand Total</span>
                  <span className="text-[#ff6814]">₹{grandTotal}</span>
                </div>

                <div className="pt-1 text-[11px] text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>You will earn <strong>+{savorPointsEarned} Savor Points</strong> on this order</span>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer Proceed CTA */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-[#141210] border-t border-white/10 shrink-0">
            <button
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full py-4 rounded-2xl bg-[#ff6814] hover:bg-[#ee5703] text-white font-bold text-sm flex items-center justify-between px-6 shadow-xl shadow-[#ff6814]/30 transition-all active:scale-98"
              id="proceed-to-checkout-btn"
            >
              <span>Proceed to Delivery Address</span>
              <div className="flex items-center gap-1">
                <span>₹{grandTotal}</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
