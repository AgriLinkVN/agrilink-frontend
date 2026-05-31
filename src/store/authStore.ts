'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type User } from '@/types';
import { disconnectSocket } from '@/lib/socket';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

/**
 * One-time migration from the legacy `agrilink_access_token` / `agrilink_user`
 * localStorage keys (written by older versions of AuthProvider) into the
 * persisted zustand store. Runs lazily inside the storage adapter so it kicks
 * in **before** the first component reads from the store.
 */
function bridgeLegacyKeys(): {
  accessToken: string | null;
  user: User | null;
} | null {
  if (typeof window === 'undefined') return null;
  try {
    const legacyToken = localStorage.getItem('agrilink_access_token');
    const legacyUser = localStorage.getItem('agrilink_user');
    if (!legacyToken || !legacyUser) return null;
    return {
      accessToken: legacyToken,
      user: JSON.parse(legacyUser) as User,
    };
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (token, user) => set({ accessToken: token, user }),
      logout: () => {
        disconnectSocket();
        set({ accessToken: null, user: null });
      },
    }),
    {
      name: 'agrilink-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      // Pull legacy keys into the store on first rehydrate
      onRehydrateStorage: () => (state) => {
        if (state && (state.accessToken || state.user)) return; // already hydrated
        const legacy = bridgeLegacyKeys();
        if (legacy && state) {
          state.accessToken = legacy.accessToken;
          state.user = legacy.user;
        }
      },
    },
  ),
);
