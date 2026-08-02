import { CartItem, User, Order, GroupOrderState, DineInSession, Coupon } from '../types';
import { DEMO_USERS, INITIAL_ORDERS, DEMO_COUPONS } from '../data/mockData';

const KEYS = {
  USER: 'savorly_active_user',
  CART: 'savorly_cart_items',
  CART_REST_ID: 'savorly_cart_restaurant_id',
  CART_REST_NAME: 'savorly_cart_restaurant_name',
  ORDERS: 'savorly_orders_history',
  FAVORITES: 'savorly_favorite_rest_ids',
  GROUP_ORDER: 'savorly_group_order_state',
  DINE_IN: 'savorly_dine_in_session',
  APPLIED_COUPON: 'savorly_applied_coupon'
};

export const getStoredUser = (): User => {
  try {
    const raw = localStorage.getItem(KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEMO_USERS[0]; // Default Arun
};

export const setStoredUser = (user: User) => {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
  window.dispatchEvent(new Event('savorly_user_changed'));
};

export const getStoredCart = (): { items: CartItem[]; restaurantId: string | null; restaurantName: string | null } => {
  try {
    const items = JSON.parse(localStorage.getItem(KEYS.CART) || '[]');
    const restaurantId = localStorage.getItem(KEYS.CART_REST_ID);
    const restaurantName = localStorage.getItem(KEYS.CART_REST_NAME);
    return { items, restaurantId, restaurantName };
  } catch (e) {
    return { items: [], restaurantId: null, restaurantName: null };
  }
};

export const setStoredCart = (items: CartItem[], restaurantId: string | null, restaurantName: string | null) => {
  localStorage.setItem(KEYS.CART, JSON.stringify(items));
  if (restaurantId) localStorage.setItem(KEYS.CART_REST_ID, restaurantId);
  else localStorage.removeItem(KEYS.CART_REST_ID);

  if (restaurantName) localStorage.setItem(KEYS.CART_REST_NAME, restaurantName);
  else localStorage.removeItem(KEYS.CART_REST_NAME);

  window.dispatchEvent(new Event('savorly_cart_changed'));
};

export const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(KEYS.ORDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_ORDERS;
};

export const addStoredOrder = (newOrder: Order) => {
  const current = getStoredOrders();
  const updated = [newOrder, ...current];
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(updated));
  window.dispatchEvent(new Event('savorly_orders_changed'));
};

export const getStoredFavorites = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.FAVORITES) || '["rest-biryani-co", "rest-madras-tiffin"]');
  } catch (e) {
    return ['rest-biryani-co', 'rest-madras-tiffin'];
  }
};

export const toggleStoredFavorite = (restaurantId: string): boolean => {
  const favs = getStoredFavorites();
  let updated: string[];
  let isFav = false;
  if (favs.includes(restaurantId)) {
    updated = favs.filter(id => id !== restaurantId);
  } else {
    updated = [...favs, restaurantId];
    isFav = true;
  }
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
  window.dispatchEvent(new Event('savorly_favorites_changed'));
  return isFav;
};

export const getStoredGroupOrder = (): GroupOrderState | null => {
  try {
    const raw = localStorage.getItem(KEYS.GROUP_ORDER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const setStoredGroupOrder = (state: GroupOrderState | null) => {
  if (state) localStorage.setItem(KEYS.GROUP_ORDER, JSON.stringify(state));
  else localStorage.removeItem(KEYS.GROUP_ORDER);
  window.dispatchEvent(new Event('savorly_group_order_changed'));
};

export const getStoredDineIn = (): DineInSession | null => {
  try {
    const raw = localStorage.getItem(KEYS.DINE_IN);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const setStoredDineIn = (session: DineInSession | null) => {
  if (session) localStorage.setItem(KEYS.DINE_IN, JSON.stringify(session));
  else localStorage.removeItem(KEYS.DINE_IN);
  window.dispatchEvent(new Event('savorly_dinein_changed'));
};

export const getStoredAppliedCoupon = (): Coupon | null => {
  try {
    const raw = localStorage.getItem(KEYS.APPLIED_COUPON);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const setStoredAppliedCoupon = (coupon: Coupon | null) => {
  if (coupon) localStorage.setItem(KEYS.APPLIED_COUPON, JSON.stringify(coupon));
  else localStorage.removeItem(KEYS.APPLIED_COUPON);
  window.dispatchEvent(new Event('savorly_cart_changed'));
};
