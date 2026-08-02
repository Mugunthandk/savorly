import React, { useState, useEffect } from 'react';
import { 
  User, Restaurant, MenuItem, CartItem, Order, Coupon, 
  GroupOrderState, DineInSession, SelectedCustomisation 
} from './types';
import { 
  getStoredUser, setStoredUser, 
  getStoredCart, setStoredCart, 
  getStoredOrders, addStoredOrder, 
  getStoredFavorites, toggleStoredFavorite, 
  getStoredGroupOrder, setStoredGroupOrder, 
  getStoredDineIn, setStoredDineIn, 
  getStoredAppliedCoupon, setStoredAppliedCoupon 
} from './utils/storage';
import { RESTAURANTS, MENU_ITEMS } from './data/mockData';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantView } from './components/RestaurantView';
import { ItemCustomizationModal } from './components/ItemCustomizationModal';
import { DietaryGuardianModal } from './components/DietaryGuardianModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveOrderTracker } from './components/LiveOrderTracker';
import { CravingConcierge } from './components/CravingConcierge';
import { ScanAndOrderModal } from './components/ScanAndOrderModal';
import { GroupOrderModal } from './components/GroupOrderModal';
import { OffersView } from './components/OffersView';
import { OrdersView } from './components/OrdersView';
import { ProfileModal } from './components/ProfileModal';
import { SurpriseMeModal } from './components/SurpriseMeModal';
import { LeftoverPlannerModal } from './components/LeftoverPlannerModal';
import { CustomerSupportModal } from './components/CustomerSupportModal';
import { FoodStoryModal } from './components/FoodStoryModal';

export function App() {
  // User & Navigation State
  const [user, setUser] = useState<User>(getStoredUser);
  const [activeView, setActiveView] = useState<'explore' | 'scan' | 'group' | 'offers' | 'orders'>('explore');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Restaurant Detail View
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Cart State
  const [cartState, setCartState] = useState(() => getStoredCart());
  const [favorites, setFavorites] = useState<string[]>(getStoredFavorites);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(getStoredAppliedCoupon);
  const [driverTip, setDriverTip] = useState(30);
  const [quietDelivery, setQuietDelivery] = useState({ noDoorbell: true, leaveAtGate: false, silentText: true });
  const [celebrationMode, setCelebrationMode] = useState({ occasion: '', cardMessage: '', candles: false });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(getStoredOrders);
  const [activeOrderTracker, setActiveOrderTracker] = useState<Order | null>(null);

  // Dine-In & Group Order State
  const [groupOrder, setGroupOrder] = useState<GroupOrderState | null>(getStoredGroupOrder);
  const [dineIn, setDineIn] = useState<DineInSession | null>(getStoredDineIn);

  // Modal Visibility State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Item Customisation & Food Story Modal
  const [customisationItem, setCustomisationItem] = useState<MenuItem | null>(null);
  const [foodStoryItem, setFoodStoryItem] = useState<MenuItem | null>(null);
  const [dietaryWarningItem, setDietaryWarningItem] = useState<{ item: MenuItem; alternatives: MenuItem[] } | null>(null);
  const [reheatModalOrder, setReheatModalOrder] = useState<Order | null>(null);

  // Save Cart Changes
  const updateCart = (items: CartItem[], restId: string | null, restName: string | null) => {
    setCartState({ items, restaurantId: restId, restaurantName: restName });
    setStoredCart(items, restId, restName);
  };

  const handleSelectUser = (newUser: User) => {
    setUser(newUser);
    setStoredUser(newUser);
  };

  const handleToggleFavorite = (restId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStoredFavorite(restId);
    setFavorites(getStoredFavorites());
  };

  // Add Item Handler with Dietary Guardian Checks!
  const handleInitiateAddItem = (item: MenuItem) => {
    // Check if user has allergy matching this item
    const matchedAllergies = item.allergens.filter(a => user.allergies.includes(a));
    if (matchedAllergies.length > 0) {
      const safeAlts = MENU_ITEMS.filter(
        m => m.restaurantId === item.restaurantId && 
             m.id !== item.id && 
             !m.allergens.some(a => user.allergies.includes(a))
      );
      setDietaryWarningItem({ item, alternatives: safeAlts });
      return;
    }

    // Check if item has customisation options
    if (item.customisations && item.customisations.length > 0) {
      setCustomisationItem(item);
    } else {
      handleAddDirectToCart(item, [], 1, '');
    }
  };

  const handleAddDirectToCart = (
    item: MenuItem, 
    customisations: SelectedCustomisation[], 
    quantity: number, 
    notes: string
  ) => {
    // Multi-restaurant check
    if (cartState.restaurantId && cartState.restaurantId !== item.restaurantId && cartState.items.length > 0) {
      if (!confirm(`Your cart currently contains items from ${cartState.restaurantName}. Would you like to clear your cart and add items from ${item.restaurantName}?`)) {
        return;
      }
      updateCart([], item.restaurantId, item.restaurantName);
    }

    const unitPrice = item.price + customisations.reduce((acc, c) => acc + c.price, 0);
    const cartItemId = `${item.id}-${customisations.map(c => c.optionId).sort().join('-')}`;

    const existingIdx = cartState.items.findIndex(i => i.cartItemId === cartItemId);
    let updatedItems: CartItem[];

    if (existingIdx >= 0) {
      updatedItems = cartState.items.map((ci, idx) => {
        if (idx === existingIdx) {
          const newQty = ci.quantity + quantity;
          return { ...ci, quantity: newQty, totalPrice: newQty * unitPrice };
        }
        return ci;
      });
    } else {
      const newCartItem: CartItem = {
        cartItemId,
        menuItem: item,
        selectedCustomisations: customisations,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
        itemNotes: notes
      };
      updatedItems = [...cartState.items, newCartItem];
    }

    updateCart(updatedItems, item.restaurantId, item.restaurantName);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    const updated = cartState.items.map(i => {
      if (i.cartItemId === cartItemId) {
        const newQty = i.quantity + delta;
        if (newQty <= 0) return null;
        return { ...i, quantity: newQty, totalPrice: newQty * i.unitPrice };
      }
      return i;
    }).filter(Boolean) as CartItem[];

    if (updated.length === 0) {
      updateCart([], null, null);
    } else {
      updateCart(updated, cartState.restaurantId, cartState.restaurantName);
    }
  };

  const handleAddConciergeBundleToCart = (bundle: { menuItem: MenuItem; quantity: number }[]) => {
    if (bundle.length === 0) return;
    const firstRest = RESTAURANTS.find(r => r.id === bundle[0].menuItem.restaurantId) || RESTAURANTS[0];

    const newCartItems: CartItem[] = bundle.map(b => ({
      cartItemId: `${b.menuItem.id}-bundle`,
      menuItem: b.menuItem,
      selectedCustomisations: [],
      quantity: b.quantity,
      unitPrice: b.menuItem.price,
      totalPrice: b.menuItem.price * b.quantity
    }));

    updateCart(newCartItems, firstRest.id, firstRest.name);
    setIsCartOpen(true);
  };

  const handlePlaceOrderSuccess = (newOrder: Order) => {
    addStoredOrder(newOrder);
    setOrders(getStoredOrders());
    updateCart([], null, null);
    setIsCheckoutOpen(false);
    setActiveOrderTracker(newOrder);
  };

  // Filtered Restaurants for Explore View
  const filteredRestaurants = RESTAURANTS.filter(rest => {
    if (selectedZone !== 'all' && rest.zone !== selectedZone) {
      return false;
    }
    if (activeFilter === 'pure-veg' && !rest.isPureVeg) {
      return false;
    }
    if (activeFilter === 'bestsellers' && rest.rating < 4.7) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = rest.name.toLowerCase().includes(q);
      const matchCuisine = rest.cuisines.some(c => c.toLowerCase().includes(q));
      const matchDishes = rest.bestDishes.some(d => d.toLowerCase().includes(q));
      return matchName || matchCuisine || matchDishes;
    }
    return true;
  });

  const activeAddress = user.savedAddresses.find(a => a.id === user.activeAddressId) || user.savedAddresses[0];

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-[#f5f2eb] flex flex-col justify-between font-sans selection:bg-[#ff6814] selection:text-white">
      
      {/* Top Sticky Navigation */}
      <Navbar
        user={user}
        onSelectUser={handleSelectUser}
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          setSelectedRestaurant(null);
          setActiveOrderTracker(null);
        }}
        cartItems={cartState.items}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenSurprise={() => setIsSurpriseOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeAddress={activeAddress}
      />

      {/* Main Body Switcher */}
      <main className="flex-1">
        
        {/* Active Order Tracker Full View */}
        {activeOrderTracker ? (
          <LiveOrderTracker
            order={activeOrderTracker}
            onBack={() => setActiveOrderTracker(null)}
            onOpenReheatModal={(ord) => setReheatModalOrder(ord)}
            onOpenSupportModal={() => setIsSupportOpen(true)}
          />
        ) : selectedRestaurant ? (
          /* Restaurant Menu Detail View */
          <RestaurantView
            restaurant={selectedRestaurant}
            user={user}
            cartItems={cartState.items}
            isFavorite={favorites.includes(selectedRestaurant.id)}
            onToggleFavorite={handleToggleFavorite}
            onBack={() => setSelectedRestaurant(null)}
            onAddMenuItem={handleInitiateAddItem}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onOpenStory={(item) => setFoodStoryItem(item)}
            onOpenCart={() => setIsCartOpen(true)}
          />
        ) : activeView === 'explore' ? (
          /* Primary Explore Restaurants View */
          <div className="space-y-8">
            <HeroSection
              onSelectMood={(moodTitle) => setIsConciergeOpen(true)}
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-white">
                    {selectedZone === 'all' ? 'Top Rated Restaurants in Chennai' : `Fine Dining in ${selectedZone}`}
                  </h2>
                  <p className="text-xs text-stone-400">
                    Showing {filteredRestaurants.length} gourmet kitchens with live freshness ratings.
                  </p>
                </div>
              </div>

              {/* Grid of Restaurants */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    isFavorite={favorites.includes(restaurant.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelect={(rest) => setSelectedRestaurant(rest)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : activeView === 'scan' ? (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <ScanAndOrderModal
              user={user}
              activeDineIn={dineIn}
              onStartSession={(session) => {
                setDineIn(session);
                setStoredDineIn(session);
              }}
              onClose={() => setActiveView('explore')}
              onAddToCart={handleInitiateAddItem}
            />
          </div>
        ) : activeView === 'group' ? (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <GroupOrderModal
              user={user}
              groupOrder={groupOrder}
              onStartGroup={(restId) => {
                const newGroup: GroupOrderState = {
                  code: `SVR-${Math.floor(100 + Math.random() * 900)}`,
                  hostId: user.id,
                  hostName: user.name,
                  restaurantId: restId || RESTAURANTS[0].id,
                  restaurantName: RESTAURANTS[0].name,
                  members: [
                    { id: user.id, name: user.name, avatar: user.avatar, isHost: true, items: [] },
                    { id: 'user-meera', name: 'Meera Nair', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', isHost: false, items: [] }
                  ],
                  poll: {
                    title: 'Where should we order from tonight?',
                    options: [
                      { id: 'opt-1', restaurantId: 'rest-biryani-co', restaurantName: 'The Biryani Company', votes: [user.id] },
                      { id: 'opt-2', restaurantId: 'rest-napoli-pizza', restaurantName: 'Napoli Pizza House', votes: [] }
                    ]
                  },
                  messages: [
                    { id: 'm1', sender: 'Meera Nair', text: 'Hey guys! Ready for dinner?', time: '08:15 PM' }
                  ],
                  status: 'open',
                  splitType: 'equal'
                };
                setGroupOrder(newGroup);
                setStoredGroupOrder(newGroup);
              }}
              onUpdateGroup={(updated) => {
                setGroupOrder(updated);
                setStoredGroupOrder(updated);
              }}
              onClose={() => setActiveView('explore')}
              onAddGroupItemToCart={(item, memberName) => handleInitiateAddItem(item)}
            />
          </div>
        ) : activeView === 'offers' ? (
          <OffersView
            user={user}
            onApplyCouponCode={(code) => {
              const found = getStoredAppliedCoupon();
              setIsCartOpen(true);
            }}
          />
        ) : (
          <OrdersView
            orders={orders}
            onSelectOrder={(ord) => setActiveOrderTracker(ord)}
            onReorder={(ord) => {
              updateCart(ord.items, ord.restaurantId, ord.restaurantName);
              setIsCartOpen(true);
            }}
            onOpenReheatModal={(ord) => setReheatModalOrder(ord)}
          />
        )}

      </main>

      {/* Footer */}
      <Footer onOpenSupport={() => setIsSupportOpen(true)} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartState.items}
        restaurantName={cartState.restaurantName}
        user={user}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={() => updateCart([], null, null)}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(c) => {
          setAppliedCoupon(c);
          setStoredAppliedCoupon(c);
        }}
        driverTip={driverTip}
        setDriverTip={setDriverTip}
        quietDelivery={quietDelivery}
        setQuietDelivery={setQuietDelivery}
        celebrationMode={celebrationMode}
        setCelebrationMode={setCelebrationMode}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Modals */}
      {isCheckoutOpen && (
        <CheckoutModal
          user={user}
          cartItems={cartState.items}
          restaurantName={cartState.restaurantName || 'Savorly Kitchen'}
          grandTotal={cartState.items.reduce((acc, item) => acc + item.totalPrice, 0) + 40 + driverTip}
          itemTotal={cartState.items.reduce((acc, item) => acc + item.totalPrice, 0)}
          discount={0}
          deliveryFee={0}
          taxesAndPacking={40}
          driverTip={driverTip}
          quietDelivery={quietDelivery}
          celebrationMode={celebrationMode}
          onClose={() => setIsCheckoutOpen(false)}
          onPlaceOrder={handlePlaceOrderSuccess}
        />
      )}

      {isConciergeOpen && (
        <CravingConcierge
          user={user}
          availableDishes={MENU_ITEMS}
          onClose={() => setIsConciergeOpen(false)}
          onAddBundleToCart={handleAddConciergeBundleToCart}
        />
      )}

      {isSurpriseOpen && (
        <SurpriseMeModal
          onClose={() => setIsSurpriseOpen(false)}
          onAddToCart={handleInitiateAddItem}
        />
      )}

      {isProfileOpen && (
        <ProfileModal
          user={user}
          onSelectUser={handleSelectUser}
          onUpdateUser={handleSelectUser}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      {customisationItem && (
        <ItemCustomizationModal
          item={customisationItem}
          onClose={() => setCustomisationItem(null)}
          onConfirm={(customisations, quantity, notes) => {
            handleAddDirectToCart(customisationItem, customisations, quantity, notes);
            setCustomisationItem(null);
          }}
        />
      )}

      {dietaryWarningItem && (
        <DietaryGuardianModal
          item={dietaryWarningItem.item}
          user={user}
          safeAlternatives={dietaryWarningItem.alternatives}
          onCancel={() => setDietaryWarningItem(null)}
          onSelectAlternative={(alt) => {
            setDietaryWarningItem(null);
            handleInitiateAddItem(alt);
          }}
          onProceedAnyway={() => {
            const target = dietaryWarningItem.item;
            setDietaryWarningItem(null);
            if (target.customisations && target.customisations.length > 0) {
              setCustomisationItem(target);
            } else {
              handleAddDirectToCart(target, [], 1, '');
            }
          }}
        />
      )}

      {foodStoryItem && (
        <FoodStoryModal
          item={foodStoryItem}
          onClose={() => setFoodStoryItem(null)}
        />
      )}

      {reheatModalOrder && (
        <LeftoverPlannerModal
          order={reheatModalOrder}
          onClose={() => setReheatModalOrder(null)}
        />
      )}

      {isSupportOpen && (
        <CustomerSupportModal
          order={activeOrderTracker}
          onClose={() => setIsSupportOpen(false)}
        />
      )}

    </div>
  );
}

export default App;
