'use client';

import { create } from 'zustand';
import { type Notification } from '@/types/notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  setNotifications: (list: Notification[]) => void;
  prependNotification: (notif: Notification) => void;
  markOneRead: (id: string) => void;
  markAllRead: () => void;
  setUnreadCount: (n: number) => void;
  decrementUnread: () => void;
  setConnected: (v: boolean) => void;
  incrementUnread: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  isConnected: false,

  setNotifications: (list) => set({ notifications: list }),

  prependNotification: (notif) =>
    set((state) => ({ notifications: [notif, ...state.notifications] })),

  markOneRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  setUnreadCount: (n) => set({ unreadCount: Math.max(0, n) }),

  // Functional update to avoid stale-closure decrements
  decrementUnread: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),

  setConnected: (v) => set({ isConnected: v }),

  incrementUnread: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
}));
