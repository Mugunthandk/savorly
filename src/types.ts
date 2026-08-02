export type Allergen = 'peanuts' | 'dairy' | 'gluten' | 'tree-nuts' | 'shellfish' | 'soy' | 'egg' | 'sesame' | 'fish';

export type DietaryRestriction = 'pure-veg' | 'peanut-allergy' | 'high-protein' | 'gluten-free' | 'dairy-free' | 'keto' | 'vegan';

export interface CustomisationOption {
  id: string;
  name: string;
  price: number;
}

export interface CustomisationGroup {
  id: string;
  title: string;
  required: boolean;
  maxSelect?: number;
  options: CustomisationOption[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  calories: number;
  protein: number; // grams
  allergens: Allergen[];
  spiceLevel: 0 | 1 | 2 | 3; // 0=mild, 1=low, 2=medium, 3=spicy
  bestseller?: boolean;
  chefSpecial?: boolean;
  image: string;
  foodStory?: string;
  customisations?: CustomisationGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  deliveryTimeMinutes: number;
  distanceKm: number;
  priceForTwo: number;
  cuisines: string[];
  isPureVeg?: boolean;
  image: string;
  headerImage: string;
  freshnessScore: number; // 0-100
  freshnessGuaranteeMinutes: number;
  bestDishes: string[];
  address: string;
  zone: 'Anna Nagar' | 'T. Nagar' | 'Velachery' | 'Adyar' | 'OMR' | 'Nungambakkam' | 'Besant Nagar' | 'Boat Club' | 'Alwarpet';
  features: string[]; // e.g., 'Gourmet', 'Late Night', 'Live Kitchen', 'Pocket Friendly'
  operatingHours: string;
}

export interface SelectedCustomisation {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // Unique ID for cart entry (item + customisations combo)
  menuItem: MenuItem;
  selectedCustomisations: SelectedCustomisation[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemNotes?: string;
  addedByMemberName?: string; // For Group Orders
}

export interface DeliveryAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  fullAddress: string;
  landmark: string;
  city: string;
  pinCode: string;
  receiverName: string;
  receiverPhone: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  savedAddresses: DeliveryAddress[];
  activeAddressId: string;
  dietaryRestrictions: DietaryRestriction[];
  allergies: Allergen[];
  savorPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface DeliveryRider {
  name: string;
  phone: string;
  photo: string;
  rating: number;
  vehicleNumber: string;
  currentTemp: string; // e.g., "37°C Insulated Thermal Bag"
  deliveriesCompleted: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantPhone: string;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  taxesAndPacking: number;
  discount: number;
  tip: number;
  grandTotal: number;
  status: OrderStatus;
  estimatedDeliveryTime: string;
  deliveryAddress: DeliveryAddress;
  rider?: DeliveryRider;
  freshnessScore: number;
  quietDelivery?: {
    noDoorbell: boolean;
    leaveAtGate: boolean;
    silentText: boolean;
  };
  celebrationMode?: {
    occasion: string;
    cardMessage: string;
    candles: boolean;
  };
  type: 'delivery' | 'dinein' | 'group';
  tableNumber?: string;
  groupCode?: string;
  rating?: number;
  review?: string;
  reheatInstructions?: { dishName: string; method: string; tempTime: string }[];
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  items: CartItem[];
  paidAmount?: number;
}

export interface GroupPollOption {
  id: string;
  restaurantId: string;
  restaurantName: string;
  votes: string[]; // member IDs
}

export interface GroupOrderState {
  code: string;
  hostId: string;
  hostName: string;
  restaurantId?: string;
  restaurantName?: string;
  members: GroupMember[];
  poll?: {
    title: string;
    options: GroupPollOption[];
  };
  messages: {
    id: string;
    sender: string;
    text: string;
    time: string;
  }[];
  status: 'open' | 'finalizing' | 'ordered';
  targetDeadline?: string;
  splitType: 'equal' | 'by-item';
}

export interface DineInSession {
  restaurantId: string;
  restaurantName: string;
  tableNumber: string;
  sessionCode: string;
  items: CartItem[];
  waiterCalled: boolean;
  waterRequested: boolean;
  billRequested: boolean;
  status: 'active' | 'paid';
  allergenWarningAcknowledged?: boolean;
}

export interface CravingMood {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  bgGradient: string;
  suggestedCuisines: string[];
}

export interface Coupon {
  code: string;
  description: string;
  discountPercentage?: number;
  flatDiscount?: number;
  minOrderValue: number;
  maxDiscount?: number;
  badge?: string;
}
