"use client";

import { AdBanner } from "@/components/ads/ad-banner";

interface AdSidebarHomeProps {
  side: "left" | "right";
  className?: string;
}

export function AdSidebarHome({
  side,
  className = "",
}: AdSidebarHomeProps) {
  const offset = side === "left" ? 0 : 3;

  return (
    <aside className={`flex flex-col gap-3 ${className}`}>
      <p className="text-center text-[9px] uppercase tracking-widest text-muted/40">
        Tài trợ
      </p>
      {[0, 1, 2].map((position) => (
        <AdBanner
          key={`${side}-${position}`}
          slotId="sidebar"
          index={offset + position}
        />
      ))}
    </aside>
  );
}
