"use client";

/**
 * AdSidebarHome — vertical sticky ad column for home page.
 *
 * FUTURE INTEGRATION:
 *   Slot IDs: "home-left" / "home-right"
 *   Replace SIDEBAR_ADS with fetch('/api/ads?slot=home-left') etc.
 *   Track via /api/ads/track
 */

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface SideAd {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  advertiser: string;
  badge?: string;
  bgColor?: string;
}

const LEFT_ADS: SideAd[] = [
  {
    id: "hl1",
    imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=300&h=200&fit=crop&auto=format",
    title: "Kubota M7040",
    subtitle: "Máy kéo 70 mã lực — phù hợp ĐBSCL",
    cta: "Xem ngay",
    href: "#",
    advertiser: "Kubota Vietnam",
    badge: "Hot",
    bgColor: "#FFF7ED",
  },
  {
    id: "hl2",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&h=200&fit=crop&auto=format",
    title: "DJI Agras T40",
    subtitle: "Drone phun 40ha/ngày, giảm 30% chi phí nhân công",
    cta: "Báo giá",
    href: "#",
    advertiser: "AgriTech Pro",
    badge: "Mới 2026",
    bgColor: "#EFF6FF",
  },
  {
    id: "hl3",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop&auto=format",
    title: "Phân bón BioFarm",
    subtitle: "Hữu cơ sinh học — tăng năng suất 25%",
    cta: "Đặt mua",
    href: "#",
    advertiser: "BioFarm VN",
    bgColor: "#F0FFF4",
  },
];

const RIGHT_ADS: SideAd[] = [
  {
    id: "hr1",
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&h=200&fit=crop&auto=format",
    title: "Tưới nhỏ giọt Netafim",
    subtitle: "Tiết kiệm 60% nước, tự động hóa tưới tiêu",
    cta: "Tư vấn miễn phí",
    href: "#",
    advertiser: "Netafim Vietnam",
    badge: "Israel Tech",
    bgColor: "#EFF6FF",
  },
  {
    id: "hr2",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&h=200&fit=crop&auto=format",
    title: "Máy gặt đập Yanmar",
    subtitle: "Năng suất 2ha/giờ — bảo hành 3 năm toàn quốc",
    cta: "Liên hệ đại lý",
    href: "#",
    advertiser: "Yanmar Vietnam",
    badge: "Ưu đãi Q2",
    bgColor: "#FFF7ED",
  },
  {
    id: "hr3",
    imageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=300&h=200&fit=crop&auto=format",
    title: "Nhà kính thông minh",
    subtitle: "Điều khiển nhiệt độ, độ ẩm tự động IoT",
    cta: "Xem giải pháp",
    href: "#",
    advertiser: "SmartFarm VN",
    bgColor: "#F0FFF4",
  },
];

function SideAdCard({ ad }: { ad: SideAd }) {
  return (
    <Link
      href={ad.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-xl border border-hairline hover:border-primary/40 hover:shadow-md transition-all duration-200 bg-white"
    >
      {/* Image */}
      <div className="relative w-full h-28 overflow-hidden">
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {ad.badge && (
          <div className="absolute top-2 left-2">
            <span className="text-[9px] font-bold uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full">
              {ad.badge}
            </span>
          </div>
        )}
        <span className="absolute top-2 right-2 text-[8px] text-white/50 font-medium uppercase tracking-wider">
          Quảng cáo
        </span>
      </div>

      {/* Content */}
      <div className="p-3" style={{ background: ad.bgColor ?? "#fff" }}>
        <div className="text-[9px] text-muted uppercase tracking-widest mb-0.5">{ad.advertiser}</div>
        <div className="text-xs font-bold text-ink leading-tight line-clamp-1">{ad.title}</div>
        <div className="text-[11px] text-muted leading-snug line-clamp-2 mt-0.5">{ad.subtitle}</div>
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:text-primary-active transition-colors">
            {ad.cta} <ExternalLink size={10} />
          </span>
        </div>
      </div>
    </Link>
  );
}

interface AdSidebarHomeProps {
  side: "left" | "right";
  className?: string;
}

export function AdSidebarHome({ side, className = "" }: AdSidebarHomeProps) {
  const ads = side === "left" ? LEFT_ADS : RIGHT_ADS;

  return (
    <aside className={`flex flex-col gap-3 ${className}`}>
      <p className="text-[9px] text-muted/40 uppercase tracking-widest text-center">Tài trợ</p>
      {ads.map((ad) => (
        <SideAdCard key={ad.id} ad={ad} />
      ))}
    </aside>
  );
}
