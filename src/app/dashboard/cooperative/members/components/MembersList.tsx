'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Check, X, Loader2, Phone, AlertTriangle, UserCheck, UserX, Pause,
} from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  ConfirmContributionsDialog,
  type AffectedBulkListing,
} from '@/components/ConfirmContributionsDialog';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import type { CooperativeMember, Paginated, MemberStatus } from '@/types/cooperative';

interface Props {
  initialStatus: string;
}

const TABS: Array<{ key: MemberStatus | 'all'; label: string }> = [
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'active', label: 'Đang hoạt động' },
  { key: 'suspended', label: 'Tạm dừng' },
  { key: 'left', label: 'Đã rời / từ chối' },
  { key: 'all', label: 'Tất cả' },
];

export function MembersList({ initialStatus }: Props) {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<MemberStatus | 'all'>(
    (TABS.some((t) => t.key === initialStatus)
      ? initialStatus
      : 'pending') as MemberStatus | 'all',
  );
  const [page, setPage] = useState(1);
  const [suspendConfirm, setSuspendConfirm] = useState<{
    memberId: string;
    memberName: string;
    reason?: string;
    affected: AffectedBulkListing[];
  } | null>(null);

  const queryKey = ['coop-members', tab, page];

  const { data, isLoading, isError } = useQuery<Paginated<CooperativeMember>>({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (tab !== 'all') params.set('status', tab);
      return api.get<Paginated<CooperativeMember>>(
        `/cooperatives/me/members?${params}`,
        accessToken,
      );
    },
    enabled: !!accessToken,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['coop-members'] });
  };

  const approve = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/cooperatives/me/members/${id}/approve`, {}, accessToken),
    onSuccess: invalidate,
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.patch(`/cooperatives/me/members/${id}/reject`, { reason }, accessToken),
    onSuccess: invalidate,
  });

  const suspend = useMutation({
    mutationFn: ({
      id,
      reason,
      force,
    }: {
      id: string;
      reason?: string;
      force?: boolean;
    }) =>
      api.patch(
        `/cooperatives/me/members/${id}/suspend${force ? '?force=true' : ''}`,
        { reason },
        accessToken,
      ),
    onSuccess: () => {
      setSuspendConfirm(null);
      invalidate();
    },
  });

  const reactivate = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/cooperatives/me/members/${id}/reactivate`, {}, accessToken),
    onSuccess: invalidate,
  });

  const handleReject = (id: string) => {
    const reason = window.prompt('Lý do từ chối (tối thiểu 5 ký tự):');
    if (reason && reason.trim().length >= 5) reject.mutate({ id, reason });
  };

  const handleSuspend = async (id: string, memberName: string) => {
    const reason = window.prompt('Lý do tạm dừng (không bắt buộc):') ?? undefined;
    try {
      await suspend.mutateAsync({ id, reason });
    } catch (err) {
      if (
        err instanceof ApiError &&
        err.status === 409 &&
        err.body.code === 'MEMBER_HAS_ACTIVE_CONTRIBUTIONS'
      ) {
        setSuspendConfirm({
          memberId: id,
          memberName,
          reason,
          affected: (err.body.affectedBulkListings ?? []) as AffectedBulkListing[],
        });
      } else {
        window.alert(err instanceof Error ? err.message : 'Lỗi không xác định');
      }
    }
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / 20)) : 1;

  return (
    <>
      {/* Tabs */}
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

      {/* List */}
      {isLoading ? (
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
          <p className="text-sm">Không có thành viên ở trạng thái này.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-hairline overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-soft text-xs text-muted uppercase">
              <tr>
                <th className="text-left px-4 py-3">Nông dân</th>
                <th className="text-left px-4 py-3">SĐT</th>
                <th className="text-left px-4 py-3">Ghi chú / Lý do</th>
                <th className="text-left px-4 py-3">Ngày yêu cầu</th>
                <th className="text-right px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {data!.data.map((m) => (
                <tr key={m.id} className="hover:bg-surface-soft">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-light text-white flex items-center justify-center text-xs font-bold">
                        {(m.farmer?.fullName ?? '?').charAt(0)}
                      </div>
                      <span className="font-medium text-ink">
                        {m.farmer?.fullName ?? '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {m.farmer?.phone ? (
                      <a
                        href={`tel:${m.farmer.phone}`}
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <Phone size={12} /> {m.farmer.phone}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted text-xs max-w-xs truncate">
                    {m.status === 'pending'
                      ? m.joinRequestNote ?? '—'
                      : m.rejectedReason ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {new Date(m.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {m.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            loading={
                              approve.isPending && approve.variables === m.id
                            }
                            onClick={() => approve.mutate(m.id)}
                            className="gap-1"
                          >
                            <Check size={13} /> Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReject(m.id)}
                            className="gap-1 text-red-500 hover:bg-red-50"
                          >
                            <X size={13} /> Từ chối
                          </Button>
                        </>
                      )}
                      {m.status === 'active' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleSuspend(m.id, m.farmer?.fullName ?? 'thành viên này')
                          }
                          className="gap-1 text-orange-500 hover:bg-orange-50"
                        >
                          <Pause size={13} /> Tạm dừng
                        </Button>
                      )}
                      {m.status === 'suspended' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          loading={
                            reactivate.isPending && reactivate.variables === m.id
                          }
                          onClick={() => reactivate.mutate(m.id)}
                          className="gap-1"
                        >
                          <UserCheck size={13} /> Kích hoạt
                        </Button>
                      )}
                      {m.status === 'left' && (
                        <span className="text-xs text-muted flex items-center gap-1">
                          <UserX size={12} /> Đã rời
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 p-4 border-t border-hairline">
              <Button
                size="sm"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Trước
              </Button>
              <span className="text-sm text-muted">
                Trang {page} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
      )}

      <ConfirmContributionsDialog
        open={!!suspendConfirm}
        title={`Tạm dừng ${suspendConfirm?.memberName ?? 'thành viên'}?`}
        description="Thành viên này đang có contribution trong các lô hàng đang active. Sản lượng đã ghi nhận sẽ được giữ nguyên, nhưng bạn cần thông báo cho người mua nếu có thay đổi."
        confirmLabel="Vẫn tạm dừng"
        affected={suspendConfirm?.affected ?? []}
        loading={suspend.isPending}
        onCancel={() => setSuspendConfirm(null)}
        onConfirm={() => {
          if (!suspendConfirm) return;
          suspend.mutate({
            id: suspendConfirm.memberId,
            reason: suspendConfirm.reason,
            force: true,
          });
        }}
      />
    </>
  );
}
