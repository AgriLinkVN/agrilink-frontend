/**
 * Products API — fetch from backend, fallback to mock data when backend unreachable.
 * All types mirror the DB schema / ProductsService response shape.
 */
import { runtimeConfig, getApiBaseUrl } from "@/config/runtime-config";
import { demoProducts } from "@/demo/fixtures";

export interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductCertification {
  id: string;
  certType: string;
  certNumber: string | null;
  issuedBy: string | null;
  issuedDate: string | null;
  expiryDate: string | null;
  storedFileId: string | null;
  isVerified: boolean;
  status?: "pending" | "verified" | "rejected";
  verifiedAt?: string | null;
  rejectionReason?: string | null;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  pricePerUnit: number;
  unit: string;
  availableQuantity: number;
  minOrderQuantity: number | null;
  farmingType: "organic" | "traditional" | "vietgap" | "globalgap" | null;
  status: string;
  viewCount: number;
  soldCount?: number;
  avgRating?: number;
  harvestDate: string | null;
  expiryDate: string | null;
  provinceId: string | null;
  districtId: string | null;
  sellerId: string;
  sellerType: "farmer" | "cooperative" | "supplier";
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  // relations
  images: ProductImage[];
  certifications?: ProductCertification[];
  category?: ProductCategory | null;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
}

// ── Mock data (fallback when BE unreachable) ───────────────────

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "mock-1", name: "Xoài cát Hòa Lộc loại 1",
    description: "Xoài cát Hòa Lộc chính gốc Tiền Giang, trái to đều, vỏ vàng óng, thịt dày ngọt thơm, ít xơ. Canh tác theo tiêu chuẩn VietGAP.",
    pricePerUnit: 45000, unit: "kg", availableQuantity: 500, minOrderQuantity: 10,
    farmingType: "vietgap", status: "active", viewCount: 1284,
    harvestDate: "2025-06-15", expiryDate: "2025-06-22",
    provinceId: null, districtId: null, sellerId: "mock-seller-1", sellerType: "farmer",
    categoryId: null, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z",
    images: [{ id: "img-1", imageUrl: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=600&q=80", isPrimary: true, sortOrder: 0 }],
    certifications: [],
  },
  {
    id: "mock-2", name: "Rau muống hữu cơ Đà Lạt",
    description: "Rau muống trồng theo hướng hữu cơ tại Đà Lạt, không thuốc trừ sâu, tươi ngon mỗi ngày.",
    pricePerUnit: 25000, unit: "kg", availableQuantity: 200, minOrderQuantity: 5,
    farmingType: "organic", status: "active", viewCount: 892,
    harvestDate: "2025-06-01", expiryDate: "2025-06-05",
    provinceId: null, districtId: null, sellerId: "mock-seller-2", sellerType: "farmer",
    categoryId: null, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z",
    images: [{ id: "img-2", imageUrl: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&q=80", isPrimary: true, sortOrder: 0 }],
    certifications: [],
  },
  {
    id: "mock-3", name: "Thanh long ruột đỏ xuất khẩu",
    description: "Thanh long ruột đỏ Bình Thuận đạt chuẩn GlobalGAP, đủ điều kiện xuất khẩu sang EU và Nhật Bản.",
    pricePerUnit: 35000, unit: "kg", availableQuantity: 1000, minOrderQuantity: 50,
    farmingType: "globalgap", status: "active", viewCount: 2105,
    harvestDate: "2025-06-20", expiryDate: "2025-06-27",
    provinceId: null, districtId: null, sellerId: "mock-seller-3", sellerType: "cooperative",
    categoryId: null, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z",
    images: [{ id: "img-3", imageUrl: "https://images.unsplash.com/photo-1507908708918-778587c9e563?w=600&q=80", isPrimary: true, sortOrder: 0 }],
    certifications: [],
  },
  {
    id: "mock-4", name: "Gạo ST25 đặc sản Sóc Trăng",
    description: "Gạo ST25 do ông Hồ Quang Cua lai tạo, từng đạt giải gạo ngon nhất thế giới. Hạt dài, cơm thơm dẻo.",
    pricePerUnit: 28000, unit: "kg", availableQuantity: 2000, minOrderQuantity: 20,
    farmingType: "vietgap", status: "active", viewCount: 5432,
    harvestDate: "2025-05-30", expiryDate: "2026-05-30",
    provinceId: null, districtId: null, sellerId: "mock-seller-4", sellerType: "farmer",
    categoryId: null, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z",
    images: [{ id: "img-4", imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80", isPrimary: true, sortOrder: 0 }],
    certifications: [],
  },
  {
    id: "mock-5", name: "Cà phê Arabica Cầu Đất",
    description: "Cà phê Arabica trồng tại vùng Cầu Đất 1500m so mực nước biển. Hữu cơ 100%, rang mộc truyền thống.",
    pricePerUnit: 120000, unit: "kg", availableQuantity: 150, minOrderQuantity: 2,
    farmingType: "organic", status: "active", viewCount: 764,
    harvestDate: "2024-12-01", expiryDate: "2025-12-01",
    provinceId: null, districtId: null, sellerId: "mock-seller-5", sellerType: "farmer",
    categoryId: null, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z",
    images: [{ id: "img-5", imageUrl: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=600&q=80", isPrimary: true, sortOrder: 0 }],
    certifications: [],
  },
  {
    id: "mock-6", name: "Bưởi da xanh Bến Tre",
    description: "Bưởi da xanh đặc sản Bến Tre, vỏ xanh bóng, múi to, tép mọng nước, vị ngọt ít đắng. Đạt VietGAP.",
    pricePerUnit: 32000, unit: "kg", availableQuantity: 800, minOrderQuantity: 10,
    farmingType: "vietgap", status: "active", viewCount: 1120,
    harvestDate: "2025-07-01", expiryDate: "2025-07-20",
    provinceId: null, districtId: null, sellerId: "mock-seller-6", sellerType: "cooperative",
    categoryId: null, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z",
    images: [{ id: "img-6", imageUrl: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=600&q=80", isPrimary: true, sortOrder: 0 }],
    certifications: [],
  },
  {
    id: "mock-7", name: "Dưa hấu không hạt Long An",
    description: "Dưa hấu không hạt trồng tại Long An, vỏ mỏng, ruột đỏ tươi, ngọt sắc. Trọng lượng 3–6kg/quả.",
    pricePerUnit: 18000, unit: "kg", availableQuantity: 3000, minOrderQuantity: 30,
    farmingType: "traditional", status: "active", viewCount: 987,
    harvestDate: "2025-06-10", expiryDate: "2025-06-20",
    provinceId: null, districtId: null, sellerId: "mock-seller-7", sellerType: "farmer",
    categoryId: null, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z",
    images: [{ id: "img-7", imageUrl: "https://images.unsplash.com/photo-1587049016823-69ef9d68bd44?w=600&q=80", isPrimary: true, sortOrder: 0 }],
    certifications: [],
  },
  {
    id: "mock-8", name: "Sầu riêng Ri6 Cai Lậy",
    description: "Sầu riêng Ri6 vùng Cai Lậy – Tiền Giang, cơm vàng hạt lép, mùi thơm nồng đặc trưng. Không dùng chất thúc chín.",
    pricePerUnit: 85000, unit: "kg", availableQuantity: 600, minOrderQuantity: 5,
    farmingType: "vietgap", status: "active", viewCount: 3250,
    harvestDate: "2025-07-15", expiryDate: "2025-07-22",
    provinceId: null, districtId: null, sellerId: "mock-seller-8", sellerType: "cooperative",
    categoryId: null, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z",
    images: [{ id: "img-8", imageUrl: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&q=80", isPrimary: true, sortOrder: 0 }],
    certifications: [],
  },
];

// ── Enum display maps ─────────────────────────────────────────

export const FARMING_TYPE_LABELS: Record<string, string> = {
  organic:     "Hữu cơ",
  vietgap:     "VietGAP",
  globalgap:   "GlobalGAP",
  traditional: "Truyền thống",
};

export const FARMING_TYPE_OPTIONS = Object.entries(FARMING_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const UNIT_LABELS: Record<string, string> = {
  kg:    "kg",
  ton:   "tấn",
  box:   "thùng",
  bunch: "bó",
  liter: "lít",
  piece: "quả/củ",
};

export const SELLER_TYPE_LABELS: Record<string, string> = {
  farmer:      "Hộ nông dân",
  cooperative: "Hợp tác xã",
  supplier:    "Nhà cung cấp",
};

export const PRODUCT_STATUS_LABELS: Record<string, string> = {
  draft:            "Nháp",
  pending_approval: "Chờ duyệt",
  active:           "Đang bán",
  out_of_stock:     "Hết hàng",
  rejected:         "Bị từ chối",
  archived:         "Lưu trữ",
  suspended:        "Tạm ngưng",
};

export const CERT_TYPE_LABELS: Record<string, string> = {
  vietgap:  "VietGAP",
  organic:  "Hữu cơ",
  globalgap:"GlobalGAP",
  ocop:     "OCOP",
  other:    "Khác",
};

export const CERT_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ duyệt",
  verified: "Đã xác thực",
  rejected: "Bị từ chối",
};

export function getVerifiedCertifications<T extends { isVerified?: boolean; status?: string }>(
  certifications: T[] | undefined,
): T[] {
  return (certifications ?? []).filter(
    (cert) => cert.isVerified || cert.status === "verified",
  );
}

// ── Province extraction ────────────────────────────────────────
// Extract tỉnh/thành từ tên sản phẩm (seed data không có provinceId)
const PROVINCE_KEYWORDS: [string, string][] = [
  ["Tiền Giang", "Tiền Giang"], ["Lâm Đồng", "Lâm Đồng"], ["Đà Lạt", "Lâm Đồng"],
  ["Bình Thuận", "Bình Thuận"], ["Sóc Trăng", "Sóc Trăng"], ["Bến Tre", "Bến Tre"],
  ["Long An", "Long An"], ["Đồng Tháp", "Đồng Tháp"], ["An Giang", "An Giang"],
  ["Cà Mau", "Cà Mau"], ["Kiên Giang", "Kiên Giang"], ["Phú Quốc", "Kiên Giang"],
  ["Vĩnh Long", "Vĩnh Long"], ["Hưng Yên", "Hưng Yên"], ["Bắc Giang", "Bắc Giang"],
  ["Lục Ngạn", "Bắc Giang"], ["Hà Giang", "Hà Giang"], ["Lào Cai", "Lào Cai"],
  ["Mường Khương", "Lào Cai"], ["Bắc Hà", "Lào Cai"], ["Sơn La", "Sơn La"],
  ["Mộc Châu", "Sơn La"], ["Thái Nguyên", "Thái Nguyên"], ["Hải Dương", "Hải Dương"],
  ["Ninh Bình", "Ninh Bình"], ["Ninh Thuận", "Ninh Thuận"], ["Bình Định", "Bình Định"],
  ["Gia Lai", "Gia Lai"], ["Đắk Lắk", "Đắk Lắk"], ["Buôn Ma Thuột", "Đắk Lắk"],
  ["Đồng Nai", "Đồng Nai"], ["Bình Phước", "Bình Phước"], ["Bình Dương", "Bình Dương"],
  ["Hà Nội", "Hà Nội"], ["Hồ Chí Minh", "TP. Hồ Chí Minh"], ["Nghệ An", "Nghệ An"],
  ["Kỳ Sơn", "Nghệ An"], ["Quảng Nam", "Quảng Nam"], ["Cần Giờ", "TP. Hồ Chí Minh"],
  ["Cần Thơ", "Cần Thơ"], ["Phan Thiết", "Bình Thuận"],
];

export function getProductProvince(product: Product): string {
  const text = `${product.name} ${product.description ?? ""}`;
  for (const [keyword, province] of PROVINCE_KEYWORDS) {
    if (text.includes(keyword)) return province;
  }
  return "Việt Nam";
}

export function getPrimaryImage(product: Product): string {
  const primary = product.images.find((img) => img.isPrimary) ?? product.images[0];
  return primary?.imageUrl ?? "/logo.png";
}

// ── API fetch functions ────────────────────────────────────────

// ── Categories API ─────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export const FALLBACK_CATEGORIES: Category[] = [
  { id: "all", name: "Tất cả", slug: "all", sortOrder: 0 },
  { id: "rau-cu-qua", name: "Rau củ quả", slug: "rau-cu-qua", sortOrder: 1 },
  { id: "trai-cay", name: "Trái cây", slug: "trai-cay", sortOrder: 2 },
  { id: "lua-gao-ngu-coc", name: "Lúa gạo & Ngũ cốc", slug: "lua-gao-ngu-coc", sortOrder: 3 },
  { id: "thuy-san", name: "Thủy sản", slug: "thuy-san", sortOrder: 4 },
  { id: "gia-suc-gia-cam", name: "Gia súc & Gia cầm", slug: "gia-suc-gia-cam", sortOrder: 5 },
  { id: "ca-phe-che", name: "Cà phê & Chè", slug: "ca-phe-che", sortOrder: 6 },
  { id: "gia-vi-thao-moc", name: "Gia vị & Thảo mộc", slug: "gia-vi-thao-moc", sortOrder: 7 },
  { id: "hat-dau", name: "Hạt & Đậu", slug: "hat-dau", sortOrder: 8 },
  { id: "mat-ong-dac-san", name: "Mật ong & Đặc sản", slug: "mat-ong-dac-san", sortOrder: 9 },
  { id: "hoa-cay-canh", name: "Hoa & Cây cảnh", slug: "hoa-cay-canh", sortOrder: 10 },
];

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  if (runtimeConfig.demoMode) return FALLBACK_CATEGORIES;
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/categories`, { cache: "no-store", signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const list: Category[] = json?.data ?? json;
    if (Array.isArray(list) && list.length > 0) {
      return [{ id: "all", name: "Tất cả", slug: "all", sortOrder: 0 }, ...list];
    }
    return FALLBACK_CATEGORIES;
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw error;
  }
}

function getDemoProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  farmingType?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  status?: string;
  sortBy?: "createdAt" | "pricePerUnit" | "name" | "soldCount" | "avgRating";
  order?: "ASC" | "DESC";
}): ProductListResponse {
  const requestedStatus = params?.status ?? "active";
  let products = demoProducts.filter(
    (product) => product.status === requestedStatus,
  );
  const normalizedSearch = params?.search?.trim().toLocaleLowerCase("vi");
  if (normalizedSearch) {
    products = products.filter((product) =>
      `${product.name} ${product.description ?? ""}`
        .toLocaleLowerCase("vi")
        .includes(normalizedSearch),
    );
  }
  if (params?.farmingType) {
    products = products.filter(
      (product) => product.farmingType === params.farmingType,
    );
  }
  if (params?.categoryId && params.categoryId !== "all") {
    products = products.filter(
      (product) => product.categoryId === params.categoryId,
    );
  }
  if (params?.minPrice != null) {
    products = products.filter(
      (product) => product.pricePerUnit >= params.minPrice!,
    );
  }
  if (params?.maxPrice != null) {
    products = products.filter(
      (product) => product.pricePerUnit <= params.maxPrice!,
    );
  }
  if (params?.sellerId) {
    products = products.filter(
      (product) => product.sellerId === params.sellerId,
    );
  }
  const sortBy = params?.sortBy ?? "createdAt";
  const direction = params?.order === "ASC" ? 1 : -1;
  products = [...products].sort((left, right) => {
    const leftValue = left[sortBy] ?? 0;
    const rightValue = right[sortBy] ?? 0;
    if (typeof leftValue === "string" && typeof rightValue === "string") {
      return leftValue.localeCompare(rightValue, "vi") * direction;
    }
    return (Number(leftValue) - Number(rightValue)) * direction;
  });
  const total = products.length;
  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.max(1, params?.limit ?? 20);
  const offset = (page - 1) * limit;
  return {
    data: products.slice(offset, offset + limit),
    total,
  };
}

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  farmingType?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
  status?: string;
  sortBy?: "createdAt" | "pricePerUnit" | "name" | "soldCount" | "avgRating";
  order?: "ASC" | "DESC";
}, signal?: AbortSignal): Promise<ProductListResponse> {
  if (runtimeConfig.demoMode) return getDemoProducts(params);
  try {
    const qs = new URLSearchParams();
    qs.set("limit", String(params?.limit ?? 20));
    qs.set("page", String(params?.page ?? 1));
    if (params?.search) qs.set("search", params.search);
    if (params?.farmingType) qs.set("farmingType", params.farmingType);
    if (params?.categoryId) qs.set("categoryId", params.categoryId);
    if (params?.minPrice != null) qs.set("minPrice", String(params.minPrice));
    if (params?.maxPrice != null) qs.set("maxPrice", String(params.maxPrice));
    if (params?.sellerId) qs.set("sellerId", params.sellerId);
    if (params?.status) qs.set("status", params.status);
    if (params?.sortBy) qs.set("sortBy", params.sortBy);
    if (params?.order) qs.set("order", params.order);

    const res = await fetch(`${getApiBaseUrl()}/products?${qs}`, { cache: "no-store", signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // ResponseInterceptor wraps: { statusCode, message, data: { data: [...], total: N } }
    const payload = json?.data ?? json;
    if (Array.isArray(payload)) {
      return { data: payload, total: payload.length };
    }
    if (Array.isArray(payload.data)) {
      return {
        data: payload.data,
        total: payload.total ?? payload.data.length,
      };
    }
    throw new Error("Phản hồi danh sách sản phẩm không hợp lệ.");
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw error;
  }
}

export async function fetchSellerProducts(
  sellerId: string,
  limit = 24,
): Promise<ProductListResponse> {
  if (runtimeConfig.demoMode) {
    return getDemoProducts({
      sellerId,
      limit,
      status: "active",
      sortBy: "createdAt",
      order: "DESC",
    });
  }
  try {
    const qs = new URLSearchParams({
      sellerId,
      limit: String(limit),
      page: "1",
      status: "active",
      sortBy: "createdAt",
      order: "DESC",
    });
    const res = await fetch(`${getApiBaseUrl()}/products?${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return (json?.data ?? json) as ProductListResponse;
  } catch (error) {
    throw error;
  }
}

// ── Product Detail (full response with seller + location populated) ─────

export interface ProductDetailLocation {
  id: string;
  name: string;
  code: string | null;
  region?: "north" | "central" | "south" | "highlands" | null;
}

export interface ProductDetailCategory {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  description: string | null;
  parent: { id: string; name: string; slug: string } | null;
}

export interface ProductDetailImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductDetailCertification {
  id: string;
  certType: "vietgap" | "organic" | "globalgap" | "ocop" | "other";
  certNumber: string | null;
  issuedBy: string | null;
  issuedDate: string | null;
  expiryDate: string | null;
  isVerified: boolean;
  status: "pending" | "verified" | "rejected";
  verifiedBy: string | null;
  verifiedAt: string | null;
  rejectionReason: string | null;
}

export interface ProductDetailSeller {
  id: string;
  fullName: string | null;
  phone: string;
  avatarUrl: string | null;
  sellerType: "farmer" | "cooperative" | "supplier";
  bio?: string | null;
  farmName?: string | null;
  experienceYears?: number | null;
  cooperativeName?: string;
  memberCount?: number;
  companyName?: string;
  supplierType?: "fertilizer" | "pesticide" | "equipment" | "mixed" | null;
  province?: ProductDetailLocation | null;
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  variety: string | null;
  pricePerUnit: number;
  unit: string;
  availableQuantity: number;
  minOrderQuantity: number | null;
  farmingType: "organic" | "traditional" | "vietgap" | "globalgap" | null;
  status: string;
  harvestDate: string | null;
  expiryDate: string | null;
  rejectionReason: string | null;
  isFeatured: boolean;
  viewCount: number;
  soldCount: number;
  avgRating: number;
  farmLatitude: number | null;
  farmLongitude: number | null;
  createdAt: string;
  updatedAt: string;
  province: ProductDetailLocation | null;
  district: ProductDetailLocation | null;
  category: ProductDetailCategory | null;
  images: ProductDetailImage[];
  certifications: ProductDetailCertification[];
  seller: ProductDetailSeller | null;
}

/** Adapt legacy Product (mock) → ProductDetail for fallback only. */
function adaptLegacyToDetail(p: Product): ProductDetail {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    sku: null,
    variety: null,
    pricePerUnit: p.pricePerUnit,
    unit: p.unit,
    availableQuantity: p.availableQuantity,
    minOrderQuantity: p.minOrderQuantity,
    farmingType: p.farmingType,
    status: p.status,
    harvestDate: p.harvestDate,
    expiryDate: p.expiryDate,
    rejectionReason: null,
    isFeatured: false,
    viewCount: p.viewCount,
    soldCount: 0,
    avgRating: 0,
    farmLatitude: null,
    farmLongitude: null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    province: null,
    district: null,
    category: p.category
      ? { id: p.category.id, name: p.category.name, slug: p.category.slug, iconUrl: null, description: null, parent: null }
      : null,
    images: p.images.map((img) => ({
      id: img.id, imageUrl: img.imageUrl, altText: null,
      sortOrder: img.sortOrder, isPrimary: img.isPrimary,
    })),
    certifications: (p.certifications ?? []).map((c) => ({
      id: c.id, certType: c.certType as ProductDetailCertification["certType"],
      certNumber: c.certNumber, issuedBy: c.issuedBy,
      issuedDate: c.issuedDate, expiryDate: c.expiryDate,
      isVerified: true,
      status: "verified",
      verifiedBy: null,
      verifiedAt: null,
      rejectionReason: null,
    })),
    seller: p.id.startsWith("demo-")
      ? {
          id: p.sellerId,
          fullName: "Nông dân Demo",
          phone: "0900000002",
          avatarUrl: null,
          sellerType: p.sellerType,
          bio: "Hồ sơ người bán mô phỏng của AgriLink.",
          farmName: "Nông trại Demo AgriLink",
          experienceYears: 8,
          province: {
            id: "demo-province",
            name: getProductProvince(p),
            code: null,
          },
        }
      : null,
  };
}

export async function fetchProductDetail(id: string): Promise<ProductDetail | null> {
  if (runtimeConfig.demoMode) {
    const product = demoProducts.find((item) => item.id === id);
    return product ? adaptLegacyToDetail(product) : null;
  }
  // Mock IDs fallback (legacy compatibility)
  if (/^\d+$/.test(id)) {
    const m = MOCK_PRODUCTS[parseInt(id, 10) - 1] ?? MOCK_PRODUCTS[0];
    return m ? adaptLegacyToDetail(m) : null;
  }
  if (id.startsWith("mock-")) {
    const m = MOCK_PRODUCTS.find((p) => p.id === id);
    return m ? adaptLegacyToDetail(m) : null;
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/products/${id}`, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`HTTP ${res.status}`);
    }
    const json = await res.json();
    return (json?.data ?? json) as ProductDetail;
  } catch {
    return null;
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  if (runtimeConfig.demoMode) {
    return demoProducts.find((product) => product.id === id) ?? null;
  }
  if (/^\d+$/.test(id)) {
    return MOCK_PRODUCTS[parseInt(id, 10) - 1] ?? MOCK_PRODUCTS[0];
  }
  if (id.startsWith("mock-")) {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // ResponseInterceptor wraps: { statusCode, message, data: <Product> }
    return (json?.data ?? json) as Product;
  } catch {
    return null;
  }
}
