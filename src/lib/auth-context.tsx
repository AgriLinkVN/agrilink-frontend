"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";
import type { User, UserRole } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors/get-error-message";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    credential: string,
    method?: "password" | "otp",
  ) => Promise<{ dashboard: string } | { error: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => ({ error: "Not initialized" }),
  logout: async () => {},
});

interface AccessTokenResponse {
  accessToken: string;
}

function subscribeToHydration(onStoreChange: () => void): () => void {
  const unsubscribeHydrate = useAuthStore.persist.onHydrate(onStoreChange);
  const unsubscribeFinish = useAuthStore.persist.onFinishHydration(onStoreChange);
  return () => {
    unsubscribeHydrate();
    unsubscribeFinish();
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.logout);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  const login = useCallback(
    async (
      email: string,
      credential: string,
      method: "password" | "otp" = "password",
    ): Promise<{ dashboard: string } | { error: string }> => {
      try {
        const trimmedEmail = email.trim().toLowerCase();

        const endpoint = method === "password" ? "/auth/login" : "/auth/login-otp";
        const payload =
          method === "password"
            ? { email: trimmedEmail, password: credential }
            : { target: trimmedEmail, code: credential, purpose: "login" };

        const auth = await api.post<AccessTokenResponse>(endpoint, payload);
        if (!auth.accessToken) {
          return { error: "Không nhận được token từ máy chủ." };
        }

        const userData = await api.get<User>("/users/me", auth.accessToken);
        const token = auth.accessToken;
        setAuth(token, userData);

        const dashboard = ROLE_DASHBOARD[userData.role] ?? "/";
        return { dashboard };
      } catch (error) {
        console.error("Login error:", error);
        return {
          error: getErrorMessage(
            error,
            "Lỗi kết nối máy chủ. Vui lòng thử lại sau.",
          ),
        };
      }
    },
    [setAuth],
  );

  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await api.post<void>("/auth/logout", undefined, accessToken);
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearAuth();
    }
  }, [accessToken, clearAuth]);

  return (
    <AuthContext.Provider value={{ user, isLoading: !hydrated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  farmer: "Nông dân",
  cooperative: "Hợp tác xã",
  buyer: "Người mua",
  enterprise: "Doanh nghiệp",
  supplier: "Nhà cung cấp",
  state_agency: "Cơ quan nhà nước",
  logistics: "Đơn vị logistics",
  admin: "Quản trị viên",
};

export const ROLE_DASHBOARD: Record<UserRole, string> = {
  farmer: "/dashboard/farmer",
  cooperative: "/dashboard/cooperative",
  buyer: "/dashboard/buyer",
  enterprise: "/dashboard/enterprise",
  supplier: "/dashboard/supplier",
  state_agency: "/dashboard/state",
  logistics: "/dashboard/logistics",
  admin: "/dashboard/admin",
};
