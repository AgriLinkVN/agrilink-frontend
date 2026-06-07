'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { PROVINCES } from '@/lib/provinces';
import type {
  CreateBulkListingPayload,
  FarmingType,
  ProductUnit,
} from '@/types/cooperative';

const UNITS: ProductUnit[] = ['kg', 'ton', 'box', 'bunch', 'liter', 'piece'];
const FARMING: Array<{ value: FarmingType; label: string }> = [
  { value: 'organic', label: 'Hữu cơ' },
  { value: 'vietgap', label: 'VietGAP' },
  { value: 'globalgap', label: 'GlobalGAP' },
  { value: 'traditional', label: 'Truyền thống' },
];

export function NewBulkListingForm() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const [error, setError] = useState('');

  const [form, setForm] = useState<CreateBulkListingPayload>({
    title: '',
    description: '',
    totalQuantity: 0,
    unit: 'kg',
    pricePerUnit: 0,
  });

  const submit = useMutation({
    mutationFn: () =>
      api.post('/cooperatives/me/bulk-listings', form, accessToken),
    onSuccess: () => {
      router.push('/dashboard/cooperative/bulk-listings');
    },
    onError: (err: Error) => setError(err.message),
  });

  const canSubmit =
    form.title.trim().length >= 5 &&
    form.totalQuantity > 0 &&
    form.pricePerUnit >= 1000;

  return (
    <div className="max-w-2xl bg-white rounded-xl border border-hairline p-6 flex flex-col gap-5">
      <Input
        label="Tiêu đề lô hàng *"
        placeholder="VD: Thu mua xoài cát Hòa Lộc vụ tháng 6"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        minLength={5}
        maxLength={255}
        hint={`${form.title.length}/255`}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Mô tả</label>
        <textarea
          value={form.description ?? ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          maxLength={2000}
          placeholder="Mô tả chi tiết về chất lượng, giống, điều kiện thu mua..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-border-strong text-sm bg-white focus:outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Tổng số lượng *"
          type="number"
          min={0}
          step={0.01}
          value={form.totalQuantity || ''}
          onChange={(e) =>
            setForm({ ...form, totalQuantity: Number(e.target.value) })
          }
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Đơn vị *</label>
          <select
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value as ProductUnit })}
            className="h-11 px-3 rounded-lg border border-border-strong bg-white text-sm focus:outline-none focus:border-primary"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Giá / đơn vị (VNĐ) *"
          type="number"
          min={1000}
          value={form.pricePerUnit || ''}
          onChange={(e) =>
            setForm({ ...form, pricePerUnit: Number(e.target.value) })
          }
          hint="≥ 1.000đ"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Phương thức canh tác</label>
          <select
            value={form.farmingType ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                farmingType: (e.target.value as FarmingType) || undefined,
              })
            }
            className="h-11 px-3 rounded-lg border border-border-strong bg-white text-sm focus:outline-none focus:border-primary"
          >
            <option value="">-- Không chọn --</option>
            {FARMING.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Tỉnh</label>
          <select
            value={form.provinceId ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                provinceId: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="h-11 px-3 rounded-lg border border-border-strong bg-white text-sm focus:outline-none focus:border-primary"
          >
            <option value="">-- Toàn quốc --</option>
            {PROVINCES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Thu hoạch từ"
          type="date"
          value={form.harvestDateFrom ?? ''}
          onChange={(e) =>
            setForm({ ...form, harvestDateFrom: e.target.value || undefined })
          }
        />
        <Input
          label="Thu hoạch đến"
          type="date"
          value={form.harvestDateTo ?? ''}
          onChange={(e) =>
            setForm({ ...form, harvestDateTo: e.target.value || undefined })
          }
        />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={() => submit.mutate()}
          disabled={!canSubmit}
          loading={submit.isPending}
          size="lg"
        >
          {submit.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
          Tạo lô hàng
        </Button>
        <Button variant="ghost" onClick={() => router.back()}>
          Hủy
        </Button>
      </div>
      <p className="text-xs text-muted">
        Lô hàng sẽ ở trạng thái <strong>chờ duyệt</strong>. Bạn có thể publish ngay
        sau khi tạo, hoặc chờ admin xét duyệt nếu cần.
      </p>
    </div>
  );
}
