"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchProducts, getPrimaryImage, type Product } from "@/lib/products-api";

interface Props {
  categoryId: string | null;
  excludeId: string;
}

function formatPriceVND(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

export function SimilarProducts({ categoryId, excludeId }: Props) {
  const [items, setItems] = useState<Product[] | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  // Intersection observer — only fetch when scrolled near
  useEffect(() => {
    if (!ref.current || visible) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    let cancel = false;
    (async () => {
      const res = await fetchProducts({
        limit: 8,
        categoryId: categoryId ?? undefined,
      });
      if (cancel) return;
      const filtered = res.data
        .filter((p) => p.id !== excludeId)
        .slice(0, 4);
      setItems(filtered);
    })();
    return () => {
      cancel = true;
    };
  }, [visible, categoryId, excludeId]);

  return (
    <section ref={ref} className="mt-10">
      <h2 className="text-lg font-semibold mb-4">Sản phẩm tương tự</h2>

      {!items && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {items && items.length === 0 && (
        <p className="text-sm text-muted">Chưa có sản phẩm tương tự.</p>
      )}

      {items && items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group rounded-xl border border-hairline bg-white overflow-hidden hover:shadow-md transition"
            >
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={getPrimaryImage(p)}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="p-2.5">
                <p className="text-sm font-medium line-clamp-2 leading-snug">
                  {p.name}
                </p>
                <p className="mt-1 text-sm font-bold text-primary">
                  {formatPriceVND(p.pricePerUnit)}
                  <span className="text-xs font-normal text-muted"> /{p.unit}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
