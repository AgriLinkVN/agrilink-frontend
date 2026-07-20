"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import type { User, UserRole } from "@/types";
import { useAuthStore } from "@/store/authStore";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    credential: string,
    method?: "password" | "otp",
  ) => Promise<{ dashboard: string } | { error: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => ({ error: "Not initialized" }),
  logout: () => {},
});

interface PersistHydrationApi {
  hasHydrated?: () => boolean;
  onFinishHydration?: (callback: () => void) => () => void;
}

function getPersistHydrationApi(): PersistHydrationApi | undefined {
  return (useAuthStore as typeof useAuthStore & { persist?: PersistHydrationApi }).persist;
}

/**
 * AuthProvider wraps the app. Its job is now thin: it exposes a `useAuth()`
 * React-Context API to legacy callers (login page, navbar) while delegating
 * **all** state to the Zustand `useAuthStore`. That makes P5 components which
 * read from `useAuthStore.accessToken` see the same value as P1/P6 components
 * reading from `useAuth().user` — single source of truth.
 *
 * Migration target: callers should switch to `useAuthStore` directly.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Read straight from the persisted Zustand store
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.logout);

  // Local flag to suppress UI flicker during Zustand persist rehydration
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const markHydratedOnNextTick = () => {
      const timer = window.setTimeout(() => setHydrated(true), 0);
      return () => window.clearTimeout(timer);
    };

    const persistApi = getPersistHydrationApi();
    if (!persistApi) {
      return markHydratedOnNextTick();
    }

    if (persistApi.hasHydrated?.()) {
      return markHydratedOnNextTick();
    }

    return persistApi.onFinishHydration?.(() => {
      setHydrated(true);
    });
  }, []);

  const login = useCallback(
    async (
      email: string,
      credential: string,
      method: "password" | "otp" = "password",
    ): Promise<{ dashboard: string } | { error: string }> => {
      try {
        const normalizedEmail = email.trim();

        const endpoint = method === "password" ? "/auth/login" : "/auth/login-otp";
        const payload =
          method === "password"
            ? { email: normalizedEmail, password: credential }
            : { target: normalizedEmail, code: credential, purpose: "login" };

        const backend =
          process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

        const res = await fetch(`${backend}/api/v1${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          return {
            error:
              (errorData as { message?: string }).message ??
              "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
          };
        }

        const data = (await res.json()) as {
          data?: { accessToken?: string };
          accessToken?: string;
        };
        const token = data.data?.accessToken ?? data.accessToken;
        if (!token) return { error: "Không nhận được token từ máy chủ." };

        const userRes = await fetch(`${backend}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) return { error: "Không thể lấy thông tin người dùng." };

        const userPayload = (await userRes.json()) as { data?: User } & User;
        const userData = (userPayload.data ?? userPayload) as User;

        // Single source of truth — persisted by zustand
        setAuth(token, userData);

        // Keep legacy keys in sync for any consumer still reading raw localStorage
        try {
          localStorage.setItem("agrilink_access_token", token);
          localStorage.setItem("agrilink_user", JSON.stringify(userData));
        } catch {}

        const dashboard = ROLE_DASHBOARD[userData.role] ?? "/";
        return { dashboard };
      } catch (error) {
        console.error("Login error:", error);
        return { error: "Lỗi kết nối máy chủ. Vui lòng thử lại sau." };
      }
    },
    [setAuth],
  );

  const logout = useCallback(() => {
    clearAuth();
    try {
      localStorage.removeItem("agrilink_user");
      localStorage.removeItem("agrilink_access_token");
    } catch {}
  }, [clearAuth]);

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
