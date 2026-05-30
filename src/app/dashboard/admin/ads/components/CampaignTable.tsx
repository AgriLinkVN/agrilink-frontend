'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Eye, Loader2, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { type AdCampaign } from '@/types/ads';

const STATUS_CONFIG = {
  pending_approval: { label: 'Chờ duyệt',  cls: 'bg-yellow-100 text-yellow-800' },
  active:           { label: 'Đang chạy',   cls: 'bg-green-100  text-green-800'  },
  paused:           { label: 'Tạm dừng',   cls: 'bg-gray-100   text-gray-600'   },
  rejected:         { label: 'Bị từ chối', cls: 'bg-red-100    text-red-800'    },
  expired:          { label: 'Hết hạn',    cls: 'bg-purple-100 text-purple-800' },
} as const;

interface Props {
  status?: string;
}

export function CampaignTable({ status }: Props) {
  const { accessToken } = useAuthStore();

  const { data, isLoading, isError } = useQuery<{ data: AdCampaign[]; total: number }>({
    queryKey: ['admin-campaigns', status],
    queryFn: () =>
      api.get<{ data: AdCampaign[]; total: number }>(
        `/ads/admin/campaigns${status ? `?status=${status}` : ''}`,
        accessToken,
      ),
    enabled: !!accessToken,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted">
        <Loader2 size={24} className="animate-spin mr-2" /> Đang tải...
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-sm text-muted py-12">
        Không thể tải danh sách. Vui lòng thử lại.
      </p>
    );
  }

  const campaigns = data?.data ?? [];

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-sm">Không có chiến dịch nào trong tab này.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-hairline card-shadow overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-hairline">
        <p className="text-sm text-muted">
          {data?.total ?? 0} chiến dịch
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-surface-soft">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Banner</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Tiêu đề</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Supplier</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Gói</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Ngày tạo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Trạng thái</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-soft">
            {campaigns.map((campaign) => {
              const statusCfg = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.pending_approval;
              return (
                <tr key={campaign.id} className="hover:bg-surface-soft transition-colors">
                  {/* Banner thumbnail */}
                  <td className="px-4 py-3">
                    <div className="w-20 h-[45px] rounded overflow-hidden bg-surface-soft border border-hairline shrink-0 flex items-center justify-center">
                      {campaign.bannerUrl ? (
                        <img
                          src={campaign.bannerUrl}
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageOff size={16} className="text-muted" />
                      )}
                    </div>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="font-medium text-ink truncate">{campaign.title}</p>
                  </td>

                  {/* Supplier — show advertiserId as placeholder */}
                  <td className="px-4 py-3">
                    <p className="text-xs font-mono text-muted truncate max-w-[120px]">
                      {campaign.advertiserId.slice(0, 8)}…
                    </p>
                  </td>

                  {/* Package */}
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-600">
                      {campaign.package?.name ?? '—'}
                    </span>
                  </td>

                  {/* Created date */}
                  <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                    {new Date(campaign.createdAt).toLocaleDateString('vi-VN')}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-[11px] font-semibold', statusCfg.cls)}>
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/admin/ads/${campaign.id}`}>
                      <Button size="sm" variant="ghost" className="gap-1 text-xs">
                        <Eye size={13} /> Xem
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
