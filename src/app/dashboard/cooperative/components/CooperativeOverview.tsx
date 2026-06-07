'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Users, Package, TrendingUp, Calendar, Plus, ArrowRight, Clock, Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import type {
  CooperativeMember,
  BulkListing,
  HarvestSchedule,
  Paginated,
  ProductionReport,
} from '@/types/cooperative';

const STATUS_LABEL: Record<BulkListing['status'], string> = {
  draft: 'Nháp',
  pending_approval: 'Chờ duyệt',
  active: 'Đang chạy',
  out_of_stock: 'Hết hàng',
  rejected: 'Từ chối',
  archived: 'Lưu trữ',
  suspended: 'Tạm dừng',
};

export function CooperativeOverview() {
  const { accessToken } = useAuthStore();

  const { data: members } = useQuery<Paginated<CooperativeMember>>({
    queryKey: ['coop-members', 'pending'],
    queryFn: () =>
      api.get<Paginated<CooperativeMember>>(
        '/cooperatives/me/members?status=pending&limit=5',
        accessToken,
      ),
    enabled: !!accessToken,
  });

  const { data: activeMembers } = useQuery<Paginated<CooperativeMember>>({
    queryKey: ['coop-members', 'active-count'],
    queryFn: () =>
      api.get<Paginated<CooperativeMember>>(
        '/cooperatives/me/members?status=active&limit=1',
        accessToken,
      ),
    enabled: !!accessToken,
  });

  const { data: listings } = useQuery<Paginated<BulkListing>>({
    queryKey: ['coop-bulk', 'active'],
    queryFn: () =>
      api.get<Paginated<BulkListing>>(
        '/cooperatives/me/bulk-listings?status=active&limit=5',
        accessToken,
      ),
    enabled: !!accessToken,
  });

  const { data: harvests } = useQuery<Paginated<HarvestSchedule>>({
    queryKey: ['coop-harvest', 'upcoming'],
    queryFn: () => {
      const today = new Date().toISOString().slice(0, 10);
      const in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
      return api.get<Paginated<HarvestSchedule>>(
        `/cooperatives/harvest-schedules?from=${today}&to=${in30}&limit=10`,
        accessToken,
      );
    },
    enabled: !!accessToken,
  });

  const { data: report } = useQuery<ProductionReport>({
    queryKey: ['coop-report-summary'],
    queryFn: () =>
      api.get<ProductionReport>('/cooperatives/me/reports/production', accessToken),
    enabled: !!accessToken,
  });

  if (!accessToken) {
    return (
      <div className="flex items-center justify-center py-20 text-muted">
        <Loader2 size={24} className="animate-spin mr-2" /> Đang tải...
      </div>
    );
  }

  const pendingCount = members?.total ?? 0;
  const activeCount = activeMembers?.total ?? 0;
  const activeListings = listings?.data ?? [];
  const upcomingHarvests = harvests?.total ?? 0;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Thành viên active"
          value={activeCount}
          subtitle={pendingCount > 0 ? `${pendingCount} chờ duyệt` : 'Tất cả đã duyệt'}
          icon={Users}
          variant="green"
        />
        <StatCard
          title="Lô hàng đang chạy"
          value={listings?.total ?? 0}
          icon={Package}
          variant="default"
        />
        <StatCard
          title="Sản lượng thực tế"
          value={`${(report?.totalActual ?? 0).toLocaleString('vi-VN')}`}
          subtitle={`Dự kiến: ${(report?.totalEstimated ?? 0).toLocaleString('vi-VN')}`}
          icon={TrendingUp}
          variant="harvest"
        />
        <StatCard
          title="Lịch thu hoạch 30 ngày"
          value={upcomingHarvests}
          icon={Calendar}
          variant="accent"
        />
      </div>

      {pendingCount > 0 && (
        <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-xl p-4 flex items-center gap-3 mb-6">
          <Clock size={18} className="text-[#854D0E] shrink-0" />
          <p className="text-sm text-[#854D0E]">
            <span className="font-semibold">{pendingCount} nông dân</span> đang chờ
            duyệt tham gia HTX.
          </p>
          <Button size="sm" className="ml-auto shrink-0" asChild>
            <Link href="/dashboard/cooperative/members">Xem & Duyệt</Link>
          </Button>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/dashboard/cooperative/bulk-listings/new">
            <Plus size={16} /> Đăng lô hàng mới
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active bulk listings */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl border border-hairline card-shadow">
            <div className="flex items-center justify-between p-5 border-b border-hairline">
              <h2 className="font-semibold text-ink">Lô hàng đang chạy</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/cooperative/bulk-listings">
                  Xem tất cả <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
            <div className="divide-y divide-hairline-soft">
              {activeListings.length === 0 ? (
                <div className="p-8 text-center text-muted text-sm">
                  Chưa có lô hàng đang chạy. Tạo lô hàng đầu tiên ngay!
                </div>
              ) : (
                activeListings.map((bl) => (
                  <Link
                    key={bl.id}
                    href={`/dashboard/cooperative/bulk-listings/${bl.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-surface-soft transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center text-xl shrink-0">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">
                        {bl.title}
                      </p>
                      <p className="text-xs text-muted">
                        {bl.totalQuantity.toLocaleString('vi-VN')} {bl.unit} ·{' '}
                        {bl.pricePerUnit.toLocaleString('vi-VN')}đ/{bl.unit}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">
                      {STATUS_LABEL[bl.status]}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pending members */}
        <div>
          <div className="bg-white rounded-xl border border-hairline card-shadow">
            <div className="flex items-center justify-between p-5 border-b border-hairline">
              <h2 className="font-semibold text-ink">
                Chờ duyệt ({pendingCount})
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/cooperative/members">Xem</Link>
              </Button>
            </div>
            <div className="divide-y divide-hairline-soft">
              {(members?.data ?? []).length === 0 ? (
                <div className="p-6 text-center text-muted text-sm">
                  Không có yêu cầu mới.
                </div>
              ) : (
                (members?.data ?? []).map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-4">
                    <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {(m.farmer?.fullName ?? '?').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">
                        {m.farmer?.fullName ?? 'Nông dân'}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {m.joinRequestNote ?? 'Không có ghi chú'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
