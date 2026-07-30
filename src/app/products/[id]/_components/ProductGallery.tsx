"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductDetailImage } from "@/lib/products-api";

const PLACEHOLDER =
  "/demo/agricultural-produce.webp";

interface Props {
  images: ProductDetailImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: Props) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const initialIdx = Math.max(
    0,
    sorted.findIndex((i) => i.isPrimary),
  );
  const [activeIdx, setActiveIdx] = useState(initialIdx === -1 ? 0 : initialIdx);
  const touchStartX = useRef<number | null>(null);

  if (sorted.length === 0) {
    return (
      <div className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        <Image
          src={PLACEHOLDER}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  const current = sorted[activeIdx];

  const goPrev = () =>
    setActiveIdx((i) => (i - 1 + sorted.length) % sorted.length);
  const goNext = () => setActiveIdx((i) => (i + 1) % sorted.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? goNext : goPrev)();
    touchStartX.current = null;
  };

  return (
    <div className="w-full">
      {/* Main image */}
      <div
        className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden group"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={current.imageUrl}
          alt={current.altText ?? productName}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority
        />
        {sorted.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Ảnh trước"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 md:opacity-100 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              aria-label="Ảnh sau"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 md:opacity-100 transition"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {activeIdx + 1} / {sorted.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(idx)}
              aria-label={`Xem ảnh ${idx + 1}`}
              className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                idx === activeIdx
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText ?? `${productName} ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
