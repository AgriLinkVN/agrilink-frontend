"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import { FarmingBadge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { ApiProduct } from "@/types/search";
import { useAuthStore } from "@/store/authStore";

interface Props {
  product: ApiProduct;
  provinceName?: string;
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";
const BASE = `${BACKEND}/api/v1`;

export function ProductCard({ product, provinceName }: Props) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [wishlisted, setWishlisted] = useState(false);
  const [pending, startTransition] = useTransition();
  const primary = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];

  const toggleWishlist = () => {
    if (!accessToken || pending) return;
    const next = !wishlisted;

    startTransition(async () => {
      try {
        const res = await fetch(`${BASE}/wishlist/${encodeURIComponent(product.id)}`, {
          method: next ? "POST" : "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setWishlisted(next);
      } catch {
        setWishlisted(wishlisted);
      }
    });
  };

  return (
    <article className="group bg-white rounded-xl border border-hairline overflow-hidden card-shadow card-shadow-hover">
      <Link
        href={`/products/${product.id}`}
        className="block aspect-4/3 bg-surface-green relative overflow-hidden"
      >
        {primary ? (
          <Image
            src={primary.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-muted">
            🌾
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist();
          }}
          disabled={pending}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur flex items-center justify-center hover:bg-white disabled:opacity-60"
          aria-label={wishlisted ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
          aria-pressed={wishlisted}
          title={accessToken ? undefined : "Đăng nhập để lưu sản phẩm"}
        >
          <Heart
            size={15}
            className={
              wishlisted
                ? "fill-rose-500 text-rose-500"
                : "text-muted hover:text-rose-500"
            }
          />
        </button>
      </Link>

      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-2 mb-1.5">
          <Link
            href={`/products/${product.id}`}
            className="text-sm font-semibold text-ink flex-1 leading-tight line-clamp-2 group-hover:text-primary"
          >
            {product.name}
          </Link>
          <FarmingBadge type={product.farmingType} />
        </div>
        {provinceName && (
          <div className="flex items-center gap-1 text-xs text-muted mb-3">
            <MapPin size={11} className="text-primary" />
            <span>{provinceName}</span>
          </div>
        )}
        <div className="text-sm sm:text-base font-bold text-primary break-words">
          {formatPrice(product.pricePerUnit, product.unit)}
        </div>
      </div>
    </article>
  );
}
