import {
  Shield, Users, TrendingUp, MapPin, QrCode, Truck, Package,
  BarChart3, Zap, Building2, Globe, Star, Award, Heart,
  Sprout, ShoppingBag, Factory, Warehouse, Landmark, Navigation,
  Settings,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface RoleFeature {
  icon: React.ElementType;
  title: string;
  desc: string;
}

export interface RoleSection {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  headline: string;
  subline: string;
  features: RoleFeature[];
  cta: { label: string; href: string };
}

export const ROLE_SECTIONS: Record<UserRole, RoleSection> = {
  farmer: {
    color: "text-[#2D6A4F]",
    bgColor: "bg-[#F0FFF4]",
    borderColor: "border-[#52B788]",
    icon: Sprout,
    headline: "AgriLink — đồng hành cùng người nông dân",
    subline: "Bán trực tiếp, giá minh bạch, không qua thương lái trung gian.",
    features: [
      { icon: TrendingUp, title: "Giá thị trường thực tế", desc: "Xem giá nông sản theo ngày từ 63 tỉnh thành. Không bị ép giá nữa." },
      { icon: Package, title: "Đăng sản phẩm dễ dàng", desc: "Chụp ảnh, nhập thông tin, đăng lên sàn trong 5 phút. Hỗ trợ offline." },
      { icon: QrCode, title: "Mã QR truy xuất nguồn gốc", desc: "Tạo mã QR cho từng lô hàng. Người mua tin tưởng hơn, bán được giá cao hơn." },
      { icon: Shield, title: "Thanh toán bảo đảm Escrow", desc: "Tiền được giữ trung gian. Giao hàng thành công mới giải ngân." },
      { icon: Truck, title: "Kết nối logistics tận nơi", desc: "GHN, Viettel Post đến tận xã. Đơn hàng giao toàn quốc." },
      { icon: Users, title: "Tham gia HTX số", desc: "Kết hợp với hộ lân cận tạo lô hàng lớn. Bán giá tốt hơn cho doanh nghiệp." },
    ],
    cta: { label: "Bắt đầu bán hàng — Miễn phí", href: "/auth/register" },
  },
  cooperative: {
    color: "text-[#1D4ED8]",
    bgColor: "bg-[#EFF6FF]",
    borderColor: "border-[#93C5FD]",
    icon: Building2,
    headline: "AgriLink — nền tảng số hóa HTX nông nghiệp",
    subline: "Quản lý thành viên, tạo lô hàng tập thể, kết nối doanh nghiệp lớn.",
    features: [
      { icon: Users, title: "Quản lý thành viên số", desc: "Dashboard tổng hợp sản lượng, đóng góp và hiệu suất từng hộ thành viên." },
      { icon: Package, title: "Gom hàng tập thể", desc: "Kết hợp sản phẩm từ nhiều hộ thành lô hàng lớn. Tăng lợi thế đàm phán." },
      { icon: Award, title: "Chứng nhận tập thể", desc: "Quản lý VietGAP, GlobalGAP, OCOP cho cả HTX. Tự động nhắc gia hạn." },
      { icon: BarChart3, title: "Báo cáo sản lượng vụ mùa", desc: "Thống kê thu nhập, sản lượng, xu hướng giá theo từng vụ mùa." },
      { icon: Factory, title: "Kết nối doanh nghiệp lớn", desc: "Tiếp cận trực tiếp siêu thị, nhà máy chế biến, nhà nhập khẩu." },
      { icon: Globe, title: "Hỗ trợ xuất khẩu", desc: "Kiểm tra tiêu chuẩn xuất khẩu, kết nối đối tác nước ngoài qua AgriLink." },
    ],
    cta: { label: "Đăng ký HTX số", href: "/auth/register" },
  },
  buyer: {
    color: "text-[#D97706]",
    bgColor: "bg-[#FFFBEB]",
    borderColor: "border-[#FCD34D]",
    icon: ShoppingBag,
    headline: "AgriLink — mua nông sản sạch trực tiếp từ nông trại",
    subline: "Không qua trung gian, giá tốt hơn, nguồn gốc rõ ràng.",
    features: [
      { icon: QrCode, title: "Truy xuất nguồn gốc QR", desc: "Quét mã QR biết ngay ai trồng, ở đâu, canh tác thế nào — từ hạt giống đến bàn ăn." },
      { icon: MapPin, title: "Tìm theo vùng địa lý", desc: "Bản đồ GIS giúp tìm nguồn hàng gần nhất hoặc đặc sản từng vùng miền." },
      { icon: Shield, title: "Thanh toán Escrow an toàn", desc: "Tiền giữ trung gian. Hàng đến tay, kiểm tra hài lòng mới trả tiền." },
      { icon: Star, title: "Đánh giá minh bạch", desc: "Hệ thống review đa chiều từ người mua thực — không có đánh giá ảo." },
      { icon: Truck, title: "Theo dõi đơn hàng realtime", desc: "Tracking từ nông trại → điểm giao → tận tay bạn. Cập nhật mỗi 30 phút." },
      { icon: Heart, title: "Wishlist & tái đặt hàng", desc: "Lưu sản phẩm yêu thích, đặt hàng định kỳ từ nông trại quen thuộc." },
    ],
    cta: { label: "Khám phá sàn nông sản", href: "/marketplace" },
  },
  enterprise: {
    color: "text-[#7C3AED]",
    bgColor: "bg-[#F5F3FF]",
    borderColor: "border-[#C4B5FD]",
    icon: Factory,
    headline: "AgriLink — nguồn cung nông sản ổn định cho doanh nghiệp",
    subline: "Thu mua số lượng lớn, hợp đồng dài hạn, chuỗi cung ứng minh bạch.",
    features: [
      { icon: Package, title: "Đặt hàng số lượng lớn", desc: "Giao diện B2B chuyên biệt cho đơn hàng tấn, toa, container từ nhiều nguồn." },
      { icon: BarChart3, title: "Dự báo nguồn cung AI", desc: "AI dự báo sản lượng 4–8 tuần tới theo vùng. Lập kế hoạch mua hàng chủ động." },
      { icon: Award, title: "Kiểm tra chứng nhận tự động", desc: "Tự động xác minh VietGAP, GlobalGAP, HACCP trước khi ký hợp đồng." },
      { icon: Globe, title: "Kết nối vùng nguyên liệu", desc: "Bản đồ GIS hiển thị 34 vùng trọng điểm, sản lượng dự kiến, lịch thu hoạch." },
      { icon: Shield, title: "Hợp đồng điện tử", desc: "Ký hợp đồng số, escrow bảo đảm, tranh chấp xử lý trong 48h." },
      { icon: Truck, title: "Logistics tích hợp", desc: "Quản lý nhiều đơn vận chuyển cùng lúc. Dashboard theo dõi toàn bộ lô hàng." },
    ],
    cta: { label: "Liên hệ thu mua doanh nghiệp", href: "/contact" },
  },
  supplier: {
    color: "text-[#DC2626]",
    bgColor: "bg-[#FFF5F5]",
    borderColor: "border-[#FCA5A5]",
    icon: Warehouse,
    headline: "AgriLink — kênh phân phối vật tư nông nghiệp số",
    subline: "Tiếp cận 8.6 triệu hộ nông dân trên toàn quốc.",
    features: [
      { icon: Users, title: "Tiếp cận 8.6M hộ nông dân", desc: "Hiển thị sản phẩm vật tư trực tiếp trên app nông dân đang dùng hàng ngày." },
      { icon: MapPin, title: "Quảng cáo theo vùng địa lý", desc: "Nhắm mục tiêu theo tỉnh, vụ mùa, loại cây trồng — tiết kiệm chi phí quảng cáo." },
      { icon: BarChart3, title: "Analytics thị trường nông cụ", desc: "Dữ liệu nhu cầu vật tư theo mùa vụ, vùng miền giúp tối ưu tồn kho." },
      { icon: Star, title: "Review từ nông dân thực", desc: "Đánh giá xác thực từ người dùng thực tế. Xây dựng uy tín thương hiệu." },
      { icon: Package, title: "Quản lý đơn hàng tập trung", desc: "Dashboard một điểm quản lý tồn kho, đơn hàng, doanh thu từ AgriLink." },
      { icon: Zap, title: "Flash deal theo mùa vụ", desc: "Tạo chương trình khuyến mãi đúng thời điểm vào vụ gieo trồng, thu hoạch." },
    ],
    cta: { label: "Đăng ký bán vật tư", href: "/auth/register" },
  },
  state_agency: {
    color: "text-[#0369A1]",
    bgColor: "bg-[#F0F9FF]",
    borderColor: "border-[#7DD3FC]",
    icon: Landmark,
    headline: "AgriLink — dữ liệu nông nghiệp quốc gia minh bạch",
    subline: "Giám sát thị trường, quản lý chính sách, hỗ trợ ra quyết định.",
    features: [
      { icon: BarChart3, title: "Dashboard giám sát thị trường", desc: "Theo dõi giá nông sản, sản lượng, giao dịch theo thời gian thực trên toàn quốc." },
      { icon: MapPin, title: "Bản đồ GIS vùng nông nghiệp", desc: "Visualize toàn bộ 34 vùng trọng điểm, loại cây trồng, mùa vụ, diện tích canh tác." },
      { icon: TrendingUp, title: "Cập nhật giá thị trường", desc: "Quyền cập nhật giá tham chiếu chính thức theo từng tỉnh và loại nông sản." },
      { icon: Award, title: "Quản lý chứng nhận", desc: "Theo dõi tình trạng VietGAP, GlobalGAP, OCOP của từng HTX và hộ sản xuất." },
      { icon: Shield, title: "Phát hiện gian lận", desc: "Hệ thống cảnh báo tự động khi phát hiện biến động giá bất thường, hàng giả." },
      { icon: Globe, title: "Báo cáo xuất nhập khẩu", desc: "Thống kê xuất khẩu nông sản theo tháng, quý, năm — phục vụ hoạch định chính sách." },
    ],
    cta: { label: "Truy cập cổng nhà nước", href: "/dashboard/state" },
  },
  logistics: {
    color: "text-[#0F766E]",
    bgColor: "bg-[#F0FDFA]",
    borderColor: "border-[#5EEAD4]",
    icon: Navigation,
    headline: "AgriLink — mạng lưới logistics nông sản kết nối toàn quốc",
    subline: "Tối ưu tuyến đường, quản lý đơn hàng lạnh, tracking realtime.",
    features: [
      { icon: MapPin, title: "Tối ưu tuyến đường giao hàng", desc: "AI gợi ý lộ trình tối ưu cho đơn hàng nông sản dễ hỏng theo thời gian thực." },
      { icon: Truck, title: "Quản lý đội xe nông sản", desc: "Dashboard theo dõi toàn bộ đội xe, nhiệt độ khoang lạnh, trạng thái đơn." },
      { icon: Package, title: "Nhận đơn từ nhiều HTX", desc: "Một app nhận đơn hàng từ nhiều nông dân, HTX trong cùng tuyến đường." },
      { icon: Zap, title: "Giao hàng nhanh chóng", desc: "Tích hợp với GHN, Viettel Post. Cập nhật trạng thái tự động về AgriLink." },
      { icon: BarChart3, title: "Thống kê doanh thu tuyến", desc: "Báo cáo doanh thu, hiệu suất, chi phí nhiên liệu theo từng tuyến đường." },
      { icon: Shield, title: "Bảo hiểm hàng hoá", desc: "Kết nối bảo hiểm hàng hoá nông sản trong quá trình vận chuyển." },
    ],
    cta: { label: "Đăng ký đơn vị vận chuyển", href: "/auth/register" },
  },
  admin: {
    color: "text-[#374151]",
    bgColor: "bg-[#F9FAFB]",
    borderColor: "border-[#D1D5DB]",
    icon: Settings,
    headline: "AgriLink — hệ thống quản trị nền tảng",
    subline: "Toàn quyền kiểm soát người dùng, nội dung, giao dịch và cấu hình hệ thống.",
    features: [
      { icon: Users, title: "Quản lý người dùng", desc: "Xem, khoá, mở khoá tài khoản. Phân quyền vai trò. Audit log toàn bộ hoạt động." },
      { icon: Package, title: "Kiểm duyệt sản phẩm", desc: "Duyệt/từ chối sản phẩm đăng bán. Gắn nhãn chất lượng và cảnh báo vi phạm." },
      { icon: BarChart3, title: "Analytics nền tảng", desc: "Dashboard tổng hợp GMV, DAU, tỷ lệ chuyển đổi, tranh chấp theo thời gian thực." },
      { icon: Shield, title: "Xử lý tranh chấp", desc: "Queue tranh chấp có ưu tiên. Công cụ hoà giải và hoàn tiền tự động." },
      { icon: TrendingUp, title: "Quản lý quảng cáo", desc: "Duyệt banner, flash deal. Theo dõi hiệu quả chiến dịch quảng cáo của supplier." },
      { icon: Settings, title: "Cấu hình hệ thống", desc: "Feature flags, tỷ lệ hoa hồng, giới hạn throttle, cấu hình email/SMS/storage." },
    ],
    cta: { label: "Vào Admin Dashboard", href: "/dashboard/admin" },
  },
};

export const ALL_ROLES: { role: UserRole; label: string; icon: React.ElementType; color: string }[] = [
  { role: "farmer",       label: "Nông dân",         icon: Sprout,    color: "text-[#2D6A4F]" },
  { role: "cooperative",  label: "Hợp tác xã",       icon: Building2, color: "text-[#1D4ED8]" },
  { role: "buyer",        label: "Người mua",         icon: ShoppingBag, color: "text-[#D97706]" },
  { role: "enterprise",   label: "Doanh nghiệp",      icon: Factory,   color: "text-[#7C3AED]" },
  { role: "supplier",     label: "Nhà cung cấp",      icon: Warehouse, color: "text-[#DC2626]" },
  { role: "state_agency", label: "Cơ quan nhà nước",  icon: Landmark,  color: "text-[#0369A1]" },
  { role: "logistics",    label: "Logistics",          icon: Navigation, color: "text-[#0F766E]" },
];
