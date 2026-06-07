'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Loader2, MapPin, Calendar, Phone, Package, AlertTriangle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { PROVINCES } from '@/lib/provinces';
import type { BulkListing, FarmingType, Paginated } from '@/types/cooperative';

const FARMING: Array<{ value: FarmingType; label: string }> = [
  { value: 'organic', label: 'Hữu cơ' },
  { value: 'vietgap', label: 'VietGAP' },
  { value: 'globalgap', label: 'GlobalGAP' },
  { value: 'traditional', label: 'Truyền thống' },
];

export function PublicBulkListings() {
  const [provinceId, setProvinceId] = useState<number | undefined>(undefined);
  const [farmingType, setFarmingType] = useState<FarmingType | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<Paginated<BulkListing>>({
    queryKey: ['public-bulk', provinceId, farmingType, page],
    queryFn: () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '12',
      });
      if (provinceId) params.set('provinceId', String(provinceId));
      if (farmingType) params.set('farmingType', farmingType);
      return api.get<Paginated<BulkListing>>(
        `/cooperatives/bulk-listings?${params}`,
      );
    },
    placeholderData: (prev) => prev,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex items-end gap-3 flex-wrap bg-white border border-hairline rounded-xl p-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">Tỉnh</label>
          <select
            value={provinceId ?? ''}
            onChange={(e) => {
              setPage(1);
              setProvinceId(e.target.value ? Number(e.target.value) : undefined);
            }}
            className="h-10 min-w-[180px] px-3 rounded-lg border border-border-strong bg-white text-sm focus:outline-none focus:border-primary"
          >
            <option value="">-- Toàn quốc --</option>
            {PROVINCES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted">Phương thức</label>
          <select
            value={farmingType ?? ''}
            onChange={(e) => {
              setPage(1);
              setFarmingType((e.target.value as FarmingType) || undefined);
            }}
            className="h-10 min-w-[160px] px-3 rounded-lg border border-border-strong bg-white text-sm focus:outline-none focus:border-primary"
          >
            <option value="">Tất cả</option>
            {FARMING.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="flex items-center justify-center py-20 text-muted">
          <Loader2 size={24} className="animate-spin mr-2" /> Đang tải...
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center py-20 gap-2 text-muted">
          <AlertTriangle size={28} className="text-error" />
          <p className="text-sm">Không thể tải dữ liệu.</p>
        </div>
      ) : (data?.data ?? []).length === 0 ? (
        <div className="text-center py-20 text-muted">
          <Package size={36} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không có lô hàng nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data!.data.map((bl) => {
            const province = bl.provinceId
              ? PROVINCES.find((p) => p.id === bl.provinceId)?.name
              : null;
            return (
              <div
                key={bl.id}
                className="bg-white rounded-xl border border-hairline card-shadow p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-ink leading-snug">{bl.title}</h3>
                {bl.description && (
                  <p className="text-xs text-muted line-clamp-2">
                    {bl.description}
                  </p>
                )}
                <div className="text-sm">
                  <span className="font-bold text-ink">
                    {bl.totalQuantity.toLocaleString('vi-VN')} {bl.unit}
                  </span>
                  <span className="mx-1.5 text-muted">·</span>
                  <span className="font-bold text-primary">
                    {bl.pricePerUnit.toLocaleString('vi-VN')}đ/{bl.unit}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted">
                  {province && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {province}
                    </span>
                  )}
                  {bl.farmingType && (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold uppercase">
                      {bl.farmingType}
                    </span>
                  )}
                </div>
                {(bl.harvestDateFrom || bl.harvestDateTo) && (
                  <p className="text-xs text-muted flex items-center gap-1">
                    <Calendar size={11} />
                    {bl.harvestDateFrom
                      ? new Date(bl.harvestDateFrom).toLocaleDateString('vi-VN')
                      : '?'}{' '}
                    →{' '}
                    {bl.harvestDateTo
                      ? new Date(bl.harvestDateTo).toLocaleDateString('vi-VN')
                      : '?'}
                  </p>
                )}
                <div className="mt-auto flex gap-2 pt-1">
                  <Link href={`/marketplace/bulk-listings/${bl.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      Xem chi tiết
                    </Button>
                  </Link>
                  {bl.cooperative?.fullName && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary"
                      title={bl.cooperative.fullName}
                    >
                      <Phone size={13} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {data && data.total > 12 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            size="sm"
            variant="ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Trước
          </Button>
          <span className="text-sm text-muted">
            Trang {page} / {Math.ceil(data.total / 12)}
          </span>
          <Button
            size="sm"
            variant="ghost"
            disabled={page >= Math.ceil(data.total / 12)}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
