import Link from "next/link";
import { MapPin, Star, Package, QrCode, Phone, MessageCircle, ShieldCheck, Truck, ChevronRight, Check, Calendar, Leaf } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge, FarmingBadge, OrderStatusBadge } from "@/components/ui/badge";

const PRODUCT = {
  id: "1",
  name: "Xoài cát Hòa Lộc loại 1 — Thu hoạch tháng 6/2025",
  province: "Tiền Giang",
  district: "Cái Bè",
  price: 45000,
  unit: "kg",
  min_order: 10,
  stock: 500,
  farming_type: "vietgap" as const,
  harvest_date: "15/06/2025",
  variety: "Cát Hòa Lộc",
  description: "Xoài cát Hòa Lộc chính gốc Tiền Giang, trái to đều, vỏ vàng óng, thịt dày ngọt thơm, ít xơ. Canh tác theo tiêu chuẩn VietGAP, không sử dụng chất kích thích tăng trưởng.",
  certifications: ["VietGAP", "OCOP 4 sao"],
  icon: "🥭",
  rating: 4.8,
  review_count: 234,
  sold: 1200,
  seller: {
    name: "HTX Xoài Cát Tiền Giang",
    type: "cooperative",
    trust_score: 4.9,
    total_sales: 8900,
    response_rate: "98%",
    phone: "0901 234 567",
  },
  qr_code: "QR-XOAI-TG-20250601-001",
};

const SIMILAR_PRODUCTS = [
  { id: "3", name: "Xoài tứ quý Đồng Tháp", price: 38000, unit: "kg", province: "Đồng Tháp", icon: "🥭", rating: 4.6 },
  { id: "5", name: "Xoài Thái siêu ngọt", price: 55000, unit: "kg", province: "An Giang", icon: "🥭", rating: 4.7 },
  { id: "7", name: "Xoài Úc ghép cành", price: 75000, unit: "kg", province: "Tiền Giang", icon: "🥭", rating: 4.5 },
];

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-hairline bg-surface-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-primary">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link href="/marketplace" className="hover:text-primary">Sàn nông sản</Link>
            <ChevronRight size={14} />
            <Link href="/marketplace?category=Trái cây" className="hover:text-primary">Trái cây</Link>
            <ChevronRight size={14} />
            <span className="text-ink font-medium truncate">Xoài cát Hòa Lộc</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — product info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Photo gallery */}
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-4 sm:col-span-3 aspect-4/3 bg-surface-green rounded-xl flex items-center justify-center text-8xl">
                {PRODUCT.icon}
              </div>
              <div className="hidden sm:flex flex-col gap-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="flex-1 bg-surface-green rounded-lg flex items-center justify-center text-3xl cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    {PRODUCT.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Product header */}
            <div>
              <div className="flex items-start gap-3 flex-wrap mb-3">
                <FarmingBadge type={PRODUCT.farming_type} />
                {PRODUCT.certifications.map((cert) => (
                  <Badge key={cert} variant="vietgap">{cert}</Badge>
                ))}
              </div>
              <h1 className="text-2xl font-bold text-ink mb-3">{PRODUCT.name}</h1>
              <div className="flex items-center flex-wrap gap-4 text-sm text-muted mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary" />
                  {PRODUCT.district}, {PRODUCT.province}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary" />
                  Thu hoạch: {PRODUCT.harvest_date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Leaf size={14} className="text-primary" />
                  Giống: {PRODUCT.variety}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={16} fill={s <= Math.floor(PRODUCT.rating) ? "#F59E0B" : "#E5E7EB"} stroke="none" />
                  ))}
                </div>
                <span className="text-2xl font-bold text-ink">{PRODUCT.rating}</span>
                <span className="text-muted">({PRODUCT.review_count} đánh giá)</span>
                <span className="text-muted">·</span>
                <span className="text-muted">Đã bán {PRODUCT.sold.toLocaleString("vi-VN")} {PRODUCT.unit}</span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-hairline pt-6">
              <h2 className="text-lg font-semibold text-ink mb-3">Mô tả sản phẩm</h2>
              <p className="text-body-text leading-relaxed">{PRODUCT.description}</p>
            </div>

            {/* QR Traceability */}
            <div className="bg-surface-green rounded-xl border-2 border-primary-light p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-hairline shrink-0">
                  <QrCode size={36} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ink">Truy xuất nguồn gốc</h3>
                    <Badge variant="organic">Đã xác thực</Badge>
                  </div>
                  <p className="text-sm text-muted mb-3">
                    Mã lô: <span className="font-mono font-semibold text-primary">{PRODUCT.qr_code}</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Ngày gieo trồng", value: "15/01/2025" },
                      { label: "Phân bón", value: "Hữu cơ vi sinh" },
                      { label: "Thuốc BVTV", value: "Không sử dụng" },
                      { label: "Ngày thu hoạch", value: "15/06/2025" },
                      { label: "Kho bảo quản", value: "Kho lạnh 8°C" },
                      { label: "Kiểm định", value: "Chi cục BVTV TG" },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white rounded-lg p-3 border border-hairline">
                        <p className="text-xs text-muted mb-1">{label}</p>
                        <p className="text-sm font-semibold text-ink">{value}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/trace/${PRODUCT.qr_code}`}>
                      <QrCode size={14} /> Xem đầy đủ lịch sử truy xuất
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Seller profile */}
            <div className="border-t border-hairline pt-6">
              <h2 className="text-lg font-semibold text-ink mb-4">Thông tin người bán</h2>
              <div className="bg-white rounded-xl border border-hairline p-5 card-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-white text-xl font-bold shrink-0">
                    HTX
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">{PRODUCT.seller.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="organic">HTX được xác thực</Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 text-center border-y border-hairline py-4">
                  <div>
                    <div className="text-xl font-bold text-primary">{PRODUCT.seller.trust_score}</div>
                    <div className="text-xs text-muted">Điểm tin cậy</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-ink">{PRODUCT.seller.total_sales.toLocaleString("vi-VN")}</div>
                    <div className="text-xs text-muted">Tổng giao dịch</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-ink">{PRODUCT.seller.response_rate}</div>
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

          {/* Right — order card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border border-hairline card-shadow p-6">
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary">{PRODUCT.price.toLocaleString("vi-VN")}đ</span>
                <span className="text-muted">/{PRODUCT.unit}</span>
              </div>

              <div className="flex flex-col gap-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Còn lại</span>
                  <span className="font-semibold text-ink">{PRODUCT.stock.toLocaleString("vi-VN")} {PRODUCT.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Đặt tối thiểu</span>
                  <span className="font-semibold text-ink">{PRODUCT.min_order} {PRODUCT.unit}</span>
                </div>
              </div>

              {/* Quantity input */}
              <div className="mb-5">
                <label className="text-sm font-medium text-ink mb-2 block">Số lượng ({PRODUCT.unit})</label>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-lg border border-border-strong flex items-center justify-center text-lg hover:border-primary hover:text-primary transition-colors">−</button>
                  <input
                    type="number"
                    defaultValue={10}
                    min={10}
                    className="flex-1 h-10 text-center border border-border-strong rounded-lg outline-none focus:border-primary text-sm font-semibold"
                  />
                  <button className="w-10 h-10 rounded-lg border border-border-strong flex items-center justify-center text-lg hover:border-primary hover:text-primary transition-colors">+</button>
                </div>
              </div>

              <div className="border-t border-hairline pt-4 mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted">Thành tiền</span>
                  <span className="font-bold text-ink">450.000đ</span>
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>+ Phí vận chuyển (tính sau)</span>
                  <span>Escrow bảo vệ</span>
                </div>
              </div>

              <Button size="lg" className="w-full mb-3">
                Đặt mua ngay
              </Button>
              <Button variant="secondary" size="lg" className="w-full">
                <MessageCircle size={16} /> Yêu cầu báo giá
              </Button>

              {/* Trust signals */}
              <div className="mt-5 flex flex-col gap-2">
                {[
                  { icon: ShieldCheck, text: "Thanh toán qua Escrow — tiền được giữ an toàn" },
                  { icon: Truck, text: "Giao hàng toàn quốc qua GHN, Viettel Post" },
                  { icon: Check, text: "Tranh chấp được xử lý trong 48 giờ" },
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
              <Link key={p.id} href={`/marketplace/${p.id}`} className="bg-white rounded-xl border border-hairline p-4 card-shadow card-shadow-hover flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-surface-green flex items-center justify-center text-2xl shrink-0">{p.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-ink">{p.name}</p>
                  <p className="text-xs text-muted flex items-center gap-1"><MapPin size={10} />{p.province}</p>
                  <p className="text-sm font-bold text-primary mt-1">{p.price.toLocaleString("vi-VN")}đ/{p.unit}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
