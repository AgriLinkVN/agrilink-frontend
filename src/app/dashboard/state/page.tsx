"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ShieldCheck, Users, AlertTriangle, Award, Eye,
  Loader2, FileText, Building2, ChevronRight, Download,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { runtimeConfig, getApiBaseUrl } from "@/config/runtime-config";
const getToken = () => useAuthStore.getState().accessToken;

interface StateStats {
  activeUsers?: number;
  totalUsers?: number;
  openDisputes?: number;
  certificationsThisMonth?: number;
  pendingProfiles?: {
    total?: number;
  };
}

interface ProfileUser {
  fullName?: string | null;
  phone?: string | null;
}

type PendingProfileType = "farmer" | "cooperative" | "enterprise" | "supplier";

interface PendingProfile {
  id: string;
  cooperativeName?: string | null;
  companyName?: string | null;
  createdAt: string;
  user?: ProfileUser | null;
  _type: PendingProfileType;
}

type PendingProfilesResponse = Partial<Record<PendingProfileType, Array<Omit<PendingProfile, "_type">>>>;

interface Dispute {
  id: string;
  description?: string | null;
  incidentType?: string | null;
  createdAt: string;
}

interface PaginatedDisputes {
  data?: Dispute[];
}

function apiFetch<T>(path: string): Promise<T> {
  return api.get<T>(path, getToken());
}

const TYPE_LABEL: Record<string, string> = {
  farmer: "Nông dân", cooperative: "HTX", enterprise: "Doanh nghiệp", supplier: "Nhà cung cấp",
};
const TYPE_ICON: Record<string, string> = {
  farmer: "🌾", cooperative: "🏡", enterprise: "🏭", supplier: "📦",
};

export default function StateAgencyDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [exporting, setExporting] = useState(false);

  async function handleExportPdf() {
    setExporting(true);
    try {
      if (runtimeConfig.demoMode) {
        const blob = new Blob(
          ["AgriLink Demo\nBáo cáo hệ thống sử dụng dữ liệu mô phỏng."],
          { type: "text/plain;charset=utf-8" },
        );
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "agrilink-demo-system-report.txt";
        anchor.click();
        URL.revokeObjectURL(url);
        return;
      }
      const token = getToken();
      const res = await fetch(`${getApiBaseUrl()}/admin/reports/system.pdf`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `agrilink-system-report-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  const { data, isPending: loading } = useQuery({
    queryKey: ["state", "dashboard"],
    queryFn: async () => {
      const [statsRes, profilesRes, disputesRes] = await Promise.all([
        apiFetch<StateStats>("/admin/stats"),
        apiFetch<PendingProfilesResponse>("/admin/pending-profiles"),
        apiFetch<PaginatedDisputes | Dispute[]>("/admin/disputes?status=open&limit=5"),
      ]);

      const raw = profilesRes ?? {};
      const flat: PendingProfile[] = [
        ...(raw.cooperative ?? []).map((p) => ({ ...p, _type: "cooperative" as const })),
        ...(raw.enterprise ?? []).map((p) => ({ ...p, _type: "enterprise" as const })),
        ...(raw.farmer ?? []).map((p) => ({ ...p, _type: "farmer" as const })),
        ...(raw.supplier ?? []).map((p) => ({ ...p, _type: "supplier" as const })),
      ];
      return {
        stats: statsRes ?? null,
        pendingProfiles: flat.slice(0, 5),
        disputes: Array.isArray(disputesRes)
          ? disputesRes.slice(0, 5)
          : (disputesRes.data ?? []).slice(0, 5),
      };
    },
    staleTime: 30_000,
  });

  const stats = data?.stats ?? null;
  const pendingProfiles = data?.pendingProfiles ?? [];
  const disputes = data?.disputes ?? [];

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
      userName={user?.full_name ?? user?.phone ?? "Cơ quan nhà nước"}
      pageTitle="Quản lý & Giám sát"
      pageDescription="Dashboard cơ quan nhà nước — duyệt hồ sơ, xử lý tranh chấp, giám sát hệ thống"
      actions={
        <Button size="sm" variant="secondary" onClick={handleExportPdf} disabled={exporting}>
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Xuất báo cáo PDF
        </Button>
      }
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

          {/* Oversight quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <Link href="/dashboard/state/cooperatives"
              className="bg-white rounded-xl border border-hairline card-shadow p-5 flex items-center gap-3 hover:border-primary transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center shrink-0">
                <Building2 size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">Danh sách HTX & Doanh nghiệp</p>
                <p className="text-xs text-muted">Toàn bộ HTX/DN đã đăng ký</p>
              </div>
              <ChevronRight size={16} className="text-muted shrink-0" />
            </Link>
            <Link href="/dashboard/state/violations"
              className="bg-white rounded-xl border border-hairline card-shadow p-5 flex items-center gap-3 hover:border-primary transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">Sản phẩm vi phạm</p>
                <p className="text-xs text-muted">Sản phẩm bị khóa/từ chối</p>
              </div>
              <ChevronRight size={16} className="text-muted shrink-0" />
            </Link>
            <Link href="/dashboard/state/audit-logs"
              className="bg-white rounded-xl border border-hairline card-shadow p-5 flex items-center gap-3 hover:border-primary transition-colors">
              <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center shrink-0">
                <FileText size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">Audit log</p>
                <p className="text-xs text-muted">Lịch sử thao tác quản trị</p>
              </div>
              <ChevronRight size={16} className="text-muted shrink-0" />
            </Link>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
