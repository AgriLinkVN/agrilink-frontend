import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingBag, MapPin, Star, TrendingUp, ArrowRight, Search, Heart } from "lucide-react";

const STATS = [
  { title: "Đơn mua tháng này", value: "15", subtitle: "2 đang giao hàng", icon: ShoppingBag, variant: "green" as const },
  { title: "Tổng chi tiêu", value: "142M đ", subtitle: "Tháng 6/2025", icon: TrendingUp, variant: "harvest" as const },
  { title: "Nhà cung cấp", value: "8", subtitle: "Đã hợp tác", icon: MapPin, variant: "default" as const },
  { title: "Đánh giá trung bình", value: "4.7 ★", subtitle: "Từ 15 đơn hàng", icon: Star, variant: "accent" as const },
];

const RECENT_ORDERS = [
  { id: "DH001", product: "Xoài cát Hòa Lộc", seller: "HTX Xoài Cát TG", qty: 500, unit: "kg", total: 22500000, status: "shipping" as const, date: "20/06/2025" },
  { id: "DH002", product: "Gạo ST25 Sóc Trăng", seller: "Hộ Hồ Quang Cua", qty: 1000, unit: "kg", total: 28000000, status: "confirmed" as const, date: "18/06/2025" },
  { id: "DH003", product: "Rau hữu cơ Đà Lạt", seller: "Nông trại Xanh", qty: 200, unit: "kg", total: 5000000, status: "completed" as const, date: "10/06/2025" },
];

const WISHLIST = [
  { name: "Sầu riêng Ri6", province: "Tiền Giang", price: 85000, unit: "kg", icon: "🥝" },
  { name: "Cà phê Arabica", province: "Lâm Đồng", price: 120000, unit: "kg", icon: "☕" },
  { name: "Thanh long ruột đỏ", province: "Bình Thuận", price: 35000, unit: "kg", icon: "🍈" },
];

export default function BuyerDashboardPage() {
  return (
    <DashboardLayout
      role="buyer"
      userName="Cty TNHH Rau Sạch HN"
      pageTitle="Tổng quan"
      pageDescription="Quản lý đơn mua và tìm kiếm nguồn hàng nông sản"
      actions={
        <Button asChild>
          <Link href="/marketplace"><Search size={16} /> Tìm nguồn hàng</Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-hairline card-shadow">
            <div className="flex items-center justify-between p-5 border-b border-hairline">
              <h2 className="font-semibold text-ink">Đơn hàng gần đây</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/buyer/orders">Xem tất cả <ArrowRight size={14} /></Link>
              </Button>
            </div>
            <div className="divide-y divide-hairline-soft">
              {RECENT_ORDERS.map((order) => (
                <div key={order.id} className="flex items-center gap-4 p-4 hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center text-xl shrink-0">🛒</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{order.product}</p>
                    <p className="text-xs text-muted">{order.seller} · {order.qty} {order.unit}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{(order.total / 1000000).toFixed(1)}M đ</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-hairline card-shadow">
            <div className="flex items-center justify-between p-5 border-b border-hairline">
              <h2 className="font-semibold text-ink flex items-center gap-2"><Heart size={16} className="text-error" /> Yêu thích</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/buyer/wishlist">Xem tất cả</Link>
              </Button>
            </div>
            <div className="divide-y divide-hairline-soft">
              {WISHLIST.map((p) => (
                <Link key={p.name} href="/marketplace" className="flex items-center gap-3 p-4 hover:bg-surface-soft transition-colors">
                  <span className="text-xl shrink-0">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{p.name}</p>
                    <p className="text-xs text-muted flex items-center gap-1"><MapPin size={10} />{p.province}</p>
                  </div>
                  <span className="text-sm font-bold text-primary shrink-0">{p.price.toLocaleString("vi-VN")}đ</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-surface-green rounded-xl border border-primary-light p-4">
            <h3 className="text-sm font-semibold text-ink mb-2">Khám phá bản đồ vùng</h3>
            <p className="text-xs text-muted mb-3">Tìm nguồn hàng theo địa lý, mùa vụ và loại canh tác</p>
            <Button variant="secondary" size="sm" className="w-full" asChild>
              <Link href="/map"><MapPin size={14} /> Mở bản đồ GIS</Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
