import { TrendingUp, QrCode, MapPin, ShieldCheck, Truck, Zap, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FEATURES: { icon: LucideIcon; title: string; desc: string; accent: string }[] = [
  {
    icon: TrendingUp,
    title: "Giá thị trường thực tế",
    desc: "Cập nhật giá nông sản theo thời gian thực từ 63 tỉnh thành. AI dự báo xu hướng 2–4 tuần.",
    accent: "#52B788",
  },
  {
    icon: QrCode,
    title: "Truy xuất nguồn gốc QR",
    desc: "Quét mã QR để xem toàn bộ hành trình từ hạt giống → thu hoạch → bàn ăn của bạn.",
    accent: "#2D6A4F",
  },
  {
    icon: MapPin,
    title: "Bản đồ vùng nông sản",
    desc: "GIS số hóa 34 tỉnh trọng điểm. Tìm nguồn hàng theo vùng, mùa vụ, loại canh tác.",
    accent: "#40916C",
  },
  {
    icon: ShieldCheck,
    title: "Kết nối người mua – người bán",
    desc: "Liên hệ trực tiếp, đàm phán và thỏa thuận không qua trung gian. Minh bạch từ đầu đến cuối.",
    accent: "#1B4332",
  },
  {
    icon: Truck,
    title: "Kết nối logistics",
    desc: "Tích hợp GHN, Viettel Post, J&T. Tracking đơn hàng realtime từ nông trại đến cửa.",
    accent: "#52B788",
  },
  {
    icon: Zap,
    title: "Nền tảng offline-first",
    desc: "Hoạt động cả khi mạng yếu. Dữ liệu sync tự động khi có kết nối — phù hợp vùng nông thôn.",
    accent: "#2D6A4F",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-surface-soft py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge variant="organic" className="mb-4">Tính năng nền tảng</Badge>
          <h2 className="text-3xl font-bold text-ink mb-4">
            Hệ sinh thái số nông nghiệp toàn diện
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm leading-relaxed">
            Từ sàn giao dịch đến truy xuất nguồn gốc, bản đồ GIS đến AI dự báo giá —
            AgriLink giải quyết toàn bộ bài toán chuỗi giá trị nông sản.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, accent }) => (
            <div
              key={title}
              className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                boxShadow: "0 2px 12px rgba(45,106,79,0.07), 0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {/* Top-left quarter-circle accent */}
              <svg
                className="absolute top-0 left-0 w-36 h-36 transition-transform duration-500 group-hover:scale-105 origin-top-left"
                viewBox="0 0 144 144"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer arc */}
                <path d="M0 0 L144 0 Q144 144 0 144 Z" fill={accent} fillOpacity="0.07" />
                {/* Inner arc */}
                <path d="M0 0 L96 0 Q96 96 0 96 Z" fill={accent} fillOpacity="0.07" />
              </svg>

              {/* Icon — floats above accent, white bg pill */}
              <div className="relative z-10 p-6 pb-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 shadow-sm"
                  style={{ background: `${accent}15`, border: `1.5px solid ${accent}25` }}
                >
                  <Icon size={20} style={{ color: accent }} />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 px-6 pb-6">
                <h3 className="text-base font-bold text-ink mb-2 leading-snug">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>

                {/* Bottom accent line */}
                <div
                  className="mt-5 h-0.5 w-10 rounded-full transition-all duration-300 group-hover:w-16"
                  style={{ background: accent }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
