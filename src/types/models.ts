
export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  landmark?: string;
  is_default: boolean;
  address_type: 'home' | 'work' | 'other';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: 'mala' | 'loose_flowers' | 'other';
  in_stock: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  created_at: string;
  status: 'active' | 'paused' | 'cancelled';
  delivery_slot: 'morning' | 'evening';
  frequency: 'daily' | 'weekly';
  selected_days?: string[];
  duration: '1_week' | '1_month';
  start_date: string;
  end_date: string;
  next_delivery_date: string;
  address_id: string;
  payment_method_id: string;
  total_cost: number;
}

export interface SubscriptionItem {
  id: string;
  subscription_id: string;
  product_id: string;
  quantity: number;
  price_per_unit: number;
}

export interface Order {
  id: string;
  user_id: string;
  created_at: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  subtotal: number;
  delivery_fee: number;
  total: number;
  address_id: string;
  payment_method_id: string;
  delivery_time: 'morning' | 'evening';
  subscription_id?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_per_unit: number;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  details: Record<string, unknown>;
  is_default: boolean;
}
