import Link from "next/link";
import {
  MapPin, Star, QrCode, Phone, MessageCircle, ShieldCheck,
  Truck, ChevronRight, Calendar, Eye, Package2, Award,
  FileText, User, Building2, Sprout,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
<<<<<<< Updated upstream
import { Badge, FarmingBadge } from "@/components/ui/badge";
=======
import { Badge, FarmingBadge, OrderStatusBadge } from "@/components/ui/badge";
import { ReviewSection } from "@/components/reviews/ReviewSection";
>>>>>>> Stashed changes

/* ── Mock data — mirrors DB schema exactly ─────────────────────
   Tables used: products, product_images, product_certifications,
                users (seller), profiles
   ─────────────────────────────────────────────────────────────── */
const PRODUCT = {
  // products table
  id: "1",
  name: "Xoài cát Hòa Lộc loại 1",
  description: "Xoài cát Hòa Lộc chính gốc Tiền Giang, trái to đều, vỏ vàng óng, thịt dày ngọt thơm, ít xơ. Canh tác theo tiêu chuẩn VietGAP, không sử dụng chất kích thích tăng trưởng. Bảo quản nơi thoáng mát, dùng trong 7 ngày sau thu hoạch.",
  pricePerUnit: 45000,
  unit: "kg",
  availableQuantity: 500,
  minOrderQuantity: 10,
  farmingType: "vietgap" as const,
  province: "Tiền Giang",
  district: "Cái Bè",
  harvestDate: "15/06/2025",
  expiryDate: "22/06/2025",          // expiry_date — có trong DB
  status: "active",
  viewCount: 1284,

  // product_images (primary image — dùng emoji placeholder)
  icon: "🥭",

  // aggregated from reviews table
  rating: 4.8,
  reviewCount: 234,
  soldCount: 1200,

  // product_certifications — đủ fields từ bảng
  certifications: [
    {
      certType: "VietGAP",
      certNumber: "VG-TG-2024-0892",
      issuedBy: "Sở NN&PTNT Tiền Giang",
      issuedDate: "01/03/2024",
      expiryDate: "01/03/2026",
    },
    {
      certType: "OCOP",
      certNumber: "OCOP-4S-TG-2024",
      issuedBy: "UBND tỉnh Tiền Giang",
      issuedDate: "15/06/2024",
      expiryDate: "15/06/2027",
    },
  ],

  // traceability — link to /trace page (không hardcode chi tiết)
  qrCode: "QR-XOAI-TG-20250601-001",

  // seller info (from users + profiles join)
  seller: {
    id: "u2",
    name: "HTX Xoài Cát Tiền Giang",
    sellerType: "cooperative",        // SellerType enum
    trustScore: 4.9,
    totalSales: 8900,
    responseRate: "98%",
    phone: "0901 234 567",
    provinceLabel: "Tiền Giang",
  },
};

const SIMILAR_PRODUCTS = [
  { id: "3", name: "Xoài tứ quý Đồng Tháp", pricePerUnit: 38000, unit: "kg", province: "Đồng Tháp", icon: "🥭", rating: 4.6, farmingType: "vietgap" as const },
  { id: "5", name: "Xoài Thái siêu ngọt", pricePerUnit: 55000, unit: "kg", province: "An Giang", icon: "🥭", rating: 4.7, farmingType: "traditional" as const },
  { id: "7", name: "Xoài Úc ghép cành", pricePerUnit: 75000, unit: "kg", province: "Tiền Giang", icon: "🥭", rating: 4.5, farmingType: "globalgap" as const },
];

<<<<<<< Updated upstream
const SELLER_TYPE_LABEL: Record<string, { label: string; icon: React.ElementType }> = {
  individual: { label: "Hộ cá nhân", icon: User },
  cooperative: { label: "Hợp tác xã", icon: Building2 },
  enterprise: { label: "Doanh nghiệp", icon: Building2 },
};

export default function ProductDetailPage() {
  const SellerIcon = SELLER_TYPE_LABEL[PRODUCT.seller.sellerType]?.icon ?? User;
  const sellerLabel = SELLER_TYPE_LABEL[PRODUCT.seller.sellerType]?.label ?? "Người bán";

=======
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id: productId } = await params;
>>>>>>> Stashed changes
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-hairline bg-surface-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link href="/marketplace" className="hover:text-primary transition-colors">Sàn nông sản</Link>
            <ChevronRight size={14} />
            <span className="text-ink font-medium truncate">{PRODUCT.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left col: product info ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Image gallery placeholder */}
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-4 sm:col-span-3 aspect-4/3 bg-surface-green rounded-xl flex items-center justify-center text-8xl">
                {PRODUCT.icon}
              </div>
              <div className="hidden sm:flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 bg-surface-green rounded-lg flex items-center justify-center text-3xl cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    {PRODUCT.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Header */}
            <div>
              {/* Status + farming badges */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-badge-organic-bg text-[#2D6A4F] text-xs font-semibold">
                  Đang bán
                </span>
                <FarmingBadge type={PRODUCT.farmingType} />
              </div>

              <h1 className="text-2xl font-bold text-ink mb-4">{PRODUCT.name}</h1>

              {/* Key info row */}
              <div className="flex items-center flex-wrap gap-x-5 gap-y-2 text-sm text-muted mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary shrink-0" />
                  {PRODUCT.district}, {PRODUCT.province}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary shrink-0" />
                  Thu hoạch: <span className="font-medium text-ink">{PRODUCT.harvestDate}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-warning shrink-0" />
                  Hạn dùng: <span className="font-medium text-ink">{PRODUCT.expiryDate}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={14} className="text-muted shrink-0" />
                  {PRODUCT.viewCount.toLocaleString("vi-VN")} lượt xem
                </span>
              </div>

              {/* Rating + sold */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill={s <= Math.floor(PRODUCT.rating) ? "#F59E0B" : "#E5E7EB"} stroke="none" />
                  ))}
                </div>
                <span className="text-xl font-bold text-ink">{PRODUCT.rating}</span>
                <span className="text-muted text-sm">({PRODUCT.reviewCount} đánh giá)</span>
                <span className="text-muted">·</span>
                <span className="text-muted text-sm">Đã bán {PRODUCT.soldCount.toLocaleString("vi-VN")} {PRODUCT.unit}</span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-hairline pt-6">
              <h2 className="text-lg font-semibold text-ink mb-3">Mô tả sản phẩm</h2>
              <p className="text-body-text leading-relaxed text-sm">{PRODUCT.description}</p>
            </div>

            {/* Specifications — DB fields */}
            <div className="border-t border-hairline pt-6">
              <h2 className="text-lg font-semibold text-ink mb-4">Thông tin sản phẩm</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Đơn vị tính", value: PRODUCT.unit, icon: Package2 },
                  { label: "Số lượng còn", value: `${PRODUCT.availableQuantity.toLocaleString("vi-VN")} ${PRODUCT.unit}`, icon: Package2 },
                  { label: "Đặt tối thiểu", value: `${PRODUCT.minOrderQuantity} ${PRODUCT.unit}`, icon: Package2 },
                  { label: "Loại canh tác", value: PRODUCT.farmingType.toUpperCase(), icon: Sprout },
                  { label: "Ngày thu hoạch", value: PRODUCT.harvestDate, icon: Calendar },
                  { label: "Hạn sử dụng", value: PRODUCT.expiryDate, icon: Calendar },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-surface-soft rounded-lg p-3 border border-hairline">
                    <p className="text-xs text-muted mb-1 flex items-center gap-1">
                      <Icon size={11} className="text-primary" />{label}
                    </p>
                    <p className="text-sm font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications — product_certifications table */}
            <div className="border-t border-hairline pt-6">
              <h2 className="text-lg font-semibold text-ink mb-4">Chứng nhận chất lượng</h2>
              <div className="flex flex-col gap-3">
                {PRODUCT.certifications.map((cert) => (
                  <div key={cert.certNumber} className="bg-white rounded-xl border border-hairline p-4 card-shadow flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-green flex items-center justify-center shrink-0">
                      <Award size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-bold text-ink">{cert.certType}</span>
                        <span className="font-mono text-xs text-muted bg-surface-soft px-2 py-0.5 rounded">
                          {cert.certNumber}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <FileText size={11} /> Cấp bởi: <span className="text-ink font-medium">{cert.issuedBy}</span>
                        </span>
                        <span>Ngày cấp: <span className="text-ink">{cert.issuedDate}</span></span>
                        <span>Hiệu lực đến: <span className="text-ink font-medium">{cert.expiryDate}</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Traceability — link to /trace, không hardcode data */}
            <div className="bg-surface-green rounded-xl border-2 border-primary-light p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-hairline shrink-0">
                  <QrCode size={32} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ink text-sm">Truy xuất nguồn gốc</h3>
                    <Badge variant="organic">Đã xác thực</Badge>
                  </div>
                  <p className="text-xs text-muted mb-3">
                    Mã lô: <span className="font-mono font-semibold text-primary">{PRODUCT.qrCode}</span>
                  </p>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/trace/${PRODUCT.qrCode}`}>
                      <QrCode size={13} /> Xem toàn bộ hành trình sản phẩm
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Seller info */}
            <div className="border-t border-hairline pt-6">
              <h2 className="text-lg font-semibold text-ink mb-4">Thông tin người bán</h2>
              <div className="bg-white rounded-xl border border-hairline p-5 card-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <SellerIcon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">{PRODUCT.seller.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="vietgap">{sellerLabel} · Đã xác thực</Badge>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <MapPin size={11} className="text-primary" />{PRODUCT.seller.provinceLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center border-y border-hairline py-4 mb-4">
                  <div>
                    <div className="text-xl font-bold text-primary">{PRODUCT.seller.trustScore}</div>
                    <div className="text-xs text-muted">Điểm tin cậy</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-ink">{PRODUCT.seller.totalSales.toLocaleString("vi-VN")}</div>
                    <div className="text-xs text-muted">Giao dịch</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-ink">{PRODUCT.seller.responseRate}</div>
                    <div className="text-xs text-muted">Phản hồi</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <MessageCircle size={14} /> Nhắn tin
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Phone size={14} /> Gọi ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right col: contact card ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border border-hairline card-shadow p-6 flex flex-col gap-5">

              {/* Price */}
              <div>
                <span className="text-3xl font-bold text-primary">{PRODUCT.pricePerUnit.toLocaleString("vi-VN")}đ</span>
                <span className="text-muted text-sm">/{PRODUCT.unit}</span>
              </div>

              {/* Quick stats */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Còn lại</span>
                  <span className="font-semibold text-ink">{PRODUCT.availableQuantity.toLocaleString("vi-VN")} {PRODUCT.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Đặt tối thiểu</span>
                  <span className="font-semibold text-ink">{PRODUCT.minOrderQuantity} {PRODUCT.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Hạn sử dụng</span>
                  <span className="font-semibold text-ink">{PRODUCT.expiryDate}</span>
                </div>
              </div>

              {/* CTA — liên hệ, không đặt mua */}
              <div className="flex flex-col gap-3 border-t border-hairline pt-4">
                <Button size="lg" className="w-full">
                  <Phone size={17} /> Liên hệ người bán
                </Button>
                <Button variant="secondary" size="lg" className="w-full">
                  <MessageCircle size={16} /> Yêu cầu báo giá
                </Button>
              </div>

              {/* Trust */}
              <div className="flex flex-col gap-2 border-t border-hairline pt-4">
                {[
                  { icon: ShieldCheck, text: "Người bán đã được xác thực danh tính" },
                  { icon: Award, text: "Chứng nhận VietGAP còn hiệu lực" },
                  { icon: Truck, text: "Hỗ trợ giao hàng toàn quốc" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-2 text-xs text-muted">
                    <Icon size={13} className="text-primary mt-0.5 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar products */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-ink mb-6">Sản phẩm tương tự</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {SIMILAR_PRODUCTS.map((p) => (
              <Link
                key={p.id}
                href={`/marketplace/${p.id}`}
                className="bg-white rounded-xl border border-hairline p-4 card-shadow card-shadow-hover flex items-center gap-3"
              >
                <div className="w-14 h-14 rounded-xl bg-surface-green flex items-center justify-center text-2xl shrink-0">
                  {p.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink leading-tight mb-1 truncate">{p.name}</p>
                  <p className="text-xs text-muted flex items-center gap-1 mb-1">
                    <MapPin size={10} />{p.province}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-primary">{p.pricePerUnit.toLocaleString("vi-VN")}đ/{p.unit}</p>
                    <FarmingBadge type={p.farmingType} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews — added by P5. productId comes from the URL param so the
          section loads the real product's reviews instead of mock data. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReviewSection productId={productId} />
      </div>

      <Footer />
    </div>
  );
}
