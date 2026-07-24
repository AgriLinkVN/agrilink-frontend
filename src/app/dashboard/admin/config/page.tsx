"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { Settings, Save, Loader2, Check } from "lucide-react";

interface SystemConfig {
  key: string;
  value: string;
  description: string | null;
  updatedBy: string | null;
}

export default function AdminConfigPage() {
  const token = useAuthStore((s) => s.accessToken);
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const fetchConfigs = useCallback(() => {
    if (!token) { setLoading(false); return; }
    api.get<SystemConfig[]>("/admin/system-configs", token)
      .then((d) => { setConfigs(d ?? []); setEdited({}); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchConfigs(); }, [fetchConfigs]);

  const save = async (key: string) => {
    if (!token || !edited[key]) return;
    setSaving((s) => ({ ...s, [key]: true }));
    try {
      await api.patch(`/admin/system-configs/${key}`, { value: edited[key] }, token);
      setConfigs((prev) => prev.map((c) => (c.key === key ? { ...c, value: edited[key] } : c)));
      setEdited((prev) => { const n = { ...prev }; delete n[key]; return n; });
    } catch (e: any) {
      alert(e?.message ?? "Lỗi lưu");
    } finally {
      setSaving((s) => ({ ...s, [key]: false }));
    }
  };

  return (
    <DashboardLayout role="admin" pageTitle="Cấu hình hệ thống" pageDescription="Quản lý tham số nền tảng">
      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : configs.length === 0 ? (
        <div className="bg-white rounded-xl border border-hairline card-shadow p-12 text-center text-muted">
          <Settings size={48} className="mx-auto mb-4 opacity-30" />
          <p>Chưa có cấu hình nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {configs.map((cfg) => {
            const isDirty = edited[cfg.key] !== undefined;
            const val = isDirty ? edited[cfg.key] : cfg.value;
            return (
              <div key={cfg.key} className="bg-white rounded-xl border border-hairline card-shadow p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-ink text-sm">{cfg.key}</p>
                    {cfg.description && <p className="text-xs text-muted mt-1">{cfg.description}</p>}
                    <div className="mt-2">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setEdited((prev) => ({ ...prev, [cfg.key]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-hairline text-sm text-ink focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => save(cfg.key)}
                    disabled={!isDirty || saving[cfg.key]}
                    className={`shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      isDirty ? "bg-primary text-white hover:bg-primary-active" : "bg-surface-strong text-muted cursor-not-allowed"
                    }`}
                  >
                    {saving[cfg.key] ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                    {isDirty ? "Lưu" : "Đã lưu"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
