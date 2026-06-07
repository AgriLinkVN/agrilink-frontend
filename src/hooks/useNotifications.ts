'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { api } from '@/lib/api';
import { type Notification } from '@/types/notification';

export function useNotifications() {
  const store = useNotificationStore();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      // Token cleared (logout) — close socket and reset state
      disconnectSocket();
      store.setNotifications([]);
      store.setUnreadCount(0);
      store.setConnected(false);
      return;
    }

    const socket = connectSocket(accessToken);

    // Initial fetch — unwrap envelope via api helper
    api
      .get<Notification[]>('/notifications/unread', accessToken)
      .then((list) => Array.isArray(list) && store.setNotifications(list))
      .catch(() => {});

    api
      .get<{ count: number }>('/notifications/count', accessToken)
      .then((res) => {
        if (typeof res?.count === 'number') store.setUnreadCount(res.count);
      })
      .catch(() => {});

    const onConnect = () => store.setConnected(true);
    const onDisconnect = () => store.setConnected(false);
    const onNewNotif = (notif: Notification) => {
      store.prependNotification(notif);
      store.incrementUnread();
    };
    const onMarkedRead = (payload: { id: string }) => {
      store.markOneRead(payload.id);
      store.decrementUnread();
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_notification', onNewNotif);
    socket.on('marked_read', onMarkedRead);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_notification', onNewNotif);
      socket.off('marked_read', onMarkedRead);
      // Keep socket alive across re-renders — disconnect only on logout (above)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const markRead = async (id: string) => {
    if (!accessToken) return;
    store.markOneRead(id);
    store.decrementUnread();
    try {
      await api.patch<unknown>(`/notifications/${id}/read`, undefined, accessToken);
    } catch {
      // best-effort; UI is already optimistic
    }
  };

  const markAllRead = async () => {
    if (!accessToken) return;
    store.markAllRead();
    try {
      await api.patch<unknown>('/notifications/mark-all-read', undefined, accessToken);
    } catch {}
  };

  return { ...store, markRead, markAllRead };
}
