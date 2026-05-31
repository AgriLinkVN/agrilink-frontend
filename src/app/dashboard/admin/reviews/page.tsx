'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ShieldAlert, Loader2, AlertTriangle, Eye, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { type AdminReviewsResponse } from '@/types/review';

type FilterTab = 'visible' | 'hidden' | 'all';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'visible', label: 'Đang hiển thị' },
  { key: 'hidden', label: 'Đã ẩn' },
  { key: 'all', label: 'Tất cả' },
];

export default function AdminReviewsPage() {
  const { accessToken } = useAuthStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('visible');
  const [page, setPage] = useState(1);

  const isHiddenParam =
    activeTab === 'visible' ? 'false' : activeTab === 'hidden' ? 'true' : undefined;

  const queryKey = ['admin-reviews', activeTab, page];

  const { data, isLoading, isError } = useQuery<AdminReviewsResponse>({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page) });
      if (isHiddenParam !== undefined) params.set('is_hidden', isHiddenParam);
      return api.get<AdminReviewsResponse>(`/reviews/admin/reviews?${params}`, accessToken);
    },
    enabled: !!accessToken,
    staleTime: 30_000,
  });

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.total / 20) : 1;

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Header */}
      <header className="bg-white border-b border-hairline px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert size={20} className="text-primary" />
            <h1 className="text-xl font-bold text-ink">Kiểm duyệt đánh giá</h1>
          </div>
          <p className="text-sm text-muted">
            Ẩn hoặc khôi phục các đánh giá vi phạm tiêu chuẩn cộng đồng
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Filter tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-white border border-hairline rounded-xl p-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-ink hover:bg-surface-soft'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {data && (
            <span className="text-sm text-muted">
              {data.total} đánh giá
            </span>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-muted">
            <Loader2 size={22} className="animate-spin mr-2" /> Đang tải...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <AlertTriangle size={28} className="text-error" />
            <p className="text-sm text-muted">Không thể tải đánh giá. Vui lòng thử lại.</p>
          </div>
        )}

        {/* Empty */}
        {data && data.data.length === 0 && !isLoading && (
          <div className="bg-white rounded-xl border border-hairline p-12 flex flex-col items-center gap-3 text-muted">
            {activeTab === 'hidden'
              ? <Eye size={36} className="opacity-30" />
              : <ShieldAlert size={36} className="opacity-30" />
            }
            <p className="text-sm">
              {activeTab === 'hidden'
                ? 'Không có đánh giá nào bị ẩn'
                : 'Không tìm thấy đánh giá'}
            </p>
          </div>
        )}

        {/* Review list */}
        {data && data.data.length > 0 && (
          <div className="bg-white rounded-xl border border-hairline divide-y divide-hairline">
            {data.data.map((review) => (
              <div key={review.id} className="px-5">
                <ReviewCard
                  review={review}
                  canHide
                  accessToken={accessToken ?? undefined}
                  queryKey={queryKey}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg border border-hairline disabled:opacity-40 hover:bg-surface-soft transition-colors"
            >
              <ChevronLeft size={16} /> Trước
            </button>
            <span className="text-sm text-muted">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg border border-hairline disabled:opacity-40 hover:bg-surface-soft transition-colors"
            >
              Sau <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
