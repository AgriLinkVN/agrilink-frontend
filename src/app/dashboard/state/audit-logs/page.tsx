"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Loader2, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

const API = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
const getToken = () => useAuthStore.getState().accessToken;

function apiFetch(path: string) {
  const token = getToken();
  return fetch(`${API}/api/v1${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((r) => r.json());
}

export default function StateAuditLogsPage() {
  const user = useAuthStore((s) => s.user);
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    apiFetch(`/admin/audit-logs?page=${page}&limit=${limit}`)
      .then((res) => {
        const data = res.data ?? res;
        setLogs(data.data ?? []);
        setTotal(data.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <DashboardLayout
      role="state_agency"
      userName={(user as any)?.fullName ?? "Cơ quan nhà nước"}
      pageTitle="Audit log"
      pageDescription={`Lịch sử thao tác quản trị — ${total} bản ghi`}
    >
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-hairline card-shadow">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-muted text-sm">Chưa có bản ghi nào</div>
            ) : (
              <div className="divide-y divide-hairline">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-4">
                    <div className="w-9 h-9 rounded-xl bg-surface-green flex items-center justify-center shrink-0 mt-0.5">
                      <FileText size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink">
                        {log.method ?? log.action} <span className="text-muted font-normal">{log.path ?? log.entityType}</span>
                      </p>
                      <p className="text-xs text-muted">
                        {log.userId ?? "system"} · {new Date(log.createdAt).toLocaleString("vi-VN")}
                        {log.ipAddress ? ` · ${log.ipAddress}` : ""}
                      </p>
                      {log.changes && (
                        <pre className="text-[11px] text-muted bg-surface-soft rounded-lg p-2 mt-2 overflow-x-auto">
                          {JSON.stringify(log.changes, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted">Trang {page} / {totalPages}</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={14} /> Trước
              </Button>
              <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Sau <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
