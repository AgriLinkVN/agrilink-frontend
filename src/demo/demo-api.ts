import {
  demoNotifications,
  demoPendingProfiles,
  demoProducts,
  demoUsers,
} from "@/demo/fixtures";
import type { Product } from "@/lib/products-api";
import type { Notification } from "@/types/notification";
import type { Review, ReviewsResponse } from "@/types/review";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface DemoState {
  wishlistIds: string[];
  notifications: Notification[];
  products: Product[];
  pendingProfileIds: string[];
  reviews: Review[];
}

interface DemoProductStatusBody {
  status?: string;
  rejectionReason?: string;
}

const STORAGE_KEY = "agrilink-demo-data";

const initialReviews: Review[] = [
  {
    id: "demo-review-1",
    productId: "demo-product-mango",
    revieweeId: "demo-farmer",
    rating: 5,
    comment: "Sản phẩm tươi, đóng gói kỹ và giao đúng hẹn.",
    isVerifiedPurchase: true,
    createdAt: "2026-07-26T09:00:00.000Z",
    reviewer: {
      id: "demo-buyer",
      fullName: "Người mua Demo",
    },
    product: {
      id: "demo-product-mango",
      name: "Xoài cát Hòa Lộc VietGAP",
    },
  },
  {
    id: "demo-review-2",
    productId: "demo-product-mango",
    revieweeId: "demo-farmer",
    rating: 4,
    comment: "Chất lượng tốt, thông tin truy xuất rõ ràng.",
    isVerifiedPurchase: true,
    createdAt: "2026-07-24T10:30:00.000Z",
    reviewer: {
      id: "demo-enterprise",
      fullName: "Doanh nghiệp Demo",
    },
    product: {
      id: "demo-product-mango",
      name: "Xoài cát Hòa Lộc VietGAP",
    },
  },
];

function createInitialState(): DemoState {
  return {
    wishlistIds: ["demo-product-mango"],
    notifications: structuredClone(demoNotifications),
    products: structuredClone(demoProducts),
    pendingProfileIds: [
      "demo-profile-farmer",
      "demo-profile-cooperative",
    ],
    reviews: structuredClone(initialReviews),
  };
}

let serverState = createInitialState();

function isDemoState(value: unknown): value is DemoState {
  if (typeof value !== "object" || value === null) return false;
  return (
    "wishlistIds" in value &&
    Array.isArray(value.wishlistIds) &&
    "notifications" in value &&
    Array.isArray(value.notifications) &&
    "products" in value &&
    Array.isArray(value.products) &&
    "pendingProfileIds" in value &&
    Array.isArray(value.pendingProfileIds) &&
    "reviews" in value &&
    Array.isArray(value.reviews)
  );
}

function readState(): DemoState {
  if (typeof window === "undefined") return serverState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createInitialState();
    const parsed: unknown = JSON.parse(stored);
    return isDemoState(parsed) ? parsed : createInitialState();
  } catch {
    return createInitialState();
  }
}

function writeState(state: DemoState): void {
  if (typeof window === "undefined") {
    serverState = state;
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getTokenUser(token?: string | null) {
  const id = token?.startsWith("demo-session:")
    ? token.slice("demo-session:".length)
    : null;
  return demoUsers.find((user) => user.id === id) ?? demoUsers[0];
}

function getReviewsResponse(reviews: Review[]): ReviewsResponse {
  const distribution: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  let sum = 0;
  for (const review of reviews) {
    distribution[review.rating] = (distribution[review.rating] ?? 0) + 1;
    sum += review.rating;
  }
  return {
    data: reviews,
    total: reviews.length,
    stats: {
      avg: reviews.length > 0 ? sum / reviews.length : 0,
      total: reviews.length,
      distribution,
    },
  };
}

function getAdminProduct(product: Product) {
  return {
    id: product.id,
    name: product.name,
    price: product.pricePerUnit,
    pricePerUnit: product.pricePerUnit,
    unit: product.unit,
    seller: {
      id: product.sellerId,
      fullName: "Nông dân Demo",
    },
    status: product.status,
    updatedAt: product.updatedAt,
    description: product.description,
    availableQuantity: product.availableQuantity,
    farmingType: product.farmingType,
    rejectionReason:
      product.status === "rejected" ? "Thông tin mùa vụ chưa đầy đủ." : null,
    images: product.images,
    certifications: product.certifications ?? [],
  };
}

function getPendingProfiles(state: DemoState) {
  return {
    farmer: demoPendingProfiles.farmer.filter((profile) =>
      state.pendingProfileIds.includes(profile.id),
    ),
    cooperative: demoPendingProfiles.cooperative.filter((profile) =>
      state.pendingProfileIds.includes(profile.id),
    ),
    enterprise: demoPendingProfiles.enterprise,
    supplier: demoPendingProfiles.supplier,
  };
}

function paginate<T>(items: T[], searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 20);
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    total: items.length,
    page,
    limit,
  };
}

function createReview(
  body: unknown,
  state: DemoState,
  token?: string | null,
): Review {
  if (typeof body !== "object" || body === null || !("productId" in body)) {
    throw new Error("Dữ liệu đánh giá demo không hợp lệ.");
  }
  const productId =
    typeof body.productId === "string" ? body.productId : "";
  const rating =
    "rating" in body && typeof body.rating === "number" ? body.rating : 5;
  const comment =
    "comment" in body && typeof body.comment === "string"
      ? body.comment
      : undefined;
  const user = getTokenUser(token);
  const product = state.products.find((item) => item.id === productId);
  return {
    id: `demo-review-${Date.now()}`,
    productId,
    revieweeId: product?.sellerId,
    rating,
    comment,
    isVerifiedPurchase: true,
    createdAt: new Date().toISOString(),
    reviewer: {
      id: user.id,
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
    },
    product: product
      ? {
          id: product.id,
          name: product.name,
        }
      : undefined,
  };
}

export async function demoApiRequest<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  token?: string | null,
): Promise<T> {
  const url = new URL(path, "https://demo.agrilink.local");
  const route = url.pathname;
  const state = readState();
  let result: object | string[] | undefined;

  if (method === "GET" && route === "/users/me") {
    result = getTokenUser(token);
  } else if (method === "GET" && route === "/admin/stats") {
    const pendingProfiles = getPendingProfiles(state);
    const pendingProducts = state.products.filter(
      (product) => product.status === "pending_approval",
    ).length;
    result = {
      totalUsers: demoUsers.length + state.pendingProfileIds.length,
      activeUsers: demoUsers.length,
      pendingProfiles: {
        farmer: pendingProfiles.farmer.length,
        cooperative: pendingProfiles.cooperative.length,
        enterprise: pendingProfiles.enterprise.length,
        supplier: pendingProfiles.supplier.length,
        total: state.pendingProfileIds.length,
      },
      totalProducts: state.products.length,
      pendingProducts,
      openDisputes: 1,
      certificationsThisMonth: 4,
    };
  } else if (
    method === "GET" &&
    route === "/admin/products/pending"
  ) {
    result = paginate(
      state.products
        .filter((product) => product.status === "pending_approval")
        .map(getAdminProduct),
      url.searchParams,
    );
  } else if (
    method === "GET" &&
    route.startsWith("/admin/products/")
  ) {
    const id = route.slice("/admin/products/".length);
    const product = state.products.find((item) => item.id === id);
    if (!product) throw new Error("Không tìm thấy sản phẩm demo.");
    result = getAdminProduct(product);
  } else if (
    method === "PATCH" &&
    route.startsWith("/admin/products/") &&
    route.endsWith("/status")
  ) {
    const id = route
      .slice("/admin/products/".length)
      .replace(/\/status$/, "");
    const update =
      typeof body === "object" && body !== null
        ? (body as DemoProductStatusBody)
        : {};
    state.products = state.products.map((product) =>
      product.id === id && update.status
        ? {
            ...product,
            status: update.status,
            updatedAt: new Date().toISOString(),
          }
        : product,
    );
    writeState(state);
    result = {};
  } else if (
    method === "GET" &&
    route === "/admin/pending-profiles"
  ) {
    result = getPendingProfiles(state);
  } else if (method === "GET" && route === "/admin/disputes") {
    result = {
      data: [
        {
          id: "demo-dispute-1",
          description: "Tranh chấp mô phỏng về chất lượng lô hàng.",
          incidentType: "quality",
          createdAt: "2026-07-28T08:00:00.000Z",
        },
      ],
      total: 1,
    };
  } else if (method === "GET" && route === "/admin/audit-logs") {
    result = paginate(
      [
        {
          id: "demo-audit-1",
          method: "PATCH",
          action: "APPROVE_PRODUCT",
          path: "/admin/products/demo-product-mango/status",
          entityType: "Product",
          userId: "demo-admin",
          ipAddress: "demo",
          changes: { status: "active" },
          createdAt: "2026-07-29T08:00:00.000Z",
        },
      ],
      url.searchParams,
    );
  } else if (
    method === "GET" &&
    route === "/admin/cooperatives-enterprises"
  ) {
    result = {
      cooperatives: [
        {
          id: "demo-organization-1",
          cooperativeName: "HTX Nông sản Xanh",
          taxCode: "DEMO-HTX-001",
          representativeName: "Trần Thu Hà",
          address: "Tiền Giang",
          isVerified: true,
        },
      ],
      enterprises: [
        {
          id: "demo-organization-2",
          companyName: "Công ty Nông nghiệp Demo",
          taxCode: "DEMO-DN-001",
          representativeName: "Doanh nghiệp Demo",
          address: "TP. Hồ Chí Minh",
          isVerified: true,
        },
      ],
    };
  } else if (
    method === "GET" &&
    route === "/admin/products/violating"
  ) {
    const violatingProducts = state.products
      .filter((product) =>
        ["rejected", "suspended"].includes(product.status),
      )
      .map(getAdminProduct);
    result = {
      data: violatingProducts,
      total: violatingProducts.length,
    };
  } else if (
    method === "PATCH" &&
    /^\/admin\/profiles\/[^/]+\/[^/]+\/verify$/.test(route)
  ) {
    const profileId = route.split("/")[4];
    state.pendingProfileIds = state.pendingProfileIds.filter(
      (id) => id !== profileId,
    );
    writeState(state);
    result = {};
  } else if (method === "GET" && route === "/wishlist/ids") {
    result = state.wishlistIds;
  } else if (method === "GET" && route === "/wishlist") {
    const products = state.products.filter((product) =>
      state.wishlistIds.includes(product.id),
    );
    result = paginate(products, url.searchParams);
  } else if (
    (method === "POST" || method === "DELETE") &&
    route.startsWith("/wishlist/")
  ) {
    const productId = route.slice("/wishlist/".length);
    state.wishlistIds =
      method === "POST"
        ? Array.from(new Set([...state.wishlistIds, productId]))
        : state.wishlistIds.filter((id) => id !== productId);
    writeState(state);
    result = {};
  } else if (method === "GET" && route === "/products") {
    const search = url.searchParams.get("search")?.trim().toLocaleLowerCase("vi");
    const categoryId = url.searchParams.get("categoryId");
    const farmingType = url.searchParams.get("farmingType");
    const minPrice = Number(url.searchParams.get("minPrice"));
    const maxPrice = Number(url.searchParams.get("maxPrice"));
    const sortBy = url.searchParams.get("sortBy") ?? "createdAt";
    const order = url.searchParams.get("order") === "ASC" ? 1 : -1;
    let products = state.products.filter(
      (product) => product.status === "active",
    );
    if (search) {
      products = products.filter((product) =>
        `${product.name} ${product.description ?? ""}`
          .toLocaleLowerCase("vi")
          .includes(search),
      );
    }
    if (categoryId) {
      products = products.filter(
        (product) => product.categoryId === categoryId,
      );
    }
    if (farmingType) {
      products = products.filter(
        (product) => product.farmingType === farmingType,
      );
    }
    if (Number.isFinite(minPrice) && minPrice > 0) {
      products = products.filter(
        (product) => product.pricePerUnit >= minPrice,
      );
    }
    if (Number.isFinite(maxPrice) && maxPrice > 0) {
      products = products.filter(
        (product) => product.pricePerUnit <= maxPrice,
      );
    }
    products = [...products].sort((left, right) => {
      const leftValue =
        sortBy === "name"
          ? left.name
          : sortBy === "pricePerUnit"
            ? left.pricePerUnit
            : left.createdAt;
      const rightValue =
        sortBy === "name"
          ? right.name
          : sortBy === "pricePerUnit"
            ? right.pricePerUnit
            : right.createdAt;
      return (
        (typeof leftValue === "string"
          ? leftValue.localeCompare(String(rightValue), "vi")
          : leftValue - Number(rightValue)) * order
      );
    });
    result = paginate(
      products.map((product) => ({
        ...product,
        provinceId: product.provinceId ?? "demo-province-tien-giang",
        categoryId: product.categoryId ?? "trai-cay",
      })),
      url.searchParams,
    );
  } else if (
    method === "GET" &&
    route === "/products/categories/tree"
  ) {
    result = [
      {
        id: "trai-cay",
        name: "Trái cây",
        slug: "trai-cay",
        parentId: null,
        sortOrder: 1,
        isActive: true,
        children: [],
      },
      {
        id: "lua-gao-ngu-coc",
        name: "Lúa gạo và ngũ cốc",
        slug: "lua-gao-ngu-coc",
        parentId: null,
        sortOrder: 2,
        isActive: true,
        children: [],
      },
    ];
  } else if (
    method === "GET" &&
    route === "/geography/provinces"
  ) {
    result = [
      {
        id: "demo-province-tien-giang",
        name: "Tiền Giang",
        code: "DEMO-82",
        region: "south",
      },
      {
        id: "demo-province-lam-dong",
        name: "Lâm Đồng",
        code: "DEMO-68",
        region: "highlands",
      },
    ];
  } else if (method === "GET" && route === "/notifications/unread") {
    result = state.notifications.filter((notification) => !notification.isRead);
  } else if (method === "GET" && route === "/notifications/count") {
    result = {
      count: state.notifications.filter(
        (notification) => !notification.isRead,
      ).length,
    };
  } else if (method === "GET" && route === "/notifications") {
    result = paginate(state.notifications, url.searchParams);
  } else if (
    method === "PATCH" &&
    route === "/notifications/mark-all-read"
  ) {
    state.notifications = state.notifications.map((notification) => ({
      ...notification,
      isRead: true,
      readAt: new Date().toISOString(),
    }));
    writeState(state);
    result = {};
  } else if (
    method === "PATCH" &&
    /^\/notifications\/[^/]+\/read$/.test(route)
  ) {
    const notificationId = route.split("/")[2];
    state.notifications = state.notifications.map((notification) =>
      notification.id === notificationId
        ? {
            ...notification,
            isRead: true,
            readAt: new Date().toISOString(),
          }
        : notification,
    );
    writeState(state);
    result = {};
  } else if (
    method === "GET" &&
    route.startsWith("/reviews/product/")
  ) {
    const productId = route.slice("/reviews/product/".length);
    result = getReviewsResponse(
      state.reviews.filter((review) => review.productId === productId),
    );
  } else if (method === "POST" && route === "/reviews") {
    const review = createReview(body, state, token);
    state.reviews = [review, ...state.reviews];
    writeState(state);
    result = review;
  } else if (method === "GET" && route === "/products/me") {
    result = paginate(
      state.products.filter(
        (product) => product.sellerId === getTokenUser(token).id,
      ),
      url.searchParams,
    );
  } else if (
    method === "GET" &&
    route === "/cooperatives/me/reports/production"
  ) {
    result = {
      totalEstimated: 12800,
      totalActual: 12150,
      byMember: [
        {
          farmerId: "demo-farmer",
          farmerName: "Nông dân Demo",
          estimated: 7200,
          actual: 7000,
        },
        {
          farmerId: "demo-farmer-2",
          farmerName: "Thành viên HTX Demo",
          estimated: 5600,
          actual: 5150,
        },
      ],
      byMonth: [
        { month: "2026-05", estimated: 3800, actual: 3600 },
        { month: "2026-06", estimated: 4200, actual: 4050 },
        { month: "2026-07", estimated: 4800, actual: 4500 },
      ],
    };
  } else if (
    (method === "PUT" || method === "PATCH") &&
    route.startsWith("/profiles/")
  ) {
    result = {
      demo: true,
      message: "Đã cập nhật dữ liệu demo.",
    };
  } else if (
    method === "GET" &&
    route === "/ads/campaigns/active"
  ) {
    result = [];
  } else if (method === "POST" && route === "/ads/events") {
    result = {};
  } else {
    throw new Error(
      `Tính năng này chưa được mô phỏng trong Demo Mode: ${method} ${route}`,
    );
  }

  return result as T;
}

export function resetDemoData(): void {
  const state = createInitialState();
  writeState(state);
}
