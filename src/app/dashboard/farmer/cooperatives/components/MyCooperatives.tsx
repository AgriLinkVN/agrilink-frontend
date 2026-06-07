'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Building2, Loader2, LogOut, AlertTriangle, UserPlus } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ConfirmContributionsDialog,
  type AffectedBulkListing,
} from '@/components/ConfirmContributionsDialog';
import { useAuthStore } from '@/store/authStore';
import type { CooperativeMember } from '@/types/cooperative';

export function MyCooperatives() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [joinCoopId, setJoinCoopId] = useState('');
  const [joinNote, setJoinNote] = useState('');
  const [joinError, setJoinError] = useState('');
  const [leaveConfirm, setLeaveConfirm] = useState<{
    cooperativeId: string;
    cooperativeName: string;
    affected: AffectedBulkListing[];
  } | null>(null);

  const { data, isLoading, isError } = useQuery<CooperativeMember[]>({
    queryKey: ['my-cooperatives'],
    queryFn: () =>
      api.get<CooperativeMember[]>(
        '/cooperatives/me/my-cooperatives',
        accessToken,
      ),
    enabled: !!accessToken,
  });

  const join = useMutation({
    mutationFn: () =>
      api.post(
        `/cooperatives/${joinCoopId}/members/join`,
        { note: joinNote || undefined },
        accessToken,
      ),
    onSuccess: () => {
      setJoinCoopId('');
      setJoinNote('');
      setJoinError('');
      alert('Đã gửi yêu cầu gia nhập! Chờ HTX duyệt.');
    },
    onError: (err: Error) => setJoinError(err.message),
  });

  const leave = useMutation({
    mutationFn: ({
      cooperativeId,
      force,
    }: {
      cooperativeId: string;
      force?: boolean;
    }) =>
      api.post(
        `/cooperatives/${cooperativeId}/members/leave${force ? '?force=true' : ''}`,
        {},
        accessToken,
      ),
    onSuccess: () => {
      setLeaveConfirm(null);
      queryClient.invalidateQueries({ queryKey: ['my-cooperatives'] });
    },
  });

  const handleLeave = async (cooperativeId: string, cooperativeName: string) => {
    if (!window.confirm(`Rời "${cooperativeName}"?`)) return;
    try {
      await leave.mutateAsync({ cooperativeId });
    } catch (err) {
      if (
        err instanceof ApiError &&
        err.status === 409 &&
        err.body.code === 'MEMBER_HAS_ACTIVE_CONTRIBUTIONS'
      ) {
        setLeaveConfirm({
          cooperativeId,
          cooperativeName,
          affected: (err.body.affectedBulkListings ?? []) as AffectedBulkListing[],
        });
      } else {
        window.alert(err instanceof Error ? err.message : 'Lỗi không xác định');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Join form */}
      <div className="bg-white rounded-xl border border-hairline p-5 flex flex-col gap-3">
        <h2 className="font-semibold text-ink flex items-center gap-2">
          <UserPlus size={16} /> Xin gia nhập HTX
        </h2>
        <Input
          label="ID HTX (lấy từ HTX bạn muốn tham gia)"
          placeholder="VD: 9c2a8f6e-..."
          value={joinCoopId}
          onChange={(e) => setJoinCoopId(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Ghi chú (tùy chọn)</label>
          <textarea
            value={joinNote}
            onChange={(e) => setJoinNote(e.target.value)}
            rows={2}
            maxLength={500}
            placeholder="Tôi muốn gia nhập HTX để..."
            className="w-full px-3 py-2 rounded-lg border border-border-strong text-sm bg-white focus:outline-none focus:border-primary"
          />
        </div>
        {joinError && <p className="text-sm text-error">{joinError}</p>}
        <Button
          onClick={() => join.mutate()}
          disabled={joinCoopId.length < 10}
          loading={join.isPending}
          className="self-start gap-1"
        >
          <UserPlus size={14} /> Gửi yêu cầu
        </Button>
      </div>

      {/* My active cooperatives */}
      <div>
        <h2 className="font-semibold text-ink mb-3 flex items-center gap-2">
          <Building2 size={16} /> HTX bạn đang là thành viên
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted">
            <Loader2 size={20} className="animate-spin mr-2" /> Đang tải...
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center py-10 gap-2 text-muted">
            <AlertTriangle size={24} className="text-error" />
            <p className="text-sm">Không thể tải HTX của bạn.</p>
          </div>
        ) : (data ?? []).length === 0 ? (
          <div className="bg-surface-soft rounded-xl p-10 text-center text-muted">
            <Building2 size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">
              Bạn chưa gia nhập HTX nào. Hãy gửi yêu cầu ở trên!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data ?? []).map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-hairline p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-white font-bold text-lg">
                  {(m.cooperative?.fullName ?? '?').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink truncate">
                    {m.cooperative?.fullName ?? 'HTX'}
                  </p>
                  <p className="text-xs text-muted">
                    Gia nhập:{' '}
                    {m.approvedAt
                      ? new Date(m.approvedAt).toLocaleDateString('vi-VN')
                      : '—'}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  loading={
                    leave.isPending &&
                    leave.variables?.cooperativeId === m.cooperativeId
                  }
                  onClick={() =>
                    handleLeave(
                      m.cooperativeId,
                      m.cooperative?.fullName ?? 'HTX này',
                    )
                  }
                  className="text-red-500 gap-1 text-xs hover:bg-red-50"
                >
                  <LogOut size={13} /> Rời
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmContributionsDialog
        open={!!leaveConfirm}
        title={`Rời "${leaveConfirm?.cooperativeName ?? 'HTX'}"?`}
        description="Bạn đang đóng góp vào các lô hàng đang active. Sản lượng đã ghi nhận trong các lô này sẽ vẫn được giữ — HTX vẫn có nghĩa vụ giao cho người mua. Bạn vẫn muốn rời?"
        confirmLabel="Vẫn rời HTX"
        affected={leaveConfirm?.affected ?? []}
        loading={leave.isPending}
        onCancel={() => setLeaveConfirm(null)}
        onConfirm={() => {
          if (!leaveConfirm) return;
          leave.mutate({
            cooperativeId: leaveConfirm.cooperativeId,
            force: true,
          });
        }}
      />
    </div>
  );
}
