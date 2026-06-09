import Link from "next/link";
import { ChevronRight, Star, Eye } from "lucide-react";
import { FarmingBadge } from "@/components/ui/badge";
import type { ProductDetail } from "@/lib/products-api";
import { UNIT_LABELS } from "@/lib/products-api";
import { CertificationBadges } from "./CertificationBadges";

interface Props {
  product: ProductDetail;
}

function formatPriceVND(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

export function ProductInfo({ product }: Props) {
  const unitLabel = UNIT_LABELS[product.unit] ?? product.unit;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted flex-wrap">
        <Link href="/" className="hover:text-primary transition-colors">
          Trang chủ
        </Link>
        <ChevronRight size={14} />
        <Link
          href="/products"
          className="hover:text-primary transition-colors"
        >
          Sản phẩm
        </Link>
        {product.category?.parent && (
          <>
            <ChevronRight size={14} />
            <Link
              href={`/products?categoryId=${product.category.parent.id}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.parent.name}
            </Link>
          </>
        )}
        {product.category && (
          <>
            <ChevronRight size={14} />
            <Link
              href={`/products?categoryId=${product.category.id}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      {/* Name + Variety */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold leading-tight">
          {product.name}
        </h1>
        {product.variety && (
          <p className="mt-1 text-sm text-muted">Giống: {product.variety}</p>
        )}
        {product.sku && (
          <p className="mt-0.5 text-xs text-muted">SKU: {product.sku}</p>
        )}
      </div>

      {/* Price */}
      <div className="flex items-end gap-2">
        <span className="text-3xl md:text-4xl font-bold text-primary">
          {formatPriceVND(product.pricePerUnit)}
        </span>
        <span className="text-lg text-muted mb-1">/ {unitLabel}</span>
      </div>

      {/* Rating + Views + Sold */}
      <div className="flex items-center gap-4 text-sm">
        {product.avgRating > 0 ? (
          <span className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{product.avgRating.toFixed(1)}</span>
          </span>
        ) : (
          <span className="text-muted">Chưa có đánh giá</span>
        )}
        {product.soldCount > 0 && (
          <span className="text-muted">
            Đã bán: <span className="font-medium text-foreground">{product.soldCount}</span>
          </span>
        )}
        <span className="flex items-center gap-1 text-muted">
          <Eye size={14} />
          {product.viewCount.toLocaleString("vi-VN")}
        </span>
      </div>

      {/* Farming type + Certifications */}
      <div className="flex flex-col gap-2">
        {product.farmingType && (
          <div>
            <FarmingBadge type={product.farmingType} />
          </div>
        )}
        <CertificationBadges certifications={product.certifications} />
      </div>

      {/* Description */}
      {product.description && (
        <div className="pt-2 border-t border-hairline">
          <h2 className="text-sm font-semibold mb-2">Mô tả sản phẩm</h2>
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
