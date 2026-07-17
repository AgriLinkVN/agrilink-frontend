'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Calendar, Plus, Loader2, CheckCircle2, Edit3, AlertTriangle, Trash2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import type {
  HarvestSchedule,
  CreateHarvestPayload,
  Paginated,
  ProductUnit,
  RecordActualPayload,
  CooperativeMember,
} from '@/types/cooperative';

const UNITS: ProductUnit[] = ['kg', 'ton', 'box', 'bunch', 'liter', 'piece'];

function toIsoToday() {
  return new Date().toISOString().slice(0, 10);
}

export function HarvestCalendar() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [from, setFrom] = useState(toIsoToday());
  const [to, setTo] = useState(() =>
    new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
  );
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, isError } = useQuery<Paginated<HarvestSchedule>>({
    queryKey: ['harvest', from, to],
    queryFn: () =>
      api.get<Paginated<HarvestSchedule>>(
        `/cooperatives/harvest-schedules?from=${from}&to=${to}&limit=100`,
        accessToken,
      ),
    enabled: !!accessToken,
  });

  const { data: members } = useQuery<Paginated<CooperativeMember>>({
    queryKey: ['coop-members', 'active', 'all'],
    queryFn: () =>
      api.get<Paginated<CooperativeMember>>(
        '/cooperatives/me/members?status=active&limit=100',
        accessToken,
      ),
    enabled: !!accessToken,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['harvest'] });

  const create = useMutation({
    mutationFn: (payload: CreateHarvestPayload) =>
      api.post('/cooperatives/harvest-schedules', payload, accessToken),
    onSuccess: () => {
      invalidate();
      setShowCreate(false);
    },
  });

  const recordActual = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RecordActualPayload }) =>
      api.patch(`/cooperatives/harvest-schedules/${id}/actual`, payload, accessToken),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/cooperatives/harvest-schedules/${id}`, accessToken),
    onSuccess: invalidate,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex items-end gap-3 flex-wrap">
        <Input
          label="Từ ngày"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="max-w-[180px]"
        />
        <Input
          label="Đến ngày"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="max-w-[180px]"
        />
        <Button onClick={() => setShowCreate((v) => !v)} className="gap-1">
          <Plus size={14} /> Thêm lịch
        </Button>
      </div>

      {showCreate && (
        <CreateHarvestForm
          members={members?.data ?? []}
          onCancel={() => setShowCreate(false)}
          onSubmit={(payload) => create.mutate(payload)}
          isPending={create.isPending}
          error={create.error?.message}
        />
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted">
          <Loader2 size={24} className="animate-spin mr-2" /> Đang tải...
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center py-20 gap-2 text-muted">
          <AlertTriangle size={28} className="text-error" />
          <p className="text-sm">Không thể tải lịch thu hoạch.</p>
        </div>
      ) : (data?.data ?? []).length === 0 ? (
        <div className="text-center py-20 text-muted text-sm">
          Không có lịch thu hoạch trong khoảng thời gian này.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-hairline overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-soft text-xs text-muted uppercase">
              <tr>
                <th className="text-left px-4 py-3">Ngày dự kiến</th>
                <th className="text-left px-4 py-3">Nông dân</th>
                <th className="text-right px-4 py-3">SL dự kiến</th>
                <th className="text-right px-4 py-3">SL thực tế</th>
                <th className="text-left px-4 py-3">Ghi chú</th>
                <th className="text-right px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {data!.data.map((h) => (
                <tr key={h.id} className="hover:bg-surface-soft">
                  <td className="px-4 py-3 font-medium text-ink">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-primary" />
                      {new Date(h.expectedDate).toLocaleDateString('vi-VN')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {h.farmer?.fullName ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-muted">
                    {h.estimatedQty != null
                      ? `${h.estimatedQty.toLocaleString('vi-VN')} ${h.unit ?? ''}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {h.actualQty != null ? (
                      <span className="font-semibold text-primary">
                        {h.actualQty.toLocaleString('vi-VN')} {h.unit ?? ''}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted truncate max-w-[180px]">
                    {h.note ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {h.actualQty == null ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1 text-xs text-green-600 hover:bg-green-50"
                          onClick={() => {
                            const date = window.prompt(
                              'Ngày thực tế (YYYY-MM-DD):',
                              h.expectedDate,
                            );
                            if (!date) return;
                            const qty = window.prompt('Sản lượng thực tế:');
                            if (!qty) return;
                            recordActual.mutate({
                              id: h.id,
                              payload: {
                                actualDate: date,
                                actualQty: Number(qty),
                              },
                            });
                          }}
                        >
                          <CheckCircle2 size={13} /> Ghi nhận
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1 text-xs"
                          onClick={() => {
                            const qty = window.prompt(
                              'Cập nhật SL thực tế:',
                              String(h.actualQty ?? ''),
                            );
                            if (!qty) return;
                            recordActual.mutate({
                              id: h.id,
                              payload: {
                                actualDate: h.actualDate ?? h.expectedDate,
                                actualQty: Number(qty),
                              },
                            });
                          }}
                        >
                          <Edit3 size={13} />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 text-xs text-red-500 hover:bg-red-50"
                        onClick={() => {
                          if (window.confirm('Xóa lịch này?')) remove.mutate(h.id);
                        }}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Inline create form ───────────────────────────────────────────────────────

function CreateHarvestForm({
  members,
  onCancel,
  onSubmit,
  isPending,
  error,
}: {
  members: CooperativeMember[];
  onCancel: () => void;
  onSubmit: (p: CreateHarvestPayload) => void;
  isPending: boolean;
  error?: string;
}) {
  const [form, setForm] = useState<CreateHarvestPayload>({
    expectedDate: toIsoToday(),
    farmerId: undefined,
  });

  const canSubmit = form.farmerId && form.expectedDate;

  return (
    <div className="bg-white rounded-xl border border-hairline p-5 flex flex-col gap-4">
      <h3 className="font-semibold text-ink">Tạo lịch thu hoạch mới</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Thành viên *</label>
          <select
            value={form.farmerId ?? ''}
            onChange={(e) =>
              setForm({ ...form, farmerId: e.target.value || undefined })
            }
            className="h-11 px-3 rounded-lg border border-border-strong bg-white text-sm focus:outline-none focus:border-primary"
          >
            <option value="">-- Chọn thành viên --</option>
            {members.map((m) => (
              <option key={m.id} value={m.farmerId}>
                {m.farmer?.fullName ?? m.farmerId}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Ngày dự kiến *"
          type="date"
          value={form.expectedDate}
          onChange={(e) => setForm({ ...form, expectedDate: e.target.value })}
        />

        <Input
          label="SL dự kiến"
          type="number"
          min={0}
          step={0.01}
          value={form.estimatedQty ?? ''}
          onChange={(e) =>
            setForm({
              ...form,
              estimatedQty: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Đơn vị</label>
          <select
            value={form.unit ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                unit: (e.target.value as ProductUnit) || undefined,
              })
            }
            className="h-11 px-3 rounded-lg border border-border-strong bg-white text-sm focus:outline-none focus:border-primary"
          >
            <option value="">--</option>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Ghi chú</label>
        <textarea
          value={form.note ?? ''}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          rows={2}
          maxLength={500}
          className="w-full px-3 py-2 rounded-lg border border-border-strong text-sm bg-white focus:outline-none focus:border-primary"
        />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onSubmit(form)}
          disabled={!canSubmit}
          loading={isPending}
        >
          Tạo lịch
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
      </div>
    </div>
  );
}
