'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, Eye, MousePointerClick, Percent, CalendarClock,
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { useAuthStore } from '@/store/authStore';
import { type CampaignAnalytics as Analytics } from '@/types/ads';

interface Props {
  campaignId: string;
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
}

export function CampaignAnalytics({ campaignId }: Props) {
  const { accessToken } = useAuthStore();

  const { data, isLoading, isError, error } = useQuery<Analytics>({
    queryKey: ['campaign-analytics', campaignId],
    queryFn: () =>
      api.get<Analytics>(`/ads/campaigns/${campaignId}/analytics`, accessToken),
    enabled: !!accessToken,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted">
        <Loader2 size={28} className="animate-spin mr-2" /> Đang tải analytics...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-error">
          {(error as Error)?.message ?? 'Không thể tải dữ liệu phân tích'}
        </p>
        <Link href="/dashboard/supplier/ads">
          <Button variant="secondary" size="sm">
            <ArrowLeft size={14} /> Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  const { campaign, daily, ctr, daysLeft } = data;

  const chartData = daily.map((d) => ({
    date: formatDateShort(d.date),
    'Hiển thị': d.impressions,
    'Click': d.clicks,
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link
            href="/dashboard/supplier/ads"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
          >
            <ArrowLeft size={14} /> Quay lại danh sách
          </Link>
          <h2 className="mt-2 text-lg font-semibold text-ink">{campaign.title}</h2>
          <p className="text-xs text-muted">
            Gói: {campaign.package?.name ?? '—'} · Trạng thái: {campaign.status}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng hiển thị"
          value={campaign.impressionCount.toLocaleString('vi-VN')}
          icon={Eye}
          variant="default"
        />
        <StatCard
          title="Tổng click"
          value={campaign.clickCount.toLocaleString('vi-VN')}
          icon={MousePointerClick}
          variant="green"
        />
        <StatCard
          title="CTR (Click-through rate)"
          value={`${ctr}%`}
          icon={Percent}
          variant="accent"
          subtitle="Click / Hiển thị"
        />
        <StatCard
          title="Ngày còn lại"
          value={daysLeft}
          icon={CalendarClock}
          variant="harvest"
          subtitle={
            campaign.endsAt
              ? `Kết thúc ${new Date(campaign.endsAt).toLocaleDateString('vi-VN')}`
              : 'Chưa xác định'
          }
        />
      </div>

      {/* Daily chart */}
      <div className="bg-white rounded-xl border border-hairline p-5">
        <h3 className="font-semibold text-ink text-sm mb-4">Hoạt động theo ngày</h3>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted text-center py-10">
            Chưa có dữ liệu hiển thị nào trong khoảng thời gian này.
          </p>
        ) : (
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" fontSize={11} stroke="#6B7280" />
                <YAxis allowDecimals={false} fontSize={11} stroke="#6B7280" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="Hiển thị"
                  stroke="#16A34A"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Click"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
