"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FarmingBadge } from "@/components/ui/badge";

const PRODUCTS = [
  {
    id: "1",
    name: "Xoài cát Hòa Lộc",
    province: "Tiền Giang",
    price: 45000,
    unit: "kg",
    farming_type: "vietgap" as const,
    rating: 4.8,
    sold: 1200,
    seller: "HTX Xoài Cát Tiền Giang",
    // Xoài chín vàng
    image: "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=600&q=80",
  },
  {
    id: "2",
    name: "Rau muống hữu cơ",
    province: "Đà Lạt, Lâm Đồng",
    price: 25000,
    unit: "kg",
    farming_type: "organic" as const,
    rating: 4.9,
    sold: 890,
    seller: "Nông trại Xanh Đà Lạt",
    // Rau xanh tươi trên ruộng
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&q=80",
  },
  {
    id: "3",
    name: "Thanh long ruột đỏ",
    province: "Bình Thuận",
    price: 35000,
    unit: "kg",
    farming_type: "globalgap" as const,
    rating: 4.7,
    sold: 2100,
    seller: "HTX Thanh Long Bình Thuận",
    // Dragon fruit đỏ
    image: "https://images.unsplash.com/photo-1507908708918-778587c9e563?w=600&q=80",
  },
  {
    id: "4",
    name: "Gạo ST25 đặc sản",
    province: "Sóc Trăng",
    price: 28000,
    unit: "kg",
    farming_type: "vietgap" as const,
    rating: 4.9,
    sold: 5400,
    seller: "Hộ ông Hồ Quang Cua",
    // Ruộng lúa chín vàng
    image: "https://images.unsplash.com/photo-1651981350249-6173caeeb660?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "5",
    name: "Cà phê Arabica",
    province: "Đà Lạt, Lâm Đồng",
    price: 180000,
    unit: "kg",
    farming_type: "organic" as const,
    rating: 4.8,
    sold: 760,
    seller: "Nông trại Cầu Đất",
    // Hạt cà phê đỏ trên cây
    image: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=600&q=80",
  },
  {
    id: "6",
    name: "Bưởi da xanh",
    province: "Bến Tre",
    price: 42000,
    unit: "kg",
    farming_type: "vietgap" as const,
    rating: 4.6,
    sold: 1540,
    seller: "HTX Bưởi Bến Tre",
    // Bưởi xanh tươi
    image: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=600&q=80",
  },
];

const CARD_WIDTH = 288;
const GAP = 24;
const AUTO_INTERVAL = 3500;

export function FeaturedCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollTo = useCallback((idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    // wrap-around
    const next = ((idx % PRODUCTS.length) + PRODUCTS.length) % PRODUCTS.length;
    el.scrollTo({ left: next * (CARD_WIDTH + GAP), behavior: "smooth" });
    setActiveIdx(next);
  }, []);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / (CARD_WIDTH + GAP));
    setActiveIdx(idx);
  }, []);

  // auto-play
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % PRODUCTS.length;
        const el = trackRef.current;
        if (el) el.scrollTo({ left: next * (CARD_WIDTH + GAP), behavior: "smooth" });
        return next;
      });
    }, AUTO_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // scroll listener
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const handleManualNav = (idx: number) => {
    scrollTo(idx);
  };

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Forest background image */}
      <div className="absolute inset-0 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark green tint overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(15, 35, 20, 0.7)" }} />
        {/* Blur layer */}
        <div className="absolute inset-0 backdrop-blur-[0.3px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-6 sm:px-10 lg:px-16">
          <div>
            <h2 className="text-2xl font-bold text-white">Sản phẩm nổi bật</h2>
            <p className="text-white/50 mt-1 text-sm">Nông sản chất lượng từ khắp Việt Nam</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleManualNav(activeIdx - 1)}
              className="w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white/70 hover:border-primary hover:text-primary hover:bg-white/20 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleManualNav(activeIdx + 1)}
              className="w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white/70 hover:border-primary hover:text-primary hover:bg-white/20 transition-all"
            >
              <ChevronRight size={18} />
            </button>
            <Button size="sm" asChild className="ml-2 bg-primary hover:bg-primary/90">
              <Link href="/marketplace">Xem tất cả</Link>
            </Button>
          </div>
        </div>

        {/* Track — full width */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-4"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: "clamp(24px, 4vw, 64px)",
          }}
        >
          {PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/marketplace/${product.id}`}
              className="group shrink-0 w-72 bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                scrollSnapAlign: "start",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-surface-green">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="288px"
                />
                <div className="absolute top-3 right-3">
                  <FarmingBadge type={product.farming_type} />
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-ink mb-1 group-hover:text-primary transition-colors leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted mb-2">
                  <MapPin size={11} className="text-primary shrink-0" />
                  {product.province}
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={11} fill="#F59E0B" stroke="none" />
                  <span className="text-xs font-semibold text-ink">{product.rating}</span>
                  <span className="text-xs text-muted">· Đã bán {product.sold.toLocaleString("vi-VN")} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-primary">
                      {product.price.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-xs text-muted">/{product.unit}</span>
                  </div>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center gap-1.5 text-xs px-3 h-8 rounded-full border border-hairline bg-surface-green text-primary font-medium hover:border-primary transition-colors"
                  >
                    <Phone size={11} /> Liên hệ
                  </button>
                </div>
                <p className="text-xs text-muted mt-2 truncate">{product.seller}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Dots + progress bar */}
        <div className="flex justify-center gap-1.5 mt-4">
          {PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => handleManualNav(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: activeIdx === i ? "24px" : "6px",
                background: activeIdx === i ? "#52B788" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
