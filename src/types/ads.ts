/** Backend response shapes for ad packages and campaigns.
 *  Field names match the backend entity serialization (camelCase). */

export interface AdPackage {
  id: string;
  name: string;
  adType: 'banner' | 'featured' | 'spotlight';
  price: number;
  durationDays: number;
  maxImpressions: number | null;
  description: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdCampaign {
  id: string;
  advertiserId: string;
  packageId: string;
  title: string;
  bannerUrl: string;
  targetUrl: string | null;
  /** Array of province IDs (empty = nationwide). */
  targetProvinces: number[];
  status: 'pending_approval' | 'active' | 'paused' | 'rejected' | 'expired';
  rejectionReason: string | null;
  startsAt: string | null;
  endsAt: string | null;
  impressionCount: number;
  clickCount: number;
  createdAt: string;
  package: AdPackage;
}

/** Payload sent to POST /ads/campaigns */
export interface CreateCampaignPayload {
  title: string;
  packageId: string;
  imageUrl: string;
  linkUrl?: string;
  targetProvinces?: number[];
}

export interface CampaignAnalytics {
  campaign: AdCampaign;
  daily: Array<{ date: string; impressions: number; clicks: number }>;
  /** Click-through rate, %. */
  ctr: number;
  daysLeft: number;
}

export interface PaginatedCampaigns {
  data: AdCampaign[];
  total: number;
  page: number;
  limit: number;
}
