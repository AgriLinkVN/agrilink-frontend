"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Check, X, Building2, Sprout, Eye } from "lucide-react";
import Link from "next/link";

interface ProfileRecord {
  id: string;
  user?: { id: string; fullName?: string; phone?: string; email?: string };
  fullName?: string;
  cooperativeName?: string;
  companyName?: string;
  cccdNumber?: string;
  taxCode?: string;
  businessLicenseNumber?: string;
  registrationNumber?: string;
  isKycVerified?: boolean;
  isVerified?: boolean;
  createdAt?: string;
}

const ROLE_LABELS: Record<string, string> = {
  farmer: "Nông dân", cooperative: "HTX", enterprise: "Doanh nghiệp", supplier: "Nhà cung cấp",
};

export default function AdminProfilesPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [profiles, setProfiles] = useState<Record<string, { farmer: ProfileRecord[]; cooperative: ProfileRecord[]; enterprise: ProfileRecord[]; supplier: ProfileRecord[] }> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/v1/admin/pending-profiles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setProfiles(d.data ?? d))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  const handleAction = async (type: string, profileId: string, isApproved: boolean, rejectionReason?: string) => {
    if (!token) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/v1/admin/profiles/${type}/${profileId}/verify`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isApproved, rejectionReason: rejectionReason ?? null }),
      },
    );
    if (res.ok) fetchProfiles();
    else alert((await res.json().catch(() => ({}))).message ?? "Lỗi");
  };

  const allProfiles = profiles
    ? [
        ...(profiles.farmer ?? []).map((p) => ({ ...p, _type: "farmer" as const })),
        ...(profiles.cooperative ?? []).map((p) => ({ ...p, _type: "cooperative" as const })),
        ...(profiles.enterprise ?? []).map((p) => ({ ...p, _type: "enterprise" as const })),
        ...(profiles.supplier ?? []).map((p) => ({ ...p, _type: "supplier" as const })),
      ]
    : [];

  return (
    <DashboardLayout role="admin" pageTitle="Duyệt hồ sơ đăng ký" pageDescription="Phê duyệt hoặc từ chối hồ sơ HTX, Doanh nghiệp, NCC, Nông dân">
      {loading ? (
        <div className="flex items-center justify-center h-64 text-muted">Đang tải...</div>
      ) : allProfiles.length === 0 ? (
        <div className="bg-white rounded-xl border border-hairline card-shadow p-12 text-center text-muted">
          <Building2 size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold mb-1">Không có hồ sơ chờ duyệt</p>
          <p className="text-sm">Tất cả hồ sơ đã được xử lý.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {allProfiles.map((p) => (
            <ProfileCard
              key={`${p._type}-${p.id}`}
              profile={p}
              onApprove={() => handleAction(p._type, p.id, true)}
              onReject={() => {
                const reason = prompt("Lý do từ chối:");
                if (reason !== null) handleAction(p._type, p.id, false, reason);
              }}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

function ProfileCard({ profile: p, onApprove, onReject }: { profile: ProfileRecord & { _type: string }; onApprove: () => void; onReject: () => void }) {
  const name = p.user?.fullName ?? p.fullName ?? p.cooperativeName ?? p.companyName ?? "—";
  const icon = p._type === "farmer" ? Sprout : Building2;

  return (
    <div className="bg-white rounded-xl border border-hairline card-shadow p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${p._type === "farmer" ? "bg-surface-green" : "bg-primary-ultra-light"}`}>
            <Icon size={18} className={p._type === "farmer" ? "text-primary" : "text-primary"} />
          </div>
          <div>
            <p className="font-semibold text-ink text-sm">{name}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white mt-0.5">
              {ROLE_LABELS[p._type]}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-muted mb-4">
        {p.cccdNumber && <span>CCCD: {p.cccdNumber}</span>}
        {p.taxCode && <span>MST: {p.taxCode}</span>}
        {p.businessLicenseNumber && <span>GPKD: {p.businessLicenseNumber}</span>}
        {p.registrationNumber && <span>ĐK: {p.registrationNumber}</span>}
        {p.user?.email && <span className="col-span-2">{p.user.email}</span>}
        {p.user?.phone && <span className="col-span-2">{p.user.phone}</span>}
        {p.createdAt && <span className="col-span-2">Gửi: {new Date(p.createdAt).toLocaleDateString("vi-VN")}</span>}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onApprove}
          className="flex-1 h-9 rounded-lg bg-surface-green text-primary text-sm font-semibold flex items-center justify-center gap-1 hover:bg-primary hover:text-white transition-colors"
        >
          <Check size={14} /> Duyệt
        </button>
        <button
          onClick={onReject}
          className="flex-1 h-9 rounded-lg bg-[#FEE2E2] text-error text-sm font-semibold flex items-center justify-center gap-1 hover:bg-error hover:text-white transition-colors"
        >
          <X size={14} /> Từ chối
        </button>
      </div>
    </div>
  );
}
