"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import Link from "next/link";
import { Users, Package, AlertTriangle, ShieldCheck } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuthStore } from "@/store/authStore";

const ROLE_COLORS: Record<string, string> = { farmer: "#16a34a", cooperative: "#2563eb", buyer: "#f59e0b", enterprise: "#8b5cf6", supplier: "#06b6d4", logistics: "#ec4899", state_agency: "#64748b", admin: "#ef4444" };

interface AdminStats {
  totalUsers: number; activeUsers: number;
  pendingProfiles: { farmer: number; cooperative: number; enterprise: number; supplier: number; total: number };
  totalProducts: number; pendingProducts: number; openDisputes: number; certificationsThisMonth: number;
}

export default function AdminDashboardPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/v1/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { const inner = d?.data ?? d; if (inner?.totalUsers !== undefined) setStats(inner); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const statCards = stats ? [
    { title: "Tổng người dùng", value: (stats.totalUsers ?? 0).toLocaleString("vi-VN"), subtitle: `${stats.activeUsers ?? 0} active`, icon: Users, variant: "green" as const },
    { title: "Sản phẩm chờ duyệt", value: String(stats.pendingProducts ?? 0), subtitle: `${stats.totalProducts ?? 0} tổng`, icon: Package, variant: "default" as const },
    { title: "Tranh chấp mở", value: String(stats.openDisputes ?? 0), subtitle: "Cần xử lý", icon: AlertTriangle, variant: "harvest" as const },
    { title: "Chứng nhận tháng này", value: String(stats.certificationsThisMonth ?? 0), subtitle: "HTX/DN được duyệt", icon: ShieldCheck, variant: "accent" as const },
  ] : [];

  const pendingTotal = stats?.pendingProfiles?.total ?? 0;

  return (
    <DashboardLayout role="admin" userName="Admin AgriLink" pageTitle="Admin Panel" pageDescription="Quản lý toàn hệ thống AgriLink Vietnam">
      {loading ? <div className="flex items-center justify-center h-64 text-muted">Đang tải...</div> : <>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => <StatCard key={stat.title} {...stat} />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-hairline card-shadow p-5">
            <h2 className="font-semibold text-ink mb-4">Sản phẩm</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats ? [{ name: "Tổng", value: stats.totalProducts }, { name: "Chờ duyệt", value: stats.pendingProducts }, { name: "Tranh chấp", value: stats.openDisputes }] : []}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
                <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl border border-hairline card-shadow p-5">
            <h2 className="font-semibold text-ink mb-4">Hồ sơ chờ duyệt ({pendingTotal})</h2>
            {stats && pendingTotal > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={[{ name: "Nông dân", value: stats.pendingProfiles.farmer }, { name: "HTX", value: stats.pendingProfiles.cooperative }, { name: "Doanh nghiệp", value: stats.pendingProfiles.enterprise }, { name: "NCC", value: stats.pendingProfiles.supplier }].filter((d) => d.value > 0)}
                    dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                    {["farmer","cooperative","enterprise","supplier"].map((role) => <Cell key={role} fill={ROLE_COLORS[role]} />)}
                  </Pie><Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-muted text-sm text-center py-12">Không có hồ sơ chờ duyệt</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[{ label: "Quản lý người dùng", href: "/dashboard/admin/users", icon: Users }, { label: "Duyệt sản phẩm", href: "/dashboard/admin/products", icon: Package }, { label: "Xử lý tranh chấp", href: "/dashboard/admin/disputes", icon: AlertTriangle }, { label: "Cấu hình hệ thống", href: "/dashboard/admin/config", icon: ShieldCheck }].map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className="bg-white rounded-xl border border-hairline card-shadow p-4 flex items-center gap-3 hover:border-primary transition-colors">
              <div className="w-10 h-10 rounded-lg bg-surface-green flex items-center justify-center"><Icon size={18} className="text-primary" /></div>
              <span className="text-sm font-semibold text-ink">{label}</span>
            </Link>
          ))}
        </div>
      </>}
    </DashboardLayout>
  );
}
