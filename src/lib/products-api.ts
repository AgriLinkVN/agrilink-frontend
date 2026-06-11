/**
 * Products API — fetch from backend, fallback to mock data when backend unreachable.
 * All types mirror the DB schema / ProductsService response shape.
 */

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
  documentUrl: string | null;
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
  return primary?.imageUrl ?? "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=600&q=80";
}

// ── API fetch functions ────────────────────────────────────────

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";
const BASE = `${BACKEND}/api/v1`;

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

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE}/products/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const list: Category[] = json?.data ?? json;
    if (Array.isArray(list) && list.length > 0) {
      return [{ id: "all", name: "Tất cả", slug: "all", sortOrder: 0 }, ...list];
    }
    return FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  farmingType?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<ProductListResponse> {
  try {
    const qs = new URLSearchParams();
    qs.set("limit", String(params?.limit ?? 20));
    qs.set("page", String(params?.page ?? 1));
    if (params?.search) qs.set("search", params.search);
    if (params?.farmingType) qs.set("farmingType", params.farmingType);
    if (params?.categoryId) qs.set("categoryId", params.categoryId);
    if (params?.minPrice != null) qs.set("minPrice", String(params.minPrice));
    if (params?.maxPrice != null) qs.set("maxPrice", String(params.maxPrice));

    const res = await fetch(`${BASE}/products?${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // ResponseInterceptor wraps: { statusCode, message, data: { data: [...], total: N } }
    const payload: ProductListResponse = json?.data ?? json;
    if (payload.data && payload.data.length > 0) return payload;
    return { data: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length };
  } catch {
    return { data: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length };
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  if (/^\d+$/.test(id)) {
    return MOCK_PRODUCTS[parseInt(id, 10) - 1] ?? MOCK_PRODUCTS[0];
  }
  if (id.startsWith("mock-")) {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }
  try {
    const res = await fetch(`${BASE}/products/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // ResponseInterceptor wraps: { statusCode, message, data: <Product> }
    return (json?.data ?? json) as Product;
  } catch {
    return null;
  }
}
