/** Backend response shapes for ad packages and campaigns.
 *  Field names match the backend entity serialization (camelCase),
 *  which mirrors the SQL columns:
 *    ad_packages.id (INT), ad_campaigns.{supplier_id, image_url, link_url,
 *    start_date, end_date, total_impressions, total_clicks}
 */

export interface AdPackage {
  /** INTEGER per SQL doc */
  id: number;
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
  /** Owner of the campaign — supplier user id (matches SQL `supplier_id`). */
  supplierId: string;
  packageId: number;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  /** Array of province IDs (empty = nationwide). */
  targetProvinces: number[];
  status: 'pending_approval' | 'active' | 'paused' | 'rejected' | 'expired';
  rejectionReason: string | null;
  /** ISO date string (DATE column, day precision). */
  startDate: string | null;
  endDate: string | null;
  totalImpressions: number;
  totalClicks: number;
  createdAt: string;
  package: AdPackage;
}

/** Payload sent to POST /ads/campaigns */
export interface CreateCampaignPayload {
  title: string;
  packageId: number;
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
