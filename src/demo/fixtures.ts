import type { User } from "@/types";
import { NotifType, type Notification } from "@/types/notification";
import type {
  Product,
  ProductCertification,
} from "@/lib/products-api";

export const DEMO_PASSWORD = "demo123";
export const DEMO_OTP = "123456";

export const demoUsers: User[] = [
  {
    id: "demo-admin",
    full_name: "Quản trị viên Demo",
    phone: "0900000001",
    email: "admin@agrilink.demo",
    role: "admin",
    status: "active",
  },
  {
    id: "demo-farmer",
    full_name: "Nông dân Demo",
    phone: "0900000002",
    email: "farmer@agrilink.demo",
    role: "farmer",
    status: "active",
  },
  {
    id: "demo-cooperative",
    full_name: "HTX Demo",
    phone: "0900000003",
    email: "cooperative@agrilink.demo",
    role: "cooperative",
    status: "active",
  },
  {
    id: "demo-enterprise",
    full_name: "Doanh nghiệp Demo",
    phone: "0900000004",
    email: "enterprise@agrilink.demo",
    role: "enterprise",
    status: "active",
  },
  {
    id: "demo-buyer",
    full_name: "Người mua Demo",
    phone: "0900000005",
    email: "buyer@agrilink.demo",
    role: "buyer",
    status: "active",
  },
  {
    id: "demo-supplier",
    full_name: "Nhà cung cấp Demo",
    phone: "0900000006",
    email: "supplier@agrilink.demo",
    role: "supplier",
    status: "active",
  },
  {
    id: "demo-logistics",
    full_name: "Logistics Demo",
    phone: "0900000007",
    email: "logistics@agrilink.demo",
    role: "logistics",
    status: "active",
  },
];

const verifiedCertification: ProductCertification = {
  id: "demo-cert-vietgap",
  certType: "vietgap",
  certNumber: "DEMO-VIETGAP-2026",
  issuedBy: "AgriLink Demo",
  issuedDate: "2026-01-10",
  expiryDate: "2027-01-10",
  storedFileId: null,
  isVerified: true,
  status: "verified",
  verifiedAt: "2026-01-11T08:00:00.000Z",
  rejectionReason: null,
};

function demoProduct(
  id: string,
  name: string,
  price: number,
  farmingType: Product["farmingType"],
  image: string,
  status = "active",
  certifications: ProductCertification[] = [],
): Product {
  return {
    id,
    name,
    description: `${name} từ vùng nguyên liệu được kiểm soát, dữ liệu dùng để trình diễn AgriLink.`,
    pricePerUnit: price,
    unit: "kg",
    availableQuantity: 480,
    minOrderQuantity: 10,
    farmingType,
    status,
    viewCount: 320,
    soldCount: 84,
    avgRating: 4.8,
    harvestDate: "2026-07-20",
    expiryDate: "2026-08-20",
    provinceId: null,
    districtId: null,
    sellerId: "demo-farmer",
    sellerType: "farmer",
    categoryId: "trai-cay",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-25T08:00:00.000Z",
    images: [
      {
        id: `${id}-image`,
        imageUrl: image,
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    certifications,
    category: {
      id: "trai-cay",
      name: "Trái cây",
      slug: "trai-cay",
    },
  };
}

export const demoProducts: Product[] = [
  demoProduct(
    "demo-product-mango",
    "Xoài cát Hòa Lộc VietGAP",
    45000,
    "vietgap",
    "/demo/agricultural-produce.webp",
    "active",
    [verifiedCertification],
  ),
  demoProduct(
    "demo-product-rice",
    "Gạo ST25 Sóc Trăng",
    32000,
    "organic",
    "/demo/agricultural-produce.webp",
    "active",
    [verifiedCertification],
  ),
  demoProduct(
    "demo-product-coffee",
    "Cà phê Arabica Cầu Đất",
    145000,
    "organic",
    "/demo/agricultural-produce.webp",
  ),
  demoProduct(
    "demo-product-dragon-fruit",
    "Thanh long ruột đỏ Bình Thuận",
    36000,
    "globalgap",
    "/demo/agricultural-produce.webp",
  ),
  demoProduct(
    "demo-product-pending",
    "Bưởi da xanh Bến Tre",
    38000,
    "vietgap",
    "/demo/agricultural-produce.webp",
    "pending_approval",
  ),
  demoProduct(
    "demo-product-rejected",
    "Rau củ theo mùa",
    24000,
    "traditional",
    "/demo/agricultural-produce.webp",
    "rejected",
  ),
];

export const demoNotifications: Notification[] = [
  {
    id: "demo-notification-1",
    type: NotifType.PRODUCT_APPROVED,
    title: "Sản phẩm đã được duyệt",
    body: "Xoài cát Hòa Lộc VietGAP đang hiển thị trên chợ.",
    isRead: false,
    createdAt: "2026-07-29T09:30:00.000Z",
  },
  {
    id: "demo-notification-2",
    type: NotifType.NEW_ORDER,
    title: "Đơn hàng demo mới",
    body: "Bạn có một đơn hàng 50 kg gạo ST25.",
    isRead: false,
    createdAt: "2026-07-28T14:15:00.000Z",
  },
  {
    id: "demo-notification-3",
    type: NotifType.NEW_REVIEW,
    title: "Đánh giá mới",
    body: "Người mua đã đánh giá 5 sao cho sản phẩm.",
    isRead: true,
    readAt: "2026-07-27T08:20:00.000Z",
    createdAt: "2026-07-27T08:00:00.000Z",
  },
];

export const demoPendingProfiles = {
  farmer: [
    {
      id: "demo-profile-farmer",
      fullName: "Nguyễn Minh An",
      user: {
        id: "demo-user-pending-farmer",
        fullName: "Nguyễn Minh An",
        email: "pending.farmer@agrilink.demo",
        phone: "0900000011",
      },
      createdAt: "2026-07-28T08:00:00.000Z",
    },
  ],
  cooperative: [
    {
      id: "demo-profile-cooperative",
      cooperativeName: "HTX Nông sản Xanh",
      registrationNumber: "DEMO-HTX-001",
      user: {
        id: "demo-user-pending-cooperative",
        fullName: "Trần Thu Hà",
        email: "pending.cooperative@agrilink.demo",
        phone: "0900000012",
      },
      createdAt: "2026-07-27T08:00:00.000Z",
    },
  ],
  enterprise: [],
  supplier: [],
};
