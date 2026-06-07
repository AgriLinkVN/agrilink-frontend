"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ADS = [
  {
    id: 1,
    label: "Mùa vụ hè 2026",
    title: "Trái cây miền Nam tươi ngon",
    subtitle: "Xoài, sầu riêng, bưởi — thẳng từ vườn đến bàn ăn. Đặt hàng sỉ tiết kiệm đến 30%.",
    cta: "Xem ngay",
    bg: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)",
    accent: "#95D5B2",
    pattern: "fruit",
  },
  {
    id: 2,
    label: "Chứng nhận GlobalGAP",
    title: "Nông sản xuất khẩu chất lượng cao",
    subtitle: "Hàng trăm sản phẩm đạt tiêu chuẩn quốc tế, sẵn sàng giao toàn quốc và xuất khẩu.",
    cta: "Khám phá",
    bg: "linear-gradient(135deg, #1A3A5C 0%, #1D4ED8 50%, #2563EB 100%)",
    accent: "#BFDBFE",
    pattern: "cert",
  },
  {
    id: 3,
    label: "HTX nông nghiệp",
    title: "Kết nối hợp tác xã toàn quốc",
    subtitle: "Mua sỉ trực tiếp từ hơn 200 HTX uy tín, đảm bảo nguồn gốc rõ ràng, giá tốt nhất.",
    cta: "Liên hệ ngay",
    bg: "linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%)",
    accent: "#FDE68A",
    pattern: "coop",
  },
  {
    id: 4,
    label: "Đặc sản vùng miền",
    title: "Hương vị Việt Nam từ mọi vùng đất",
    subtitle: "Mật ong Tây Nguyên, chè Shan Tuyết Hà Giang, gạo ST25 Sóc Trăng — tất cả tại một nơi.",
    cta: "Mua ngay",
    bg: "linear-gradient(135deg, #4A1942 0%, #7C3AED 50%, #8B5CF6 100%)",
    accent: "#DDD6FE",
    pattern: "special",
  },
];

function PatternBg({ pattern, accent }: { pattern: string; accent: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
      {pattern === "fruit" && (
        <>
          <circle cx="85%" cy="50%" r="120" fill={accent} />
          <circle cx="92%" cy="20%" r="60" fill={accent} />
          <circle cx="78%" cy="80%" r="40" fill={accent} />
          <circle cx="70%" cy="30%" r="80" fill="white" opacity="0.3" />
        </>
      )}
      {pattern === "cert" && (
        <>
          <rect x="70%" y="10%" width="160" height="160" rx="20" fill={accent} transform="rotate(15 0 0)" />
          <rect x="80%" y="50%" width="100" height="100" rx="12" fill="white" opacity="0.3" transform="rotate(-10 0 0)" />
        </>
      )}
      {pattern === "coop" && (
        <>
          <ellipse cx="85%" cy="50%" rx="130" ry="90" fill={accent} />
          <ellipse cx="75%" cy="20%" rx="70" ry="50" fill="white" opacity="0.2" />
        </>
      )}
      {pattern === "special" && (
        <>
          <circle cx="85%" cy="40%" r="100" fill={accent} />
          <circle cx="95%" cy="70%" r="60" fill="white" opacity="0.15" />
          <circle cx="72%" cy="60%" r="40" fill={accent} opacity="0.5" />
        </>
      )}
      {/* Arc lines */}
      <circle cx="100%" cy="0%" r="200" stroke="white" strokeWidth="1" fill="none" opacity="0.15" />
      <circle cx="100%" cy="0%" r="140" stroke="white" strokeWidth="0.8" fill="none" opacity="0.1" />
    </svg>
  );
}

export function AdCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((i) => (i + 1) % ADS.length), []);
  const prev = () => setActive((i) => (i - 1 + ADS.length) % ADS.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [paused, next]);

  const ad = ADS[active];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden select-none"
      style={{ height: 148 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {ADS.map((a, i) => (
        <div
          key={a.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === active ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
          style={{ background: a.bg }}
        >
          <PatternBg pattern={a.pattern} accent={a.accent} />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center px-8 gap-6">
            <div className="flex-1 min-w-0">
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2"
                style={{ background: a.accent + "30", color: a.accent }}
              >
                {a.label}
              </span>
              <h2 className="text-white font-bold text-lg leading-tight mb-1.5 drop-shadow">
                {a.title}
              </h2>
              <p className="text-white/70 text-xs leading-relaxed line-clamp-2 max-w-lg">
                {a.subtitle}
              </p>
            </div>

            <button
              className="shrink-0 text-xs font-semibold px-5 h-9 rounded-full transition-all shadow-md hover:scale-105 active:scale-95"
              style={{ background: a.accent, color: "#1B4332" }}
            >
              {a.cta}
            </button>
          </div>

          {/* Ad label */}
          <span className="absolute top-2.5 right-3 text-[9px] text-white/30 font-medium uppercase tracking-wider">
            Quảng cáo
          </span>
        </div>
      ))}

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-all"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-all"
      >
        <ChevronRight size={14} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {ADS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-full transition-all duration-300",
              i === active ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </div>
  );
}
