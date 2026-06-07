"use client";

/**
 * AdCarouselHome — rotating ad carousel for home page.
 *
 * FUTURE INTEGRATION NOTE:
 * ─────────────────────────────────────────────────────────────────────
 * Slot: "home-carousel" — dải quảng cáo sau StatsSection trên trang chủ.
 * Đối tượng: nhà bán nông cụ, vật tư nông nghiệp, phân bón, máy móc.
 * Tích hợp thật:
 *   1. Fetch GET /api/ads?slot=home-carousel → trả về mảng Ad[]
 *   2. Mỗi ad: { id, bg, imageUrl, label, title, subtitle, cta, href, advertiser }
 *   3. Track impression khi slide vào viewport, track click khi nhấn CTA
 *   4. Hỗ trợ A/B testing bằng cách server trả ad theo segment user
 * ─────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeAd {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  advertiser: string;
  imageUrl: string;
  bg: string;
  accent: string;
}

const HOME_ADS: HomeAd[] = [
  {
    id: "h1",
    label: "Nông cụ hiện đại",
    title: "Máy gặt đập liên hợp Kubota DC-70G",
    subtitle: "Hiệu suất 0.3 ha/giờ, phù hợp lúa nước ĐBSCL. Đại lý chính hãng toàn quốc.",
    cta: "Xem báo giá",
    href: "#",
    advertiser: "Kubota Vietnam",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=300&fit=crop&auto=format",
    bg: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)",
    accent: "#95D5B2",
  },
  {
    id: "h2",
    label: "Hệ thống tưới tiêu",
    title: "Tưới nhỏ giọt Netafim — Tiết kiệm 60% nước",
    subtitle: "Công nghệ Israel, phù hợp rau màu, cây ăn trái. Lắp đặt và bảo trì tại chỗ.",
    cta: "Tư vấn miễn phí",
    href: "#",
    advertiser: "Netafim Vietnam",
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=300&fit=crop&auto=format",
    bg: "linear-gradient(135deg, #1A3A5C 0%, #1D4ED8 60%, #2563EB 100%)",
    accent: "#BFDBFE",
  },
  {
    id: "h3",
    label: "Phân bón & Thuốc BVTV",
    title: "Phân bón hữu cơ sinh học BioFarm",
    subtitle: "NPK + vi sinh, tăng năng suất 25%, giảm dư lượng hóa chất. Đạt chuẩn VietGAP.",
    cta: "Đặt mua sỉ",
    href: "#",
    advertiser: "BioFarm Vietnam",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=300&fit=crop&auto=format",
    bg: "linear-gradient(135deg, #78350F 0%, #B45309 60%, #D97706 100%)",
    accent: "#FDE68A",
  },
  {
    id: "h4",
    label: "Thiết bị bay nông nghiệp",
    title: "Drone phun thuốc DJI Agras T40",
    subtitle: "Phun 40 ha/ngày, tích hợp AI nhận diện sâu bệnh. Cho thuê theo mùa vụ.",
    cta: "Liên hệ ngay",
    href: "#",
    advertiser: "DJI Agriculture VN",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&h=300&fit=crop&auto=format",
    bg: "linear-gradient(135deg, #312E81 0%, #4338CA 60%, #6366F1 100%)",
    accent: "#C7D2FE",
  },
];

export function AdCarouselHome() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((i) => (i + 1) % HOME_ADS.length), []);
  const prev = () => setActive((i) => (i - 1 + HOME_ADS.length) % HOME_ADS.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  const ad = HOME_ADS[active];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden select-none"
      style={{ height: 200 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {HOME_ADS.map((a, i) => (
        <div
          key={a.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 flex",
            i === active ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
          style={{ background: a.bg }}
        >
          {/* Right image panel */}
          <div className="absolute right-0 top-0 bottom-0 w-64 overflow-hidden opacity-30">
            <Image src={a.imageUrl} alt={a.title} fill className="object-cover" sizes="256px" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${a.bg.split("100%")[0].split(",").pop()?.trim() ?? "#000"} 0%, transparent 100%)` }} />
          </div>

          {/* SVG arcs */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100%" cy="0%" r="220" stroke="white" strokeWidth="1" fill="none" opacity="0.2" />
            <circle cx="100%" cy="0%" r="150" stroke="white" strokeWidth="0.8" fill="none" opacity="0.12" />
          </svg>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center px-8 gap-6 flex-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                  style={{ background: a.accent + "25", color: a.accent }}
                >
                  {a.label}
                </span>
                <span className="text-[9px] text-white/30 uppercase tracking-wider">{a.advertiser}</span>
              </div>
              <h3 className="text-white font-bold text-base leading-tight mb-2 drop-shadow line-clamp-2">
                {a.title}
              </h3>
              <p className="text-white/65 text-xs leading-relaxed line-clamp-2 max-w-md">
                {a.subtitle}
              </p>
            </div>

            <button
              className="shrink-0 text-xs font-semibold px-5 h-9 rounded-full transition-all shadow-md hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{ background: a.accent, color: "#1B4332" }}
            >
              {a.cta}
            </button>
          </div>

          {/* Ad label */}
          <span className="absolute bottom-2 right-3 text-[8px] text-white/25 uppercase tracking-wider">
            Quảng cáo
          </span>
        </div>
      ))}

      {/* Prev / Next */}
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-all">
        <ChevronLeft size={14} />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-all">
        <ChevronRight size={14} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {HOME_ADS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-full transition-all duration-300",
              i === active ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}
