'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Check, X, ImageOff, MapPin, Globe, Eye, MousePointer,
  AlertTriangle, Clock, Loader2, BarChart2,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { type AdCampaign } from '@/types/ads';
import { PROVINCES } from '@/lib/provinces';
import { RejectModal } from './components/RejectModal';

// ── Status config (shared) ────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending_approval: { label: 'Chờ duyệt',  cls: 'bg-yellow-100 text-yellow-800' },
  active:           { label: 'Đang chạy',   cls: 'bg-green-100  text-green-800'  },
  paused:           { label: 'Tạm dừng',   cls: 'bg-gray-100   text-gray-600'   },
  rejected:         { label: 'Bị từ chối', cls: 'bg-red-100    text-red-800'    },
  expired:          { label: 'Hết hạn',    cls: 'bg-purple-100 text-purple-800' },
} as const;

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white',
        type === 'success' ? 'bg-green-600' : 'bg-red-600',
      )}
    >
      {type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
      {message}
    </div>
  );
}

// ── Info row helper ───────────────────────────────────────────────────────────

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
      <span className="text-xs font-semibold text-muted uppercase tracking-wide sm:w-36 shrink-0 mt-0.5">
        {label}
      </span>
      <span className="text-sm text-ink">{children}</span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminCampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const { data: campaign, isLoading, isError } = useQuery<AdCampaign>({
    queryKey: ['admin-campaign', id],
    queryFn: () => api.get<AdCampaign>(`/ads/admin/campaigns/${id}`, accessToken),
    enabled: !!accessToken && !!id,
  });

  const approve = useMutation({
    mutationFn: () => api.patch(`/ads/admin/campaigns/${id}/approve`, undefined, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['admin-campaign', id] });
      showToast('Chiến dịch đã được duyệt và kích hoạt!', 'success');
      setTimeout(() => router.push('/dashboard/admin/ads'), 1500);
    },
    onError: (err: Error) => showToast(err.message ?? 'Không thể duyệt. Thử lại sau.', 'error'),
  });

  const reject = useMutation({
    mutationFn: (reason: string) =>
      api.patch(`/ads/admin/campaigns/${id}/reject`, { reason }, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['admin-campaign', id] });
      setShowRejectModal(false);
      showToast('Chiến dịch đã bị từ chối.', 'success');
      setTimeout(() => router.push('/dashboard/admin/ads'), 1500);
    },
    onError: (err: Error) => showToast(err.message ?? 'Không thể từ chối. Thử lại sau.', 'error'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted">
        <Loader2 size={28} className="animate-spin mr-2" /> Đang tải...
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <AlertTriangle size={32} className="text-error" />
        <p className="text-sm text-muted">Không thể tải thông tin chiến dịch.</p>
        <Link href="/dashboard/admin/ads">
          <Button variant="secondary">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.pending_approval;
  // targetProvinces is already a number[] from the JSONB column
  const parsedProvinces: number[] = Array.isArray(campaign.targetProvinces)
    ? campaign.targetProvinces
    : [];
  const provinceNames = parsedProvinces.length === 0
    ? null
    : PROVINCES.filter((p) => parsedProvinces.includes(p.id)).map((p) => p.name).join(', ');

  const ctr =
    campaign.impressionCount > 0
      ? ((campaign.clickCount / campaign.impressionCount) * 100).toFixed(2)
      : '0.00';

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-hairline px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard/admin/ads" className="text-muted hover:text-ink transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold text-ink flex-1 truncate">{campaign.title}</h1>
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', statusCfg.cls)}>
          {statusCfg.label}
        </span>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Banner */}
        <div className="rounded-2xl overflow-hidden border border-hairline bg-surface-soft">
          {campaign.bannerUrl ? (
            <img src={campaign.bannerUrl} alt={campaign.title} className="w-full object-cover" />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center text-muted">
              <ImageOff size={36} />
            </div>
          )}
        </div>

        {/* Campaign info */}
        <div className="bg-white rounded-xl border border-hairline p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-ink">Thông tin chiến dịch</h2>
          <div className="flex flex-col gap-3">
            <InfoRow label="Supplier ID">
              <span className="font-mono text-xs">{campaign.advertiserId}</span>
            </InfoRow>
            <InfoRow label="Gói quảng cáo">
              {campaign.package?.name ?? '—'} — {campaign.package
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(campaign.package.price)
                : ''}
            </InfoRow>
            <InfoRow label="Thời hạn">
              {campaign.package?.durationDays ?? '—'} ngày
            </InfoRow>
            <InfoRow label="Link đích">
              {campaign.targetUrl ? (
                <a href={campaign.targetUrl} target="_blank" rel="noopener noreferrer"
                   className="text-primary hover:underline break-all">
                  {campaign.targetUrl}
                </a>
              ) : '—'}
            </InfoRow>
            <InfoRow label="Phạm vi">
              {parsedProvinces.length === 0 ? (
                <span className="flex items-center gap-1">
                  <Globe size={13} className="text-primary" /> Toàn quốc
                </span>
              ) : (
                <span className="flex items-start gap-1">
                  <MapPin size={13} className="text-primary mt-0.5 shrink-0" />
                  {provinceNames}
                </span>
              )}
            </InfoRow>
            <InfoRow label="Ngày tạo">
              {new Date(campaign.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </InfoRow>
            {campaign.startsAt && (
              <InfoRow label="Chạy từ">
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-muted" />
                  {new Date(campaign.startsAt).toLocaleDateString('vi-VN')}
                  {' → '}
                  {campaign.endsAt ? new Date(campaign.endsAt).toLocaleDateString('vi-VN') : '?'}
                </span>
              </InfoRow>
            )}
          </div>
        </div>

        {/* Active stats */}
        {campaign.status === 'active' && (
          <div className="bg-white rounded-xl border border-hairline p-6">
            <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <BarChart2 size={16} className="text-primary" /> Hiệu quả chiến dịch
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Lượt hiển thị', value: campaign.impressionCount.toLocaleString('vi-VN'), icon: Eye },
                { label: 'Lượt click', value: campaign.clickCount.toLocaleString('vi-VN'), icon: MousePointer },
                { label: 'CTR', value: `${ctr}%`, icon: BarChart2 },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-surface-soft">
                  <Icon size={18} className="text-primary" />
                  <span className="text-xl font-bold text-ink">{value}</span>
                  <span className="text-xs text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejection reason */}
        {campaign.status === 'rejected' && campaign.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
              <X size={15} /> Lý do từ chối
            </div>
            <p className="text-sm text-red-700 leading-relaxed">{campaign.rejectionReason}</p>
          </div>
        )}

        {/* Actions — pending_approval only */}
        {campaign.status === 'pending_approval' && (
          <div className="bg-white rounded-xl border border-hairline p-6">
            <h2 className="font-semibold text-ink mb-4">Quyết định duyệt</h2>

            {showApproveConfirm ? (
              <div className="flex flex-col gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 text-green-700">
                  <Check size={16} />
                  <span className="font-semibold text-sm">Duyệt chiến dịch này?</span>
                </div>
                <p className="text-sm text-green-700">
                  Chiến dịch sẽ chạy ngay hôm nay và nhà cung cấp sẽ nhận được thông báo.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => approve.mutate()}
                    loading={approve.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    ✅ Xác nhận duyệt
                  </Button>
                  <Button variant="ghost" onClick={() => setShowApproveConfirm(false)} disabled={approve.isPending}>
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowApproveConfirm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <Check size={16} /> Duyệt
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectModal(true)}
                  className="gap-2"
                >
                  <X size={16} /> Từ chối
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {showRejectModal && (
        <RejectModal
          onConfirm={(reason) => reject.mutate(reason)}
          onClose={() => setShowRejectModal(false)}
          isSubmitting={reject.isPending}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
