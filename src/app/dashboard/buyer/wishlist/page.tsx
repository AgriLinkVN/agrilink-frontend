"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadWishlist = async () => {
      await Promise.resolve();

      if (!accessToken) {
        if (!cancelled) {
          setProducts([]);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setLoading(true);
        setError(null);
      }

      try {
        const result = await api.get<WishlistResponse>("/wishlist", accessToken);
        if (!cancelled) setProducts(result.data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Không thể tải danh sách yêu thích");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const removeProduct = async (productId: string) => {
    if (!accessToken) return;

    setRemovingId(productId);
    setError(null);
    try {
      await api.delete(`/wishlist/${productId}`, accessToken);
      setProducts((items) => items.filter((item) => item.id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể bỏ yêu thích");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <DashboardLayout
      role="buyer"
      userName={user?.full_name ?? "Người mua"}
      pageTitle="Sản phẩm yêu thích"
      pageDescription={`${products.length} sản phẩm đã lưu`}
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Đang tải danh sách yêu thích...
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
                  disabled={removingId === product.id}
                  className="justify-center text-error hover:text-error"
                >
                  {removingId === product.id ? (
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
