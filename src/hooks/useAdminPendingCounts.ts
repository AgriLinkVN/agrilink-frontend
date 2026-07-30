"use client";

import { useEffect, useSyncExternalStore } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface PendingCounts {
  profiles: number;
  products: number;
  disputes: number;
}

interface AdminStats {
  pendingProfiles?: { total?: number };
  pendingProducts?: number;
  openDisputes?: number;
}

const EMPTY_COUNTS: PendingCounts = {
  profiles: 0,
  products: 0,
  disputes: 0,
};

let cachedCounts = EMPTY_COUNTS;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function publish(counts: PendingCounts): void {
  cachedCounts = counts;
  listeners.forEach((listener) => listener());
}

function getSnapshot(): PendingCounts {
  return cachedCounts;
}

function getServerSnapshot(): PendingCounts {
  return EMPTY_COUNTS;
}

export function useAdminPendingCounts() {
  const token = useAuthStore((state) => state.accessToken);
  const counts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!token) return;

    let active = true;
    const poll = async () => {
      try {
        const stats = await api.get<AdminStats>("/admin/stats", token);
        if (!active) return;
        publish({
          profiles: stats.pendingProfiles?.total ?? 0,
          products: stats.pendingProducts ?? 0,
          disputes: stats.openDisputes ?? 0,
        });
      } catch {
        // A temporary polling failure must not disrupt dashboard navigation.
      }
    };

    void poll();
    const timer = window.setInterval(() => void poll(), 30_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [token]);

  return { counts };
}
