'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Loader2, Download, AlertTriangle, TrendingUp, TrendingDown,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { useAuthStore } from '@/store/authStore';
import type { ProductionReport } from '@/types/cooperative';

export function ProductionReportView() {
  const { accessToken } = useAuthStore();

  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() =>
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  );

  const { data, isLoading, isError } = useQuery<ProductionReport>({
    queryKey: ['report', from, to],
    queryFn: () =>
      api.get<ProductionReport>(
        `/cooperatives/me/reports/production?from=${from}&to=${to}`,
        accessToken,
      ),
    enabled: !!accessToken,
  });

  const downloadCsv = async () => {
    if (!accessToken) return;
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';
    const url = `${backend}/api/v1/cooperatives/me/reports/production.csv?from=${from}&to=${to}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      alert('Tải CSV thất bại');
      return;
    }
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-san-luong-${from}_${to}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const ratio =
    data && data.totalEstimated > 0
      ? Math.round((data.totalActual / data.totalEstimated) * 100)
      : 0;
  const achievedPositive = ratio >= 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex items-end gap-3 flex-wrap">
        <Input
          label="Từ ngày"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="max-w-[180px]"
        />
        <Input
          label="Đến ngày"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="max-w-[180px]"
        />
        <Button onClick={downloadCsv} variant="secondary" className="gap-1">
          <Download size={14} /> Xuất CSV
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted">
          <Loader2 size={24} className="animate-spin mr-2" /> Đang tải...
        </div>
      ) : isError || !data ? (
        <div className="flex flex-col items-center py-20 gap-2 text-muted">
          <AlertTriangle size={28} className="text-error" />
          <p className="text-sm">Không thể tải báo cáo.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Tổng dự kiến"
              value={data.totalEstimated.toLocaleString('vi-VN')}
              icon={TrendingUp}
              variant="default"
            />
            <StatCard
              title="Tổng thực tế"
              value={data.totalActual.toLocaleString('vi-VN')}
              icon={achievedPositive ? TrendingUp : TrendingDown}
              variant="green"
            />
            <StatCard
              title="Tỷ lệ đạt"
              value={`${ratio}%`}
              variant={achievedPositive ? 'green' : 'accent'}
            />
          </div>

          {/* Monthly bar chart */}
          <div className="bg-white rounded-xl border border-hairline p-5">
            <h3 className="font-semibold text-ink text-sm mb-4">
              Sản lượng theo tháng
            </h3>
            {data.byMonth.length === 0 ? (
              <p className="text-sm text-muted text-center py-10">
                Chưa có dữ liệu trong khoảng này.
              </p>
            ) : (
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.byMonth.map((d) => ({
                      month: d.month,
                      'Dự kiến': d.estimated,
                      'Thực tế': d.actual,
                    }))}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" fontSize={11} stroke="#6B7280" />
                    <YAxis fontSize={11} stroke="#6B7280" />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Dự kiến" fill="#94A3B8" />
                    <Bar dataKey="Thực tế" fill="#16A34A" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* By member */}
          <div className="bg-white rounded-xl border border-hairline overflow-hidden">
            <div className="p-5 border-b border-hairline">
              <h3 className="font-semibold text-ink text-sm">
                Sản lượng theo thành viên
              </h3>
            </div>
            {data.byMember.length === 0 ? (
              <p className="text-sm text-muted text-center py-10">
                Chưa có dữ liệu.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-surface-soft text-xs text-muted uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">Thành viên</th>
                    <th className="text-right px-4 py-3">Dự kiến</th>
                    <th className="text-right px-4 py-3">Thực tế</th>
                    <th className="text-right px-4 py-3">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {data.byMember.map((m) => {
                    const r =
                      m.estimated > 0
                        ? Math.round((m.actual / m.estimated) * 100)
                        : null;
                    return (
                      <tr key={m.farmerId}>
                        <td className="px-4 py-3 font-medium text-ink">
                          {m.farmerName ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-right text-muted">
                          {m.estimated.toLocaleString('vi-VN')}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-primary">
                          {m.actual.toLocaleString('vi-VN')}
                        </td>
                        <td className="px-4 py-3 text-right text-xs">
                          {r != null ? (
                            <span
                              className={
                                r >= 100 ? 'text-green-600' : 'text-orange-500'
                              }
                            >
                              {r}%
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
