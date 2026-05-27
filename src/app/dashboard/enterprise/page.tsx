import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge, OrderStatusBadge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingBag, Building2, TrendingUp, FileText, Plus, ArrowRight, MapPin } from "lucide-react";

const STATS = [
  { title: "Đơn mua đang xử lý", value: "7", subtitle: "Tổng 45 tấn", icon: ShoppingBag, variant: "green" as const },
  { title: "Nhà cung cấp hợp tác", value: "23", subtitle: "HTX & Nông dân", icon: Building2, variant: "default" as const },
  { title: "Chi tiêu tháng này", value: "1.2 tỷ đ", subtitle: "↑ 18% vs tháng trước", icon: TrendingUp, variant: "harvest" as const },
  { title: "Hợp đồng đang chạy", value: "5", subtitle: "Đến hạn tháng 8/2025", icon: FileText, variant: "accent" as const },
];

const PURCHASE_REQUESTS = [
  { id: "YC001", product: "Gạo trắng hạt dài", qty: 10000, unit: "kg", std: "VietGAP", deadline: "30/06/2025", matched: 3 },
  { id: "YC002", product: "Rau cải xanh", qty: 2000, unit: "kg", std: "Hữu cơ", deadline: "25/06/2025", matched: 5 },
  { id: "YC003", product: "Xoài cát xuất khẩu", qty: 5000, unit: "kg", std: "GlobalGAP", deadline: "15/07/2025", matched: 2 },
];

const ORDERS = [
  { id: "DH001", product: "Xoài cát Hòa Lộc", supplier: "HTX Tiền Giang", qty: 5000, unit: "kg", total: 225000000, status: "shipping" as const },
  { id: "DH002", product: "Gạo ST25", supplier: "Hộ Hồ Quang Cua", qty: 2000, unit: "kg", total: 56000000, status: "confirmed" as const },
  { id: "DH003", product: "Thanh long xuất khẩu", supplier: "HTX Bình Thuận", qty: 8000, unit: "kg", total: 280000000, status: "pending" as const },
];

export default function EnterpriseDashboardPage() {
  return (
    <DashboardLayout
      role="enterprise"
      userName="Cty TNHH Chế Biến Rau Quả VN"
      pageTitle="Tổng quan Doanh nghiệp"
      pageDescription="Quản lý yêu cầu mua, đơn hàng và hợp đồng nhà cung cấp"
      actions={
        <Button asChild>
          <Link href="/dashboard/enterprise/requests/new"><Plus size={16} /> Đăng yêu cầu mua</Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Purchase requests */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-hairline card-shadow">
            <div className="flex items-center justify-between p-5 border-b border-hairline">
              <h2 className="font-semibold text-ink">Yêu cầu mua đang mở</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/enterprise/requests">Xem tất cả</Link>
              </Button>
            </div>
            <div className="divide-y divide-hairline-soft">
              {PURCHASE_REQUESTS.map((req) => (
                <div key={req.id} className="p-4 hover:bg-surface-soft transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-ink">{req.product}</p>
                    <Badge variant="organic">{req.matched} nhà cung cấp</Badge>
                  </div>
                  <p className="text-xs text-muted">{req.qty.toLocaleString("vi-VN")} {req.unit} · {req.std} · Hạn: {req.deadline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-xl border border-hairline card-shadow">
            <div className="flex items-center justify-between p-5 border-b border-hairline">
              <h2 className="font-semibold text-ink">Đơn hàng gần đây</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/enterprise/orders">Xem tất cả <ArrowRight size={14} /></Link>
              </Button>
            </div>
            <div className="divide-y divide-hairline-soft">
              {ORDERS.map((o) => (
                <div key={o.id} className="flex items-center gap-4 p-4 hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center text-xl shrink-0">📦</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{o.product}</p>
                    <p className="text-xs text-muted">{o.supplier} · {o.qty.toLocaleString("vi-VN")} {o.unit}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{(o.total / 1000000).toFixed(0)}M đ</p>
                    <OrderStatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
