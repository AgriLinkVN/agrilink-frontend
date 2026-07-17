'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { api } from '@/lib/api';
import { type Notification } from '@/types/notification';

export function useNotifications() {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const isConnected = useNotificationStore((s) => s.isConnected);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const prependNotification = useNotificationStore((s) => s.prependNotification);
  const markOneRead = useNotificationStore((s) => s.markOneRead);
  const markAllReadState = useNotificationStore((s) => s.markAllRead);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
  const decrementUnread = useNotificationStore((s) => s.decrementUnread);
  const setConnected = useNotificationStore((s) => s.setConnected);
  const incrementUnread = useNotificationStore((s) => s.incrementUnread);

  const unreadQueryKey = useMemo(
    () => ['notifications', 'unread', accessToken] as const,
    [accessToken],
  );
  const countQueryKey = useMemo(
    () => ['notifications', 'count', accessToken] as const,
    [accessToken],
  );

  const { data: unreadNotifications } = useQuery({
    queryKey: unreadQueryKey,
    queryFn: () => api.get<Notification[]>('/notifications/unread', accessToken),
    enabled: !!accessToken,
    staleTime: 30_000,
  });

  const { data: unreadCountPayload } = useQuery({
    queryKey: countQueryKey,
    queryFn: () => api.get<{ count: number }>('/notifications/count', accessToken),
    enabled: !!accessToken,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (accessToken && Array.isArray(unreadNotifications)) {
      setNotifications(unreadNotifications);
    }
  }, [accessToken, setNotifications, unreadNotifications]);

  useEffect(() => {
    if (accessToken && typeof unreadCountPayload?.count === 'number') {
      setUnreadCount(unreadCountPayload.count);
    }
  }, [accessToken, setUnreadCount, unreadCountPayload]);

  useEffect(() => {
    if (!accessToken) {
      // Token cleared (logout) — close socket and reset state
      disconnectSocket();
      setNotifications([]);
      setUnreadCount(0);
      setConnected(false);
      return;
    }

    const socket = connectSocket(accessToken);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onNewNotif = (notif: Notification) => {
      prependNotification(notif);
      incrementUnread();
      queryClient.setQueryData<Notification[]>(unreadQueryKey, (current) => [
        notif,
        ...(current ?? []),
      ]);
      queryClient.setQueryData<{ count: number }>(countQueryKey, (current) => ({
        count: (current?.count ?? unreadCount) + 1,
      }));
      queryClient.invalidateQueries({ queryKey: ['notifications-page'] });
    };
    const onMarkedRead = (payload: { id: string }) => {
      markOneRead(payload.id);
      decrementUnread();
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
  }, [
    accessToken,
    countQueryKey,
    decrementUnread,
    incrementUnread,
    markOneRead,
    prependNotification,
    queryClient,
    setConnected,
    setNotifications,
    setUnreadCount,
    unreadCount,
    unreadQueryKey,
  ]);

  const markReadMutation = useMutation({
    mutationFn: (id: string) =>
      api.patch<unknown>(`/notifications/${id}/read`, undefined, accessToken),
    onMutate: (id) => {
      markOneRead(id);
      decrementUnread();
      queryClient.setQueryData<Notification[]>(unreadQueryKey, (current) =>
        (current ?? []).map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif,
        ),
      );
      queryClient.setQueryData<{ count: number }>(countQueryKey, (current) => ({
        count: Math.max(0, (current?.count ?? unreadCount) - 1),
      }));
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () =>
      api.patch<unknown>('/notifications/mark-all-read', undefined, accessToken),
    onMutate: () => {
      markAllReadState();
      queryClient.setQueryData<Notification[]>(unreadQueryKey, (current) =>
        (current ?? []).map((notif) => ({ ...notif, isRead: true })),
      );
      queryClient.setQueryData<{ count: number }>(countQueryKey, { count: 0 });
      queryClient.setQueryData<{ pages: { data: Notification[] }[] } | undefined>(
        ['notifications-page'],
        (current) => {
          if (!current) return current;
          return {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              data: page.data.map((notif) => ({ ...notif, isRead: true })),
            })),
          };
        },
      );
    },
  });

  const markRead = useCallback(async (id: string) => {
    if (!accessToken) return;
    await markReadMutation.mutateAsync(id).catch(() => {});
  }, [accessToken, markReadMutation]);

  const markAllRead = useCallback(async () => {
    if (!accessToken) return;
    await markAllReadMutation.mutateAsync().catch(() => {});
  }, [accessToken, markAllReadMutation]);

  return {
    notifications,
    unreadCount,
    isConnected,
    markRead,
    markAllRead,
  };
}
