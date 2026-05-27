import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, Package, AlertTriangle, Megaphone, TrendingUp, ShieldCheck, Lock, Check, X, Eye } from "lucide-react";

const STATS = [
  { title: "Tổng người dùng", value: "2,847", subtitle: "+124 tuần này", icon: Users, variant: "green" as const },
  { title: "Sản phẩm chờ duyệt", value: "43", subtitle: "12 mới hôm nay", icon: Package, variant: "default" as const },
  { title: "Tranh chấp chờ xử lý", value: "7", subtitle: "3 khẩn cấp", icon: AlertTriangle, variant: "harvest" as const },
  { title: "Quảng cáo chờ duyệt", value: "5", subtitle: "Nhà cung cấp gửi", icon: Megaphone, variant: "accent" as const },
];

const RECENT_USERS = [
  { name: "Nguyễn Văn A", role: "farmer", province: "Tiền Giang", joined: "21/06/2025", status: "pending" },
  { name: "HTX Rau Sạch Đà Lạt", role: "cooperative", province: "Lâm Đồng", joined: "20/06/2025", status: "active" },
  { name: "Cty TNHH Xuất Khẩu XYZ", role: "enterprise", province: "TP.HCM", joined: "20/06/2025", status: "pending" },
  { name: "Trần Thị Bích", role: "buyer", province: "Hà Nội", joined: "19/06/2025", status: "active" },
];

const ROLE_LABELS: Record<string, string> = {
  farmer: "Nông dân", cooperative: "HTX", buyer: "Người mua", enterprise: "Doanh nghiệp", supplier: "NCC", admin: "Admin"
};

const PRODUCTS_PENDING = [
  { name: "Xoài cát Hòa Lộc loại 1", seller: "HTX TG", price: 45000, unit: "kg", submitted: "21/06/2025" },
  { name: "Gạo nếp đặc sản", seller: "Hộ ông Bình", price: 35000, unit: "kg", submitted: "21/06/2025" },
  { name: "Cà phê chồn Buôn Ma Thuột", seller: "Nông trại ABC", price: 250000, unit: "kg", submitted: "20/06/2025" },
];

const SYSTEM_HEALTH = [
  { label: "API response time", value: "145ms", status: "good" },
  { label: "DB connections", value: "48/100", status: "good" },
  { label: "Storage used", value: "234GB / 1TB", status: "good" },
  { label: "Active sessions", value: "1,240", status: "good" },
];

export default function AdminDashboardPage() {
  return (
    <DashboardLayout
      role="admin"
      userName="Admin AgriLink"
      pageTitle="Admin Panel"
      pageDescription="Quản lý toàn hệ thống AgriLink Vietnam"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent users */}
        <div className="bg-white rounded-xl border border-hairline card-shadow">
          <div className="flex items-center justify-between p-5 border-b border-hairline">
            <h2 className="font-semibold text-ink">Người dùng mới</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/admin/users">Quản lý</Link>
            </Button>
          </div>
          <div className="divide-y divide-hairline-soft">
            {RECENT_USERS.map((u) => (
              <div key={u.name} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{u.name}</p>
                  <p className="text-xs text-muted">{ROLE_LABELS[u.role]} · {u.province}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {u.status === "pending" ? (
                    <>
                      <button className="w-7 h-7 rounded bg-surface-green text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><Check size={12} /></button>
                      <button className="w-7 h-7 rounded bg-[#FEE2E2] text-error flex items-center justify-center hover:bg-error hover:text-white transition-colors"><X size={12} /></button>
                    </>
                  ) : (
                    <button className="w-7 h-7 rounded border border-hairline text-muted flex items-center justify-center hover:border-error hover:text-error transition-colors"><Lock size={12} /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products pending */}
        <div className="bg-white rounded-xl border border-hairline card-shadow">
          <div className="flex items-center justify-between p-5 border-b border-hairline">
            <h2 className="font-semibold text-ink">Sản phẩm chờ duyệt</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/admin/products">Xem tất cả</Link>
            </Button>
          </div>
          <div className="divide-y divide-hairline-soft">
            {PRODUCTS_PENDING.map((p) => (
              <div key={p.name} className="p-4 hover:bg-surface-soft transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-ink truncate">{p.name}</p>
                  <span className="text-xs font-bold text-primary shrink-0 ml-2">{p.price.toLocaleString("vi-VN")}đ/{p.unit}</span>
                </div>
                <p className="text-xs text-muted mb-3">{p.seller} · {p.submitted}</p>
                <div className="flex gap-2">
                  <button className="flex-1 h-7 rounded-lg bg-surface-green text-primary text-xs font-semibold flex items-center justify-center gap-1 hover:bg-primary hover:text-white transition-colors">
                    <Check size={12} /> Duyệt
                  </button>
                  <button className="flex-1 h-7 rounded-lg bg-[#FEE2E2] text-error text-xs font-semibold flex items-center justify-center gap-1 hover:bg-error hover:text-white transition-colors">
                    <X size={12} /> Từ chối
                  </button>
                  <button className="w-7 h-7 rounded-lg border border-hairline text-muted flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                    <Eye size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System health */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-hairline card-shadow p-5">
            <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" /> Sức khỏe hệ thống
            </h2>
            <div className="flex flex-col gap-3">
              {SYSTEM_HEALTH.map(({ label, value, status }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-muted">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{value}</span>
                    <div className={`w-2 h-2 rounded-full ${status === "good" ? "bg-primary" : "bg-error"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-hairline card-shadow p-5">
            <h2 className="font-semibold text-ink mb-4">Thao tác nhanh</h2>
            <div className="flex flex-col gap-2">
              {[
                { label: "Quản lý người dùng", href: "/dashboard/admin/users" },
                { label: "Duyệt sản phẩm (43)", href: "/dashboard/admin/products" },
                { label: "Xử lý tranh chấp (7)", href: "/dashboard/admin/disputes" },
                { label: "Duyệt quảng cáo (5)", href: "/dashboard/admin/ads" },
                { label: "Cấu hình hệ thống", href: "/dashboard/admin/config" },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-surface-green transition-colors text-sm text-ink hover:text-primary">
                  {label}
                  <span className="text-muted">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
