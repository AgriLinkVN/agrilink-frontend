export type ApiFarmingType = "organic" | "vietgap" | "globalgap" | "traditional";

export type ApiProductStatus =
  | "draft"
  | "pending_approval"
  | "active"
  | "out_of_stock"
  | "rejected"
  | "archived"
  | "suspended";

export type SellerType = "farmer" | "cooperative" | "supplier";

export type SortBy = "createdAt" | "pricePerUnit" | "name";
export type SortOrder = "ASC" | "DESC";

export interface ApiProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder?: number;
}

export interface ApiProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  children?: ApiProductCategory[];
}

export interface ApiProduct {
  id: string;
  name: string;
  description?: string;
  pricePerUnit: number;
  unit: string;
  provinceId: string;
  farmingType: ApiFarmingType;
  status: ApiProductStatus;
  sellerId: string;
  sellerType: SellerType;
  categoryId: string;
  category?: ApiProductCategory;
  images?: ApiProductImage[];
  createdAt: string;
}

export interface ApiProvince {
  id: string;
  name: string;
  code?: string;
  region?: string;
}

export interface ProductListResponse {
  data: ApiProduct[];
  total: number;
}

export interface SearchFilter {
  search?: string;
  categoryId?: string;
  provinceId?: string;
  minPrice?: number;
  maxPrice?: number;
  farmingType?: ApiFarmingType;
  sortBy?: SortBy;
  order?: SortOrder;
  page?: number;
  limit?: number;
}
