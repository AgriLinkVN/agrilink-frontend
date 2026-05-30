'use client';

import { useState } from 'react';
import { Star, X, ShieldCheck, MessageSquare, EyeOff, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { type Review } from '@/types/review';

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={14} stroke="none" fill={n <= rating ? '#F59E0B' : '#E5E7EB'} />
      ))}
    </div>
  );
}

function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
        <img
          src={images[idx]}
          alt={`Ảnh ${idx + 1}`}
          className="w-full rounded-xl max-h-[80vh] object-contain"
        />
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  i === idx ? 'bg-white' : 'bg-white/40',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  review: Review;
  /** Show inline reply form — caller confirms current user is this review's seller */
  canReply?: boolean;
  /** Show hide/unhide button — caller confirms current user is admin */
  canHide?: boolean;
  accessToken?: string;
  /** Invalidation key(s) — notified on successful mutation */
  queryKey?: unknown[];
}

export function ReviewCard({ review, canReply, canHide, accessToken, queryKey }: Props) {
  const queryClient = useQueryClient();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showHideConfirm, setShowHideConfirm] = useState(false);
  const [hideReason, setHideReason] = useState('');

  const images: string[] = (() => {
    try { return JSON.parse(review.images ?? '[]') as string[]; }
    catch { return []; }
  })();

  const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
    locale: vi,
    addSuffix: true,
  });

  const invalidate = () => {
    if (queryKey) queryClient.invalidateQueries({ queryKey });
  };

  const replyMutation = useMutation({
    mutationFn: () =>
      api.patch(`/reviews/${review.id}/reply`, { reply: replyText }, accessToken),
    onSuccess: () => {
      setShowReplyForm(false);
      setReplyText('');
      invalidate();
    },
  });

  const hideMutation = useMutation({
    mutationFn: () =>
      api.patch(`/reviews/admin/reviews/${review.id}/hide`, { reason: hideReason }, accessToken),
    onSuccess: () => {
      setShowHideConfirm(false);
      setHideReason('');
      invalidate();
    },
  });

  const unhideMutation = useMutation({
    mutationFn: () =>
      api.patch(`/reviews/admin/reviews/${review.id}/unhide`, undefined, accessToken),
    onSuccess: () => invalidate(),
  });

  return (
    <>
      <div className={cn(
        'flex flex-col gap-3 py-4 border-b border-hairline last:border-0',
        review.isHidden && 'opacity-60',
      )}>
        {/* Reviewer info */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-white text-sm font-bold shrink-0">
            {review.reviewer?.avatarUrl ? (
              <img
                src={review.reviewer.avatarUrl}
                alt={review.reviewer.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              (review.reviewer?.fullName ?? 'U').charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-ink">
                {review.reviewer?.fullName ?? 'Người dùng'}
              </span>
              {review.product && (
                <span className="text-xs text-muted truncate max-w-[180px]">
                  · {review.product.name}
                </span>
              )}
              {review.isVerifiedPurchase && (
                <span className="flex items-center gap-0.5 text-[10px] font-medium text-green-600">
                  <ShieldCheck size={10} /> Đã mua
                </span>
              )}
              {review.isHidden && (
                <span className="text-[10px] font-medium text-red-500 flex items-center gap-0.5">
                  <EyeOff size={10} /> Đã ẩn
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <StarDisplay rating={review.rating} />
              <span className="text-xs text-muted">{timeAgo}</span>
            </div>
          </div>

          {/* Admin actions */}
          {canHide && (
            <div className="shrink-0 flex items-center gap-2">
              {review.isHidden ? (
                <button
                  onClick={() => unhideMutation.mutate()}
                  disabled={unhideMutation.isPending}
                  className="text-xs text-primary hover:underline disabled:opacity-50"
                >
                  {unhideMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : 'Hiện lại'}
                </button>
              ) : (
                <button
                  onClick={() => setShowHideConfirm(true)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Ẩn review
                </button>
              )}
            </div>
          )}
        </div>

        {/* Comment */}
        {review.comment && (
          <p className="text-sm text-body-text leading-relaxed">{review.comment}</p>
        )}

        {/* Image thumbnails */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className="aspect-square rounded-lg overflow-hidden border border-hairline hover:border-primary transition-colors"
              >
                <img src={src} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Seller reply */}
        {review.sellerReply && (
          <div className="ml-4 pl-4 border-l-2 border-primary/30 bg-surface-green rounded-r-lg p-3">
            <div className="flex items-center gap-1 mb-1 text-xs font-semibold text-primary">
              <MessageSquare size={12} /> Phản hồi từ người bán:
            </div>
            <p className="text-sm text-ink leading-relaxed">{review.sellerReply}</p>
            {review.sellerReplyAt && (
              <p className="text-xs text-muted mt-1">
                {formatDistanceToNow(new Date(review.sellerReplyAt), {
                  locale: vi,
                  addSuffix: true,
                })}
              </p>
            )}
          </div>
        )}

        {/* Seller reply button */}
        {canReply && !review.sellerReply && !showReplyForm && (
          <button
            onClick={() => setShowReplyForm(true)}
            className="self-start text-xs text-primary hover:underline font-medium"
          >
            Phản hồi đánh giá này
          </button>
        )}

        {/* Inline reply form */}
        {canReply && showReplyForm && (
          <div className="ml-4 border-l-2 border-primary/20 pl-4 flex flex-col gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Nhập phản hồi của bạn... (tối thiểu 5 ký tự)"
              rows={3}
              maxLength={500}
              className="w-full text-sm border border-hairline rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">{replyText.length}/500</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setShowReplyForm(false); setReplyText(''); }}
                  disabled={replyMutation.isPending}
                >
                  Hủy
                </Button>
                <Button
                  size="sm"
                  onClick={() => replyMutation.mutate()}
                  loading={replyMutation.isPending}
                  disabled={replyText.trim().length < 5}
                >
                  Gửi phản hồi
                </Button>
              </div>
            </div>
            {replyMutation.isError && (
              <p className="text-xs text-red-500">
                {(replyMutation.error as Error)?.message ?? 'Gửi thất bại. Thử lại.'}
              </p>
            )}
          </div>
        )}

        {/* Admin: hide confirm */}
        {canHide && showHideConfirm && (
          <div className="ml-4 border-l-2 border-red-200 pl-4 flex flex-col gap-2">
            <p className="text-xs font-semibold text-red-600">Nhập lý do ẩn review:</p>
            <textarea
              value={hideReason}
              onChange={(e) => setHideReason(e.target.value)}
              placeholder="Vi phạm tiêu chuẩn cộng đồng..."
              rows={2}
              maxLength={300}
              className="w-full text-sm border border-red-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-red-400"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setShowHideConfirm(false); setHideReason(''); }}
                disabled={hideMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => hideMutation.mutate()}
                loading={hideMutation.isPending}
                disabled={hideReason.trim().length < 5}
              >
                Xác nhận ẩn
              </Button>
            </div>
            {hideMutation.isError && (
              <p className="text-xs text-red-500">
                {(hideMutation.error as Error)?.message ?? 'Thất bại. Thử lại.'}
              </p>
            )}
          </div>
        )}
      </div>

      {lightbox !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
