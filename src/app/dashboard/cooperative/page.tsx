import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge, OrderStatusBadge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, Package, TrendingUp, Calendar, Plus, ArrowRight, Check, Clock } from "lucide-react";

const STATS = [
  { title: "Thành viên hoạt động", value: "48", subtitle: "3 yêu cầu mới chờ duyệt", icon: Users, variant: "green" as const },
  { title: "Lô hàng đang mở", value: "6", subtitle: "Tổng 12.5 tấn", icon: Package, variant: "default" as const },
  { title: "Doanh thu tháng", value: "285M đ", subtitle: "↑ 22% so với tháng trước", icon: TrendingUp, variant: "harvest" as const, trend: { value: 22, label: "tháng trước" } },
  { title: "Lịch thu hoạch", value: "8", subtitle: "Sự kiện trong 30 ngày tới", icon: Calendar, variant: "accent" as const },
];

const MEMBERS = [
  { name: "Nguyễn Văn Hùng", product: "Xoài cát Hòa Lộc", qty: "2.5 tấn", status: "active" },
  { name: "Trần Thị Mai", product: "Bưởi da xanh", qty: "800 kg", status: "active" },
  { name: "Lê Văn Bình", product: "Xoài tứ quý", qty: "1.2 tấn", status: "active" },
  { name: "Phạm Thị Hoa", product: "Ổi lê Đài Loan", qty: "600 kg", status: "pending" },
];

const BULK_LISTINGS = [
  { id: "BL001", product: "Xoài cát Hòa Lộc tổng hợp", qty: 5000, unit: "kg", price: 43000, status: "shipping" as const, buyers: 3 },
  { id: "BL002", product: "Bưởi da xanh tuyển", qty: 2000, unit: "kg", price: 30000, status: "confirmed" as const, buyers: 1 },
  { id: "BL003", product: "Xoài cát mùa 2", qty: 8000, unit: "kg", price: 42000, status: "pending" as const, buyers: 0 },
];

export default function CooperativeDashboardPage() {
  return (
    <DashboardLayout
      role="cooperative"
      userName="HTX Xoài Cát Tiền Giang"
      pageTitle="Tổng quan HTX"
      pageDescription="Quản lý thành viên, lô hàng và báo cáo sản lượng"
      actions={
        <Button asChild>
          <Link href="/dashboard/cooperative/bulk-listings/new">
            <Plus size={16} /> Đăng lô hàng mới
          </Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      {/* Pending member requests */}
      <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-xl p-4 flex items-center gap-3 mb-6">
        <Clock size={18} className="text-[#854D0E] shrink-0" />
        <p className="text-sm text-[#854D0E]">
          <span className="font-semibold">3 nông dân</span> đang chờ duyệt tham gia HTX.
        </p>
        <Button size="sm" className="ml-auto shrink-0" asChild>
          <Link href="/dashboard/cooperative/members">Xem & Duyệt</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bulk listings */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-hairline card-shadow">
            <div className="flex items-center justify-between p-5 border-b border-hairline">
              <h2 className="font-semibold text-ink">Lô hàng lớn đang hoạt động</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/cooperative/bulk-listings">Xem tất cả <ArrowRight size={14} /></Link>
              </Button>
            </div>
            <div className="divide-y divide-hairline-soft">
              {BULK_LISTINGS.map((bl) => (
                <div key={bl.id} className="flex items-center gap-4 p-4 hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center text-xl shrink-0">📦</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink">{bl.product}</p>
                    <p className="text-xs text-muted">{bl.qty.toLocaleString("vi-VN")} {bl.unit} · {bl.price.toLocaleString("vi-VN")}đ/{bl.unit} · {bl.buyers} người mua</p>
                  </div>
                  <OrderStatusBadge status={bl.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Member list */}
        <div>
          <div className="bg-white rounded-xl border border-hairline card-shadow">
            <div className="flex items-center justify-between p-5 border-b border-hairline">
              <h2 className="font-semibold text-ink">Thành viên (48)</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/cooperative/members">Xem tất cả</Link>
              </Button>
            </div>
            <div className="divide-y divide-hairline-soft">
              {MEMBERS.map((m) => (
                <div key={m.name} className="flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink">{m.name}</p>
                    <p className="text-xs text-muted truncate">{m.product} · {m.qty}</p>
                  </div>
                  {m.status === "pending" ? (
                    <div className="flex gap-1">
                      <button className="w-7 h-7 rounded-lg bg-surface-green text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><Check size={13} /></button>
                    </div>
                  ) : (
                    <Badge variant="organic">Hoạt động</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
