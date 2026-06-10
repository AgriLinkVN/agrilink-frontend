"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Loader2, AlertTriangle, Search, CheckCircle2, AlertCircle,
  Clock, CheckCheck, ChevronDown, ChevronUp, Calendar, FileText,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
const getToken = () => useAuthStore.getState().accessToken;

type StatusFilter = "all" | "open" | "in_progress" | "resolved";

const STATUS_TABS: { label: string; value: StatusFilter; color: string }[] = [
  { label: "Tất cả",       value: "all",         color: "" },
  { label: "Đang mở",      value: "open",        color: "text-error" },
  { label: "Đang xử lý",   value: "in_progress", color: "text-warning" },
  { label: "Đã giải quyết",value: "resolved",    color: "text-primary" },
];

const STATUS_BADGE: Record<string, { label: string; variant: any }> = {
  open:        { label: "Đang mở",      variant: "harvest" },
  in_progress: { label: "Đang xử lý",   variant: "traditional" },
  resolved:    { label: "Đã giải quyết",variant: "vietgap" },
};

const INCIDENT_TYPE_LABEL: Record<string, string> = {
  quality_issue:   "Chất lượng sản phẩm",
  delivery_delay:  "Giao hàng chậm",
  wrong_product:   "Sai sản phẩm",
  payment_dispute: "Tranh chấp thanh toán",
  fraud:           "Gian lận",
  other:           "Khác",
};

interface Dispute {
  id: string;
  shipmentId: string;
  reportedBy: string;
  incidentType: string;
  description: string;
  evidenceUrls: string[];
  status: string;
  resolvedAt: string | null;
  createdAt: string;
}

export default function DisputesPage() {
  const user = useAuthStore((s) => s.user);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [total, setTotal] = useState(0);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const loadDisputes = useCallback(() => {
    setLoading(true);
    const token = getToken();
    const query = statusFilter !== "all" ? `?status=${statusFilter}&limit=50` : "?limit=50";
    fetch(`${API}/api/v1/admin/disputes${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((res) => {
        const raw = res.data ?? res;
        const list = Array.isArray(raw) ? raw : (raw.data ?? []);
        setDisputes(list);
        setTotal(raw.total ?? list.length);
      })
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => { loadDisputes(); }, [loadDisputes]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setActionLoading(id);
    const token = getToken();
    try {
      const res = await fetch(`${API}/api/v1/admin/disputes/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Cập nhật thất bại");
      showToast("success", `Đã chuyển trạng thái sang: ${STATUS_BADGE[newStatus]?.label ?? newStatus}`);
      loadDisputes();
      setExpandedId(null);
    } catch (e: any) {
      showToast("error", e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = disputes.filter((d) => {
    if (!search) return true;
    return (
      d.description?.toLowerCase().includes(search.toLowerCase()) ||
      d.incidentType?.toLowerCase().includes(search.toLowerCase()) ||
      d.id.includes(search)
    );
  });

  return (
    <DashboardLayout
      role="state_agency"
      userName={(user as any)?.fullName ?? "Cơ quan nhà nước"}
      pageTitle="Tranh chấp & Sự cố"
      pageDescription="Theo dõi và xử lý các tranh chấp được báo cáo trên hệ thống"
    >
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border",
          toast.type === "success"
            ? "bg-surface-green text-primary border-primary/20"
            : "bg-red-50 text-error border-error/20"
        )}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Status tabs */}
      <div className="flex gap-1 bg-surface-soft p-1 rounded-xl border border-hairline mb-5 w-fit">
        {STATUS_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-colors",
              statusFilter === value ? "bg-white text-primary shadow-sm" : "text-muted hover:text-ink"
            )}
          >
            {label}
            {value !== "all" && (
              <span className="ml-1.5 text-[10px] bg-primary/10 text-primary rounded-full px-1.5 py-0.5 font-bold">
                {disputes.filter((d) => d.status === value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 h-10 px-3.5 rounded-lg border border-border-strong bg-white mb-5 max-w-sm">
        <Search size={15} className="text-muted shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo mô tả, loại sự cố..."
          className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-soft"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-hairline card-shadow p-12 text-center">
          <CheckCheck size={40} className="text-primary mx-auto mb-3 opacity-40" />
          <p className="text-muted text-sm">Không có tranh chấp nào trong mục này</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((d) => {
            const isExpanded = expandedId === d.id;
            const badge = STATUS_BADGE[d.status] ?? { label: d.status, variant: "traditional" };
            return (
              <div key={d.id} className="bg-white rounded-xl border border-hairline card-shadow overflow-hidden">
                <div className="flex items-start gap-3 p-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <AlertTriangle size={18} className="text-error" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono text-muted">{d.id.slice(0, 8)}…</span>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      <span className="text-xs text-muted bg-surface-soft px-2 py-0.5 rounded-full">
                        {INCIDENT_TYPE_LABEL[d.incidentType] ?? d.incidentType}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-ink line-clamp-2 mb-1">{d.description}</p>
                    <p className="text-xs text-muted flex items-center gap-1">
                      <Calendar size={10} /> {new Date(d.createdAt).toLocaleDateString("vi-VN")}
                      {d.resolvedAt && <span className="ml-2 text-primary">· Giải quyết: {new Date(d.resolvedAt).toLocaleDateString("vi-VN")}</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : d.id)}
                    className="w-8 h-8 rounded-lg border border-hairline flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors shrink-0"
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-hairline bg-surface-soft/50 px-4 py-4 space-y-4">
                    {d.evidenceUrls?.length > 0 && (
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Bằng chứng đính kèm</p>
                        <div className="flex flex-wrap gap-2">
                          {d.evidenceUrls.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-primary border border-primary/20 bg-surface-green px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors">
                              <FileText size={12} /> Tài liệu {i + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {d.status !== "resolved" && (
                      <div>
                        <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Cập nhật trạng thái</p>
                        <div className="flex gap-2 flex-wrap">
                          {d.status === "open" && (
                            <button
                              onClick={() => handleStatusUpdate(d.id, "in_progress")}
                              disabled={!!actionLoading}
                              className="h-8 px-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-yellow-100 transition-colors disabled:opacity-40"
                            >
                              {actionLoading === d.id ? <Loader2 size={12} className="animate-spin" /> : <Clock size={12} />}
                              Bắt đầu xử lý
                            </button>
                          )}
                          <button
                            onClick={() => handleStatusUpdate(d.id, "resolved")}
                            disabled={!!actionLoading}
                            className="h-8 px-3 rounded-lg bg-surface-green text-primary text-xs font-semibold flex items-center gap-1.5 hover:bg-primary hover:text-white transition-colors disabled:opacity-40"
                          >
                            {actionLoading === d.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />}
                            Đánh dấu giải quyết
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
