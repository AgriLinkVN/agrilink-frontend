'use client';

import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  XCircle,
  Megaphone,
  Ban,
  UserPlus,
  Star,
  MessageCircle,
  TrendingUp,
  Bell,
  Lock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { type Notification, NotifType } from '@/types/notification';

interface Props {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

const TYPE_CONFIG: Record<
  NotifType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  [NotifType.NEW_ORDER]:        { icon: Bell,          color: 'text-blue-500',   bg: 'bg-blue-100' },
  [NotifType.PRODUCT_APPROVED]: { icon: CheckCircle,   color: 'text-green-500',  bg: 'bg-green-100' },
  [NotifType.PRODUCT_REJECTED]: { icon: XCircle,       color: 'text-red-500',    bg: 'bg-red-100' },
  [NotifType.AD_APPROVED]:      { icon: Megaphone,     color: 'text-blue-500',   bg: 'bg-blue-100' },
  [NotifType.AD_REJECTED]:      { icon: Ban,           color: 'text-orange-500', bg: 'bg-orange-100' },
  [NotifType.MEMBER_REQUEST]:   { icon: UserPlus,      color: 'text-purple-500', bg: 'bg-purple-100' },
  [NotifType.NEW_REVIEW]:       { icon: Star,          color: 'text-yellow-500', bg: 'bg-yellow-100' },
  [NotifType.REVIEW_REPLY]:     { icon: MessageCircle, color: 'text-emerald-500',bg: 'bg-emerald-100' },
  [NotifType.PRICE_ALERT]:      { icon: TrendingUp,    color: 'text-teal-500',   bg: 'bg-teal-100' },
  [NotifType.NEW_MESSAGE]:      { icon: Bell,          color: 'text-indigo-500', bg: 'bg-indigo-100' },
  [NotifType.USER_LOCKED]:      { icon: Lock,          color: 'text-red-600',    bg: 'bg-red-100' },
  [NotifType.MEMBER_APPROVED]:  { icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-100' },
  [NotifType.MEMBER_REJECTED]:  { icon: XCircle,       color: 'text-red-500',    bg: 'bg-red-100' },
  [NotifType.MEMBER_SUSPENDED]: { icon: Ban,           color: 'text-orange-500', bg: 'bg-orange-100' },
  [NotifType.MEMBER_REACTIVATED]: { icon: CheckCircle, color: 'text-emerald-600',bg: 'bg-emerald-100' },
  [NotifType.HARVEST_REMINDER]: { icon: Bell,          color: 'text-amber-600',  bg: 'bg-amber-100' },
};

function safeFormatTimeAgo(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return formatDistanceToNow(d, { locale: vi, addSuffix: true });
}

export function NotificationItem({ notification, onMarkRead }: Props) {
  const router = useRouter();
  const config = TYPE_CONFIG[notification.type] ?? {
    icon: Bell,
    color: 'text-gray-500',
    bg: 'bg-gray-100',
  };
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.isRead) onMarkRead(notification.id);
    if (notification.data?.link) {
      router.push(notification.data.link);
    }
  };

  const timeAgo = safeFormatTimeAgo(notification.createdAt);

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors',
        notification.isRead
          ? 'bg-white hover:bg-gray-50'
          : 'bg-blue-50 hover:bg-blue-100',
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          'shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5',
          config.bg,
        )}
      >
        <Icon size={16} className={config.color} />
      </span>

      {/* Content */}
      <span className="flex-1 min-w-0">
        <span
          className={cn(
            'block text-sm truncate',
            notification.isRead ? 'font-normal text-gray-700' : 'font-medium text-gray-900',
          )}
        >
          {notification.title}
        </span>
        {notification.body && (
          <span className="block text-xs text-gray-500 mt-0.5 line-clamp-2">
            {notification.body}
          </span>
        )}
      </span>

      {/* Time + unread dot */}
      <span className="shrink-0 flex flex-col items-end gap-1 ml-1">
        <span className="text-[11px] text-gray-400 whitespace-nowrap">{timeAgo}</span>
        {!notification.isRead && (
          <span className="w-2 h-2 rounded-full bg-blue-500" />
        )}
      </span>
    </button>
  );
}
