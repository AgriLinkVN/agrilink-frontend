'use client';

import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, ImagePlus, X, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { api, uploadImageToStorage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { type CreateReviewPayload } from '@/types/review';

interface Props {
  productId: string;
  /** Optional — when present, hides the form for the product owner. */
  sellerId?: string;
}

export function ReviewForm({ productId, sellerId }: Props) {
  const { accessToken, user } = useAuthStore();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const isSeller = sellerId !== undefined && user?.id === sellerId;
  const isLoggedIn = !!accessToken && !!user;

  const submit = useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      api.post('/reviews', payload, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setRating(0);
      setComment('');
      setImages([]);
    },
  });

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 bg-surface-soft rounded-xl border border-hairline text-center">
        <p className="text-sm text-muted">Đăng nhập để viết đánh giá</p>
        <Link href="/auth/login">
          <Button variant="secondary" size="sm">
            <LogIn size={14} /> Đăng nhập để đánh giá
          </Button>
        </Link>
      </div>
    );
  }

  // Seller cannot review own product
  if (isSeller) {
    return null;
  }

  const handleImageUpload = async (files: FileList) => {
    setUploadError('');
    const remaining = 5 - images.length;
    const toUpload = Array.from(files).slice(0, remaining);

    setUploading(true);
    try {
      const urls = await Promise.all(
        toUpload.map((file) => uploadImageToStorage(file, 'reviews', accessToken)),
      );
      setImages((prev) => [...prev, ...urls]);
    } catch {
      setUploadError('Upload ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!rating) return;
    submit.mutate({
      productId,
      rating,
      comment: comment.trim() || undefined,
      images: images.length > 0 ? images : undefined,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-hairline p-5 flex flex-col gap-4">
      <h3 className="font-semibold text-ink">Viết đánh giá của bạn</h3>

      {/* Star picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Đánh giá *</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(n)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                stroke="none"
                fill={n <= (hover || rating) ? '#F59E0B' : '#E5E7EB'}
                className="transition-colors"
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-muted">
              {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">
          Nhận xét <span className="text-muted font-normal">(không bắt buộc)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
          rows={3}
          className="w-full px-3.5 py-3 rounded-lg border border-border-strong bg-white text-sm text-ink placeholder:text-muted-soft focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
        />
        <span className="text-xs text-muted text-right">{comment.length}/1000</span>
      </div>

      {/* Image upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">
          Ảnh <span className="text-muted font-normal">(tối đa 5)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-hairline">
              <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center text-white"
              >
                <X size={9} />
              </button>
            </div>
          ))}

          {images.length < 5 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className={cn(
                'w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors',
                uploading ? 'border-primary/40 cursor-wait' : 'border-gray-200 hover:border-primary',
              )}
            >
              {uploading ? (
                <Loader2 size={16} className="text-primary animate-spin" />
              ) : (
                <ImagePlus size={16} className="text-muted" />
              )}
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            if (e.target.files?.length) handleImageUpload(e.target.files);
            e.target.value = '';
          }}
        />
        {uploadError && <p className="text-xs text-error">{uploadError}</p>}
      </div>

      {submit.isError && (
        <p className="text-sm text-error">
          {(submit.error as Error)?.message ?? 'Đã có lỗi. Vui lòng thử lại.'}
        </p>
      )}
      {submit.isSuccess && (
        <p className="text-sm text-green-600 font-medium">Cảm ơn! Đánh giá của bạn đã được gửi.</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!rating}
        loading={submit.isPending}
        size="md"
      >
        Gửi đánh giá
      </Button>
    </div>
  );
}
