'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { BellOff, CheckCheck, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { useAuthStore } from '@/store/authStore';
import { useNotifications } from '@/hooks/useNotifications';
import { type Notification } from '@/types/notification';

interface Paginated {
  data: Notification[];
  total: number;
}

const PAGE_SIZE = 20;

export function NotificationsList() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const { markRead, markAllRead, unreadCount } = useNotifications();

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isError } =
    useInfiniteQuery<Paginated>({
      queryKey: ['notifications-page'],
      enabled: !!accessToken,
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        api.get<Paginated>(
          `/notifications?page=${pageParam as number}&limit=${PAGE_SIZE}`,
          accessToken,
        ),
      getNextPageParam: (lastPage, all) => {
        const loaded = all.reduce((sum, p) => sum + p.data.length, 0);
        return loaded < lastPage.total ? all.length + 1 : undefined;
      },
    });

  const items = data?.pages.flatMap((p) => p.data) ?? [];

  const handleMarkRead = async (id: string) => {
    await markRead(id);
    queryClient.setQueryData<{ pages: Paginated[]; pageParams: number[] } | undefined>(
      ['notifications-page'],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            data: p.data.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
          })),
        };
      },
    );
  };

  if (!accessToken) {
    return (
      <p className="text-sm text-muted text-center py-10">
        Bạn cần đăng nhập để xem thông báo.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted">
        <Loader2 size={22} className="animate-spin mr-2" /> Đang tải...
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-error text-center py-10">
        Không thể tải thông báo. Vui lòng thử lại.
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted">
        <BellOff size={36} />
        <p className="text-sm">Bạn chưa có thông báo nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-hairline overflow-hidden">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-hairline bg-blue-50/40">
          <p className="text-sm text-muted">
            Bạn có <span className="font-semibold text-ink">{unreadCount}</span> thông báo chưa đọc
          </p>
          <Button size="sm" variant="ghost" onClick={() => markAllRead()} className="text-xs gap-1">
            <CheckCheck size={13} /> Đánh dấu đã đọc tất cả
          </Button>
        </div>
      )}

      <ul className="divide-y divide-gray-50">
        {items.map((notif) => (
          <li key={notif.id}>
            <NotificationItem notification={notif} onMarkRead={handleMarkRead} />
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div className="flex justify-center p-4 border-t border-hairline">
          <Button
            variant="secondary"
            size="sm"
            loading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            Tải thêm
          </Button>
        </div>
      )}
    </div>
  );
}
