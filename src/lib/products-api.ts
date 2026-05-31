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

// Province labels for mock (no provinceId in mock data)
const MOCK_PROVINCE_LABELS: Record<string, string> = {
  "mock-1": "Tiền Giang",
  "mock-2": "Lâm Đồng",
  "mock-3": "Bình Thuận",
  "mock-4": "Sóc Trăng",
  "mock-5": "Lâm Đồng",
  "mock-6": "Bến Tre",
  "mock-7": "Long An",
  "mock-8": "Tiền Giang",
};

export function getProductProvince(product: Product): string {
  if (!product.id.startsWith("mock-")) return product.provinceId ?? "Việt Nam";
  return MOCK_PROVINCE_LABELS[product.id] ?? "Việt Nam";
}

export function getPrimaryImage(product: Product): string {
  const primary = product.images.find((img) => img.isPrimary) ?? product.images[0];
  return primary?.imageUrl ?? "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=600&q=80";
}

// ── API fetch functions ────────────────────────────────────────

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
const BASE = `${BACKEND}/api/v1`;

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  farmingType?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<ProductListResponse> {
  try {
    const qs = new URLSearchParams();
    qs.set("limit", String(params?.limit ?? 20));
    qs.set("page", String(params?.page ?? 1));
    if (params?.search) qs.set("search", params.search);
    if (params?.farmingType) qs.set("farmingType", params.farmingType);
    if (params?.minPrice != null) qs.set("minPrice", String(params.minPrice));
    if (params?.maxPrice != null) qs.set("maxPrice", String(params.maxPrice));

    const res = await fetch(`${BASE}/products?${qs}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.data && json.data.length > 0) return json as ProductListResponse;
    // BE returned empty → use mock so UI isn't blank
    return { data: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length };
  } catch {
    return { data: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length };
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  // If id is a small integer string (legacy mock), return mock directly
  if (/^\d+$/.test(id)) {
    return MOCK_PRODUCTS[parseInt(id, 10) - 1] ?? MOCK_PRODUCTS[0];
  }
  if (id.startsWith("mock-")) {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }
  try {
    const res = await fetch(`${BASE}/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Product;
  } catch {
    return null;
  }
}
