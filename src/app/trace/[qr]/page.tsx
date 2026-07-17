import Link from "next/link";
import { Calendar, Package, Truck, CheckCircle, QrCode, Shield, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";

const TRACE_DATA = {
  qr_code: "QR-XOAI-TG-20250601-001",
  product_name: "Xoài cát Hòa Lộc loại 1",
  batch_code: "XOAI-TG-20250601-LO01",
  steps: [
    {
      id: 1,
      icon: "🌱",
      title: "Thông tin nông trại",
      status: "verified",
      date: "15/01/2025",
      items: [
        { label: "Tên HTX / Hộ sản xuất", value: "HTX Xoài Cát Tiền Giang" },
        { label: "Địa chỉ trang trại", value: "Xã Hòa Hưng, huyện Cái Bè, Tiền Giang" },
        { label: "Tọa độ GPS", value: "10.3957° N, 106.0044° E" },
        { label: "Diện tích canh tác", value: "5.2 ha" },
        { label: "Chứng nhận", value: "VietGAP, OCOP 4 sao 2024" },
      ],
    },
    {
      id: 2,
      icon: "🌿",
      title: "Lịch sử canh tác",
      status: "verified",
      date: "15/01/2025",
      items: [
        { label: "Ngày gieo trồng", value: "15/01/2025" },
        { label: "Giống cây", value: "Xoài cát Hòa Lộc — Nhân giống cành" },
        { label: "Phân bón sử dụng", value: "Phân hữu cơ vi sinh Biogro, NPK 16-16-8" },
        { label: "Thuốc BVTV", value: "Không sử dụng (canh tác VietGAP)" },
        { label: "Hệ thống tưới", value: "Tưới nhỏ giọt tự động" },
      ],
    },
    {
      id: 3,
      icon: "🥭",
      title: "Thu hoạch & Sơ chế",
      status: "verified",
      date: "15/06/2025",
      items: [
        { label: "Ngày thu hoạch", value: "15/06/2025" },
        { label: "Sản lượng lô này", value: "2.5 tấn" },
        { label: "Phương pháp sơ chế", value: "Rửa sạch → phân loại kích thước → đóng thùng" },
        { label: "Điều kiện bảo quản", value: "Kho lạnh 8°C — 12°C" },
        { label: "Đóng gói", value: "Thùng carton 10kg, màng co PE" },
      ],
    },
    {
      id: 4,
      icon: "🔬",
      title: "Kiểm định chất lượng",
      status: "verified",
      date: "17/06/2025",
      items: [
        { label: "Đơn vị kiểm nghiệm", value: "Chi cục Bảo vệ Thực vật tỉnh Tiền Giang" },
        { label: "Mã số kiểm nghiệm", value: "KN-TG-2025-0601-042" },
        { label: "Dư lượng thuốc BVTV", value: "Không phát hiện (ND)" },
        { label: "Kim loại nặng", value: "Dưới ngưỡng an toàn" },
        { label: "Kết luận", value: "✅ Đạt tiêu chuẩn VSATTP" },
      ],
    },
    {
      id: 5,
      icon: "🚛",
      title: "Vận chuyển",
      status: "in_transit",
      date: "20/06/2025",
      items: [
        { label: "Đơn vị vận chuyển", value: "Giao Hàng Nhanh (GHN)" },
        { label: "Mã vận đơn", value: "GHN-2025062000001" },
        { label: "Điểm xuất phát", value: "Kho HTX — Cái Bè, Tiền Giang" },
        { label: "Điểm đến", value: "Siêu thị Co.op Mart TP.HCM" },
        { label: "Nhiệt độ xe lạnh", value: "8°C — 12°C" },
      ],
    },
    {
      id: 6,
      icon: "🏪",
      title: "Phân phối",
      status: "pending",
      date: "—",
      items: [
        { label: "Đơn vị phân phối", value: "Co.opmart Việt Nam" },
        { label: "Điểm bán", value: "Chờ xác nhận" },
        { label: "Ngày đưa ra thị trường", value: "Dự kiến 22/06/2025" },
      ],
    },
  ],
};

const statusConfig = {
  verified: { label: "Đã xác thực", color: "text-primary", bg: "bg-primary", icon: CheckCircle },
  in_transit: { label: "Đang thực hiện", color: "text-[#1E40AF]", bg: "bg-[#1E40AF]", icon: Truck },
  pending: { label: "Chờ cập nhật", color: "text-muted", bg: "bg-muted-soft", icon: Package },
};

export default function TracePage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Header */}
      <div className="bg-surface-green border-b border-primary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl border-2 border-primary-light flex items-center justify-center shrink-0">
              <QrCode size={36} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="organic">✅ Đã xác thực nguồn gốc</Badge>
                <Badge variant="vietgap">VietGAP</Badge>
              </div>
              <h1 className="text-2xl font-bold text-ink">{TRACE_DATA.product_name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted flex-wrap">
                <span>Mã QR: <span className="font-mono font-semibold text-primary">{TRACE_DATA.qr_code}</span></span>
                <span>·</span>
                <span>Lô hàng: <span className="font-semibold text-ink">{TRACE_DATA.batch_code}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-lg font-bold text-ink mb-8 flex items-center gap-2">
          <Shield size={20} className="text-primary" />
          Hành trình từ nông trại đến bàn ăn
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-light" />

          <div className="flex flex-col gap-6">
            {TRACE_DATA.steps.map((step) => {
              const status = statusConfig[step.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              return (
                <div key={step.id} className="relative flex gap-6">
                  {/* Step indicator */}
                  <div className={`relative z-10 w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-2xl shrink-0 ${
                    step.status === "verified" ? "bg-surface-green" :
                    step.status === "in_transit" ? "bg-[#DBEAFE]" : "bg-surface-soft"
                  }`}>
                    {step.icon}
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 rounded-xl border p-5 mb-2 ${
                    step.status === "verified" ? "bg-white border-primary-light" :
                    step.status === "in_transit" ? "bg-white border-[#93C5FD]" :
                    "bg-surface-soft border-hairline opacity-70"
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-ink">{step.title}</h3>
                        <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                          <Calendar size={11} /> {step.date}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${status.color}`}>
                        <StatusIcon size={13} />
                        {status.label}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.items.map(({ label, value }) => (
                        <div key={label} className={`rounded-lg p-3 ${step.status === "pending" ? "bg-surface-strong" : "bg-surface-green"}`}>
                          <p className="text-[11px] text-muted mb-0.5">{label}</p>
                          <p className="text-sm font-medium text-ink">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 bg-surface-green rounded-2xl border border-primary-light p-6 text-center">
          <p className="text-muted text-sm mb-4">Muốn mua trực tiếp từ HTX này?</p>
          <Link href="/marketplace/1" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-active transition-colors">
            Xem sản phẩm trên sàn AgriLink <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
