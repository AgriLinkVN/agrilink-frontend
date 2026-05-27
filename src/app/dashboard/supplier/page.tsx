import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Package, Megaphone, TrendingUp, BarChart3, Plus, Eye, MousePointer } from "lucide-react";

const STATS = [
  { title: "Sản phẩm đang bán", value: "34", subtitle: "5 chờ duyệt", icon: Package, variant: "green" as const },
  { title: "Chiến dịch quảng cáo", value: "3", subtitle: "2 đang chạy", icon: Megaphone, variant: "default" as const },
  { title: "Doanh thu tháng", value: "95M đ", subtitle: "↑ 12% vs tháng trước", icon: TrendingUp, variant: "harvest" as const },
  { title: "Lượt xem tổng", value: "28.5K", subtitle: "Tháng 6/2025", icon: BarChart3, variant: "accent" as const },
];

const PRODUCTS = [
  { name: "Phân NPK 16-16-8 Đầu Trâu", price: 320000, unit: "bao 25kg", stock: 500, status: "active", views: 1240 },
  { name: "Thuốc trừ sâu sinh học Abamectin", price: 85000, unit: "chai 100ml", stock: 200, status: "active", views: 890 },
  { name: "Máy phun thuốc điện 16L", price: 1200000, unit: "cái", stock: 45, status: "active", views: 560 },
  { name: "Hạt giống dưa leo F1 Thái Lan", price: 45000, unit: "gói 10g", stock: 0, status: "out_of_stock", views: 320 },
];

const ADS = [
  { name: "Chiến dịch phân bón tháng 6", type: "banner", impressions: 12400, clicks: 340, status: "active", end_date: "30/06/2025" },
  { name: "Nổi bật — Máy phun thuốc", type: "featured", impressions: 5600, clicks: 180, status: "active", end_date: "25/06/2025" },
  { name: "Hạt giống F1 — Tháng 5", type: "spotlight", impressions: 8900, clicks: 290, status: "ended", end_date: "31/05/2025" },
];

export default function SupplierDashboardPage() {
  return (
    <DashboardLayout
      role="supplier"
      userName="Cty Vật Tư Nông Nghiệp XYZ"
      pageTitle="Tổng quan Nhà cung cấp"
      pageDescription="Quản lý sản phẩm nông cụ và chiến dịch quảng cáo"
      actions={
        <Button asChild>
          <Link href="/dashboard/supplier/products/new"><Plus size={16} /> Thêm sản phẩm</Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Products */}
        <div className="bg-white rounded-xl border border-hairline card-shadow">
          <div className="flex items-center justify-between p-5 border-b border-hairline">
            <h2 className="font-semibold text-ink">Sản phẩm của tôi</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/supplier/products">Xem tất cả</Link>
            </Button>
          </div>
          <div className="divide-y divide-hairline-soft">
            {PRODUCTS.map((p) => (
              <div key={p.name} className="flex items-center gap-3 p-4 hover:bg-surface-soft transition-colors">
                <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center text-xl shrink-0">🌿</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{p.name}</p>
                  <p className="text-xs text-muted">{p.price.toLocaleString("vi-VN")}đ/{p.unit} · Còn {p.stock}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-xs text-muted justify-end mb-1">
                    <Eye size={11} />{p.views.toLocaleString("vi-VN")}
                  </div>
                  <span className={`text-xs font-semibold ${p.status === "out_of_stock" ? "text-error" : "text-primary"}`}>
                    {p.status === "out_of_stock" ? "Hết hàng" : "Đang bán"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ad campaigns */}
        <div className="bg-white rounded-xl border border-hairline card-shadow">
          <div className="flex items-center justify-between p-5 border-b border-hairline">
            <h2 className="font-semibold text-ink">Chiến dịch quảng cáo</h2>
            <Button size="sm" asChild>
              <Link href="/dashboard/supplier/ads/new"><Plus size={14} /> Tạo chiến dịch</Link>
            </Button>
          </div>
          <div className="divide-y divide-hairline-soft">
            {ADS.map((ad) => (
              <div key={ad.name} className="p-4 hover:bg-surface-soft transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-ink">{ad.name}</p>
                  <Badge variant={ad.status === "active" ? "organic" : "traditional"}>
                    {ad.status === "active" ? "Đang chạy" : "Đã kết thúc"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1"><Eye size={11} />{ad.impressions.toLocaleString("vi-VN")} lượt xem</span>
                  <span className="flex items-center gap-1"><MousePointer size={11} />{ad.clicks} clicks</span>
                  <span>CTR: {((ad.clicks / ad.impressions) * 100).toFixed(1)}%</span>
                </div>
                <p className="text-xs text-muted mt-1">Kết thúc: {ad.end_date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
