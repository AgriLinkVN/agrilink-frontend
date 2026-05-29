import { TrendingUp, QrCode, MapPin, ShieldCheck, Truck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    title: "Kết nối người mua – người bán",
    desc: "Liên hệ trực tiếp, đàm phán và thỏa thuận không qua trung gian. Minh bạch từ đầu đến cuối.",
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

export function FeaturesSection() {
  return (
    <section className="bg-surface-soft py-20">
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
  );
}
