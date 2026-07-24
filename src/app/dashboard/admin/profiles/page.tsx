"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { Check, X, Building2, Sprout, Loader2 } from "lucide-react";

interface ProfileRecord {
  id: string;
  user?: { id: string; fullName?: string; phone?: string; email?: string };
  fullName?: string; cooperativeName?: string; companyName?: string;
  cccdNumber?: string; taxCode?: string; businessLicenseNumber?: string;
  registrationNumber?: string; isKycVerified?: boolean; isVerified?: boolean;
  createdAt?: string;
}

const ROLE_LABELS: Record<string, string> = { farmer: "Nông dân", cooperative: "HTX", enterprise: "Doanh nghiệp", supplier: "Nhà cung cấp" };

type ProfilesData = { farmer: ProfileRecord[]; cooperative: ProfileRecord[]; enterprise: ProfileRecord[]; supplier: ProfileRecord[] };

export default function AdminProfilesPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [data, setData] = useState<ProfilesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.get<ProfilesData>("/admin/pending-profiles", token)
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleAction = async (type: string, profileId: string, isApproved: boolean) => {
    if (!token) return;
    let reason: string | null = null;
    if (!isApproved) {
      const input = prompt("Lý do từ chối (có thể bỏ trống):");
      if (input === null) return; // user bấm Cancel → hủy thao tác
      reason = input.trim() || null;
    }
    try {
      await api.patch(`/admin/profiles/${type}/${profileId}/verify`, { isApproved, rejectionReason: reason }, token);
      // refetch
      const d = await api.get<ProfilesData>("/admin/pending-profiles", token);
      setData(d);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Lỗi");
    }
  };

  const allProfiles: (ProfileRecord & { _type: string })[] = [];
  if (data) {
    for (const p of data.farmer ?? []) allProfiles.push({ ...p, _type: "farmer" });
    for (const p of data.cooperative ?? []) allProfiles.push({ ...p, _type: "cooperative" });
    for (const p of data.enterprise ?? []) allProfiles.push({ ...p, _type: "enterprise" });
    for (const p of data.supplier ?? []) allProfiles.push({ ...p, _type: "supplier" });
  }

  return (
    <DashboardLayout role="admin" pageTitle="Duyệt hồ sơ đăng ký" pageDescription="Phê duyệt hoặc từ chối hồ sơ HTX, Doanh nghiệp, NCC, Nông dân">
      {loading ? (
        <div className="flex items-center justify-center h-64 text-muted"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : allProfiles.length === 0 ? (
        <div className="bg-white rounded-xl border border-hairline card-shadow p-12 text-center text-muted">
          <Building2 size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold mb-1">Không có hồ sơ chờ duyệt</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {allProfiles.map((p) => {
            const name = p.user?.fullName ?? p.fullName ?? p.cooperativeName ?? p.companyName ?? "—";
            const Icon = p._type === "farmer" ? Sprout : Building2;
            return (
              <div key={`${p._type}-${p.id}`} className="bg-white rounded-xl border border-hairline card-shadow p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-green flex items-center justify-center"><Icon size={18} className="text-primary" /></div>
                    <div>
                      <p className="font-semibold text-ink text-sm">{name}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white mt-0.5">{ROLE_LABELS[p._type]}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted mb-4">
                  {p.cccdNumber && <span>CCCD: {p.cccdNumber}</span>}
                  {p.taxCode && <span>MST: {p.taxCode}</span>}
                  {p.businessLicenseNumber && <span>GPKD: {p.businessLicenseNumber}</span>}
                  {p.user?.email && <span className="col-span-2">{p.user.email}</span>}
                  {p.user?.phone && <span className="col-span-2">{p.user.phone}</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(p._type, p.id, true)} className="flex-1 h-9 rounded-lg bg-surface-green text-primary text-sm font-semibold flex items-center justify-center gap-1 hover:bg-primary hover:text-white transition-colors"><Check size={14} /> Duyệt</button>
                  <button onClick={() => handleAction(p._type, p.id, false)} className="flex-1 h-9 rounded-lg bg-[#FEE2E2] text-error text-sm font-semibold flex items-center justify-center gap-1 hover:bg-error hover:text-white transition-colors"><X size={14} /> Từ chối</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
