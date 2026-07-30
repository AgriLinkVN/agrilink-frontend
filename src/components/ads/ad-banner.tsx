"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { api } from "@/lib/api";

interface AdCampaign {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
}

interface AdBannerProps {
  slotId?: "sidebar" | "below-hero" | "inline";
  index?: number;
  className?: string;
}

async function trackAdEvent(
  campaignId: string,
  eventType: "impression" | "click",
): Promise<void> {
  await api.post<void>("/ads/events", { campaignId, eventType });
}

export function AdBanner({
  slotId = "sidebar",
  index = 0,
  className = "",
}: AdBannerProps) {
  const { data: campaigns = [] } = useQuery({
    queryKey: ["ads", "banners"],
    queryFn: () => api.get<AdCampaign[]>("/ads/banners"),
    staleTime: 60_000,
  });
  const ad = campaigns.length > 0 ? campaigns[index % campaigns.length] : null;

  useEffect(() => {
    if (!ad) return;
    void trackAdEvent(ad.id, "impression").catch(() => undefined);
  }, [ad]);

  if (!ad) return null;

  const isWide = slotId === "below-hero" || slotId === "inline";
  const href = ad.linkUrl ?? "/marketplace";
  const external = /^https?:\/\//i.test(href);

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() => void trackAdEvent(ad.id, "click").catch(() => undefined)}
      className={`group relative block overflow-hidden rounded-lg border border-hairline bg-white transition-all duration-200 hover:border-primary/30 hover:shadow-md ${className}`}
    >
      <div
        className={`relative w-full overflow-hidden ${isWide ? "h-28 sm:h-36" : "h-32"}`}
      >
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={isWide ? "800px" : "300px"}
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 text-white">
        <p className="line-clamp-2 text-sm font-semibold">{ad.title}</p>
        <ExternalLink size={15} className="shrink-0" />
      </div>
    </Link>
  );
}
