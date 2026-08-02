import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, MapPin, Phone, MessageSquare, ShieldCheck, 
  Thermometer, Flame, Star, Sparkles, ChefHat, RefreshCw, ArrowLeft, AlertCircle 
} from 'lucide-react';
import { Order } from '../types';

interface LiveOrderTrackerProps {
  order: Order;
  onBack: () => void;
  onOpenReheatModal: (order: Order) => void;
  onOpenSupportModal: (order: Order) => void;
}

const TRACKING_STEPS = [
  { key: 'placed', label: 'Order Placed', time: 'Just now' },
  { key: 'confirmed', label: 'Kitchen Confirmed', time: '2 mins ago' },
  { key: 'preparing', label: 'Cooking & Thermal Sealing', time: 'In progress' },
  { key: 'packed', label: 'Freshness Insulated Pack', time: 'Next' },
  { key: 'out_for_delivery', label: 'On The Way (Express)', time: '12 mins remaining' },
  { key: 'delivered', label: 'Delivered', time: 'Goal' }
];

export const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({
  order,
  onBack,
  onOpenReheatModal,
  onOpenSupportModal
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(2); // Default 'preparing'
  const [freshnessMinutesLeft, setFreshnessMinutesLeft] = useState(28);

  useEffect(() => {
    const timer = setInterval(() => {
      setFreshnessMinutesLeft(prev => Math.max(1, prev - 1));
    }, 120000); // decrement every 2 mins in demo
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-400 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">Order ID:</span>
          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
            {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Main Tracking Status Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-[#221b16] to-[#181613] border border-amber-500/40 space-y-6 shadow-2xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE • Express Delivery In Progress</span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
              Estimated Delivery in <span className="text-[#ff6814]">{order.estimatedDeliveryTime}</span>
            </h1>
            <p className="text-xs text-stone-300 mt-1">
              Delivering to <strong className="text-white">{order.deliveryAddress.fullAddress}</strong>
            </p>
          </div>

          {/* Freshness Clock Widget */}
          <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/30 text-center space-y-1 shrink-0">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Freshness Guarantee</span>
            </div>
            <p className="font-serif font-bold text-2xl text-white">{freshnessMinutesLeft} Mins</p>
            <p className="text-[10px] text-stone-400">Optimal temperature window</p>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {TRACKING_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div
                  key={step.key}
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-[#ff6814]/20 border-[#ff6814] text-white shadow-lg shadow-[#ff6814]/20 ring-1 ring-[#ff6814]'
                      : isCompleted
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 border-white/5 text-stone-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase">
                      {isCompleted ? '✓ Done' : `Step ${idx + 1}`}
                    </span>
                  </div>
                  <p className="font-bold text-xs truncate">{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Chennai Live GPS Map Visualizer */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-stone-900 h-64 shadow-2xl flex flex-col justify-between p-6">
        
        {/* Mock Map Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#3a322b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs text-stone-300 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#ff6814]" />
            <span>Chennai Route: {order.restaurantName} → {order.deliveryAddress.label}</span>
          </div>

          <span className="bg-emerald-950/90 text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500">
            Thermal Container Temp: {order.rider?.currentTemp || '38°C Insulated'}
          </span>
        </div>

        {/* Animated Rider Movement Mock */}
        <div className="relative z-10 flex items-center justify-between max-w-md mx-auto w-full px-8">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-[#ff6814] text-white flex items-center justify-center font-bold text-xs mx-auto shadow-lg">
              🍳
            </div>
            <span className="text-[10px] font-bold text-stone-300 block mt-1">{order.restaurantName}</span>
          </div>

          <div className="flex-1 h-1 bg-gradient-to-r from-[#ff6814] via-amber-400 to-emerald-400 mx-4 relative">
            <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-xs font-bold absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce shadow-lg">
              🛵
            </div>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs mx-auto shadow-lg">
              🏠
            </div>
            <span className="text-[10px] font-bold text-stone-300 block mt-1">{order.deliveryAddress.label}</span>
          </div>
        </div>

        <div className="relative z-10 text-center text-[11px] text-stone-400">
          GPS Captain: <strong className="text-white">{order.rider?.name}</strong> • {order.rider?.vehicleNumber}
        </div>
      </div>

      {/* Delivery Rider & Support Action Bar */}
      {order.rider && (
        <div className="p-5 rounded-3xl bg-[#1c1a17] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <img src={order.rider.photo} alt={order.rider.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#ff6814]" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-white">{order.rider.name}</h3>
                <span className="flex items-center gap-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  <Star className="w-3 h-3 fill-amber-400" /> {order.rider.rating}
                </span>
              </div>
              <p className="text-xs text-stone-400">{order.rider.vehicleNumber} • {order.rider.deliveriesCompleted} deliveries</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => alert(`Calling delivery captain ${order.rider?.name} at ${order.rider?.phone}`)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Phone className="w-4 h-4" />
              <span>Call Rider</span>
            </button>

            <button
              onClick={() => alert(`Opening live chat with captain ${order.rider?.name}`)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Chat</span>
            </button>
          </div>

        </div>
      )}

      {/* Order Items & Reheat Planner Trigger */}
      <div className="p-6 rounded-3xl bg-[#1c1a17] border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-serif font-bold text-lg text-white">Order Items ({order.items.length})</h3>
          <button
            onClick={() => onOpenReheatModal(order)}
            className="text-xs text-amber-400 font-bold flex items-center gap-1.5 hover:underline"
          >
            <ChefHat className="w-4 h-4 text-amber-400" />
            <span>Smart Reheating & Storage Planner</span>
          </button>
        </div>

        <div className="space-y-2">
          {order.items.map((cartItem) => (
            <div key={cartItem.cartItemId} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img src={cartItem.menuItem.image} alt={cartItem.menuItem.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <p className="font-bold text-stone-200">{cartItem.quantity}x {cartItem.menuItem.name}</p>
                  <p className="text-[10px] text-stone-400">₹{cartItem.unitPrice} each</p>
                </div>
              </div>
              <span className="font-bold text-[#ff6814]">₹{cartItem.totalPrice}</span>
            </div>
          ))}
        </div>

        {/* Quiet Delivery Preferences Badge */}
        {order.quietDelivery && (
          <div className="p-3 rounded-xl bg-stone-900 border border-white/5 text-xs text-stone-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              <strong>Quiet Delivery active:</strong> {order.quietDelivery.noDoorbell && 'No doorbell • '} {order.quietDelivery.silentText && 'Silent text only.'}
            </span>
          </div>
        )}

        {/* Support Help Button */}
        <div className="pt-2 text-center">
          <button
            onClick={() => onOpenSupportModal(order)}
            className="text-xs text-stone-400 hover:text-white underline"
          >
            Need help with this order? Contact Savorly Live Support →
          </button>
        </div>

      </div>

    </div>
  );
};
