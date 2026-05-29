import Link from "next/link";
import {
  TrendingUp,
  Users,
  Sprout,
  Smartphone,
  Building2,
  BarChart,
  Handshake,
  ShieldCheck,
  DollarSign,
  MapPin,
  FileText,
  Megaphone,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// ─── Data ────────────────────────────────────────────────────────────────────

const FARMER_BENEFITS = [
  {
    icon: TrendingUp,
    title: "Biết giá thị trường",
    desc: "Cập nhật giá nông sản theo ngày từ 34 tỉnh thành — không còn bị thương lái ép giá vì thiếu thông tin.",
  },
  {
    icon: Users,
    title: "Kết nối trực tiếp người mua",
    desc: "Chat và ký hợp đồng điện tử trực tiếp với doanh nghiệp, siêu thị, nhà hàng mà không qua trung gian.",
  },
  {
    icon: Sprout,
    title: "Đăng sản phẩm dễ dàng",
    desc: "Chụp ảnh, nhập sản lượng, chọn giá — đăng lên sàn chỉ trong 3 phút, ngay cả khi chưa quen công nghệ.",
  },
  {
    icon: Smartphone,
    title: "Hỗ trợ tiếng địa phương",
    desc: "Giao diện tiếng Việt đơn giản, hỗ trợ tiếng dân tộc tại một số tỉnh. Hotline tư vấn miễn phí 24/7.",
  },
];

const FARMER_STEPS = [
  {
    step: "01",
    title: "Đăng ký",
    desc: "Tạo tài khoản bằng số điện thoại — xác thực OTP, không cần email hay thẻ ngân hàng.",
  },
  {
    step: "02",
    title: "Đăng sản phẩm",
    desc: "Chụp ảnh nông sản, nhập sản lượng và giá bán. Hệ thống tự gợi ý giá theo thị trường hiện tại.",
  },
  {
    step: "03",
    title: "Nhận đơn hàng",
    desc: "Người mua đặt hàng trực tiếp. Nhận thanh toán qua ví điện tử hoặc chuyển khoản ngân hàng.",
  },
];

const COOP_BENEFITS = [
  {
    icon: Building2,
    title: "Quản lý thành viên HTX",
    desc: "Theo dõi sản lượng, đăng ký, và hợp đồng từng thành viên trong một dashboard tập trung, dễ dùng.",
  },
  {
    icon: TrendingUp,
    title: "Bán hàng tập thể",
    desc: "Gom đơn từ nhiều hộ thành viên, tạo lô hàng lớn để đàm phán giá tốt hơn với doanh nghiệp.",
  },
  {
    icon: BarChart,
    title: "Báo cáo sản lượng",
    desc: "Xuất báo cáo sản lượng theo tuần, tháng, mùa vụ — định dạng PDF / Excel, phục vụ đối tác và nhà nước.",
  },
  {
    icon: Handshake,
    title: "Kết nối doanh nghiệp lớn",
    desc: "AgriLink ưu tiên kết nối HTX với siêu thị, nhà máy chế biến, và nhà xuất khẩu trong mạng lưới đối tác.",
  },
];

const COOP_DASHBOARD = [
  {
    title: "Quản lý đơn hàng tập thể",
    desc: "Bảng điều khiển riêng cho ban quản trị: xem tổng sản lượng, doanh thu, thành viên hoạt động và đơn hàng đang chờ.",
  },
  {
    title: "Thống kê thành viên",
    desc: "Mỗi thành viên có profile riêng với lịch sử giao dịch, chứng nhận VietGAP/hữu cơ và điểm đánh giá từ người mua.",
  },
  {
    title: "Xuất báo cáo vùng trồng",
    desc: "Ký kết hợp đồng khung giữa HTX và doanh nghiệp trực tuyến, có giá trị pháp lý theo quy định hiện hành.",
  },
];

const BUYER_BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Nguồn gốc rõ ràng",
    desc: "Mỗi lô hàng có mã QR truy xuất nguồn gốc — biết chính xác vùng trồng, ngày thu hoạch, quy trình canh tác.",
  },
  {
    icon: DollarSign,
    title: "Giá cạnh tranh",
    desc: "Mua trực tiếp từ nông dân và HTX — loại bỏ 3–5 tầng trung gian, tiết kiệm 15–25% chi phí đầu vào.",
  },
  {
    icon: MapPin,
    title: "Kết nối vùng nguyên liệu",
    desc: "Bản đồ GIS 34 tỉnh thành — tìm và kết nối với vùng nguyên liệu phù hợp theo diện tích, sản lượng, mùa vụ.",
  },
  {
    icon: FileText,
    title: "Hợp đồng điện tử",
    desc: "Ký kết hợp đồng mua bán online có giá trị pháp lý, thanh toán qua nền tảng an toàn, có bảo đảm giao dịch.",
  },
];

const SUPPLIER_BENEFITS = [
  {
    icon: Users,
    title: "Tiếp cận 8.6 triệu nông dân",
    desc: "Đưa sản phẩm nông cụ, phân bón, thuốc BVTV đến tay người dùng cuối — không qua đại lý trung gian tốn kém.",
  },
  {
    icon: Megaphone,
    title: "Quảng bá sản phẩm",
    desc: "Tạo gian hàng số miễn phí, đăng ảnh, video demo và thông số kỹ thuật. Hiển thị trong kết quả tìm kiếm của nông dân.",
  },
  {
    icon: ShoppingCart,
    title: "Đặt hàng trực tuyến",
    desc: "Nhận đơn đặt hàng trực tiếp từ nông dân và HTX, xử lý thanh toán và xuất hóa đơn điện tử ngay trên nền tảng.",
  },
  {
    icon: BarChart,
    title: "Phân tích thị trường",
    desc: "Xem báo cáo nhu cầu theo mùa vụ, theo tỉnh thành — chủ động điều phối hàng tồn kho và kế hoạch phân phối.",
  },
];

// ─── Shared components ────────────────────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-surface-green text-primary mb-3">
      {children}
    </span>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-hairline p-5 hover:border-primary-light transition-all">
      <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center mb-4">
        <Icon size={20} className="text-primary" />
      </div>
      <h3 className="font-semibold text-ink mb-2 text-sm">{title}</h3>
      <p className="text-muted text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

function SectionDivider() {
  return <div className="h-px bg-primary/20 w-full" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ForPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero-gradient relative overflow-hidden py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Ai có thể dùng AgriLink?
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Nền tảng phục vụ toàn bộ chuỗi nông sản Việt Nam — từ nông dân đến doanh nghiệp xuất khẩu
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Nông dân", href: "#farmers" },
              { label: "Hợp tác xã", href: "#cooperatives" },
              { label: "Người mua", href: "#buyers" },
              { label: "Nhà cung cấp", href: "#suppliers" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="inline-block px-5 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-medium hover:bg-white/25 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Section 1: Farmers ── */}
      <section id="farmers" className="bg-white py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <Badge>Nông dân</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-ink mb-4 leading-tight">
                Dành cho Nông dân &amp; Hộ sản xuất
              </h2>
              <p className="text-muted text-base leading-relaxed mb-6">
                AgriLink miễn phí 100% trong 12 tháng đầu cho toàn bộ nông dân và hộ sản xuất. Bán được giá tốt hơn — trực tiếp đến tay người mua, không qua trung gian.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Đăng ký miễn phí <ArrowRight size={18} />
              </Link>
            </div>
            {/* Right: benefit grid */}
            <div className="grid grid-cols-2 gap-4">
              {FARMER_BENEFITS.map((b) => (
                <BenefitCard key={b.title} {...b} />
              ))}
            </div>
          </div>

          {/* 3 steps */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {FARMER_STEPS.map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center bg-surface-green/40 rounded-2xl border border-hairline p-6">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Section 2: Cooperatives ── */}
      <section id="cooperatives" className="py-20 scroll-mt-20" style={{ backgroundColor: "#F9FBF9" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: benefit grid */}
            <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
              {COOP_BENEFITS.map((b) => (
                <BenefitCard key={b.title} {...b} />
              ))}
            </div>
            {/* Right: text */}
            <div className="order-1 lg:order-2">
              <Badge>HTX</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-ink mb-4 leading-tight">
                Dành cho Hợp tác xã
              </h2>
              <p className="text-muted text-base leading-relaxed mb-6">
                Quản lý thành viên, tổng hợp sản lượng, và bán hàng tập thể — tất cả trong một nền tảng số miễn phí 12 tháng đầu cho HTX nông nghiệp.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Đăng ký cho HTX <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Dashboard features */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {COOP_DASHBOARD.map(({ title, desc }, i) => (
              <div key={title} className="bg-white rounded-2xl border border-hairline p-6">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm mb-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-muted text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Section 3: Buyers ── */}
      <section id="buyers" className="bg-white py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <Badge>Doanh nghiệp</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-ink mb-4 leading-tight">
                Dành cho Người mua &amp; Doanh nghiệp
              </h2>
              <p className="text-muted text-base leading-relaxed mb-6">
                Tìm nguồn nông sản đã xác minh, đàm phán giá trực tiếp với nông dân và HTX, ký hợp đồng điện tử — tất cả trên một nền tảng minh bạch và tin cậy.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Khám phá sàn nông sản <ArrowRight size={18} />
              </Link>
            </div>
            {/* Right: benefit grid */}
            <div className="grid grid-cols-2 gap-4">
              {BUYER_BENEFITS.map((b) => (
                <BenefitCard key={b.title} {...b} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── Section 4: Suppliers ── */}
      <section id="suppliers" className="py-20 scroll-mt-20" style={{ backgroundColor: "#F9FBF9" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: benefit grid */}
            <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
              {SUPPLIER_BENEFITS.map((b) => (
                <BenefitCard key={b.title} {...b} />
              ))}
            </div>
            {/* Right: text */}
            <div className="order-1 lg:order-2">
              <Badge>Nhà cung cấp</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-ink mb-4 leading-tight">
                Dành cho Nhà cung cấp Nông cụ &amp; Vật tư
              </h2>
              <p className="text-muted text-base leading-relaxed mb-6">
                Tiếp cận trực tiếp hàng triệu nông dân và HTX đang cần nông cụ, phân bón, thuốc bảo vệ thực vật — không tốn chi phí đại lý trung gian.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Mở gian hàng miễn phí <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Tham gia AgriLink ngay
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
            Miễn phí 12 tháng cho tất cả đối tượng. Không ràng buộc. Bắt đầu ngay hôm nay.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-xl hover:bg-surface-green transition-colors"
          >
            Tham gia AgriLink ngay <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
