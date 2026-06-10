"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ShieldCheck, Users, AlertTriangle, Award, Check, X, Eye,
  Loader2, Clock, FileText, Building2, Tractor, ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
const getToken = () => useAuthStore.getState().accessToken;

function apiFetch(path: string) {
  const token = getToken();
  return fetch(`${API}/api/v1${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((r) => r.json());
}

const TYPE_LABEL: Record<string, string> = {
  farmer: "Nông dân", cooperative: "HTX", enterprise: "Doanh nghiệp", supplier: "Nhà cung cấp",
};
const TYPE_ICON: Record<string, string> = {
  farmer: "🌾", cooperative: "🏡", enterprise: "🏭", supplier: "📦",
};

export default function StateAgencyDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<any>(null);
  const [pendingProfiles, setPendingProfiles] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/admin/stats"),
      apiFetch("/admin/pending-profiles"),
      apiFetch("/admin/disputes?status=open&limit=5"),
    ]).then(([statsRes, profilesRes, disputesRes]) => {
      setStats(statsRes.data ?? statsRes);
      const raw = profilesRes.data ?? profilesRes;
      const flat: any[] = [
        ...(raw.cooperative ?? []).map((p: any) => ({ ...p, _type: "cooperative" })),
        ...(raw.enterprise ?? []).map((p: any) => ({ ...p, _type: "enterprise" })),
        ...(raw.farmer ?? []).map((p: any) => ({ ...p, _type: "farmer" })),
        ...(raw.supplier ?? []).map((p: any) => ({ ...p, _type: "supplier" })),
      ];
      setPendingProfiles(flat.slice(0, 5));
      const dr = disputesRes.data ?? disputesRes;
      setDisputes(Array.isArray(dr) ? dr.slice(0, 5) : (dr.data ?? []).slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    {
      title: "Chờ duyệt hồ sơ",
      value: String(stats.pendingProfiles?.total ?? "—"),
      subtitle: "HTX, DN, Nông dân, NCC",
      icon: ShieldCheck,
      variant: "green" as const,
    },
    {
      title: "Người dùng hoạt động",
      value: String(stats.activeUsers ?? "—"),
      subtitle: `Tổng: ${stats.totalUsers ?? "—"} tài khoản`,
      icon: Users,
      variant: "default" as const,
    },
    {
      title: "Tranh chấp đang mở",
      value: String(stats.openDisputes ?? "—"),
      subtitle: "Cần xử lý",
      icon: AlertTriangle,
      variant: "harvest" as const,
    },
    {
      title: "Chứng nhận tháng này",
      value: String(stats.certificationsThisMonth ?? "—"),
      subtitle: "VietGAP, OCOP, Hữu cơ",
      icon: Award,
      variant: "accent" as const,
    },
  ] : [];

  return (
    <DashboardLayout
      role="state_agency"
      userName={(user as any)?.fullName ?? "Cơ quan nhà nước"}
      pageTitle="Quản lý & Giám sát"
      pageDescription="Dashboard cơ quan nhà nước — duyệt hồ sơ, xử lý tranh chấp, giám sát hệ thống"
    >
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => <StatCard key={s.title} {...s} />)}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Pending profiles */}
            <div className="bg-white rounded-xl border border-hairline card-shadow">
              <div className="flex items-center justify-between p-5 border-b border-hairline">
                <h2 className="font-semibold text-ink flex items-center gap-2">
                  <FileText size={16} className="text-primary" /> Hàng chờ duyệt hồ sơ
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/state/approvals">Xem tất cả <ChevronRight size={14} /></Link>
                </Button>
              </div>
              {pendingProfiles.length === 0 ? (
                <div className="p-8 text-center text-muted text-sm">Không có hồ sơ chờ duyệt</div>
              ) : (
                <div className="divide-y divide-hairline">
                  {pendingProfiles.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-4 hover:bg-surface-soft transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center text-xl shrink-0">
                        {TYPE_ICON[item._type] ?? "📄"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">
                          {item.cooperativeName ?? item.companyName ?? item.user?.fullName ?? item.id}
                        </p>
                        <p className="text-xs text-muted">
                          {TYPE_LABEL[item._type]} · {item.user?.phone ?? "—"} · {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Link href={`/dashboard/state/approvals?highlight=${item.id}`}
                          className="w-8 h-8 rounded-lg border border-hairline flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors">
                          <Eye size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disputes */}
            <div className="bg-white rounded-xl border border-hairline card-shadow">
              <div className="flex items-center justify-between p-5 border-b border-hairline">
                <h2 className="font-semibold text-ink flex items-center gap-2">
                  <AlertTriangle size={16} className="text-warning" /> Tranh chấp cần xử lý
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/state/disputes">Xem tất cả <ChevronRight size={14} /></Link>
                </Button>
              </div>
              {disputes.length === 0 ? (
                <div className="p-8 text-center text-muted text-sm">Không có tranh chấp đang mở</div>
              ) : (
                <div className="divide-y divide-hairline">
                  {disputes.map((d) => (
                    <div key={d.id} className="p-4 hover:bg-surface-soft transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono text-muted">{d.id.slice(0, 8)}…</span>
                        <Badge variant="harvest">Đang mở</Badge>
                      </div>
                      <p className="text-sm font-semibold text-ink mb-0.5 line-clamp-1">{d.description ?? "—"}</p>
                      <p className="text-xs text-muted mb-3">{d.incidentType ?? "—"} · {new Date(d.createdAt).toLocaleDateString("vi-VN")}</p>
                      <Link href={`/dashboard/state/disputes?id=${d.id}`}>
                        <Button size="sm" variant="secondary" className="text-xs h-7 px-3">Xử lý</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
