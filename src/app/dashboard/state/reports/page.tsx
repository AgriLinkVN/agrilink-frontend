"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";
import {
  Loader2, Users, Package, AlertTriangle, Award,
  TrendingUp, Download, BarChart3, ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
const getToken = () => useAuthStore.getState().accessToken;

const MONTH_LABELS = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];

function MiniBar({ values, color = "bg-primary" }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {values.map((v, i) => (
        <div
          key={i}
          title={`${MONTH_LABELS[i]}: ${v}`}
          style={{ height: `${Math.round((v / max) * 100)}%` }}
          className={cn("flex-1 rounded-sm min-h-[4px] transition-all", color)}
        />
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    fetch(`${API}/api/v1/admin/stats`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((res) => setStats(res.data ?? res))
      .finally(() => setLoading(false));
  }, []);

  // Mock monthly trend data (replace with real endpoint when available)
  const mockMonthlyUsers   = [120,145,160,178,195,230,260,295,320,355,390,stats?.totalUsers ? Math.round(stats.totalUsers / 8) : 420];
  const mockMonthlyDisputes= [3,5,2,4,6,3,5,4,7,5,3,stats?.openDisputes ?? 7];
  const mockMonthlyCerts   = [12,15,10,18,22,19,25,28,30,35,38,stats?.certificationsThisMonth ?? 38];

  return (
    <DashboardLayout
      role="state_agency"
      userName={(user as any)?.fullName ?? "Cơ quan nhà nước"}
      pageTitle="Báo cáo & Thống kê"
      pageDescription="Tổng hợp dữ liệu giám sát hệ thống AgriLink theo tháng"
      actions={
        <button className="flex items-center gap-2 h-9 px-4 rounded-lg border border-hairline bg-white text-sm font-medium text-muted hover:text-ink hover:border-primary transition-colors">
          <Download size={15} /> Xuất CSV
        </button>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard title="Tổng người dùng" value={String(stats?.totalUsers ?? "—")} subtitle={`${stats?.activeUsers ?? "—"} đang hoạt động`} icon={Users} variant="green" />
            <StatCard title="Tổng sản phẩm" value={String(stats?.totalProducts ?? "—")} subtitle={`${stats?.pendingProducts ?? "—"} chờ duyệt`} icon={Package} variant="default" />
            <StatCard title="Tranh chấp đang mở" value={String(stats?.openDisputes ?? "—")} subtitle="Cần xử lý" icon={AlertTriangle} variant="harvest" />
            <StatCard title="Chứng nhận tháng này" value={String(stats?.certificationsThisMonth ?? "—")} subtitle="Đã cấp" icon={Award} variant="accent" />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* User growth */}
            <div className="bg-white rounded-xl border border-hairline card-shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-ink text-sm">Tăng trưởng người dùng</h3>
                  <p className="text-xs text-muted mt-0.5">12 tháng qua</p>
                </div>
                <Users size={18} className="text-primary" />
              </div>
              <MiniBar values={mockMonthlyUsers} color="bg-primary" />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-muted">T1</span>
                <span className="text-[10px] text-muted">T12</span>
              </div>
            </div>

            {/* Disputes trend */}
            <div className="bg-white rounded-xl border border-hairline card-shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-ink text-sm">Tranh chấp theo tháng</h3>
                  <p className="text-xs text-muted mt-0.5">12 tháng qua</p>
                </div>
                <AlertTriangle size={18} className="text-warning" />
              </div>
              <MiniBar values={mockMonthlyDisputes} color="bg-yellow-400" />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-muted">T1</span>
                <span className="text-[10px] text-muted">T12</span>
              </div>
            </div>

            {/* Certifications trend */}
            <div className="bg-white rounded-xl border border-hairline card-shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-ink text-sm">Chứng nhận cấp theo tháng</h3>
                  <p className="text-xs text-muted mt-0.5">12 tháng qua</p>
                </div>
                <Award size={18} className="text-primary" />
              </div>
              <MiniBar values={mockMonthlyCerts} color="bg-emerald-400" />
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-muted">T1</span>
                <span className="text-[10px] text-muted">T12</span>
              </div>
            </div>
          </div>

          {/* Profile breakdown table */}
          <div className="bg-white rounded-xl border border-hairline card-shadow">
            <div className="p-5 border-b border-hairline flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              <h3 className="font-semibold text-ink">Hồ sơ chờ duyệt theo loại</h3>
            </div>
            <div className="divide-y divide-hairline">
              {[
                { label: "Hợp tác xã (HTX)",      key: "cooperative", icon: "🏡" },
                { label: "Doanh nghiệp",           key: "enterprise",  icon: "🏭" },
                { label: "Nông dân",               key: "farmer",      icon: "🌾" },
                { label: "Nhà cung cấp vật tư",    key: "supplier",    icon: "📦" },
              ].map(({ label, key, icon }) => {
                const count = stats?.pendingProfiles?.[key] ?? 0;
                const total = stats?.pendingProfiles?.total ?? 1;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={key} className="flex items-center gap-4 px-5 py-3.5">
                    <span className="text-xl w-7 shrink-0">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-ink">{label}</span>
                        <span className="text-sm font-bold text-primary">{count}</span>
                      </div>
                      <div className="h-1.5 bg-surface-soft rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-muted w-10 text-right shrink-0">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit log note */}
          <div className="bg-surface-soft rounded-xl border border-hairline p-4 flex items-start gap-3">
            <BarChart3 size={18} className="text-muted shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-ink mb-0.5">Audit log chi tiết</p>
              <p className="text-xs text-muted">Lịch sử thao tác đầy đủ (duyệt hồ sơ, đổi cấu hình, xử lý tranh chấp) có thể xem tại dashboard Admin → Audit Logs.</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
