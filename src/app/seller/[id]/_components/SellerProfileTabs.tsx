"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, MessageSquare, Package2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGridCard } from "@/components/marketplace/product-card";
import type { Product } from "@/lib/products-api";

export interface SellerReviewItem {
  id: string;
  productId: string;
  productName: string;
  reviewerName: string;
  rating: number;
  comment: string | null;
  sellerReply: string | null;
  createdAt: string;
}

interface Props {
  sellerId: string;
  products: Product[];
  reviews: SellerReviewItem[];
  reviewAverage: number | null;
  reviewTotal: number;
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          stroke="none"
          fill={star <= Math.round(rating) ? "#F59E0B" : "#E5E7EB"}
        />
      ))}
    </span>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN");
}

export function SellerProfileTabs({
  sellerId,
  products,
  reviews,
  reviewAverage,
  reviewTotal,
}: Props) {
  const [activeTab, setActiveTab] = useState<"products" | "reviews">("products");

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">Hoạt động bán hàng</h2>
          <p className="mt-1 text-sm text-muted">
            {products.length.toLocaleString("vi-VN")} sản phẩm đang bán
            {reviewTotal > 0 ? ` · ${reviewTotal.toLocaleString("vi-VN")} đánh giá` : ""}
          </p>
        </div>

        <div className="grid w-full grid-cols-2 rounded-lg border border-hairline bg-white p-1 sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`inline-flex h-9 min-w-0 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition sm:px-4 ${
              activeTab === "products"
                ? "bg-primary text-white"
                : "text-muted hover:bg-surface-soft hover:text-ink"
            }`}
          >
            <Package2 size={15} className="shrink-0" />
            <span className="truncate">Sản phẩm</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`inline-flex h-9 min-w-0 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition sm:px-4 ${
              activeTab === "reviews"
                ? "bg-primary text-white"
                : "text-muted hover:bg-surface-soft hover:text-ink"
            }`}
          >
            <MessageSquare size={15} className="shrink-0" />
            <span className="truncate">Đánh giá</span>
          </button>
        </div>
      </div>

      {activeTab === "products" ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductGridCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-hairline bg-white">
          <div className="flex flex-col gap-3 border-b border-hairline p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Đánh giá từ người mua</p>
              <p className="mt-1 text-xs text-muted">Tổng hợp từ các sản phẩm đang bán công khai</p>
            </div>
            {reviewAverage != null && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-ink">{reviewAverage.toFixed(1)}</span>
                <StarRow rating={reviewAverage} size={18} />
              </div>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="divide-y divide-hairline-soft">
              {reviews.map((review) => (
                <article key={`${review.productId}-${review.id}`} className="p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-ink">{review.reviewerName}</span>
                        <StarRow rating={review.rating} />
                        <span className="text-xs text-muted">{formatDate(review.createdAt)}</span>
                      </div>
                      <Link
                        href={`/products/${review.productId}`}
                        className="mt-1 inline-flex max-w-full items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        <span className="truncate">{review.productName}</span>
                        <ExternalLink size={11} />
                      </Link>
                    </div>
                  </div>

                  {review.comment && (
                    <p className="mt-3 text-sm leading-relaxed text-body-text">{review.comment}</p>
                  )}

                  {review.sellerReply && (
                    <div className="mt-3 rounded-lg border-l-2 border-primary bg-surface-green px-3 py-2">
                      <p className="text-xs font-semibold text-primary">Phản hồi từ người bán</p>
                      <p className="mt-1 text-sm text-ink">{review.sellerReply}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <MessageSquare size={34} className="mx-auto text-muted-soft" />
              <p className="mt-3 text-sm font-semibold text-ink">Chưa có đánh giá công khai</p>
              <p className="mt-1 text-sm text-muted">Các đánh giá mới sẽ xuất hiện tại đây.</p>
            </div>
          )}

          {products.length > 0 && (
            <div className="border-t border-hairline p-5 text-center">
              <Button variant="secondary" size="sm" className="w-full sm:w-auto" asChild>
                <Link href={`/marketplace?sellerId=${sellerId}`}>Xem toàn bộ sản phẩm</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
