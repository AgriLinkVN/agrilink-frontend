"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  getPrimaryImage,
  type Product,
  UNIT_LABELS,
} from "@/lib/products-api";
import { useAuthStore } from "@/store/authStore";

interface WishlistResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export default function BuyerWishlistPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const wishlistQueryKey = ["wishlist", "products", accessToken] as const;
  const { data, isPending, error: queryError } = useQuery({
    queryKey: wishlistQueryKey,
    queryFn: () => api.get<WishlistResponse>("/wishlist?page=1&limit=50", accessToken),
    enabled: !!accessToken,
    staleTime: 30_000,
  });
  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!accessToken) throw new Error("Vui lòng đăng nhập để cập nhật wishlist.");
      await api.delete(`/wishlist/${productId}`, accessToken);
      return productId;
    },
    onMutate: () => {
      setActionError(null);
      setNotice(null);
    },
    onSuccess: (productId) => {
      queryClient.setQueryData<WishlistResponse>(wishlistQueryKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          data: current.data.filter((item) => item.id !== productId),
          total: Math.max(0, current.total - 1),
        };
      });
      queryClient.setQueryData<string[]>(["wishlist", "ids", accessToken], (current) =>
        (current ?? []).filter((id) => id !== productId),
      );
      setNotice("Đã bỏ sản phẩm khỏi danh sách yêu thích.");
    },
    onError: (err) => {
      setActionError(err instanceof Error ? err.message : "Không thể bỏ yêu thích");
    },
  });

  const products = data?.data ?? [];
  const total = data?.total ?? 0;
  const loading = !!accessToken && isPending;
  const error =
    actionError ??
    (queryError instanceof Error ? queryError.message : null);

  const removeProduct = async (productId: string) => {
    removeMutation.mutate(productId);
  };

  return (
    <DashboardLayout
      role="buyer"
      userName={user?.full_name ?? "Người mua"}
      pageTitle="Sản phẩm yêu thích"
      pageDescription={
        accessToken
          ? `${total.toLocaleString("vi-VN")} sản phẩm đã lưu`
          : "Đăng nhập để xem danh sách sản phẩm đã lưu"
      }
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {notice && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-xl border border-hairline bg-white p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center"
            >
              <div className="aspect-4/3 animate-pulse rounded-lg bg-surface-soft sm:aspect-square" />
              <div className="space-y-3">
                <div className="h-4 w-2/3 animate-pulse rounded bg-surface-soft" />
                <div className="h-5 w-32 animate-pulse rounded bg-surface-soft" />
                <div className="h-3 w-24 animate-pulse rounded bg-surface-soft" />
              </div>
              <div className="h-9 w-24 animate-pulse rounded bg-surface-soft" />
            </div>
          ))}
        </div>
      ) : !accessToken ? (
        <div className="rounded-xl border border-hairline bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-green text-primary">
            <Heart size={28} />
          </div>
          <h2 className="text-base font-semibold text-ink">Đăng nhập để xem wishlist</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Danh sách yêu thích được lưu theo tài khoản để bạn có thể quay lại từ mọi thiết bị.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <Button asChild>
              <Link href="/auth/login?redirect=/dashboard/buyer/wishlist">Đăng nhập</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/search">Khám phá sản phẩm</Link>
            </Button>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-hairline bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-green text-primary">
            <Heart size={28} />
          </div>
          <h2 className="text-base font-semibold text-ink">Chưa có sản phẩm yêu thích</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Lưu sản phẩm để quay lại nhanh khi cần so sánh giá hoặc liên hệ người bán.
          </p>
          <Button asChild className="mt-5">
            <Link href="/search">Khám phá sản phẩm</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => {
            const unitLabel = UNIT_LABELS[product.unit] ?? product.unit;

            return (
              <div
                key={product.id}
                className="grid gap-4 rounded-xl border border-hairline bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto] sm:items-center"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="relative aspect-4/3 overflow-hidden rounded-lg bg-surface-green sm:aspect-square"
                >
                  <Image
                    src={getPrimaryImage(product)}
                    alt={product.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </Link>

                <div className="min-w-0">
                  <Link
                    href={`/products/${product.id}`}
                    className="line-clamp-2 text-sm font-semibold text-ink hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {product.pricePerUnit.toLocaleString("vi-VN")}đ
                    <span className="text-sm font-medium text-muted">/{unitLabel}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Còn {Number(product.availableQuantity).toLocaleString("vi-VN")} {unitLabel}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => removeProduct(product.id)}
                  disabled={removeMutation.variables === product.id && removeMutation.isPending}
                  className="justify-center text-error hover:text-error"
                >
                  {removeMutation.variables === product.id && removeMutation.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Bỏ lưu
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
