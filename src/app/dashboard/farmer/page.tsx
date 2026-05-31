import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge, FarmingBadge, OrderStatusBadge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Package, ShoppingBag, TrendingUp, Star, Plus,
  ArrowRight, MapPin, Calendar, AlertCircle
} from "lucide-react";

const STATS = [
  { title: "Sản phẩm đang bán", value: "12", subtitle: "3 chờ duyệt", icon: Package, variant: "green" as const },
  { title: "Đơn hàng tháng này", value: "38", subtitle: "↑ 15% so với tháng trước", icon: ShoppingBag, variant: "default" as const, trend: { value: 15, label: "tháng trước" } },
  { title: "Doanh thu tháng", value: "18.5M đ", subtitle: "Sau phí nền tảng", icon: TrendingUp, variant: "harvest" as const },
  { title: "Điểm tin cậy", value: "4.8 ★", subtitle: "234 đánh giá", icon: Star, variant: "accent" as const },
];

const RECENT_ORDERS = [
  { id: "DH001", product: "Xoài cát Hòa Lộc", buyer: "Cty TNHH Rau Sạch Hà Nội", qty: 500, unit: "kg", total: 22500000, status: "shipping" as const, date: "20/06/2025" },
  { id: "DH002", product: "Xoài cát Hòa Lộc", buyer: "Siêu thị Big C Đà Nẵng", qty: 200, unit: "kg", total: 9000000, status: "confirmed" as const, date: "19/06/2025" },
  { id: "DH003", product: "Xoài cát Hòa Lộc", buyer: "Hộ bà Nguyễn Thị Lan", qty: 20, unit: "kg", total: 900000, status: "completed" as const, date: "15/06/2025" },
  { id: "DH004", product: "Bưởi da xanh", buyer: "HTX Trái Cây Tiền Giang", qty: 100, unit: "kg", total: 3200000, status: "pending" as const, date: "21/06/2025" },
];

const MY_PRODUCTS = [
  { id: "1", name: "Xoài cát Hòa Lộc", type: "vietgap" as const, price: 45000, unit: "kg", stock: 500, status: "active", views: 1240 },
  { id: "2", name: "Bưởi da xanh", type: "vietgap" as const, price: 32000, unit: "kg", stock: 200, status: "active", views: 890 },
  { id: "3", name: "Ổi lê Đài Loan", type: "traditional" as const, price: 22000, unit: "kg", stock: 0, status: "out_of_stock", views: 450 },
];

export default function FarmerDashboardPage() {
  return (
    <DashboardLayout
      role="farmer"
      userName="Nguyễn Văn Hùng"
      pageTitle="Tổng quan"
      pageDescription="Chào buổi sáng, Anh Hùng! Hôm nay có 3 đơn hàng mới."
      actions={
        <Button asChild>
          <Link href="/dashboard/farmer/products/new">
            <Plus size={16} /> Đăng sản phẩm mới
          </Link>
        </Button>
      }
    >
      {/* Alert */}
      <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-xl p-4 flex items-start gap-3 mb-6">
        <AlertCircle size={18} className="text-[#854D0E] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#854D0E]">Hành động cần thiết</p>
          <p className="text-sm text-[#92400E]">Sản phẩm &quot;Ổi lê Đài Loan&quot; đã hết hàng. Cập nhật tồn kho để tiếp tục nhận đơn.</p>
        </div>
        <Button variant="ghost" size="sm" className="ml-auto shrink-0 text-[#854D0E] hover:bg-[#FEF08A]">
          Cập nhật
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-hairline card-shadow">
            <div className="flex items-center justify-between p-5 border-b border-hairline">
              <h2 className="font-semibold text-ink">Đơn hàng gần đây</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/farmer/orders">Xem tất cả <ArrowRight size={14} /></Link>
              </Button>
            </div>
            <div className="divide-y divide-hairline-soft">
              {RECENT_ORDERS.map((order) => (
                <div key={order.id} className="flex items-center gap-4 p-4 hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center text-xl shrink-0">🥭</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{order.product}</p>
                    <p className="text-xs text-muted truncate">{order.buyer} · {order.qty} {order.unit}</p>
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

        {/* My products */}
        <div>
          <div className="bg-white rounded-xl border border-hairline card-shadow">
            <div className="flex items-center justify-between p-5 border-b border-hairline">
              <h2 className="font-semibold text-ink">Sản phẩm của tôi</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/farmer/products">Xem tất cả</Link>
              </Button>
            </div>
            <div className="divide-y divide-hairline-soft">
              {MY_PRODUCTS.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center text-xl shrink-0">🥭</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <FarmingBadge type={p.type} />
                      <span className="text-xs text-muted">{p.price.toLocaleString("vi-VN")}đ/{p.unit}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-ink">{p.stock} {p.unit}</p>
                    <p className={`text-xs ${p.status === "out_of_stock" ? "text-error" : "text-primary"}`}>
                      {p.status === "out_of_stock" ? "Hết hàng" : "Đang bán"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-hairline">
              <Button variant="secondary" size="sm" className="w-full" asChild>
                <Link href="/dashboard/farmer/products/new"><Plus size={14} /> Thêm sản phẩm</Link>
              </Button>
            </div>
          </div>

          {/* Market price preview */}
          <div className="bg-surface-green rounded-xl border border-primary-light p-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-ink">Giá thị trường hôm nay</h3>
              <Link href="/prices" className="text-xs text-primary hover:underline">Xem chi tiết</Link>
            </div>
            {[
              { name: "Xoài cát", price: "45,000–52,000", unit: "đ/kg", trend: "+5%" },
              { name: "Sầu riêng", price: "85,000–95,000", unit: "đ/kg", trend: "+8%" },
              { name: "Bưởi da xanh", price: "30,000–35,000", unit: "đ/kg", trend: "-2%" },
            ].map(({ name, price, unit, trend }) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-primary-light last:border-0">
                <span className="text-sm text-ink">{name}</span>
                <div className="text-right">
                  <span className="text-xs font-semibold text-ink">{price} {unit}</span>
                  <span className={`ml-2 text-xs font-bold ${trend.startsWith("+") ? "text-primary" : "text-error"}`}>{trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
