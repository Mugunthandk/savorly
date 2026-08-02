import React, { useState } from 'react';
import { 
  CreditCard, Wallet, Smartphone, ShieldCheck, CheckCircle2, 
  Sparkles, Star, Crown, Award, ChevronRight, ThumbsUp, Heart, ArrowRight, X
} from 'lucide-react';
import { Order, User, CartItem } from '../types';

interface ElegantPaymentProps {
  user: User;
  grandTotal: number;
  restaurantName: string;
  cartItems?: CartItem[];
  onPaymentSuccess: (paymentDetails: { method: string; goldPointsEarned: number }) => void;
  onClose?: () => void;
}

export const ElegantPayment: React.FC<ElegantPaymentProps> = ({
  user,
  grandTotal,
  restaurantName,
  cartItems = [],
  onPaymentSuccess,
  onClose
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'gold_wallet' | 'card' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Star Rating & Feedback State (Animated Feedback on Completion)
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    '⚡ Lightning Delivery', 
    '👑 Royal Gourmet Presentation', 
    '🔥 Piping Hot & Sealed'
  ]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [customComment, setCustomComment] = useState('');

  const FEEDBACK_TAGS = [
    '⚡ Lightning Delivery',
    '🔥 Piping Hot & Sealed',
    '👑 Royal Gourmet Presentation',
    '👨‍🍳 Chef Special Spice',
    '🌿 Eco Insulated Box',
    '🛵 Courteous Rider'
  ];

  const RATING_LABELS: Record<number, string> = {
    1: 'Needs Improvement ⚠️',
    2: 'Fair Experience 😐',
    3: 'Good Quality 🙂',
    4: 'Delicious & Fresh ✨',
    5: 'Royal Dining Perfection 👑'
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      onPaymentSuccess({
        method: selectedMethod,
        goldPointsEarned: Math.floor(grandTotal * 0.1) // 10% Gold Points
      });
    }, 1200);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitFeedback = () => {
    setFeedbackSubmitted(true);
  };

  return (
    <div className="relative">
      {/* Outer Golden-Gradient Border Container */}
      <div 
        className="relative p-[2px] rounded-3xl shadow-[0_0_35px_rgba(191,149,63,0.35)] transition-all duration-300"
        style={{ background: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)' }}
      >
        
        {/* Subtle Ambient Gold Glow Background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/30 via-yellow-400/20 to-amber-500/30 rounded-3xl blur-xl opacity-60 pointer-events-none" />

        {/* Inner Card Content */}
        <div className="relative bg-[#171512] rounded-[22px] overflow-hidden text-stone-100">
          
          {/* Header with Savorly Gold Privilege Banner */}
          <div className="p-6 bg-gradient-to-b from-[#28231a] to-[#1d1914] border-b border-amber-500/30 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0">
                  <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-white">Savorly Gold Payment</h3>
                    <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <Sparkles className="w-2.5 h-2.5 fill-stone-950" />
                      Savorly Gold
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/80">
                    VIP Priority Processing • 0% Convenience Fee • Gold Cashback
                  </p>
                </div>
              </div>

              {onClose && (
                <button 
                  onClick={onClose} 
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Total Payable Gold Pill */}
            <div className="mt-4 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
              <div className="text-xs text-stone-300">
                <span>Amount to Pay for </span>
                <strong className="text-white">{restaurantName}</strong>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif font-extrabold text-amber-300">₹{grandTotal}</span>
                <span className="block text-[10px] text-amber-400 font-medium">Earn +{Math.floor(grandTotal * 0.1)} Gold Points</span>
              </div>
            </div>
          </div>

          {!paymentComplete ? (
            /* PAYMENT SELECTION STEP */
            <div className="p-6 space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-200">
                  <span>Select Payment Method:</span>
                  <span className="text-[11px] text-stone-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    256-Bit Encrypted
                  </span>
                </div>

                {/* 1. UPI / GPay / PhonePe with Savorly Gold Badge */}
                <div 
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                    selectedMethod === 'upi'
                      ? 'bg-gradient-to-r from-amber-950/60 to-emerald-950/40 border-amber-400 ring-1 ring-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-white">Instant UPI (GPay / PhonePe / Paytm)</strong>
                          {/* Sophisticated Savorly Gold Badge */}
                          <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-stone-950 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Crown className="w-2.5 h-2.5 fill-stone-950" />
                            Savorly Gold
                          </span>
                        </div>
                        <p className="text-xs text-stone-300 mt-0.5">
                          Instant verification • Extra ₹25 Gold Cashback applied
                        </p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedMethod === 'upi' ? 'border-amber-400 bg-amber-400 text-stone-950' : 'border-stone-600'
                    }`}>
                      {selectedMethod === 'upi' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* 2. Savorly Gold VIP Wallet */}
                <div 
                  onClick={() => setSelectedMethod('gold_wallet')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                    selectedMethod === 'gold_wallet'
                      ? 'bg-gradient-to-r from-amber-950/80 via-yellow-950/50 to-amber-900/60 border-amber-400 ring-1 ring-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-white">Savorly Gold Pay Wallet</strong>
                          <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-stone-950 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Crown className="w-2.5 h-2.5 fill-stone-950" />
                            Savorly Gold
                          </span>
                        </div>
                        <p className="text-xs text-amber-200/90 mt-0.5">
                          Balance: <strong className="text-amber-300">₹{user.walletBalance + 500}</strong> • Auto-pay & Instant Refund Guarantee
                        </p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedMethod === 'gold_wallet' ? 'border-amber-400 bg-amber-400 text-stone-950' : 'border-stone-600'
                    }`}>
                      {selectedMethod === 'gold_wallet' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* 3. Credit / Debit Card */}
                <div 
                  onClick={() => setSelectedMethod('card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedMethod === 'card'
                      ? 'bg-gradient-to-r from-amber-950/60 to-purple-950/40 border-amber-400 ring-1 ring-amber-400'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="text-sm text-white block">Credit or Debit Card</strong>
                        <p className="text-xs text-stone-300 mt-0.5">Visa, Mastercard, RuPay & Amex accepted</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedMethod === 'card' ? 'border-amber-400 bg-amber-400 text-stone-950' : 'border-stone-600'
                    }`}>
                      {selectedMethod === 'card' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* 4. Pay on Delivery */}
                <div 
                  onClick={() => setSelectedMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedMethod === 'cod'
                      ? 'bg-gradient-to-r from-amber-950/60 to-orange-950/40 border-amber-400 ring-1 ring-amber-400'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="text-sm text-white block">Cash or QR on Delivery</strong>
                        <p className="text-xs text-stone-300 mt-0.5">Pay at doorstep via Cash or QR code scanner</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      selectedMethod === 'cod' ? 'border-amber-400 bg-amber-400 text-stone-950' : 'border-stone-600'
                    }`}>
                      {selectedMethod === 'cod' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm flex items-center justify-between px-6 shadow-xl shadow-amber-500/20 transition-all transform active:scale-98 disabled:opacity-50"
              >
                <span>{isProcessing ? 'Securing Golden Slot...' : 'Confirm Gold Payment'}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">₹{grandTotal}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          ) : (
            /* ANIMATED STAR-RATING FEEDBACK ON ORDER COMPLETION */
            <div className="p-6 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
              
              {!feedbackSubmitted ? (
                <>
                  {/* Order Complete Celebration Badge */}
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 p-1 shadow-xl shadow-amber-500/30 flex items-center justify-center animate-bounce">
                      <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-9 h-9 text-amber-400" />
                      </div>
                    </div>

                    <h2 className="font-serif font-bold text-2xl text-white">Payment Confirmed!</h2>
                    <p className="text-xs text-amber-200/90 max-w-sm mx-auto">
                      Your order is sent to <strong className="text-white">{restaurantName}</strong>. Rate your dining preparation experience to claim <strong className="text-amber-300">100 Savorly Gold Star Points</strong>!
                    </p>
                  </div>

                  {/* Interactive Star Rating Selector */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-amber-500/30 space-y-3">
                    <span className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
                      Tap to Rate Experience
                    </span>

                    <div className="flex items-center justify-center gap-2 py-2">
                      {[1, 2, 3, 4, 5].map((starIndex) => {
                        const isFilled = (hoverRating !== null ? hoverRating : rating) >= starIndex;
                        return (
                          <button
                            key={starIndex}
                            type="button"
                            onMouseEnter={() => setHoverRating(starIndex)}
                            onMouseLeave={() => setHoverRating(null)}
                            onClick={() => setRating(starIndex)}
                            className="p-1 transition-all transform hover:scale-125 focus:outline-none"
                          >
                            <Star 
                              className={`w-9 h-9 transition-colors duration-150 ${
                                isFilled
                                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                                  : 'text-stone-600 hover:text-stone-400'
                              }`} 
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Rating Text Banner */}
                    <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-serif font-bold text-sm shadow-md">
                      {RATING_LABELS[rating]}
                    </div>
                  </div>

                  {/* Feedback Tag Chips */}
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>What impressed you most?</span>
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {FEEDBACK_TAGS.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold shadow-md shadow-amber-500/20 scale-105'
                                : 'bg-white/5 border border-white/10 text-stone-300 hover:bg-white/10'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Chef Comment */}
                  <div className="text-left space-y-1.5">
                    <label className="text-xs text-stone-400">Add a compliment or special note for the Chef:</label>
                    <input
                      type="text"
                      value={customComment}
                      onChange={(e) => setCustomComment(e.target.value)}
                      placeholder="e.g. Please make the biryani spice medium cooked, loved the thermal seal!"
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Submit Feedback Button */}
                  <button
                    onClick={handleSubmitFeedback}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <Award className="w-5 h-5" />
                    <span>Submit Savorly Gold Feedback (+100 Stars)</span>
                  </button>
                </>
              ) : (
                /* FEEDBACK SUBMITTED CONFIRMATION */
                <div className="p-6 space-y-4 text-center animate-in fade-in zoom-in duration-300">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 p-1 shadow-2xl shadow-amber-500/50 flex items-center justify-center">
                      <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center">
                        <Crown className="w-10 h-10 text-amber-400 animate-pulse" />
                      </div>
                    </div>
                    {/* Floating star particles */}
                    <div className="absolute -top-1 -right-1 text-xl animate-bounce">⭐</div>
                    <div className="absolute -bottom-1 -left-1 text-xl animate-bounce delay-100">✨</div>
                  </div>

                  <h3 className="font-serif font-bold text-2xl text-white">Thank You, Gourmet Gold Member!</h3>
                  <p className="text-xs text-stone-300 max-w-sm mx-auto">
                    Your {rating}-Star rating & compliments have been shared directly with <strong className="text-amber-300">{restaurantName}</strong> and your delivery captain.
                  </p>

                  <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-center gap-2">
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <span><strong>+100 Savorly Gold Points</strong> added to your profile!</span>
                  </div>

                  {onClose && (
                    <button
                      onClick={onClose}
                      className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                    >
                      Return to Order Tracker
                    </button>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
