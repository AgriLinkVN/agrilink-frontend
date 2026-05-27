import Link from "next/link";
import {
  Leaf, Search, MapPin, TrendingUp, ShieldCheck, Truck,
  ArrowRight, Star, Users, Package, BarChart3, CheckCircle,
  QrCode, Zap, Globe
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge, FarmingBadge } from "@/components/ui/badge";

/* Mock featured products */
const FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Xoài cát Hòa Lộc",
    province: "Tiền Giang",
    price: 45000,
    unit: "kg",
    farming_type: "vietgap" as const,
    rating: 4.8,
    sold: 1200,
    seller: "HTX Xoài Cát Tiền Giang",
    image_placeholder: "🥭",
  },
  {
    id: "2",
    name: "Rau muống hữu cơ",
    province: "Đà Lạt, Lâm Đồng",
    price: 25000,
    unit: "kg",
    farming_type: "organic" as const,
    rating: 4.9,
    sold: 890,
    seller: "Nông trại Xanh Đà Lạt",
    image_placeholder: "🥬",
  },
  {
    id: "3",
    name: "Thanh long ruột đỏ",
    province: "Bình Thuận",
    price: 35000,
    unit: "kg",
    farming_type: "globalgap" as const,
    rating: 4.7,
    sold: 2100,
    seller: "HTX Thanh Long Bình Thuận",
    image_placeholder: "🍈",
  },
  {
    id: "4",
    name: "Gạo ST25 đặc sản",
    province: "Sóc Trăng",
    price: 28000,
    unit: "kg",
    farming_type: "vietgap" as const,
    rating: 4.9,
    sold: 5400,
    seller: "Hộ ông Hồ Quang Cua",
    image_placeholder: "🌾",
  },
];

const CATEGORIES = [
  { label: "Lúa gạo", icon: "🌾", count: 234 },
  { label: "Rau củ", icon: "🥦", count: 512 },
  { label: "Trái cây", icon: "🍊", count: 389 },
  { label: "Thủy sản", icon: "🐟", count: 156 },
  { label: "Gia súc", icon: "🐄", count: 98 },
  { label: "Nông sản khô", icon: "🌰", count: 201 },
];

const STATS = [
  { value: "8.6M+", label: "Hộ nông dân tiềm năng", icon: Users },
  { value: "34", label: "Tỉnh thành phủ sóng", icon: MapPin },
  { value: "53B USD", label: "Xuất khẩu nông sản 2023", icon: Globe },
  { value: "20-35%", label: "Lãng phí cần giảm", icon: BarChart3 },
];

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Giá thị trường thực tế",
    desc: "Cập nhật giá nông sản theo thời gian thực từ 63 tỉnh thành. AI dự báo xu hướng 2–4 tuần.",
  },
  {
    icon: QrCode,
    title: "Truy xuất nguồn gốc QR",
    desc: "Quét mã QR để xem toàn bộ hành trình từ hạt giống → thu hoạch → bàn ăn của bạn.",
  },
  {
    icon: MapPin,
    title: "Bản đồ vùng nông sản",
    desc: "GIS số hóa 34 tỉnh trọng điểm. Tìm nguồn hàng theo vùng, mùa vụ, loại canh tác.",
  },
  {
    icon: ShieldCheck,
    title: "Thanh toán an toàn Escrow",
    desc: "Tiền được giữ trung gian đến khi giao hàng thành công. Bảo vệ cả người mua và người bán.",
  },
  {
    icon: Truck,
    title: "Kết nối logistics",
    desc: "Tích hợp GHN, Viettel Post, J&T. Tracking đơn hàng realtime từ nông trại đến cửa.",
  },
  {
    icon: Zap,
    title: "Nền tảng offline-first",
    desc: "Hoạt động cả khi mạng yếu. Dữ liệu sync tự động khi có kết nối — phù hợp vùng nông thôn.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline" className="border-white/40 text-white text-xs">
                🌾 AgriTech Vietnam 2025
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Kết nối nông dân Việt Nam <br />
              <span className="text-primary-ultra-light">trực tiếp với thị trường</span>
            </h1>
            <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-xl">
              Nền tảng số minh bạch hóa giá cả, truy xuất nguồn gốc và kết nối 8.6 triệu hộ nông dân với người mua trên toàn quốc.
            </p>

            {/* Hero search bar */}
            <div className="flex items-center gap-0 bg-white rounded-full p-2 max-w-lg shadow-xl mb-6">
              <Search size={18} className="ml-4 text-muted shrink-0" />
              <input
                type="text"
                placeholder="Tìm nông sản, tỉnh thành, HTX..."
                className="flex-1 px-4 py-2 bg-transparent text-ink text-sm outline-none placeholder:text-muted-soft"
              />
              <button className="h-11 px-6 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-active transition-colors shrink-0">
                Tìm ngay
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-white/70">
              <span>Phổ biến:</span>
              {["Xoài", "Gạo ST25", "Thanh long", "Rau hữu cơ", "Cà phê"].map((tag) => (
                <Link
                  key={tag}
                  href={`/marketplace?q=${tag}`}
                  className="text-white/90 hover:text-white hover:underline transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl border border-hairline p-6 card-shadow text-center">
              <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center mx-auto mb-3">
                <Icon size={20} className="text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{value}</div>
              <div className="text-xs text-muted leading-tight">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORY STRIP ===== */}
      <section className="border-y border-hairline bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(({ label, icon, count }) => (
              <Link
                key={label}
                href={`/marketplace?category=${label}`}
                className="flex flex-col items-center gap-2 px-6 py-3 rounded-xl border border-hairline hover:border-primary hover:bg-surface-green transition-all shrink-0 group"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-semibold text-ink group-hover:text-primary">{label}</span>
                <span className="text-xs text-muted">{count} sản phẩm</span>
              </Link>
            ))}
            <Link
              href="/marketplace"
              className="flex flex-col items-center gap-2 px-6 py-3 rounded-xl border border-dashed border-primary bg-surface-green transition-all shrink-0"
            >
              <span className="text-2xl">🔍</span>
              <span className="text-sm font-semibold text-primary">Xem tất cả</span>
              <span className="text-xs text-muted">Tất cả danh mục</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-ink">Sản phẩm nổi bật</h2>
            <p className="text-muted mt-1">Nông sản chất lượng từ khắp Việt Nam</p>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/marketplace">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/marketplace/${product.id}`}
              className="group bg-white rounded-xl border border-hairline overflow-hidden card-shadow card-shadow-hover"
            >
              {/* Product image placeholder */}
              <div className="aspect-4/3 bg-surface-green flex items-center justify-center text-6xl">
                {product.image_placeholder}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-ink leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <FarmingBadge type={product.farming_type} />
                </div>

                <div className="flex items-center gap-1 text-xs text-muted mb-3">
                  <MapPin size={11} className="text-primary" />
                  {product.province}
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <Star size={12} fill="#F59E0B" stroke="none" className="text-star" />
                  <span className="text-xs font-semibold text-ink">{product.rating}</span>
                  <span className="text-xs text-muted">· Đã bán {product.sold.toLocaleString("vi-VN")} kg</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-primary">
                      {product.price.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-xs text-muted">/{product.unit}</span>
                  </div>
                  <Button size="sm" className="text-xs px-3 h-8">
                    Đặt mua
                  </Button>
                </div>

                <p className="text-xs text-muted mt-2 truncate">
                  {product.seller}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="bg-surface-soft border-y border-hairline py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="organic" className="mb-4">Tính năng nền tảng</Badge>
            <h2 className="text-3xl font-bold text-ink mb-4">
              Hệ sinh thái số nông nghiệp toàn diện
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Từ sàn giao dịch đến truy xuất nguồn gốc, bản đồ GIS đến AI dự báo giá — AgriLink giải quyết toàn bộ bài toán chuỗi giá trị nông sản.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl border border-hairline p-6 card-shadow hover:border-primary-light transition-colors">
                <div className="w-12 h-12 rounded-xl bg-surface-green flex items-center justify-center mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-base font-semibold text-ink mb-2">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ink mb-4">Hoạt động như thế nào?</h2>
          <p className="text-muted">Bắt đầu trong 3 bước đơn giản</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Đăng ký tài khoản",
              desc: "Chọn vai trò của bạn — nông dân, HTX, người mua, hay doanh nghiệp. Xác thực qua OTP điện thoại.",
              icon: Users,
            },
            {
              step: "02",
              title: "Đăng / Tìm nông sản",
              desc: "Nông dân đăng sản phẩm với đầy đủ thông tin. Người mua tìm kiếm theo vùng, loại, giá.",
              icon: Package,
            },
            {
              step: "03",
              title: "Giao dịch an toàn",
              desc: "Đặt hàng — Escrow giữ tiền — Giao hàng — Giải ngân. Tranh chấp được xử lý trong 48h.",
              icon: ShieldCheck,
            },
          ].map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-ultra-light border-2 border-primary-light mb-6">
                <Icon size={28} className="text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  {step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-ink mb-3">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== MAP PREVIEW CTA ===== */}
      <section className="bg-surface-green border-y border-primary-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <Badge variant="organic" className="mb-4">Bản đồ GIS</Badge>
              <h2 className="text-3xl font-bold text-ink mb-4">
                Khám phá 34 vùng nông sản trọng điểm
              </h2>
              <p className="text-muted mb-6 leading-relaxed">
                Bản đồ số hóa hiển thị vùng trồng, sản lượng dự kiến, mùa vụ và loại nông sản đặc trưng của từng tỉnh thành. Tìm nguồn hàng chính xác theo địa lý.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <Link href="/map">
                    <MapPin size={16} /> Xem bản đồ vùng trồng
                  </Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/prices">
                    <TrendingUp size={16} /> Bảng giá thị trường
                  </Link>
                </Button>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="flex-1 w-full max-w-md">
              <div className="bg-white rounded-2xl border border-primary-light p-4 card-shadow aspect-4/3 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={64} className="text-primary mx-auto mb-4" />
                  <p className="text-sm font-semibold text-primary">Bản đồ GIS tương tác</p>
                  <p className="text-xs text-muted mt-1">MapBox GL · 34 tỉnh thành</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOR FARMERS CTA ===== */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Nông dân đăng ký hoàn toàn miễn phí
          </h2>
          <p className="text-white/80 mb-8 text-lg max-w-2xl mx-auto">
            12 tháng đầu miễn phí 100% cho nông dân và HTX. Không cần thẻ tín dụng.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-surface-green" asChild>
              <Link href="/auth/register">
                <Leaf size={20} /> Đăng ký ngay — Miễn phí
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 border border-white/30" asChild>
              <Link href="/about">Tìm hiểu thêm</Link>
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-white/70 text-sm">
            {["Miễn phí 12 tháng", "Không phí ẩn", "Hỗ trợ 24/7", "OTP bảo mật"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-primary-ultra-light" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
