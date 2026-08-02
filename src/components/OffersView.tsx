import React, { useState } from 'react';
import { Tag, Sparkles, Gift, Copy, Check, Percent, Award, ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { DEMO_COUPONS } from '../data/mockData';

interface OffersViewProps {
  user: User;
  onApplyCouponCode: (code: string) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({ user, onApplyCouponCode }) => {
  const [scratched, setScratched] = useState(false);
  const [wonPoints, setWonPoints] = useState(150);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Savor Points Hero Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#221b16] to-[#181613] border border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-800 uppercase tracking-widest">
            {user.tier} Tier Member
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-white">
            Offers & Savor Points
          </h1>
          <p className="text-xs text-stone-300 max-w-md">
            Earn 10 Savor Points for every ₹100 spent. Redeem points for free gourmet dishes, exclusive delivery passes, and date night upgrades.
          </p>
        </div>

        {/* Points Badge */}
        <div className="p-5 rounded-2xl bg-black/60 border border-amber-500/40 text-center space-y-1 shrink-0">
          <Award className="w-8 h-8 text-amber-400 mx-auto" />
          <p className="font-serif font-bold text-3xl text-amber-300">{user.savorPoints}</p>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">Available Savor Points</span>
        </div>
      </div>

      {/* Interactive Scratch Card Widget */}
      <div className="p-6 rounded-3xl bg-[#1c1a17] border border-white/10 space-y-4 text-center">
        <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-bold">
          <Gift className="w-5 h-5 text-amber-400" />
          <span>Daily Epicurean Scratch Card</span>
        </div>

        <div className="max-w-xs mx-auto">
          {!scratched ? (
            <button
              onClick={() => setScratched(true)}
              className="w-full h-36 rounded-2xl bg-gradient-to-br from-amber-500 via-[#ff6814] to-orange-600 p-6 flex flex-col items-center justify-center text-white font-serif font-bold text-lg shadow-xl hover:scale-105 transition-transform group"
              id="scratch-card-btn"
            >
              <Sparkles className="w-8 h-8 text-amber-200 mb-2 group-hover:rotate-12 transition-transform" />
              <span>Click to Scratch & Win Savor Points!</span>
            </button>
          ) : (
            <div className="w-full h-36 rounded-2xl bg-emerald-950 border border-emerald-500 p-6 flex flex-col items-center justify-center text-emerald-200 animate-in zoom-in-95 duration-300 space-y-1">
              <Sparkles className="w-8 h-8 text-emerald-400" />
              <p className="font-serif font-bold text-2xl text-white">+{wonPoints} Savor Points!</p>
              <span className="text-xs text-emerald-300">Added directly to {user.name}'s account</span>
            </div>
          )}
        </div>
      </div>

      {/* Available Coupon Codes */}
      <div className="space-y-4">
        <h2 className="font-serif font-bold text-xl text-white flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#ff6814]" />
          <span>Active Gourmet Promo Codes</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEMO_COUPONS.map((coupon) => (
            <div key={coupon.code} className="p-5 rounded-2xl bg-[#1c1a17] border border-white/10 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-base text-[#ff6814] bg-[#ff6814]/10 border border-[#ff6814]/30 px-3 py-1 rounded-xl">
                    {coupon.code}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800">
                    {coupon.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-200 font-medium mt-2.5">{coupon.description}</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Min order: ₹{coupon.minOrderValue} {coupon.maxDiscount ? `• Max discount: ₹${coupon.maxDiscount}` : ''}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex gap-2">
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === coupon.code ? 'Copied' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={() => onApplyCouponCode(coupon.code)}
                  className="flex-1 py-2 rounded-xl bg-[#ff6814] hover:bg-[#ee5703] text-white text-xs font-bold"
                >
                  Use Coupon
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
