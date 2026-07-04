'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Check, ChevronRight, ImagePlus, Loader2, AlertTriangle,
  X, Globe, MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api, uploadImageToStorage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { useAuthStore } from '@/store/authStore';
import { type AdPackage, type CreateCampaignPayload } from '@/types/ads';
import { PROVINCES } from '@/lib/provinces';

// ── Formatters ────────────────────────────────────────────────────────────────

const vnd = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const formatImpressions = (n: number | null) =>
  n == null ? 'Không giới hạn' : n.toLocaleString('vi-VN');

// ── Step progress bar ─────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: 'Chọn gói' },
    { n: 2, label: 'Nội dung' },
    { n: 3, label: 'Xác nhận' },
  ];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                step > s.n
                  ? 'bg-primary text-white'
                  : step === s.n
                  ? 'bg-primary text-white ring-4 ring-primary/20'
                  : 'bg-gray-100 text-gray-400',
              )}
            >
              {step > s.n ? <Check size={16} /> : s.n}
            </div>
            <span
              className={cn(
                'text-xs mt-1 font-medium whitespace-nowrap',
                step >= s.n ? 'text-primary' : 'text-gray-400',
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'h-0.5 w-16 sm:w-24 mx-1 mb-4 transition-colors',
                step > s.n + 1 || (step > s.n) ? 'bg-primary' : 'bg-gray-200',
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Step 1 — Package selector ─────────────────────────────────────────────────

const PACKAGE_LABEL: Record<string, string> = {
  banner: 'Banner',
  featured: 'Nổi bật',
  spotlight: 'Tiêu điểm',
};

function Step1({
  packages,
  selected,
  onSelect,
  onNext,
}: {
  packages: AdPackage[];
  selected: AdPackage | null;
  onSelect: (p: AdPackage) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-ink mb-1">Chọn gói quảng cáo</h2>
      <p className="text-sm text-muted mb-6">Mỗi gói có thời hạn, giá và lượt hiển thị khác nhau.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {packages.map((pkg) => {
          const isSelected = selected?.id === pkg.id;
          const isPopular = pkg.adType === 'spotlight';
          return (
            <button
              key={pkg.id}
              onClick={() => onSelect(pkg)}
              className={cn(
                'relative flex flex-col gap-3 p-5 rounded-xl border-2 text-left transition-all',
                isSelected
                  ? 'border-blue-500 shadow-md bg-blue-50'
                  : 'border-hairline bg-white hover:border-gray-300 hover:shadow-sm',
              )}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-white text-[10px] font-bold whitespace-nowrap">
                  ⭐ Phổ biến nhất
                </span>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {PACKAGE_LABEL[pkg.adType] ?? pkg.adType}
                </span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>

              <p className="font-bold text-ink text-base">{pkg.name}</p>
              <p className="text-2xl font-extrabold text-primary">{vnd(pkg.price)}</p>

              <ul className="flex flex-col gap-1.5 text-sm text-muted">
                <li className="flex items-center gap-1.5">
                  <Check size={13} className="text-primary shrink-0" />
                  {pkg.durationDays} ngày
                </li>
                <li className="flex items-center gap-1.5">
                  <Check size={13} className="text-primary shrink-0" />
                  {formatImpressions(pkg.maxImpressions)} lượt hiển thị
                </li>
                {pkg.description && (
                  <li className="text-xs text-muted-soft leading-snug mt-1">{pkg.description}</li>
                )}
              </ul>
            </button>
          );
        })}
      </div>

      <Button onClick={onNext} disabled={!selected} size="lg">
        Tiếp theo <ChevronRight size={18} />
      </Button>
    </div>
  );
}

// ── Province multi-select ─────────────────────────────────────────────────────

function ProvinceSelector({
  value,
  onChange,
}: {
  value: number[];
  onChange: (ids: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = PROVINCES.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (id: number) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink">
        Tỉnh/thành mục tiêu <span className="text-muted font-normal">(không chọn = Toàn quốc)</span>
      </label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-12 px-3.5 rounded-lg border border-border-strong bg-white text-sm text-left hover:border-primary transition-colors"
      >
        <MapPin size={16} className="text-muted shrink-0" />
        <span className={value.length === 0 ? 'text-muted-soft' : 'text-ink'}>
          {value.length === 0
            ? 'Toàn quốc'
            : `${value.length} tỉnh đã chọn`}
        </span>
        <span className="ml-auto text-muted text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="rounded-lg border border-border-strong bg-white shadow-lg overflow-hidden z-10">
          <div className="p-2 border-b border-hairline">
            <Input
              placeholder="Tìm tỉnh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 rounded text-sm text-left transition-colors',
                  value.includes(p.id)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-surface-soft text-ink',
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center shrink-0',
                    value.includes(p.id) ? 'bg-primary border-primary' : 'border-gray-300',
                  )}
                >
                  {value.includes(p.id) && <Check size={10} className="text-white" />}
                </div>
                {p.name}
              </button>
            ))}
          </div>
          {value.length > 0 && (
            <div className="p-2 border-t border-hairline flex justify-between items-center">
              <span className="text-xs text-muted">{value.length} tỉnh đã chọn</span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-red-500 hover:underline"
              >
                Bỏ chọn tất cả
              </button>
            </div>
          )}
        </div>
      )}

      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {value.slice(0, 5).map((id) => {
            const p = PROVINCES.find((x) => x.id === id);
            return p ? (
              <span
                key={id}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
              >
                {p.name}
                <button type="button" onClick={() => toggle(id)}>
                  <X size={10} />
                </button>
              </span>
            ) : null;
          })}
          {value.length > 5 && (
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">
              +{value.length - 5} tỉnh khác
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Step 2 — Campaign content ─────────────────────────────────────────────────

function Step2({
  title, setTitle,
  imageUrl, setImageUrl,
  linkUrl, setLinkUrl,
  provinces, setProvinces,
  onBack, onNext,
}: {
  title: string; setTitle: (v: string) => void;
  imageUrl: string; setImageUrl: (v: string) => void;
  linkUrl: string; setLinkUrl: (v: string) => void;
  provinces: number[]; setProvinces: (v: number[]) => void;
  onBack: () => void; onNext: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [aspectWarning, setAspectWarning] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setUploadError('');
    setAspectWarning(false);

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Ảnh phải nhỏ hơn 2MB');
      return;
    }

    // Check aspect ratio
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise<void>((resolve) => { img.onload = () => resolve(); });
    const ratio = img.width / img.height;
    if (Math.abs(ratio - 1200 / 628) > 0.1) {
      setAspectWarning(true);
    }
    URL.revokeObjectURL(img.src);

    setUploading(true);
    try {
      const url = await uploadImageToStorage(file, 'ads');
      setImageUrl(url);
    } catch {
      setUploadError('Upload thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  }, [setImageUrl]);

  const canProceed = title.trim().length >= 5 && imageUrl;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-ink mb-1">Nội dung chiến dịch</h2>
        <p className="text-sm text-muted">Điền thông tin và tải lên banner quảng cáo.</p>
      </div>

      {/* Title */}
      <Input
        label="Tiêu đề chiến dịch *"
        placeholder="VD: Khuyến mãi phân bón tháng 7"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        minLength={5}
        maxLength={255}
        error={title.length > 0 && title.length < 5 ? 'Tối thiểu 5 ký tự' : undefined}
        hint={`${title.length}/255 ký tự`}
      />

      {/* Banner upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">
          Banner quảng cáo * <span className="text-muted font-normal text-xs">(khuyến nghị 1200×628px, JPEG/PNG/WebP, max 2MB)</span>
        </label>

        {imageUrl ? (
          <div className="relative rounded-xl overflow-hidden border border-hairline">
            <img src={imageUrl} alt="Banner preview" className="w-full aspect-video object-cover" />
            <button
              onClick={() => setImageUrl('')}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={cn(
              'w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors',
              uploading ? 'border-primary/40 bg-primary/5 cursor-wait' : 'border-gray-200 hover:border-primary hover:bg-surface-green cursor-pointer',
            )}
          >
            {uploading ? (
              <>
                <Loader2 size={28} className="text-primary animate-spin" />
                <p className="text-sm text-primary font-medium">Đang tải lên...</p>
              </>
            ) : (
              <>
                <ImagePlus size={28} className="text-muted" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-ink">Click để chọn ảnh</p>
                  <p className="text-xs text-muted mt-0.5">JPEG, PNG, WebP — tối đa 2MB</p>
                </div>
              </>
            )}
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />

        {aspectWarning && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            Tỷ lệ ảnh chưa chuẩn (nên là 1200×628). Banner có thể bị cắt khi hiển thị.
          </div>
        )}
        {uploadError && <p className="text-sm text-error">{uploadError}</p>}
      </div>

      {/* Link URL */}
      <Input
        label="Link URL đích (không bắt buộc)"
        placeholder="https://agrilink.vn/products/..."
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        type="url"
        hint="Khi khách click banner sẽ được điều hướng đến URL này"
      />

      {/* Province multi-select */}
      <ProvinceSelector value={provinces} onChange={setProvinces} />

      <div className="flex items-center gap-3 pt-2">
        <Button variant="secondary" onClick={onBack}>Quay lại</Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Tiếp theo <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}

// ── Step 3 — Preview + confirm ────────────────────────────────────────────────

function Step3({
  selectedPackage, title, imageUrl, linkUrl, provinces,
  onBack, onSubmit, isSubmitting,
}: {
  selectedPackage: AdPackage;
  title: string;
  imageUrl: string;
  linkUrl: string;
  provinces: number[];
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const provinceNames =
    provinces.length === 0
      ? 'Toàn quốc'
      : PROVINCES.filter((p) => provinces.includes(p.id))
          .map((p) => p.name)
          .join(', ');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold text-ink mb-1">Xem trước và xác nhận</h2>
        <p className="text-sm text-muted">Kiểm tra lại thông tin trước khi gửi duyệt.</p>
      </div>

      {/* Banner preview */}
      <div className="rounded-xl overflow-hidden border border-hairline max-h-64">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover max-h-64" />
      </div>

      {/* Summary card */}
      <div className="bg-surface-soft rounded-xl p-5 flex flex-col gap-4 border border-hairline">
        <h3 className="font-semibold text-ink text-base">{title}</h3>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-muted text-xs font-medium uppercase tracking-wide mb-0.5">Gói</dt>
            <dd className="font-semibold text-ink">{selectedPackage.name}</dd>
          </div>
          <div>
            <dt className="text-muted text-xs font-medium uppercase tracking-wide mb-0.5">Chi phí</dt>
            <dd className="font-bold text-primary">{vnd(selectedPackage.price)}</dd>
          </div>
          <div>
            <dt className="text-muted text-xs font-medium uppercase tracking-wide mb-0.5">Thời hạn</dt>
            <dd className="font-semibold text-ink">{selectedPackage.durationDays} ngày</dd>
          </div>
          <div>
            <dt className="text-muted text-xs font-medium uppercase tracking-wide mb-0.5">Lượt hiển thị</dt>
            <dd className="font-semibold text-ink">{formatImpressions(selectedPackage.maxImpressions)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted text-xs font-medium uppercase tracking-wide mb-0.5 flex items-center gap-1">
              <MapPin size={11} /> Phạm vi
            </dt>
            <dd className="font-medium text-ink">
              {provinces.length === 0 && (
                <span className="flex items-center gap-1"><Globe size={13} className="text-primary" /> Toàn quốc</span>
              )}
              {provinces.length > 0 && provinceNames}
            </dd>
          </div>
          {linkUrl && (
            <div className="col-span-2">
              <dt className="text-muted text-xs font-medium uppercase tracking-wide mb-0.5">Link đích</dt>
              <dd className="text-primary text-xs truncate">{linkUrl}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <span>Chiến dịch sẽ được admin duyệt trong <strong>1-2 ngày làm việc</strong>. Sau khi duyệt, banner sẽ tự động hiển thị.</span>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button variant="secondary" onClick={onBack} disabled={isSubmitting}>Quay lại</Button>
        <Button onClick={onSubmit} loading={isSubmitting} size="lg">
          {isSubmitting ? 'Đang gửi...' : 'Gửi duyệt'}
        </Button>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-in slide-in-from-bottom-4',
        type === 'success' ? 'bg-green-600' : 'bg-red-600',
      )}
    >
      {type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
      {message}
    </div>
  );
}

// ── Main wizard page ──────────────────────────────────────────────────────────

export default function NewCampaignPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPackage, setSelectedPackage] = useState<AdPackage | null>(null);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [provinces, setProvinces] = useState<number[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch packages
  const { data: packages = [], isLoading: pkgLoading } = useQuery<AdPackage[]>({
    queryKey: ['ad-packages'],
    queryFn: () => api.get<AdPackage[]>('/ads/packages'),
  });

  // Submit mutation
  const submit = useMutation({
    mutationFn: (payload: CreateCampaignPayload) =>
      api.post('/ads/campaigns', payload, accessToken),
    onSuccess: () => {
      showToast('Chiến dịch đã được gửi — đang chờ admin duyệt!', 'success');
      setTimeout(() => router.push('/dashboard/supplier/ads'), 1500);
    },
    onError: (err: Error) => {
      showToast(err.message ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.', 'error');
    },
  });

  const handleSubmit = () => {
    if (!selectedPackage) return;
    submit.mutate({
      title: title.trim(),
      packageId: selectedPackage.id,
      imageUrl,
      linkUrl: linkUrl.trim() || undefined,
      targetProvinces: provinces.length > 0 ? provinces : undefined,
    });
  };

  return (
    <DashboardLayout
      role="supplier"
      userName="Cty Vật Tư Nông Nghiệp XYZ"
      pageTitle="Tạo chiến dịch quảng cáo"
      pageDescription="Hoàn thành 3 bước để tạo chiến dịch quảng cáo mới"
    >
      <div className="max-w-2xl mx-auto">
        <StepIndicator step={step} />

        {step === 1 && (
          pkgLoading ? (
            <div className="flex items-center justify-center py-20 text-muted">
              <Loader2 size={24} className="animate-spin mr-2" /> Đang tải gói quảng cáo...
            </div>
          ) : (
            <Step1
              packages={packages}
              selected={selectedPackage}
              onSelect={setSelectedPackage}
              onNext={() => setStep(2)}
            />
          )
        )}

        {step === 2 && (
          <Step2
            title={title} setTitle={setTitle}
            imageUrl={imageUrl} setImageUrl={setImageUrl}
            linkUrl={linkUrl} setLinkUrl={setLinkUrl}
            provinces={provinces} setProvinces={setProvinces}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && selectedPackage && (
          <Step3
            selectedPackage={selectedPackage}
            title={title}
            imageUrl={imageUrl}
            linkUrl={linkUrl}
            provinces={provinces}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
            isSubmitting={submit.isPending}
          />
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </DashboardLayout>
  );
}
