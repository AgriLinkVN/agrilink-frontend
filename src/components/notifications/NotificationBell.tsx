'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    notifications,
    unreadCount,
    isConnected,
    markRead,
    markAllRead,
  } = useNotifications();

  // Pulse animation when new notification arrives
  const prevCount = useRef(unreadCount);
  useEffect(() => {
    if (unreadCount > prevCount.current) setHasNew(true);
    prevCount.current = unreadCount;
  }, [unreadCount]);

  // Reset pulse after animation
  useEffect(() => {
    if (!hasNew) return;
    const t = setTimeout(() => setHasNew(false), 2000);
    return () => clearTimeout(t);
  }, [hasNew]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayCount = unreadCount > 99 ? '99+' : unreadCount;
  const visibleNotifs = notifications.slice(0, 10);

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative w-9 h-9 rounded-full flex items-center justify-center transition-colors text-muted hover:text-ink hover:bg-surface-soft',
          open && 'bg-surface-soft text-ink',
        )}
        aria-label="Thông báo"
      >
        <Bell size={18} className={cn(hasNew && 'animate-bounce')} />

        {unreadCount > 0 && (
          <span
            className={cn(
              'absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none',
              hasNew && 'animate-pulse',
            )}
          >
            {displayCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-11 w-[360px] bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900">Thông báo</span>
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  isConnected ? 'bg-green-400' : 'bg-gray-300',
                )}
                title={isConnected ? 'Đang kết nối' : 'Mất kết nối'}
              />
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => { markAllRead(); }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Đọc tất cả
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-96 divide-y divide-gray-50">
            {visibleNotifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-400">
                <BellOff size={32} />
                <span className="text-sm">Chưa có thông báo nào</span>
              </div>
            ) : (
              visibleNotifs.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onMarkRead={(id) => { markRead(id); }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
