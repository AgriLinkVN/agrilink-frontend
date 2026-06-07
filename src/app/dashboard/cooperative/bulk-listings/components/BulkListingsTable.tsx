'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Loader2, Eye, Send, Archive, AlertTriangle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import type { BulkListing, BulkStatus, Paginated } from '@/types/cooperative';

interface Props {
  initialStatus?: string;
}

const TABS: Array<{ key: BulkStatus | 'all'; label: string }> = [
  { key: 'all', label: 'Tất cả' },
  { key: 'draft', label: 'Nháp' },
  { key: 'pending_approval', label: 'Chờ duyệt' },
  { key: 'active', label: 'Đang chạy' },
  { key: 'archived', label: 'Đã lưu trữ' },
];

const STATUS_CLS: Record<BulkStatus, string> = {
  draft: 'bg-gray-100 text-gray-600',
  pending_approval: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  out_of_stock: 'bg-orange-100 text-orange-700',
  rejected: 'bg-red-100 text-red-700',
  archived: 'bg-purple-100 text-purple-700',
  suspended: 'bg-gray-200 text-gray-700',
};

const STATUS_LABEL: Record<BulkStatus, string> = {
  draft: 'Nháp',
  pending_approval: 'Chờ duyệt',
  active: 'Đang chạy',
  out_of_stock: 'Hết hàng',
  rejected: 'Từ chối',
  archived: 'Lưu trữ',
  suspended: 'Tạm dừng',
};

export function BulkListingsTable({ initialStatus }: Props) {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<BulkStatus | 'all'>(
    (TABS.some((t) => t.key === initialStatus)
      ? initialStatus
      : 'all') as BulkStatus | 'all',
  );
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<Paginated<BulkListing>>({
    queryKey: ['coop-bulk', tab, page],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (tab !== 'all') params.set('status', tab);
      return api.get<Paginated<BulkListing>>(
        `/cooperatives/me/bulk-listings?${params}`,
        accessToken,
      );
    },
    enabled: !!accessToken,
    placeholderData: (prev) => prev,
  });

  const publish = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/cooperatives/me/bulk-listings/${id}/publish`, {}, accessToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['coop-bulk'] }),
  });
  const archive = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/cooperatives/me/bulk-listings/${id}/archive`, {}, accessToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['coop-bulk'] }),
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / 12)) : 1;

  return (
    <>
      <div className="flex gap-1 bg-surface-soft p-1 rounded-xl border border-hairline mb-6 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setPage(1);
            }}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
              tab === t.key ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-ink',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && !data ? (
        <div className="flex items-center justify-center py-20 text-muted">
          <Loader2 size={24} className="animate-spin mr-2" /> Đang tải...
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center py-20 gap-2 text-muted">
          <AlertTriangle size={28} className="text-error" />
          <p className="text-sm">Không thể tải danh sách.</p>
        </div>
      ) : (data?.data ?? []).length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-sm">Chưa có lô hàng nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data!.data.map((bl) => (
            <div
              key={bl.id}
              className="bg-white rounded-xl border border-hairline card-shadow p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-ink leading-snug">{bl.title}</h3>
                <span
                  className={cn(
                    'text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                    STATUS_CLS[bl.status],
                  )}
                >
                  {STATUS_LABEL[bl.status]}
                </span>
              </div>

              <div className="text-sm text-muted">
                {bl.totalQuantity.toLocaleString('vi-VN')} {bl.unit} ·{' '}
                <span className="font-semibold text-primary">
                  {bl.pricePerUnit.toLocaleString('vi-VN')}đ
                </span>
                /{bl.unit}
              </div>

              {(bl.harvestDateFrom || bl.harvestDateTo) && (
                <p className="text-xs text-muted">
                  Thu hoạch:{' '}
                  {bl.harvestDateFrom
                    ? new Date(bl.harvestDateFrom).toLocaleDateString('vi-VN')
                    : '?'}{' '}
                  →{' '}
                  {bl.harvestDateTo
                    ? new Date(bl.harvestDateTo).toLocaleDateString('vi-VN')
                    : '?'}
                </p>
              )}

              <div className="flex items-center gap-2 mt-auto">
                <Link
                  href={`/dashboard/cooperative/bulk-listings/${bl.id}`}
                  className="flex-1"
                >
                  <Button variant="ghost" size="sm" className="w-full gap-1 text-xs">
                    <Eye size={13} /> Chi tiết
                  </Button>
                </Link>
                {bl.status === 'pending_approval' && (
                  <Button
                    size="sm"
                    loading={publish.isPending && publish.variables === bl.id}
                    onClick={() => publish.mutate(bl.id)}
                    className="gap-1 text-xs"
                  >
                    <Send size={13} /> Publish
                  </Button>
                )}
                {bl.status !== 'archived' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    loading={archive.isPending && archive.variables === bl.id}
                    onClick={() => {
                      if (window.confirm('Lưu trữ lô hàng này?'))
                        archive.mutate(bl.id);
                    }}
                    className="gap-1 text-xs text-orange-500 hover:bg-orange-50"
                  >
                    <Archive size={13} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <Button
            size="sm"
            variant="ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="gap-1"
          >
            <ChevronLeft size={14} /> Trước
          </Button>
          <span className="text-sm text-muted">
            Trang {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="ghost"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="gap-1"
          >
            Sau <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </>
  );
}
