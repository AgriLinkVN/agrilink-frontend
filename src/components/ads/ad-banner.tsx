"use client";

/**
 * AdBanner — static image-style ad slot.
 *
 * FUTURE INTEGRATION NOTE:
 * ─────────────────────────────────────────────────────────────────────
 * Slot dành cho quảng cáo nhà bán nông cụ (máy cày, máy phun, phân bón…).
 * Để tích hợp quảng cáo thật:
 *   1. Thay `MOCK_ADS` bằng fetch từ /api/ads?slot=<slotId>&page=<page>
 *   2. `slotId` giúp phân biệt vị trí đặt quảng cáo (sidebar / below-hero / inline)
 *   3. Mỗi ad gồm: { imageUrl, title, cta, href, advertiser }
 *   4. Ghi lại impression/click qua /api/ads/track
 * ─────────────────────────────────────────────────────────────────────
 */

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Ad {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  advertiser: string;
  badge?: string;
}

// ── Mock ads — replace with API fetch later ──────────────────────────
const MOCK_ADS: Record<string, Ad[]> = {
  "profile-sidebar": [
    {
      id: "ps1",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=200&fit=crop&auto=format",
      title: "Máy phun thuốc không người lái",
      subtitle: "DJI Agras T40 — phun 40ha/ngày, tiết kiệm 30% chi phí nhân công",
      cta: "Xem báo giá",
      href: "#",
      advertiser: "AgriTech Pro",
      badge: "Mới 2026",
    },
    {
      id: "ps2",
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop&auto=format",
      title: "Phân bón hữu cơ vi sinh",
      subtitle: "Tăng năng suất 25%, cải tạo đất lâu dài. Chứng nhận hữu cơ",
      cta: "Đặt mua ngay",
      href: "#",
      advertiser: "BioFarm VN",
      badge: "Khuyến mãi",
    },
    {
      id: "ps3",
      imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=200&fit=crop&auto=format",
      title: "Hệ thống tưới nhỏ giọt Netafim",
      subtitle: "Tiết kiệm 60% nước. Lắp đặt và bảo trì toàn quốc",
      cta: "Nhận tư vấn",
      href: "#",
      advertiser: "Netafim Vietnam",
    },
    {
      id: "ps4",
      imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&h=200&fit=crop&auto=format",
      title: "Máy kéo Kubota L4018",
      subtitle: "40 mã lực, đa năng, phù hợp mọi loại đất",
      cta: "Xem chi tiết",
      href: "#",
      advertiser: "Kubota VN",
    },
  ],
  sidebar: [
    {
      id: "s1",
      imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=200&fit=crop&auto=format",
      title: "Máy phun thuốc không người lái",
      subtitle: "DJI Agras T40 — phun 40ha/ngày, giảm 30% chi phí",
      cta: "Xem báo giá",
      href: "#",
      advertiser: "AgriTech Pro",
      badge: "Mới 2026",
    },
    {
      id: "s2",
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop&auto=format",
      title: "Phân bón hữu cơ sinh học",
      subtitle: "Tăng năng suất 25%, thân thiện môi trường",
      cta: "Đặt mua ngay",
      href: "#",
      advertiser: "BioFarm VN",
      badge: "Khuyến mãi",
    },
  ],
  "below-hero": [
    {
      id: "bh1",
      imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=160&fit=crop&auto=format",
      title: "Hệ thống tưới nhỏ giọt Israel — Netafim",
      subtitle: "Tiết kiệm 60% nước, tăng năng suất cây trồng. Lắp đặt toàn quốc.",
      cta: "Nhận tư vấn miễn phí",
      href: "#",
      advertiser: "Netafim Vietnam",
      badge: "Đối tác chính thức",
    },
  ],
  inline: [
    {
      id: "i1",
      imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&h=120&fit=crop&auto=format",
      title: "Máy kéo đa năng Kubota M7040",
      subtitle: "70 mã lực, phù hợp đồng bằng sông Cửu Long",
      cta: "Xem chi tiết",
      href: "#",
      advertiser: "Kubota VN",
    },
  ],
};

// ── Variants ─────────────────────────────────────────────────────────

interface AdBannerProps {
  /** Which slot this banner occupies — used for future server-side targeting */
  slotId?: "sidebar" | "below-hero" | "inline" | "profile-sidebar";
  /** Index into the mock ad list for this slot */
  index?: number;
  className?: string;
}

export function AdBanner({ slotId = "sidebar", index = 0, className = "" }: AdBannerProps) {
  const ads = MOCK_ADS[slotId] ?? MOCK_ADS.sidebar;
  const ad = ads[index % ads.length];

  const isWide = slotId === "below-hero" || slotId === "inline";
  const isSidebar = slotId === "sidebar" || slotId === "profile-sidebar";

  return (
    <Link
      href={ad.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative block overflow-hidden rounded-xl border border-hairline hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-white ${className}`}
    >
      {/* Image */}
      <div className={`relative w-full overflow-hidden ${isWide ? "h-28 sm:h-36" : "h-32"}`}>
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={isWide ? "800px" : "300px"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Badge */}
        {ad.badge && (
          <div className="absolute top-2 left-2">
            <span className="text-[9px] font-bold uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full">
              {ad.badge}
            </span>
          </div>
        )}

        {/* Ad label */}
        <span className="absolute top-2 right-2 text-[8px] text-white/50 font-medium uppercase tracking-wider">
          Quảng cáo
        </span>
      </div>

      {/* Content */}
      <div className={`p-3 flex ${isWide ? "flex-row items-center gap-4" : "flex-col gap-1.5"}`}>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] text-muted uppercase tracking-widest mb-0.5">{ad.advertiser}</div>
          <div className="text-sm font-bold text-ink leading-tight line-clamp-1">{ad.title}</div>
          <div className="text-[11px] text-muted leading-snug line-clamp-2 mt-0.5">{ad.subtitle}</div>
        </div>
        <div className={isWide ? "shrink-0" : "mt-1"}>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-active">
            {ad.cta} <ExternalLink size={10} />
          </span>
        </div>
      </div>
    </Link>
  );
}
