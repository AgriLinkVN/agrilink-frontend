"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { Lock, Unlock, UserX, UserCheck, Loader2 } from "lucide-react";

interface UserRecord {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
}

const ROLE_LABELS: Record<string, string> = {
  farmer: "Nông dân", cooperative: "HTX", buyer: "Người mua",
  enterprise: "Doanh nghiệp", supplier: "NCC", logistics: "Vận chuyển",
  state_agency: "Cơ quan NN", admin: "Admin",
};

export default function AdminUsersPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(() => {
    if (!token) { setLoading(false); return; }
    api.get<{ data: UserRecord[]; total: number }>(`/admin/users?page=${page}&limit=20`, token)
      .then((d) => { setUsers(d.data ?? []); setTotal(d.total ?? 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleStatus = async (user: UserRecord) => {
    if (user.role === "admin") { alert("Không thể khóa tài khoản Admin"); return; }
    const newStatus = user.status === "active" ? "suspended" : "active";
    const action = newStatus === "active" ? "MỞ KHÓA" : "KHÓA";
    if (!confirm(`${action} tài khoản "${user.fullName || user.email}"?`)) return;
    try {
      await api.patch(`/admin/users/${user.id}/status`, { status: newStatus }, token);
      fetchUsers();
    } catch (e: any) {
      alert(e?.message ?? "Lỗi");
    }
  };

  return (
    <DashboardLayout role="admin" pageTitle="Quản lý người dùng" pageDescription="Khóa/mở tài khoản, xem danh sách người dùng">
      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-hairline card-shadow overflow-hidden">
          <div className="p-5 border-b border-hairline flex items-center justify-between">
            <h2 className="font-semibold text-ink">Tất cả người dùng ({total})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-soft text-muted font-medium border-b border-hairline">
                <tr>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Họ tên</th>
                  <th className="px-5 py-3">Vai trò</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-soft text-ink">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-soft transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm">{u.email}</p>
                      {u.phone && <p className="text-xs text-muted">{u.phone}</p>}
                    </td>
                    <td className="px-5 py-4">{u.fullName || "—"}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary-ultra-light text-primary">
                        {ROLE_LABELS[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {u.status === "active" ? (
                        <span className="text-primary text-xs font-semibold flex items-center gap-1"><UserCheck size={12} /> Hoạt động</span>
                      ) : (
                        <span className="text-error text-xs font-semibold flex items-center gap-1"><UserX size={12} /> Bị khóa</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => toggleStatus(u)}
                        disabled={u.role === "admin"}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          u.role === "admin"
                            ? "text-muted cursor-not-allowed"
                            : u.status === "active"
                              ? "bg-[#FEE2E2] text-error hover:bg-error hover:text-white"
                              : "bg-surface-green text-primary hover:bg-primary hover:text-white"
                        }`}
                      >
                        {u.status === "active" ? <><Lock size={12} /> Khóa</> : <><Unlock size={12} /> Mở khóa</>}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">Không có người dùng nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {total > 20 && (
            <div className="p-4 flex justify-center gap-2 border-t border-hairline">
              {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${page === i + 1 ? "bg-primary text-white" : "text-muted hover:bg-surface-strong"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
