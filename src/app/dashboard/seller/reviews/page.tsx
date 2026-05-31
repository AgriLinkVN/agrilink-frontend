'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Loader2, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { type SellerReviewsResponse } from '@/types/review';

type Tab = 'all' | 'pending' | 'replied';

const TABS: { key: Tab; label: string }[] = [
  { key: 'pending', label: 'Chờ phản hồi' },
  { key: 'replied', label: 'Đã phản hồi' },
  { key: 'all', label: 'Tất cả' },
];

export default function SellerReviewsPage() {
  const { accessToken } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [page, setPage] = useState(1);

  const repliedParam =
    activeTab === 'pending' ? 'false' : activeTab === 'replied' ? 'true' : undefined;

  const queryKey = ['seller-reviews', activeTab, page];

  const { data, isLoading, isError } = useQuery<SellerReviewsResponse>({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page) });
      if (repliedParam !== undefined) params.set('replied', repliedParam);
      return api.get<SellerReviewsResponse>(`/reviews/seller/me?${params}`, accessToken);
    },
    enabled: !!accessToken,
    staleTime: 30_000,
  });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Header */}
      <header className="bg-white border-b border-hairline px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={20} className="text-primary" />
            <h1 className="text-xl font-bold text-ink">Quản lý đánh giá</h1>
          </div>
          <p className="text-sm text-muted">
            Xem và phản hồi các đánh giá từ người mua
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-hairline rounded-xl p-1 w-fit">
          {TABS.map((tab) => (
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

        {/* Content */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-muted">
            <Loader2 size={22} className="animate-spin mr-2" /> Đang tải...
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-muted">
            <AlertTriangle size={28} className="text-error" />
            <p className="text-sm">Không thể tải đánh giá. Vui lòng thử lại.</p>
          </div>
        )}

        {data && data.data.length === 0 && !isLoading && (
          <div className="bg-white rounded-xl border border-hairline p-12 flex flex-col items-center gap-3 text-muted">
            <MessageSquare size={36} className="opacity-30" />
            <p className="text-sm">
              {activeTab === 'pending'
                ? 'Không có đánh giá nào đang chờ phản hồi'
                : activeTab === 'replied'
                ? 'Bạn chưa phản hồi đánh giá nào'
                : 'Chưa có đánh giá nào'}
            </p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <div className="bg-white rounded-xl border border-hairline divide-y divide-hairline">
            {data.data.map((review) => (
              <div key={review.id} className="px-5">
                <ReviewCard
                  review={review}
                  canReply={!review.sellerReply}
                  accessToken={accessToken ?? undefined}
                  queryKey={queryKey}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.total > 20 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm rounded-lg border border-hairline disabled:opacity-40 hover:bg-surface-soft transition-colors"
            >
              Trước
            </button>
            <span className="text-sm text-muted">
              Trang {page} / {Math.ceil(data.total / 20)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(data.total / 20)}
              className="px-4 py-2 text-sm rounded-lg border border-hairline disabled:opacity-40 hover:bg-surface-soft transition-colors"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
