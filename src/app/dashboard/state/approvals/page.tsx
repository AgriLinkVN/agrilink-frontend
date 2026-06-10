"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Loader2, Check, X, Eye, Search, ChevronDown, ChevronUp,
  FileText, Building2, User, Package, MapPin, Phone, Calendar,
  ShieldCheck, AlertCircle, CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
const getToken = () => useAuthStore.getState().accessToken;

type ProfileType = "all" | "cooperative" | "enterprise" | "farmer" | "supplier";

const TYPE_TABS: { label: string; value: ProfileType; icon: React.ElementType }[] = [
  { label: "Tất cả",       value: "all",         icon: FileText },
  { label: "HTX",          value: "cooperative", icon: Building2 },
  { label: "Doanh nghiệp", value: "enterprise",  icon: Building2 },
  { label: "Nông dân",     value: "farmer",      icon: User },
  { label: "Nhà cung cấp", value: "supplier",    icon: Package },
];

const TYPE_LABEL: Record<string, string> = {
  farmer: "Nông dân", cooperative: "HTX", enterprise: "Doanh nghiệp", supplier: "Nhà cung cấp",
};

interface ProfileItem {
  id: string;
  _type: string;
  cooperativeName?: string;
  companyName?: string;
  address?: string;
  taxCode?: string;
  representativeName?: string;
  representativePhone?: string;
  businessLicenseUrl?: string;
  cooperativeCertUrl?: string;
  createdAt: string;
  user?: { fullName?: string; phone?: string; email?: string };
}

export default function ApprovalsPage() {
  const user = useAuthStore((s) => s.user);
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<ProfileType>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const loadProfiles = useCallback(() => {
    setLoading(true);
    const token = getToken();
    fetch(`${API}/api/v1/admin/pending-profiles`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((res) => {
        const raw = res.data ?? res;
        const flat: ProfileItem[] = [
          ...(raw.cooperative ?? []).map((p: any) => ({ ...p, _type: "cooperative" })),
          ...(raw.enterprise ?? []).map((p: any) => ({ ...p, _type: "enterprise" })),
          ...(raw.farmer ?? []).map((p: any) => ({ ...p, _type: "farmer" })),
          ...(raw.supplier ?? []).map((p: any) => ({ ...p, _type: "supplier" })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProfiles(flat);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadProfiles(); }, [loadProfiles]);

  const handleVerify = async (item: ProfileItem, approve: boolean) => {
    if (!approve && !rejectReason.trim()) return;
    setActionLoading(item.id);
    const token = getToken();
    try {
      const res = await fetch(`${API}/api/v1/admin/profiles/${item._type}/${item.id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ isApproved: approve, rejectionReason: approve ? undefined : rejectReason }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Thao tác thất bại");
      showToast("success", approve ? "Đã duyệt hồ sơ thành công" : "Đã từ chối hồ sơ");
      setRejectId(null);
      setRejectReason("");
      setExpandedId(null);
      loadProfiles();
    } catch (e: any) {
      showToast("error", e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = profiles.filter((p) => {
    const matchType = activeType === "all" || p._type === activeType;
    const name = (p.cooperativeName ?? p.companyName ?? p.user?.fullName ?? "").toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <DashboardLayout
      role="state_agency"
      userName={(user as any)?.fullName ?? "Cơ quan nhà nước"}
      pageTitle="Duyệt hồ sơ HTX / Doanh nghiệp"
      pageDescription="Xem xét và phê duyệt hồ sơ đăng ký từ các tổ chức"
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

      {/* Type tabs */}
      <div className="flex gap-1 bg-surface-soft p-1 rounded-xl border border-hairline mb-5 w-fit flex-wrap">
        {TYPE_TABS.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveType(value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors",
              activeType === value ? "bg-white text-primary shadow-sm" : "text-muted hover:text-ink"
            )}
          >
            <Icon size={14} /> {label}
            {value !== "all" && (
              <span className="ml-0.5 text-[10px] bg-primary/10 text-primary rounded-full px-1.5 py-0.5 font-bold">
                {profiles.filter((p) => p._type === value).length}
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
          placeholder="Tìm theo tên tổ chức..."
          className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-soft"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-hairline card-shadow p-12 text-center">
          <ShieldCheck size={40} className="text-primary mx-auto mb-3 opacity-40" />
          <p className="text-muted text-sm">Không có hồ sơ nào chờ duyệt</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => {
            const name = item.cooperativeName ?? item.companyName ?? item.user?.fullName ?? item.id;
            const isExpanded = expandedId === item.id;
            const isRejecting = rejectId === item.id;
            return (
              <div key={item.id} className="bg-white rounded-xl border border-hairline card-shadow overflow-hidden">
                {/* Header row */}
                <div className="flex items-center gap-3 p-4">
                  <div className="w-11 h-11 rounded-xl bg-surface-green flex items-center justify-center text-2xl shrink-0">
                    {item._type === "cooperative" ? "🏡" : item._type === "enterprise" ? "🏭" : item._type === "farmer" ? "🌾" : "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-ink truncate">{name}</p>
                      <Badge variant="traditional">{TYPE_LABEL[item._type]}</Badge>
                    </div>
                    <p className="text-xs text-muted flex items-center gap-3 mt-0.5 flex-wrap">
                      {item.user?.phone && <span className="flex items-center gap-1"><Phone size={10} />{item.user.phone}</span>}
                      {item.address && <span className="flex items-center gap-1"><MapPin size={10} />{item.address.slice(0, 40)}{item.address.length > 40 ? "…" : ""}</span>}
                      <span className="flex items-center gap-1"><Calendar size={10} />{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="w-8 h-8 rounded-lg border border-hairline flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button
                      onClick={() => { setRejectId(isRejecting ? null : item.id); setRejectReason(""); }}
                      disabled={!!actionLoading}
                      className="h-8 px-3 rounded-lg bg-red-50 text-error text-xs font-semibold flex items-center gap-1 hover:bg-error hover:text-white transition-colors disabled:opacity-40"
                    >
                      <X size={13} /> Từ chối
                    </button>
                    <button
                      onClick={() => handleVerify(item, true)}
                      disabled={!!actionLoading}
                      className="h-8 px-3 rounded-lg bg-surface-green text-primary text-xs font-semibold flex items-center gap-1 hover:bg-primary hover:text-white transition-colors disabled:opacity-40"
                    >
                      {actionLoading === item.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                      Duyệt
                    </button>
                  </div>
                </div>

                {/* Reject reason input */}
                {isRejecting && (
                  <div className="px-4 pb-4 border-t border-hairline bg-red-50/50">
                    <p className="text-xs font-semibold text-error mb-2 mt-3">Lý do từ chối (bắt buộc)</p>
                    <div className="flex gap-2">
                      <input
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Nêu rõ lý do..."
                        className="flex-1 h-9 px-3 rounded-lg border border-border-strong bg-white text-sm outline-none focus:border-error focus:ring-2 focus:ring-error/20"
                      />
                      <button
                        onClick={() => handleVerify(item, false)}
                        disabled={!rejectReason.trim() || !!actionLoading}
                        className="h-9 px-4 rounded-lg bg-error text-white text-sm font-semibold disabled:opacity-40 hover:bg-red-700 transition-colors"
                      >
                        {actionLoading === item.id ? <Loader2 size={13} className="animate-spin" /> : "Xác nhận"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-hairline bg-surface-soft/50 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                    {item.taxCode && (
                      <div><p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Mã số thuế</p><p className="text-sm font-semibold text-ink">{item.taxCode}</p></div>
                    )}
                    {item.representativeName && (
                      <div><p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Người đại diện</p><p className="text-sm font-semibold text-ink">{item.representativeName}</p></div>
                    )}
                    {item.representativePhone && (
                      <div><p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">SĐT đại diện</p><p className="text-sm font-semibold text-ink">{item.representativePhone}</p></div>
                    )}
                    {item.user?.email && (
                      <div><p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Email</p><p className="text-sm font-semibold text-ink">{item.user.email}</p></div>
                    )}
                    {(item.businessLicenseUrl || item.cooperativeCertUrl) && (
                      <div className="col-span-full">
                        <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Tài liệu đính kèm</p>
                        <div className="flex flex-wrap gap-2">
                          {item.businessLicenseUrl && (
                            <a href={item.businessLicenseUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-primary border border-primary/20 bg-surface-green px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors">
                              <FileText size={12} /> Giấy phép KD
                            </a>
                          )}
                          {item.cooperativeCertUrl && (
                            <a href={item.cooperativeCertUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-primary border border-primary/20 bg-surface-green px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors">
                              <FileText size={12} /> Quyết định thành lập
                            </a>
                          )}
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
