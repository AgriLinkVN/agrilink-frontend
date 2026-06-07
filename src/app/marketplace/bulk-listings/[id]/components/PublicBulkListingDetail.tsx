'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, MapPin, Sprout, Loader2, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { PROVINCES } from '@/lib/provinces';
import type { BulkListing, BulkListingContribution } from '@/types/cooperative';

interface Props {
  id: string;
}

export function PublicBulkListingDetail({ id }: Props) {
  const { data: listing, isLoading, isError } = useQuery<BulkListing>({
    queryKey: ['public-bulk', id],
    queryFn: () => api.get<BulkListing>(`/cooperatives/bulk-listings/${id}`),
  });

  const { data: contribs } = useQuery<BulkListingContribution[]>({
    queryKey: ['public-bulk-contributions', id],
    queryFn: () =>
      api.get<BulkListingContribution[]>(
        `/cooperatives/bulk-listings/${id}/contributions`,
      ),
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
        <p className="text-sm text-error">Lô hàng không tồn tại hoặc đã đóng.</p>
        <Link href="/marketplace/bulk-listings">
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

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/marketplace/bulk-listings"
        className="text-sm text-muted hover:text-ink flex items-center gap-1 w-fit"
      >
        <ArrowLeft size={14} /> Danh sách lô hàng
      </Link>

      <div className="bg-white rounded-xl border border-hairline p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-ink">{listing.title}</h1>

        {listing.cooperative?.fullName && (
          <p className="text-sm text-muted">
            HTX:{' '}
            <span className="font-semibold text-ink">
              {listing.cooperative.fullName}
            </span>
          </p>
        )}

        {listing.description && (
          <p className="text-sm text-body-text whitespace-pre-line leading-relaxed">
            {listing.description}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <p className="text-xs text-muted uppercase font-semibold mb-0.5">
              Tổng SL
            </p>
            <p className="font-bold text-ink">
              {listing.totalQuantity.toLocaleString('vi-VN')} {listing.unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase font-semibold mb-0.5">Giá</p>
            <p className="font-bold text-primary text-lg">
              {listing.pricePerUnit.toLocaleString('vi-VN')}đ
            </p>
            <p className="text-xs text-muted">/ {listing.unit}</p>
          </div>
          {listing.farmingType && (
            <div>
              <p className="text-xs text-muted uppercase font-semibold mb-0.5">
                Canh tác
              </p>
              <p className="flex items-center gap-1 font-semibold text-ink">
                <Sprout size={13} /> {listing.farmingType}
              </p>
            </div>
          )}
          {province && (
            <div>
              <p className="text-xs text-muted uppercase font-semibold mb-0.5">
                Tỉnh
              </p>
              <p className="flex items-center gap-1 font-semibold text-ink">
                <MapPin size={13} /> {province}
              </p>
            </div>
          )}
        </div>

        {(listing.harvestDateFrom || listing.harvestDateTo) && (
          <p className="text-sm text-muted flex items-center gap-1">
            <Calendar size={13} />
            Thu hoạch:{' '}
            {listing.harvestDateFrom
              ? new Date(listing.harvestDateFrom).toLocaleDateString('vi-VN')
              : '?'}{' '}
            →{' '}
            {listing.harvestDateTo
              ? new Date(listing.harvestDateTo).toLocaleDateString('vi-VN')
              : '?'}
          </p>
        )}

        {/* Coverage progress */}
        <div className="pt-3 border-t border-hairline">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted">
              Tiến độ tổng hợp từ {contribs?.length ?? 0} thành viên
            </span>
            <span className="font-semibold text-ink">
              {contributedSum.toLocaleString('vi-VN')} /{' '}
              {listing.totalQuantity.toLocaleString('vi-VN')} {listing.unit}
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Math.round(
                    (contributedSum / Math.max(listing.totalQuantity, 1)) * 100,
                  ),
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Public contributors list */}
      {contribs && contribs.length > 0 && (
        <div className="bg-white rounded-xl border border-hairline overflow-hidden">
          <div className="p-5 border-b border-hairline flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <h2 className="font-semibold text-ink">
              Thành viên đóng góp ({contribs.length})
            </h2>
          </div>
          <ul className="divide-y divide-hairline">
            {contribs.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-full bg-primary-light text-white flex items-center justify-center text-xs font-bold">
                  {(c.farmer?.fullName ?? '?').charAt(0)}
                </div>
                <span className="flex-1 text-sm text-ink truncate">
                  {c.farmer?.fullName ?? 'Nông dân'}
                </span>
                <span className="text-sm font-semibold text-primary">
                  {c.quantity.toLocaleString('vi-VN')} {c.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        💡 Liên hệ trực tiếp HTX qua thông tin trên hồ sơ để thương lượng đặt hàng số
        lượng lớn.
      </div>
    </div>
  );
}
