"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";

interface PendingCounts {
  profiles: number;
  products: number;
  disputes: number;
}

let cachedCounts: PendingCounts = { profiles: 0, products: 0, disputes: 0 };
const listeners: Set<(c: PendingCounts) => void> = new Set();
let pollTimer: ReturnType<typeof setInterval> | null = null;

function startPolling(token: string) {
  if (pollTimer) return;
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

  const poll = () => {
    fetch(`${backend}/api/v1/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        const data = d?.data ?? d;
        if (data?.pendingProfiles) {
          const next: PendingCounts = {
            profiles: data.pendingProfiles?.total ?? 0,
            products: data.pendingProducts ?? 0,
            disputes: data.openDisputes ?? 0,
          };
          cachedCounts = next;
          listeners.forEach((fn) => fn(next));
        }
      })
      .catch(() => {});
  };

  poll();
  pollTimer = setInterval(poll, 30000);
}

function subscribe(cb: (c: PendingCounts) => void) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

export function useAdminPendingCounts() {
  const token = useAuthStore((s) => s.accessToken);
  const cbRef = useRef<(c: PendingCounts) => void>();

  useEffect(() => {
    if (!token) return;
    startPolling(token);
    return subscribe((c) => {
      cbRef.current?.(c);
    });
  }, [token]);

  const setCallback = useCallback((cb: (c: PendingCounts) => void) => {
    cbRef.current = cb;
  }, []);

  return { counts: cachedCounts, setCallback };
}
