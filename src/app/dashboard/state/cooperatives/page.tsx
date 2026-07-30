"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Building2, Factory } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getApiBaseUrl } from "@/config/runtime-config";

const getToken = () => useAuthStore.getState().accessToken;

interface ApiEnvelope<T> {
  data?: T;
}

interface OrganizationProfile {
  id: string;
  cooperativeName?: string | null;
  companyName?: string | null;
  taxCode?: string | null;
  representativeName?: string | null;
  address?: string | null;
  isVerified?: boolean;
}

interface OrganizationsResponse {
  cooperatives?: OrganizationProfile[];
  enterprises?: OrganizationProfile[];
}

function apiFetch<T>(path: string, signal?: AbortSignal): Promise<ApiEnvelope<T> | T> {
  const token = getToken();
  return fetch(`${getApiBaseUrl()}${path}`, {
    signal,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((r) => r.json());
}

export default function StateCooperativesPage() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<"cooperative" | "enterprise">("cooperative");
  const [search, setSearch] = useState("");
  const { data, isPending: loading } = useQuery({
    queryKey: ["state", "organizations"],
    queryFn: async ({ signal }) => {
      const res = await apiFetch<OrganizationsResponse>("/admin/cooperatives-enterprises", signal);
      return (
        "data" in Object(res)
          ? (res as ApiEnvelope<OrganizationsResponse>).data
          : res
      ) as OrganizationsResponse | undefined;
    },
    staleTime: 60_000,
  });

  const cooperatives = data?.cooperatives ?? [];
  const enterprises = data?.enterprises ?? [];

  const list = tab === "cooperative" ? cooperatives : enterprises;
  const filtered = list.filter((item) => {
    const name = item.cooperativeName ?? item.companyName ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <DashboardLayout
      role="state_agency"
      userName={user?.full_name ?? user?.phone ?? "Cơ quan nhà nước"}
      pageTitle="Danh sách HTX & Doanh nghiệp"
      pageDescription="Toàn bộ hợp tác xã và doanh nghiệp đã đăng ký trên hệ thống"
    >
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => setTab("cooperative")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "cooperative" ? "bg-primary text-white" : "bg-white border border-hairline text-muted"
          }`}
        >
          <Building2 size={14} className="inline mr-1.5 -mt-0.5" /> HTX ({cooperatives.length})
        </button>
        <button
          onClick={() => setTab("enterprise")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "enterprise" ? "bg-primary text-white" : "bg-white border border-hairline text-muted"
          }`}
        >
          <Factory size={14} className="inline mr-1.5 -mt-0.5" /> Doanh nghiệp ({enterprises.length})
        </button>
        <div className="flex-1 max-w-xs ml-auto">
          <Input
            placeholder="Tìm theo tên..."
            leftIcon={<Search size={14} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-hairline card-shadow">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm">Không có dữ liệu</div>
          ) : (
            <div className="divide-y divide-hairline">
              {filtered.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center shrink-0">
                    {tab === "cooperative" ? <Building2 size={16} className="text-primary" /> : <Factory size={16} className="text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {item.cooperativeName ?? item.companyName}
                    </p>
                    <p className="text-xs text-muted truncate">
                      MST: {item.taxCode} · {item.representativeName} · {item.address}
                    </p>
                  </div>
                  <Badge variant={item.isVerified ? "organic" : "harvest"}>
                    {item.isVerified ? "Đã xác minh" : "Chờ xác minh"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
