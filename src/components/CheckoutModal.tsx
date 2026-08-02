import React, { useState } from 'react';
import { MapPin, ShieldCheck, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { User, CartItem, DeliveryAddress, Order } from '../types';
import { ElegantPayment } from './ElegantPayment';

interface CheckoutModalProps {
  user: User;
  cartItems: CartItem[];
  restaurantName: string;
  grandTotal: number;
  itemTotal: number;
  discount: number;
  deliveryFee: number;
  taxesAndPacking: number;
  driverTip: number;
  quietDelivery: { noDoorbell: boolean; leaveAtGate: boolean; silentText: boolean };
  celebrationMode: { occasion: string; cardMessage: string; candles: boolean };
  onClose: () => void;
  onPlaceOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  user,
  cartItems,
  restaurantName,
  grandTotal,
  itemTotal,
  discount,
  deliveryFee,
  taxesAndPacking,
  driverTip,
  quietDelivery,
  celebrationMode,
  onClose,
  onPlaceOrder
}) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user.activeAddressId || user.savedAddresses[0]?.id || 'addr-home'
  );

  const selectedAddress = user.savedAddresses.find(a => a.id === selectedAddressId) || user.savedAddresses[0];

  const handlePaymentSuccess = (paymentDetails: { method: string; goldPointsEarned: number }) => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `SVR-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      restaurantId: cartItems[0]?.menuItem.restaurantId || 'rest-biryani-co',
      restaurantName: restaurantName || 'Savorly Gourmet',
      restaurantImage: cartItems[0]?.menuItem.image || '',
      restaurantPhone: '+91 44 2621 9900',
      items: cartItems,
      itemTotal,
      deliveryFee,
      taxesAndPacking,
      discount,
      tip: driverTip,
      grandTotal,
      status: 'placed',
      estimatedDeliveryTime: '22 mins',
      deliveryAddress: selectedAddress,
      freshnessScore: 98,
      rider: {
        name: 'Ramesh Sundaram',
        phone: '+91 98840 12345',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
        rating: 4.9,
        vehicleNumber: 'TN 02 BK 4821 (EV Scooter)',
        currentTemp: '38°C Insulated Thermal Deg Container',
        deliveriesCompleted: 1420
      },
      quietDelivery,
      celebrationMode: celebrationMode.occasion ? celebrationMode : undefined,
      type: 'delivery',
      reheatInstructions: cartItems.map(c => ({
        dishName: c.menuItem.name,
        method: 'Thermal Reheat',
        tempTime: 'Sprinkle 1 tsp water, microwave for 90 seconds at medium power.'
      }))
    };

    // Trigger order placement after payment & gold points awarded
    setTimeout(() => {
      onPlaceOrder(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181613] border border-amber-500/30 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="p-6 bg-[#211e19] border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              Step 2 of 2 • Savorly Gold Checkout
            </span>
            <h2 className="font-serif font-bold text-xl text-white mt-0.5">
              Delivery Address & Elegant Payment
            </h2>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          
          {/* Select Delivery Address */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#ff6814]" />
              <span>Select Delivery Address (Chennai):</span>
            </label>

            <div className="space-y-2">
              {user.savedAddresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-colors ${
                    selectedAddressId === addr.id
                      ? 'bg-[#ff6814]/20 border-[#ff6814] text-white'
                      : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    selectedAddressId === addr.id ? 'border-[#ff6814] bg-[#ff6814]' : 'border-stone-500'
                  }`}>
                    {selectedAddressId === addr.id && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-stone-100">{addr.label}</span>
                    <p className="text-xs text-stone-300 leading-snug mt-0.5">{addr.fullAddress}, {addr.landmark}</p>
                    <span className="text-[10px] text-stone-400">{addr.city} • {addr.pinCode}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Elegant Payment Component Frame */}
          <div className="pt-2 border-t border-white/10">
            <ElegantPayment
              user={user}
              grandTotal={grandTotal}
              restaurantName={restaurantName}
              cartItems={cartItems}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>

          {/* Guarantee Footer */}
          <div className="p-3.5 rounded-2xl bg-stone-900 border border-white/10 text-xs text-stone-300 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white">Thermal Protection & Freshness Guarantee</strong>
              <p className="text-[10px] text-stone-400">If your food is cold or damaged, Savorly refund pledge applies automatically.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

