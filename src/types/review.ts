export interface ReviewerInfo {
  id: string;
  fullName: string;
  avatarUrl?: string;
}

export interface ReviewProductInfo {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  revieweeId?: string;
  productId?: string;
  rating: number;
  comment?: string;
  /** JSON-stringified string[] — parse before use */
  images?: string;
  isVerifiedPurchase: boolean;
  sellerReply?: string | null;
  sellerReplyAt?: string | null;
  isHidden?: boolean;
  hiddenReason?: string | null;
  createdAt: string;
  reviewer: ReviewerInfo;
  product?: ReviewProductInfo;
}

export interface RatingStats {
  avg: number;
  total: number;
  distribution: Record<number, number>;
}

export interface ReviewsResponse {
  data: Review[];
  total: number;
  stats: RatingStats;
}

export interface SellerReviewsResponse {
  data: Review[];
  total: number;
}

export interface AdminReviewsResponse {
  data: Review[];
  total: number;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
  images?: string[];
}
