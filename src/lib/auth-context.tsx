"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, UserRole } from "@/types";

// Removed DEMO_USERS mock data
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, credential: string, method?: "password" | "otp") => Promise<{ dashboard: string } | { error: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => ({ error: "Not initialized" }),
  logout: () => {},
});

const STORAGE_KEY = "agrilink_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTimeout(() => {
          setUser(parsed);
          setIsLoading(false);
        }, 0);
        return;
      }
    } catch {}
    setTimeout(() => setIsLoading(false), 0);
  }, []);

  const login = useCallback(async (phone: string, credential: string, method: "password" | "otp" = "password"): Promise<{ dashboard: string } | { error: string }> => {
    try {
      const normalizedPhone = phone.replace(/\s/g, "");
      
      const endpoint = method === "password" ? "/auth/login" : "/auth/login-otp";
      const payload = method === "password" 
        ? { phone: normalizedPhone, password: credential }
        : { target: normalizedPhone, code: credential, purpose: "login" };

      const res = await fetch(`http://localhost:3001/api/v1${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return { error: errorData.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin." };
      }

      const data = await res.json();
      const token = data.data?.accessToken || data.accessToken;
      
      if (!token) return { error: "Không nhận được token từ máy chủ." };
      
      localStorage.setItem("agrilink_access_token", token);

      const userRes = await fetch("http://localhost:3001/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!userRes.ok) {
        return { error: "Không thể lấy thông tin người dùng." };
      }

      const userDataResponse = await userRes.json();
      const userData = userDataResponse.data || userDataResponse;
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      
      const dashboard = ROLE_DASHBOARD[userData.role as UserRole] || "/";
      return { dashboard };
    } catch (error) {
      console.error("Login error:", error);
      return { error: "Lỗi kết nối máy chủ. Vui lòng thử lại sau." };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("agrilink_access_token");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
