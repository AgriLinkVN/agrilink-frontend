export enum NotifType {
  NEW_ORDER = 'new_order',
  PRODUCT_APPROVED = 'product_approved',
  PRODUCT_REJECTED = 'product_rejected',
  PRICE_ALERT = 'price_alert',
  MEMBER_REQUEST = 'member_request',
  NEW_MESSAGE = 'new_message',
  NEW_REVIEW = 'new_review',
  REVIEW_REPLY = 'review_reply',
  AD_APPROVED = 'ad_approved',
  AD_REJECTED = 'ad_rejected',
  USER_LOCKED = 'user_locked',
  MEMBER_APPROVED = 'member_approved',
  MEMBER_REJECTED = 'member_rejected',
  MEMBER_SUSPENDED = 'member_suspended',
  MEMBER_REACTIVATED = 'member_reactivated',
  HARVEST_REMINDER = 'harvest_reminder',
}

/**
 * Wire format from backend.
 * Backend serializes TypeORM entities using camelCase, so all timestamp/flag
 * fields are camelCase too. Do NOT use snake_case here.
 */
export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body?: string;
  data?: Record<string, string>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}
