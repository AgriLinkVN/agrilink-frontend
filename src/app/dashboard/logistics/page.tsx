import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/ui/badge";
import Link from "next/link";
import { Truck, Package, CheckCircle, TrendingUp, MapPin, Clock, Check } from "lucide-react";

const STATS = [
  { title: "Đơn cần lấy hàng", value: "8", subtitle: "Hôm nay", icon: Package, variant: "green" as const },
  { title: "Đang vận chuyển", value: "15", subtitle: "Trên đường giao", icon: Truck, variant: "default" as const },
  { title: "Hoàn thành hôm nay", value: "12", subtitle: "Tỷ lệ thành công 98%", icon: CheckCircle, variant: "harvest" as const },
  { title: "Doanh thu tuần", value: "4.2M đ", subtitle: "↑ 8% vs tuần trước", icon: TrendingUp, variant: "accent" as const },
];

const PICKUPS = [
  { id: "VD001", product: "Xoài cát Hòa Lộc", seller: "HTX Xoài TG — Cái Bè", buyer: "BigC Đà Nẵng", weight: "500 kg", pickup_time: "08:00 — 21/06", status: "pending" as const },
  { id: "VD002", product: "Gạo ST25", seller: "Hộ Hồ Quang Cua — Sóc Trăng", buyer: "Co.opmart HCM", weight: "1000 kg", pickup_time: "10:00 — 21/06", status: "confirmed" as const },
  { id: "VD003", product: "Rau hữu cơ", seller: "Nông trại Xanh — Đà Lạt", buyer: "Bếp xanh Hà Nội", weight: "200 kg", pickup_time: "14:00 — 21/06", status: "pending" as const },
];

const ACTIVE_DELIVERIES = [
  { id: "GH001", product: "Thanh long Bình Thuận", route: "Bình Thuận → TP.HCM", eta: "17:00 hôm nay", weight: "800 kg", progress: 65 },
  { id: "GH002", product: "Cà phê Lâm Đồng", route: "Đà Lạt → Hà Nội", eta: "06:00 ngày mai", weight: "300 kg", progress: 30 },
  { id: "GH003", product: "Xoài cát Tiền Giang", route: "Tiền Giang → Đà Nẵng", eta: "20:00 hôm nay", weight: "500 kg", progress: 80 },
];

export default function LogisticsDashboardPage() {
  return (
    <DashboardLayout
      role="logistics"
      userName="GHN — Tài xế Văn Tài"
      pageTitle="Tổng quan Logistics"
      pageDescription="Đơn cần lấy và trạng thái giao hàng hôm nay"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pickup list */}
        <div className="bg-white rounded-xl border border-hairline card-shadow">
          <div className="flex items-center justify-between p-5 border-b border-hairline">
            <h2 className="font-semibold text-ink flex items-center gap-2">
              <Package size={18} className="text-primary" /> Đơn cần lấy hàng
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/logistics/pickups">Xem tất cả</Link>
            </Button>
          </div>
          <div className="divide-y divide-hairline-soft">
            {PICKUPS.map((p) => (
              <div key={p.id} className="p-4 hover:bg-surface-soft transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-ink">{p.product}</p>
                  <OrderStatusBadge status={p.status} />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted mb-1">
                  <MapPin size={11} className="text-primary shrink-0" />
                  <span className="truncate">{p.seller}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1"><Clock size={11} />{p.pickup_time}</span>
                    <span>{p.weight}</span>
                  </div>
                  <Button size="sm" className="text-xs h-7 px-3">
                    <Check size={12} /> Xác nhận
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active deliveries */}
        <div className="bg-white rounded-xl border border-hairline card-shadow">
          <div className="flex items-center justify-between p-5 border-b border-hairline">
            <h2 className="font-semibold text-ink flex items-center gap-2">
              <Truck size={18} className="text-primary" /> Đang vận chuyển
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/logistics/active">Xem tất cả</Link>
            </Button>
          </div>
          <div className="divide-y divide-hairline-soft">
            {ACTIVE_DELIVERIES.map((d) => (
              <div key={d.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-ink">{d.product}</p>
                  <span className="text-xs font-semibold text-primary">{d.progress}%</span>
                </div>
                <p className="text-xs text-muted flex items-center gap-1 mb-2">
                  <MapPin size={11} className="text-primary" />{d.route}
                </p>
                {/* Progress bar */}
                <div className="h-1.5 bg-surface-strong rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${d.progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1"><Clock size={11} />ETA: {d.eta}</span>
                  <span>{d.weight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
