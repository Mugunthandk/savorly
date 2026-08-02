import React, { useState } from 'react';
import { 
  Star, Clock, MapPin, ArrowLeft, Search, ShieldCheck, Heart, 
  Sparkles, Share2, Flame, ThumbsUp, Check 
} from 'lucide-react';
import { Restaurant, MenuItem, User, CartItem } from '../types';
import { MENU_ITEMS } from '../data/mockData';
import { MenuItemCard } from './MenuItemCard';

interface RestaurantViewProps {
  restaurant: Restaurant;
  user: User;
  cartItems: CartItem[];
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onBack: () => void;
  onAddMenuItem: (item: MenuItem) => void;
  onUpdateCartQuantity: (cartItemId: string, delta: number) => void;
  onOpenStory: (item: MenuItem) => void;
  onOpenCart: () => void;
}

export const RestaurantView: React.FC<RestaurantViewProps> = ({
  restaurant,
  user,
  cartItems,
  isFavorite,
  onToggleFavorite,
  onBack,
  onAddMenuItem,
  onUpdateCartQuantity,
  onOpenStory,
  onOpenCart
}) => {
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeQuickFilter, setActiveQuickFilter] = useState<'all' | 'bestseller' | 'chef' | 'veg' | 'protein'>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  // Dishes for this restaurant
  const restaurantDishes = MENU_ITEMS.filter(m => m.restaurantId === restaurant.id);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(restaurantDishes.map(d => d.category)))];

  // Bestsellers for highlight section
  const bestsellers = restaurantDishes.filter(d => d.bestseller || d.chefSpecial).slice(0, 3);

  // Filtered dishes based on category, search & quick filter
  const filteredDishes = restaurantDishes.filter(dish => {
    if (menuSearch && !dish.name.toLowerCase().includes(menuSearch.toLowerCase()) && !dish.description.toLowerCase().includes(menuSearch.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'All' && dish.category !== selectedCategory) {
      return false;
    }
    if (activeQuickFilter === 'veg' && !dish.isVeg) {
      return false;
    }
    if (activeQuickFilter === 'bestseller' && !dish.bestseller) {
      return false;
    }
    if (activeQuickFilter === 'chef' && !dish.chefSpecial) {
      return false;
    }
    if (activeQuickFilter === 'protein' && dish.protein < 20) {
      return false;
    }
    return true;
  });

  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-300 hover:text-white text-xs font-bold px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Restaurants</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-stone-300 hover:text-white text-xs font-semibold transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={(e) => onToggleFavorite(restaurant.id, e)}
            className={`p-2.5 rounded-full border transition-all ${
              isFavorite ? 'bg-rose-500/20 border-rose-500 text-rose-500' : 'bg-white/5 border-white/10 text-stone-300 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Restaurant Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-stone-900 min-h-[260px] sm:min-h-[300px]">
        <img
          src={restaurant.headerImage || restaurant.image}
          alt={restaurant.name}
          className="w-full h-full absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a] via-[#0d0c0a]/70 to-transparent" />

        <div className="relative p-6 sm:p-8 flex flex-col justify-end min-h-[260px] sm:min-h-[300px] space-y-3 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {restaurant.freshnessScore}% Freshness Guarantee
            </span>
            {restaurant.isPureVeg && (
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md">
                🌱 100% Pure Veg
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white/10 text-stone-200 text-xs font-medium backdrop-blur-md border border-white/10">
              🕒 {restaurant.operatingHours}
            </span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-white tracking-tight">
            {restaurant.name}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl font-light leading-relaxed">
            {restaurant.tagline} • {restaurant.address}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-200 pt-1">
            <span className="flex items-center gap-1 font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{restaurant.rating}</span>
              <span className="text-stone-400 font-normal">({restaurant.reviewCount} reviews)</span>
            </span>

            <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
              <Clock className="w-3.5 h-3.5 text-[#ff6814]" />
              {restaurant.deliveryTimeMinutes} mins avg
            </span>

            <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              {restaurant.distanceKm} km • {restaurant.zone}
            </span>

            <span className="bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
              ₹{restaurant.priceForTwo} for two
            </span>
          </div>

          {/* Restaurant Features Badges */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            {restaurant.features.map(feature => (
              <span key={feature} className="text-[11px] bg-white/10 backdrop-blur-md border border-white/15 px-2.5 py-0.5 rounded-full text-stone-200">
                ✦ {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Bestsellers Preview (If available) */}
      {bestsellers.length > 0 && selectedCategory === 'All' && !menuSearch && activeQuickFilter === 'all' && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Chef's Recommended Highlights</span>
            </h2>
            <span className="text-xs text-stone-400">Handcrafted delicacies</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bestsellers.map(dish => {
              const cartItem = cartItems.find(c => c.menuItem.id === dish.id);
              const qty = cartItem ? cartItem.quantity : 0;

              return (
                <div key={dish.id} className="bg-[#181614] rounded-2xl border border-amber-500/20 p-3.5 flex gap-3 items-center hover:border-amber-500/40 transition-colors">
                  <img src={dish.image} alt={dish.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800">
                        Top Choice
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-xs text-white line-clamp-1">{dish.name}</h3>
                    <p className="text-[#ff6814] font-bold text-xs">₹{dish.price}</p>
                    <button
                      onClick={() => onAddMenuItem(dish)}
                      className="text-[10px] font-bold bg-[#ff6814] hover:bg-[#ee5703] text-white px-2.5 py-1 rounded-lg transition-colors"
                    >
                      {qty > 0 ? `In Cart (${qty})` : '+ Add Item'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sticky Menu Navigation & Filters */}
      <div className="sticky top-20 z-30 bg-[#12110e]/95 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-3 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Menu Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes or ingredients..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="w-full bg-stone-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#ff6814]"
            />
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
            <button
              onClick={() => setActiveQuickFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                activeQuickFilter === 'all'
                  ? 'bg-stone-200 text-stone-900 border-white'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:text-white'
              }`}
            >
              All Items
            </button>

            <button
              onClick={() => setActiveQuickFilter('veg')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeQuickFilter === 'veg'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Pure Veg</span>
            </button>

            <button
              onClick={() => setActiveQuickFilter('bestseller')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-1 ${
                activeQuickFilter === 'bestseller'
                  ? 'bg-amber-950 border-amber-500 text-amber-300'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Bestsellers</span>
            </button>

            <button
              onClick={() => setActiveQuickFilter('chef')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-1 ${
                activeQuickFilter === 'chef'
                  ? 'bg-orange-950 border-orange-500 text-orange-300'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:text-white'
              }`}
            >
              <ThumbsUp className="w-3 h-3 text-orange-400" />
              <span>Chef Specials</span>
            </button>

            <button
              onClick={() => setActiveQuickFilter('protein')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-1 ${
                activeQuickFilter === 'protein'
                  ? 'bg-sky-950 border-sky-500 text-sky-300'
                  : 'bg-white/5 border-white/10 text-stone-300 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-sky-400" />
              <span>High Protein</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#ff6814] text-white shadow-md shadow-[#ff6814]/20'
                  : 'bg-white/5 hover:bg-white/10 text-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl text-white">
            {selectedCategory === 'All' ? 'Full Gourmet Menu' : selectedCategory} ({filteredDishes.length})
          </h2>
          <span className="text-xs text-stone-400">
            Showing {filteredDishes.length} dishes
          </span>
        </div>

        {filteredDishes.length === 0 ? (
          <div className="p-12 text-center bg-[#1c1a17] rounded-3xl border border-white/10 text-stone-400 text-xs space-y-2">
            <p className="text-sm font-semibold text-stone-300">No dishes match your filters</p>
            <p>Try resetting search or filters to explore the full menu.</p>
            <button
              onClick={() => {
                setMenuSearch('');
                setSelectedCategory('All');
                setActiveQuickFilter('all');
              }}
              className="mt-2 px-4 py-2 bg-[#ff6814] text-white font-bold text-xs rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredDishes.map((item) => {
              // Find matching cart item quantity
              const cartItem = cartItems.find(c => c.menuItem.id === item.id);
              const qty = cartItem ? cartItem.quantity : 0;

              return (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  user={user}
                  quantityInCart={qty}
                  onAdd={onAddMenuItem}
                  onUpdateQuantity={(menuItem, delta) => {
                    if (cartItem) {
                      onUpdateCartQuantity(cartItem.cartItemId, delta);
                    } else if (delta > 0) {
                      onAddMenuItem(menuItem);
                    }
                  }}
                  onOpenStory={onOpenStory}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Sticky Cart Bar */}
      {cartTotalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-md w-full px-4">
          <button
            onClick={onOpenCart}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#ff6814] hover:bg-[#ee5703] text-white font-bold text-xs flex items-center justify-between shadow-2xl shadow-[#ff6814]/40 transition-all hover:scale-102"
            id="sticky-cart-checkout-bar"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {cartTotalItems}
              </span>
              <span>{cartTotalItems === 1 ? '1 Item Added' : `${cartTotalItems} Items Added`}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm">₹{cartTotalPrice}</span>
              <span>View Cart →</span>
            </div>
          </button>
        </div>
      )}

    </div>
  );
};

