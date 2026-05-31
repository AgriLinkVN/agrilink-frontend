'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { MessageSquare, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { RatingStats } from './RatingStats';
import { ReviewForm } from './ReviewForm';
import { ReviewCard } from './ReviewCard';
import { type ReviewsResponse } from '@/types/review';

const LIMIT = 10;

interface Props {
  productId: string;
  /** Optional — used to hide the form for the product owner. */
  sellerId?: string;
}

export function ReviewSection({ productId, sellerId }: Props) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ReviewsResponse>({
    queryKey: ['reviews', productId],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      api.get<ReviewsResponse>(
        `/reviews/product/${productId}?page=${pageParam as number}&limit=${LIMIT}`,
      ),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.data.length, 0);
      return loaded < lastPage.total ? allPages.length + 1 : undefined;
    },
    staleTime: 60_000,
  });

  const reviews = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const stats = data?.pages[0]?.stats;

  return (
    <section className="mt-16 border-t border-hairline pt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={22} className="text-primary" />
        <h2 className="text-xl font-bold text-ink">Đánh giá sản phẩm</h2>
        {total > 0 && (
          <span className="text-sm text-muted">({total} đánh giá)</span>
        )}
      </div>

      {/* Rating summary */}
      {stats && stats.total > 0 && (
        <div className="mb-6">
          <RatingStats stats={stats} />
        </div>
      )}

      {/* Review form */}
      <div className="mb-8">
        <ReviewForm productId={productId} sellerId={sellerId} />
      </div>

      {/* Reviews list */}
      {isLoading && (
        <div className="flex items-center justify-center py-10 text-muted">
          <Loader2 size={22} className="animate-spin mr-2" /> Đang tải đánh giá...
        </div>
      )}

      {isError && (
        <p className="text-sm text-muted text-center py-6">
          Không thể tải đánh giá. Vui lòng thử lại.
        </p>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="text-center py-10 text-muted">
          <MessageSquare size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="flex flex-col">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button
            variant="secondary"
            onClick={() => fetchNextPage()}
            loading={isFetchingNextPage}
          >
            Xem thêm đánh giá
          </Button>
        </div>
      )}
    </section>
  );
}
