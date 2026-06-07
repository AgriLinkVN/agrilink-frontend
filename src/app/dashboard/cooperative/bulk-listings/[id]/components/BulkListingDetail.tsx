'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Sprout, Users, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { PROVINCES } from '@/lib/provinces';
import type { BulkListing, BulkListingContribution } from '@/types/cooperative';

interface Props {
  id: string;
}

export function BulkListingDetail({ id }: Props) {
  const { accessToken } = useAuthStore();

  const { data: listing, isLoading, isError } = useQuery<BulkListing>({
    queryKey: ['bulk-listing', id],
    queryFn: () => api.get<BulkListing>(`/cooperatives/bulk-listings/${id}`),
  });

  const { data: contribs } = useQuery<BulkListingContribution[]>({
    queryKey: ['bulk-listing-contributions', id],
    queryFn: () =>
      api.get<BulkListingContribution[]>(
        `/cooperatives/bulk-listings/${id}/contributions`,
        accessToken,
      ),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted">
        <Loader2 size={24} className="animate-spin mr-2" /> Đang tải...
      </div>
    );
  }
  if (isError || !listing) {
    return (
      <div className="flex flex-col items-center py-20 gap-3">
        <p className="text-sm text-error">Không thể tải lô hàng.</p>
        <Link href="/dashboard/cooperative/bulk-listings">
          <Button variant="secondary" size="sm">
            <ArrowLeft size={14} /> Quay lại
          </Button>
        </Link>
      </div>
    );
  }

  const province = listing.provinceId
    ? PROVINCES.find((p) => p.id === listing.provinceId)?.name
    : null;

  const contributedSum = (contribs ?? []).reduce((s, c) => s + c.quantity, 0);
  const pct =
    listing.totalQuantity > 0
      ? Math.min(100, Math.round((contributedSum / listing.totalQuantity) * 100))
      : 0;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <Link
        href="/dashboard/cooperative/bulk-listings"
        className="text-sm text-muted hover:text-ink flex items-center gap-1"
      >
        <ArrowLeft size={14} /> Danh sách lô hàng
      </Link>

      {/* Summary card */}
      <div className="bg-white rounded-xl border border-hairline p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-ink">{listing.title}</h1>
        {listing.description && (
          <p className="text-sm text-muted whitespace-pre-line">
            {listing.description}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted uppercase font-semibold mb-0.5">Tổng SL</p>
            <p className="font-bold text-ink">
              {listing.totalQuantity.toLocaleString('vi-VN')} {listing.unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase font-semibold mb-0.5">Giá</p>
            <p className="font-bold text-primary">
              {listing.pricePerUnit.toLocaleString('vi-VN')}đ/{listing.unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase font-semibold mb-0.5">Trạng thái</p>
            <p className="font-semibold text-ink">{listing.status}</p>
          </div>
          {listing.farmingType && (
            <div>
              <p className="text-xs text-muted uppercase font-semibold mb-0.5">Canh tác</p>
              <p className="flex items-center gap-1 font-semibold text-ink">
                <Sprout size={13} /> {listing.farmingType}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted">
          {province && (
            <p className="flex items-center gap-1">
              <MapPin size={11} /> {province}
            </p>
          )}
          {(listing.harvestDateFrom || listing.harvestDateTo) && (
            <p className="flex items-center gap-1">
              <Calendar size={11} />
              {listing.harvestDateFrom
                ? new Date(listing.harvestDateFrom).toLocaleDateString('vi-VN')
                : '?'}{' '}
              →{' '}
              {listing.harvestDateTo
                ? new Date(listing.harvestDateTo).toLocaleDateString('vi-VN')
                : '?'}
            </p>
          )}
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>
              Đã đóng góp: {contributedSum.toLocaleString('vi-VN')} / {listing.totalQuantity.toLocaleString('vi-VN')} {listing.unit}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contributions */}
      <div className="bg-white rounded-xl border border-hairline overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-hairline">
          <h2 className="font-semibold text-ink flex items-center gap-2">
            <Users size={16} /> Đóng góp từ thành viên ({contribs?.length ?? 0})
          </h2>
        </div>
        {(contribs ?? []).length === 0 ? (
          <div className="p-10 text-center text-muted text-sm">
            Chưa có thành viên nào đóng góp vào lô hàng này.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-soft text-xs text-muted uppercase">
              <tr>
                <th className="text-left px-4 py-3">Thành viên</th>
                <th className="text-left px-4 py-3">SĐT</th>
                <th className="text-right px-4 py-3">Số lượng</th>
                <th className="text-left px-4 py-3">Đóng góp lúc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {(contribs ?? []).map((c) => (
                <tr key={c.id} className="hover:bg-surface-soft">
                  <td className="px-4 py-3 font-medium text-ink">
                    {c.farmer?.fullName ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted">{c.farmer?.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">
                    {c.quantity.toLocaleString('vi-VN')} {c.unit}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(c.createdAt).toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
