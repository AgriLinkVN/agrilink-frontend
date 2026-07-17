"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Eye, Package, ShoppingCart, Award, Calendar } from "lucide-react";
import { FarmingBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getPrimaryImage,
  getProductProvince,
  UNIT_LABELS,
  SELLER_TYPE_LABELS,
  CERT_TYPE_LABELS,
  getVerifiedCertifications,
  type Product,
} from "@/lib/products-api";

// ── Helpers ───────────────────────────────────────────────────

function stockPercent(product: Product): number {
  const max = Math.max(product.availableQuantity, product.minOrderQuantity ?? 1, 100);
  return Math.min(100, Math.round((product.availableQuantity / max) * 100));
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function stockColor(pct: number): string {
  if (pct > 60) return "bg-emerald-400";
  if (pct > 25) return "bg-amber-400";
  return "bg-red-400";
}

// ── Grid Card ─────────────────────────────────────────────────

export function ProductGridCard({ product }: { product: Product }) {
  const imageUrl = getPrimaryImage(product);
  const province = getProductProvince(product);
  const unitLabel = UNIT_LABELS[product.unit] ?? product.unit;
  const pct = stockPercent(product);
  const primaryCert = getVerifiedCertifications(product.certifications)[0];
  const harvestFmt = formatDate(product.harvestDate);
  const sellerLabel = SELLER_TYPE_LABELS[product.sellerType] ?? product.sellerType;

  return (
    <Link
      href={`/marketplace/${product.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-hairline overflow-hidden card-shadow hover:border-primary/40 hover:shadow-lg transition-all duration-200"
    >
      {/* Image */}
      <div className="aspect-4/3 bg-surface-green relative overflow-hidden shrink-0">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />

        {/* Top-left: cert badge */}
        {primaryCert && (
          <div className="absolute top-2.5 left-2.5">
            <span className="flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              <Award size={9} /> {CERT_TYPE_LABELS[primaryCert.certType] ?? primaryCert.certType}
            </span>
          </div>
        )}

        {/* Top-right: farming badge */}
        {product.farmingType && (
          <div className="absolute top-2.5 right-2.5">
            <FarmingBadge type={product.farmingType} />
          </div>
        )}

        {/* Bottom bar: views + harvest */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2.5 py-1.5 bg-gradient-to-t from-black/60 to-transparent">
          <span className="flex items-center gap-1 text-white text-[10px]">
            <Eye size={10} /> {product.viewCount.toLocaleString("vi-VN")}
          </span>
          {harvestFmt && (
            <span className="flex items-center gap-1 text-white/90 text-[10px]">
              <Calendar size={9} /> Thu {harvestFmt}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">

        {/* Seller type chip */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-muted bg-surface-soft px-2 py-0.5 rounded-full">
            {sellerLabel}
          </span>
          {product.category?.name && (
            <span className="text-[10px] text-muted/70 truncate">{product.category.name}</span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-ink leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-muted">
          <MapPin size={10} className="text-primary shrink-0" />
          <span className="truncate">{province}</span>
        </div>

        {/* Stock bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-muted">
            <span className="flex items-center gap-1">
              <Package size={9} /> Còn lại
            </span>
            <span className="font-medium text-ink">
              {Number(product.availableQuantity).toLocaleString("vi-VN")} {unitLabel}
            </span>
          </div>
          <div className="h-1 bg-surface-soft rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", stockColor(pct))}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Min order */}
        {product.minOrderQuantity && product.minOrderQuantity > 1 && (
          <div className="flex items-center gap-1 text-[10px] text-muted">
            <ShoppingCart size={9} />
            Đặt tối thiểu {product.minOrderQuantity.toLocaleString("vi-VN")} {unitLabel}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-1 border-t border-hairline">
          <div>
            <div className="text-base font-bold text-primary leading-none">
              {Number(product.pricePerUnit).toLocaleString("vi-VN")}đ
            </div>
            <div className="text-[10px] text-muted">/{unitLabel}</div>
          </div>
          <button
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 text-xs px-3 h-8 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-sm"
          >
            <Phone size={11} /> Liên hệ
          </button>
        </div>
      </div>
    </Link>
  );
}

// ── List Card ─────────────────────────────────────────────────

export function ProductListCard({ product }: { product: Product }) {
  const imageUrl = getPrimaryImage(product);
  const province = getProductProvince(product);
  const unitLabel = UNIT_LABELS[product.unit] ?? product.unit;
  const pct = stockPercent(product);
  const primaryCert = getVerifiedCertifications(product.certifications)[0];
  const harvestFmt = formatDate(product.harvestDate);
  const sellerLabel = SELLER_TYPE_LABELS[product.sellerType] ?? product.sellerType;

  return (
    <Link
      href={`/marketplace/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-white card-shadow transition-all duration-200 hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-stretch"
    >
      {/* Thumbnail */}
      <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-32">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="128px"
        />
        {product.farmingType && (
          <div className="absolute top-2 left-2">
            <FarmingBadge type={product.farmingType} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4">
        {/* Top meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-medium text-muted bg-surface-soft px-2 py-0.5 rounded-full">
            {sellerLabel}
          </span>
          {primaryCert && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              <Award size={8} /> {CERT_TYPE_LABELS[primaryCert.certType] ?? primaryCert.certType}
            </span>
          )}
          {harvestFmt && (
            <span className="flex items-center gap-1 text-[10px] text-muted">
              <Calendar size={9} /> Thu {harvestFmt}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-ink group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Location + views */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="flex min-w-0 items-center gap-1">
            <MapPin size={10} className="text-primary" />{province}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={10} /> {product.viewCount.toLocaleString("vi-VN")} lượt xem
          </span>
        </div>

        {/* Stock mini bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-surface-soft rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full", stockColor(pct))} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] text-muted whitespace-nowrap">
            {Number(product.availableQuantity).toLocaleString("vi-VN")} {unitLabel}
          </span>
        </div>
      </div>

      {/* Price panel */}
      <div className="flex shrink-0 flex-col gap-3 border-t border-hairline p-4 sm:min-w-[120px] sm:items-end sm:justify-between sm:border-l sm:border-t-0">
        <div className="text-left sm:text-right">
          <div className="text-base font-bold text-primary leading-none">
            {Number(product.pricePerUnit).toLocaleString("vi-VN")}đ
          </div>
          <div className="text-[10px] text-muted">/{unitLabel}</div>
        </div>
        {product.minOrderQuantity && product.minOrderQuantity > 1 && (
          <div className="text-[10px] text-muted sm:text-right">
            Tối thiểu {product.minOrderQuantity} {unitLabel}
          </div>
        )}
        <button
          onClick={(e) => e.preventDefault()}
          className="flex h-8 w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-white transition-all hover:bg-primary/90 sm:w-auto"
        >
          <Phone size={11} /> Liên hệ
        </button>
      </div>
    </Link>
  );
}
