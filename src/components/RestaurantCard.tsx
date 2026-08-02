import React from 'react';
import { Star, Clock, MapPin, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelect: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  isFavorite,
  onToggleFavorite,
  onSelect
}) => {
  return (
    <div 
      onClick={() => onSelect(restaurant)}
      className="group bg-[#1a1815] rounded-2xl border border-white/10 hover:border-[#ff6814]/50 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#ff6814]/10 flex flex-col justify-between"
      id={`restaurant-card-${restaurant.id}`}
    >
      {/* Image Banner Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1815] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1 backdrop-blur-md">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            {restaurant.freshnessScore}% Freshness
          </span>
          {restaurant.isPureVeg && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
              🌱 Pure Veg
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => onToggleFavorite(restaurant.id, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all z-10 ${
            isFavorite
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-500'
              : 'bg-black/40 border-white/20 text-white hover:bg-black/70'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Bottom Image Overlay Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-200">
          <span className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-[#ff6814]" />
            {restaurant.deliveryTimeMinutes} mins
          </span>
          <span className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            {restaurant.distanceKm} km • {restaurant.zone}
          </span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-serif font-bold text-lg text-white group-hover:text-[#ff6814] transition-colors leading-snug">
              {restaurant.name}
            </h2>
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-300 text-xs font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{restaurant.rating}</span>
              <span className="text-stone-400 font-normal">({restaurant.reviewCount})</span>
            </div>
          </div>

          <p className="text-xs text-stone-400 line-clamp-1 mt-1 font-light">
            {restaurant.tagline}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {restaurant.cuisines.map((c) => (
              <span key={c} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-stone-300">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Bestseller Dishes Preview */}
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-medium truncate">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">Top: {restaurant.bestDishes.join(', ')}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
            <span>₹{restaurant.priceForTwo} for two</span>
            <span className="text-[#ff6814] group-hover:underline font-medium">View Menu →</span>
          </div>
        </div>

      </div>
    </div>
  );
};
