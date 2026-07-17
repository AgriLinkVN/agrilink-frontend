'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import {
  BarChart2, Clock, ChevronLeft, ChevronRight, ImageOff, Loader2, Megaphone, Pause, Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { type AdCampaign, type PaginatedCampaigns } from '@/types/ads';

const PAGE_SIZE = 12;

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending_approval: { label: 'Chờ duyệt',   cls: 'bg-yellow-100 text-yellow-800' },
  active:           { label: 'Đang chạy',   cls: 'bg-green-100  text-green-800'  },
  paused:           { label: 'Tạm dừng',    cls: 'bg-gray-100   text-gray-600'   },
  rejected:         { label: 'Bị từ chối',  cls: 'bg-red-100    text-red-800'    },
  expired:          { label: 'Hết hạn',     cls: 'bg-purple-100 text-purple-800' },
} as const;

// ── CampaignCard ──────────────────────────────────────────────────────────────

function CampaignCard({ campaign }: { campaign: AdCampaign }) {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const status = STATUS_CONFIG[campaign.status];

  const provinces = Array.isArray(campaign.targetProvinces)
    ? campaign.targetProvinces
    : [];

  const maxImpressions = campaign.package?.maxImpressions ?? null;
  const impressionPct =
    maxImpressions && maxImpressions > 0
      ? Math.min(100, Math.round((campaign.totalImpressions / maxImpressions) * 100))
      : null;

  const pause = useMutation({
    mutationFn: () => api.patch(`/ads/campaigns/${campaign.id}/pause`, undefined, accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['supplier-campaigns'] }),
  });

  const resume = useMutation({
    mutationFn: () => api.patch(`/ads/campaigns/${campaign.id}/resume`, undefined, accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['supplier-campaigns'] }),
  });

  return (
    <div className="bg-white rounded-xl border border-hairline card-shadow flex flex-col overflow-hidden">
      {/* Banner preview */}
      <div className="relative aspect-video bg-surface-soft overflow-hidden">
        {campaign.imageUrl ? (
          <Image
            src={campaign.imageUrl}
            alt={campaign.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <ImageOff size={32} />
          </div>
        )}
        <span
          className={cn(
            'absolute top-2 right-2 text-[11px] font-semibold px-2 py-0.5 rounded-full',
            status.cls,
          )}
        >
          {status.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="font-semibold text-ink text-sm leading-snug">{campaign.title}</p>
          <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
            {campaign.package?.name ?? '—'}
          </span>
        </div>

        {campaign.status === 'rejected' && campaign.rejectionReason && (
          <p className="text-xs italic text-red-600 leading-snug">
            {campaign.rejectionReason}
          </p>
        )}

        {campaign.status === 'active' && impressionPct !== null && (
          <div>
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>{campaign.totalImpressions.toLocaleString('vi-VN')} lượt hiển thị</span>
              <span>{impressionPct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${impressionPct}%` }}
              />
            </div>
          </div>
        )}

        {(campaign.startDate || campaign.endDate) && (
          <div className="flex items-center gap-1 text-xs text-muted">
            <Clock size={11} />
            {campaign.startDate
              ? new Date(campaign.startDate).toLocaleDateString('vi-VN')
              : '—'}{' '}
            →{' '}
            {campaign.endDate
              ? new Date(campaign.endDate).toLocaleDateString('vi-VN')
              : '—'}
          </div>
        )}

        <p className="text-xs text-muted">
          {provinces.length === 0 ? 'Toàn quốc' : `${provinces.length} tỉnh mục tiêu`}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-1">
          <Link
            href={`/dashboard/supplier/ads/${campaign.id}/analytics`}
            className="flex-1"
          >
            <Button variant="ghost" size="sm" className="w-full gap-1 text-xs">
              <BarChart2 size={13} /> Xem analytics
            </Button>
          </Link>

          {campaign.status === 'active' && (
            <Button
              size="sm"
              variant="secondary"
              loading={pause.isPending}
              onClick={() => pause.mutate()}
              className="text-xs gap-1"
            >
              <Pause size={13} /> Tạm dừng
            </Button>
          )}

          {campaign.status === 'paused' && (
            <Button
              size="sm"
              loading={resume.isPending}
              onClick={() => resume.mutate()}
              className="text-xs gap-1"
            >
              <Play size={13} /> Tiếp tục
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CampaignList ──────────────────────────────────────────────────────────────

export function CampaignList() {
  const { accessToken } = useAuthStore();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<PaginatedCampaigns>({
    queryKey: ['supplier-campaigns', page],
    queryFn: () =>
      api.get<PaginatedCampaigns>(
        `/ads/campaigns?page=${page}&limit=${PAGE_SIZE}`,
        accessToken,
      ),
    enabled: !!accessToken,
    placeholderData: (prev) => prev,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center py-20 text-muted">
        <Loader2 size={28} className="animate-spin mr-2" /> Đang tải...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2 text-muted">
        <p className="text-sm">Không thể tải danh sách chiến dịch. Vui lòng thử lại.</p>
      </div>
    );
  }

  const campaigns = data?.data ?? [];

  if (campaigns.length === 0 && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-green flex items-center justify-center">
          <Megaphone size={28} className="text-primary" />
        </div>
        <div>
          <p className="font-semibold text-ink">Chưa có chiến dịch nào</p>
          <p className="text-sm text-muted mt-1">Tạo chiến dịch đầu tiên để tiếp cận khách hàng trên khắp Việt Nam</p>
        </div>
        <Link href="/dashboard/supplier/ads/new">
          <Button>Tạo chiến dịch mới</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaigns.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="gap-1"
          >
            <ChevronLeft size={14} /> Trước
          </Button>
          <span className="text-sm text-muted">
            Trang <span className="font-semibold text-ink">{page}</span> / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="gap-1"
          >
            Sau <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
