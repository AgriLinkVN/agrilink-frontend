"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, UserRole } from "@/types";

const DEMO_USERS: Record<string, User & { password: string; dashboard: string }> = {
  "0901111001": {
    id: "u1", full_name: "Nguyễn Văn Hùng", phone: "0901111001",
    role: "farmer", status: "active", password: "demo123",
    dashboard: "/dashboard/farmer",
  },
  "0901111002": {
    id: "u2", full_name: "HTX Rau Sạch Lâm Đồng", phone: "0901111002",
    role: "cooperative", status: "active", password: "demo123",
    dashboard: "/dashboard/cooperative",
  },
  "0901111003": {
    id: "u3", full_name: "Trần Thị Mai", phone: "0901111003",
    role: "buyer", status: "active", password: "demo123",
    dashboard: "/dashboard/buyer",
  },
  "0901111004": {
    id: "u4", full_name: "Công ty CP Thực Phẩm Việt", phone: "0901111004",
    role: "enterprise", status: "active", password: "demo123",
    dashboard: "/dashboard/enterprise",
  },
  "0901111005": {
    id: "u5", full_name: "Nhà cung cấp Nông Cụ Miền Nam", phone: "0901111005",
    role: "supplier", status: "active", password: "demo123",
    dashboard: "/dashboard/supplier",
  },
  "0901111006": {
    id: "u6", full_name: "Sở NN&PTNT Đà Nẵng", phone: "0901111006",
    role: "state_agency", status: "active", password: "demo123",
    dashboard: "/dashboard/state",
  },
  "0901111007": {
    id: "u7", full_name: "GHN Express Đà Nẵng", phone: "0901111007",
    role: "logistics", status: "active", password: "demo123",
    dashboard: "/dashboard/logistics",
  },
  "0901111099": {
    id: "u99", full_name: "Admin AgriLink", phone: "0901111099",
    role: "admin", status: "active", password: "demo123",
    dashboard: "/dashboard/admin",
  },
};

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, credential: string) => Promise<{ dashboard: string } | { error: string }>;
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
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  const login = useCallback(async (phone: string, credential: string): Promise<{ dashboard: string } | { error: string }> => {
    const normalized = phone.replace(/\s/g, "");
    const account = DEMO_USERS[normalized];
    if (!account) return { error: "Số điện thoại không tồn tại trong hệ thống demo." };
    if (credential !== "demo123" && credential !== "123456") {
      return { error: "Thông tin đăng nhập không đúng. Dùng: demo123 hoặc OTP 123456" };
    }
    const { password: _, dashboard, ...userData } = account;
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return { dashboard };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
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
