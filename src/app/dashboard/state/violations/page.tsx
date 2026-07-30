"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
const getToken = () => useAuthStore.getState().accessToken;

interface ViolatingProduct {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
  rejectionReason?: string | null;
  seller?: {
    fullName?: string | null;
  } | null;
}

interface ViolatingProductsResponse {
  data?: ViolatingProduct[];
  total?: number;
}

function apiFetch<T>(path: string): Promise<T> {
  return api.get<T>(path, getToken());
}

const STATUS_LABEL: Record<string, string> = {
  suspended: "Đã khóa",
  rejected: "Bị từ chối",
};

export default function StateViolationsPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isPending: loading } = useQuery({
    queryKey: ["state", "violating-products"],
    queryFn: () =>
      apiFetch<ViolatingProductsResponse>(
        "/admin/products/violating?limit=50",
      ),
    staleTime: 30_000,
  });

  const products = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <DashboardLayout
      role="state_agency"
      userName={user?.full_name ?? user?.phone ?? "Cơ quan nhà nước"}
      pageTitle="Sản phẩm vi phạm"
      pageDescription={`${total} sản phẩm bị khóa hoặc từ chối do vi phạm chính sách`}
    >
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-hairline card-shadow">
          {products.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm">Không có sản phẩm vi phạm</div>
          ) : (
            <div className="divide-y divide-hairline">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] flex items-center justify-center shrink-0">
                    <AlertTriangle size={16} className="text-[#991B1B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{p.name}</p>
                    <p className="text-xs text-muted truncate">
                      Người bán: {p.seller?.fullName ?? "—"} · Cập nhật: {new Date(p.updatedAt).toLocaleDateString("vi-VN")}
                    </p>
                    {p.rejectionReason && (
                      <p className="text-xs text-[#991B1B] mt-1 truncate">Lý do: {p.rejectionReason}</p>
                    )}
                  </div>
                  <Badge variant="harvest">{STATUS_LABEL[p.status] ?? p.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
