'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { type AdCampaign } from '@/types/ads';
import { BannerAd } from './BannerAd';

interface Props {
  /** Optional — when provided, prefer banners targeted at this province. */
  provinceId?: number;
}

export function BannerSlider({ provinceId }: Props) {
  const { data: campaigns, isLoading } = useQuery<AdCampaign[]>({
    queryKey: ['banners', provinceId ?? null],
    queryFn: () =>
      api.get<AdCampaign[]>(
        provinceId ? `/ads/banners?province_id=${provinceId}` : '/ads/banners',
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds when multiple banners
  useEffect(() => {
    if (!campaigns || campaigns.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [campaigns]);

  // Skeleton
  if (isLoading) {
    return (
      <div className="w-full aspect-[16/5] rounded-lg bg-gray-200 animate-pulse" />
    );
  }

  // No banners
  if (!campaigns || campaigns.length === 0) return null;

  // Single banner — render directly without slider chrome
  if (campaigns.length === 1) {
    return <BannerAd campaign={campaigns[0]} />;
  }

  const safeIndex = Math.min(currentIndex, campaigns.length - 1);

  // Multiple banners — auto-slide with dot navigation
  return (
    <div className="relative">
      <BannerAd campaign={campaigns[safeIndex]} />

      {/* Dot navigation */}
      <div className="flex justify-center gap-1.5 mt-2">
        {campaigns.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === safeIndex ? 'w-5 bg-primary' : 'w-1.5 bg-gray-300'
            }`}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
