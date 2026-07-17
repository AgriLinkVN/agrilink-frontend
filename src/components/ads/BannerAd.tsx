'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { type AdCampaign } from '@/types/ads';

async function trackEvent(
  campaignId: string,
  eventType: 'impression' | 'click',
): Promise<void> {
  try {
    await api.post('/ads/events', { campaignId, eventType });
  } catch {
    // best-effort, never throw from a banner
  }
}

export function BannerAd({ campaign }: { campaign: AdCampaign }) {
  const hasTracked = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || hasTracked.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTracked.current) {
          hasTracked.current = true;
          void trackEvent(campaign.id, 'impression');
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [campaign.id]);

  const handleClick = () => {
    void trackEvent(campaign.id, 'click');
  };

  return (
    <div ref={ref} className="relative rounded-lg overflow-hidden">
      <span className="absolute top-1 right-1 text-[10px] text-white/60 bg-black/30 px-1 rounded z-10 pointer-events-none">
        Quảng cáo
      </span>
      <a
        href={campaign.linkUrl ?? '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        <Image
          src={campaign.imageUrl}
          alt={campaign.title}
          width={1600}
          height={500}
          sizes="100vw"
          className="w-full object-cover aspect-[16/5]"
        />
      </a>
    </div>
  );
}
