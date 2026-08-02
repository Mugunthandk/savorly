import React from 'react';
import { Clock, ShieldCheck, RefreshCw, ChefHat, MapPin, ArrowRight, Star } from 'lucide-react';
import { Order, MenuItem } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onReorder: (order: Order) => void;
  onOpenReheatModal: (order: Order) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onSelectOrder,
  onReorder,
  onOpenReheatModal
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white">Your Orders History</h1>
          <p className="text-xs text-stone-400">Track active deliveries or reorder favorite past meals in 1 click.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 p-8 bg-[#1c1a17] rounded-3xl border border-white/10 space-y-3">
          <Clock className="w-12 h-12 text-stone-500 mx-auto" />
          <h2 className="font-serif font-bold text-lg text-white">No orders placed yet</h2>
          <p className="text-xs text-stone-400">Your past and active deliveries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isActive = order.status !== 'delivered' && order.status !== 'cancelled';
            return (
              <div
                key={order.id}
                className="p-5 rounded-3xl bg-[#1c1a17] border border-white/10 hover:border-white/20 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.restaurantImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=150'}
                      alt={order.restaurantName}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                    <div>
                      <h3 className="font-serif font-bold text-base text-white">{order.restaurantName}</h3>
                      <p className="text-xs text-stone-400">
                        {order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isActive
                        ? 'bg-amber-950 border-amber-500 text-amber-300 animate-pulse'
                        : 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    }`}>
                      {isActive ? '🚚 Express Delivery' : '✓ Delivered'}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-1">
                  {order.items.map((i) => (
                    <p key={i.cartItemId} className="text-xs text-stone-300">
                      <strong>{i.quantity}x</strong> {i.menuItem.name}
                    </p>
                  ))}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-serif font-bold text-base text-[#ff6814]">
                    Total: ₹{order.grandTotal}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {isActive ? (
                      <button
                        onClick={() => onSelectOrder(order)}
                        className="px-4 py-2 rounded-xl bg-[#ff6814] hover:bg-[#ee5703] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#ff6814]/20"
                      >
                        <span>Live GPS Tracker</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onOpenReheatModal(order)}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                          <span>Reheat Tips</span>
                        </button>

                        <button
                          onClick={() => onReorder(order)}
                          className="px-4 py-2 rounded-xl bg-[#ff6814] hover:bg-[#ee5703] text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reorder Meal</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
