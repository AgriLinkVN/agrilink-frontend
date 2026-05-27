export type UserRole =
  | "farmer"
  | "cooperative"
  | "buyer"
  | "enterprise"
  | "supplier"
  | "state_agency"
  | "logistics"
  | "admin";

export type FarmingType = "organic" | "vietgap" | "globalgap" | "traditional";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipping"
  | "delivered"
  | "completed"
  | "disputed"
  | "cancelled";

export type ProductStatus =
  | "draft"
  | "pending_review"
  | "active"
  | "out_of_stock"
  | "rejected"
  | "archived";

export interface User {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar_url?: string;
  status: "active" | "pending" | "locked";
}

export interface Product {
  id: string;
  name: string;
  category: string;
  farming_type: FarmingType;
  price: number;
  unit: string;
  stock_quantity: number;
  province: string;
  harvest_date?: string;
  images: string[];
  avg_rating: number;
  sold_count: number;
  seller_name: string;
  seller_trust_score: number;
  status: ProductStatus;
  is_featured?: boolean;
  certifications?: string[];
}

export interface Order {
  id: string;
  product_name: string;
  quantity: number;
  unit: string;
  total_price: number;
  status: OrderStatus;
  buyer_name: string;
  seller_name: string;
  created_at: string;
  updated_at: string;
}

export interface Province {
  id: number;
  name: string;
  code: string;
  region: "north" | "central" | "south" | "highland";
  is_key_agri: boolean;
}

export interface MarketPrice {
  category: string;
  province: string;
  date: string;
  min_price: number;
  max_price: number;
  avg_price: number;
  unit: string;
}
