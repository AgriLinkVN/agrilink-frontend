"use client";

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { FarmingBadge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { ApiProduct, ApiProvince } from "@/types/search";

interface Props {
  product: ApiProduct;
  provinceName?: string;
}

export function ProductCard({ product, provinceName }: Props) {
  const primary = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];

  return (
    <article className="group bg-white rounded-xl border border-hairline overflow-hidden card-shadow card-shadow-hover">
      <Link
        href={`/products/${product.id}`}
        className="block aspect-4/3 bg-surface-green relative"
      >
        {primary ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primary.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
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
            // TODO: wire to wishlist (task khác)
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur flex items-center justify-center hover:bg-white"
          aria-label="Thêm vào yêu thích"
        >
          <Heart size={15} className="text-muted hover:text-red-500" />
        </button>
      </Link>

      <div className="p-4">
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
        <div className="text-base font-bold text-primary">
          {formatPrice(product.pricePerUnit, product.unit)}
        </div>
      </div>
    </article>
  );
}
