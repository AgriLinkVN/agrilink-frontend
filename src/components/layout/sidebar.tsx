"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3,
  Settings, FileText, MapPin, Truck, Megaphone, ShieldCheck,
  Leaf, ChevronRight, LogOut, Bell, QrCode, TrendingUp,
  ClipboardList, Building2, Calendar, Award, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type UserRole } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const ROLE_NAV: Record<UserRole, NavItem[]> = {
  farmer: [
    { label: "Tổng quan", href: "/dashboard/farmer", icon: LayoutDashboard },
    { label: "Sản phẩm của tôi", href: "/dashboard/farmer/products", icon: Package },
    { label: "Đơn hàng", href: "/dashboard/farmer/orders", icon: ShoppingBag, badge: "3" },
    { label: "Giá tham khảo", href: "/prices", icon: TrendingUp },
    { label: "Hồ sơ nông trại", href: "/dashboard/farmer/profile", icon: FileText },
    { label: "Cài đặt", href: "/dashboard/farmer/settings", icon: Settings },
  ],
  cooperative: [
    { label: "Tổng quan", href: "/dashboard/cooperative", icon: LayoutDashboard },
    { label: "Thành viên", href: "/dashboard/cooperative/members", icon: Users },
    { label: "Lô hàng lớn", href: "/dashboard/cooperative/bulk-listings", icon: Package },
    { label: "Lịch thu hoạch", href: "/dashboard/cooperative/schedules", icon: Calendar },
    { label: "Đơn hàng", href: "/dashboard/cooperative/orders", icon: ShoppingBag },
    { label: "Báo cáo", href: "/dashboard/cooperative/reports", icon: BarChart3 },
    { label: "Hồ sơ HTX", href: "/dashboard/cooperative/profile", icon: Building2 },
    { label: "Cài đặt", href: "/dashboard/cooperative/settings", icon: Settings },
  ],
  buyer: [
    { label: "Tổng quan", href: "/dashboard/buyer", icon: LayoutDashboard },
    { label: "Tìm nguồn hàng", href: "/marketplace", icon: MapPin },
    { label: "Đơn mua", href: "/dashboard/buyer/orders", icon: ShoppingBag, badge: "2" },
    { label: "Nhà cung cấp", href: "/dashboard/buyer/suppliers", icon: Users },
    { label: "Yêu thích", href: "/dashboard/buyer/wishlist", icon: Leaf },
    { label: "Hồ sơ", href: "/dashboard/buyer/profile", icon: FileText },
    { label: "Cài đặt", href: "/dashboard/buyer/settings", icon: Settings },
  ],
  enterprise: [
    { label: "Tổng quan", href: "/dashboard/enterprise", icon: LayoutDashboard },
    { label: "Yêu cầu mua", href: "/dashboard/enterprise/requests", icon: ClipboardList },
    { label: "Đơn hàng", href: "/dashboard/enterprise/orders", icon: ShoppingBag },
    { label: "Nhà cung cấp", href: "/dashboard/enterprise/suppliers", icon: Building2 },
    { label: "Hợp đồng", href: "/dashboard/enterprise/contracts", icon: FileText },
    { label: "Báo cáo", href: "/dashboard/enterprise/reports", icon: BarChart3 },
    { label: "Hồ sơ DN", href: "/dashboard/enterprise/profile", icon: Settings },
  ],
  supplier: [
    { label: "Tổng quan", href: "/dashboard/supplier", icon: LayoutDashboard },
    { label: "Sản phẩm", href: "/dashboard/supplier/products", icon: Package },
    { label: "Quảng cáo", href: "/dashboard/supplier/ads", icon: Megaphone },
    { label: "Đơn hàng", href: "/dashboard/supplier/orders", icon: ShoppingBag },
    { label: "Phân tích", href: "/dashboard/supplier/analytics", icon: BarChart3 },
    { label: "Hồ sơ", href: "/dashboard/supplier/profile", icon: Settings },
  ],
  state_agency: [
    { label: "Tổng quan", href: "/dashboard/state", icon: LayoutDashboard },
    { label: "Duyệt HTX/DN", href: "/dashboard/state/approvals", icon: ShieldCheck, badge: "12" },
    { label: "Chứng nhận", href: "/dashboard/state/certifications", icon: Award },
    { label: "Quản lý người dùng", href: "/dashboard/state/users", icon: Users },
    { label: "Tranh chấp", href: "/dashboard/state/disputes", icon: AlertTriangle, badge: "2" },
    { label: "Báo cáo", href: "/dashboard/state/reports", icon: BarChart3 },
    { label: "Cấu hình", href: "/dashboard/state/config", icon: Settings },
  ],
  logistics: [
    { label: "Tổng quan", href: "/dashboard/logistics", icon: LayoutDashboard },
    { label: "Đơn cần lấy", href: "/dashboard/logistics/pickups", icon: Package, badge: "8" },
    { label: "Đang giao", href: "/dashboard/logistics/active", icon: Truck },
    { label: "Lịch sử", href: "/dashboard/logistics/history", icon: ClipboardList },
    { label: "Bản đồ tuyến", href: "/dashboard/logistics/map", icon: MapPin },
    { label: "Doanh thu", href: "/dashboard/logistics/revenue", icon: BarChart3 },
    { label: "Hồ sơ", href: "/dashboard/logistics/profile", icon: Settings },
  ],
  admin: [
    { label: "Tổng quan", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Người dùng", href: "/dashboard/admin/users", icon: Users },
    { label: "Sản phẩm", href: "/dashboard/admin/products", icon: Package },
    { label: "Tranh chấp", href: "/dashboard/admin/disputes", icon: AlertTriangle, badge: "5" },
    { label: "Quảng cáo", href: "/dashboard/admin/ads", icon: Megaphone },
    { label: "Báo cáo", href: "/dashboard/admin/reports", icon: BarChart3 },
    { label: "Cấu hình", href: "/dashboard/admin/config", icon: Settings },
  ],
};

const ROLE_LABEL: Record<UserRole, string> = {
  farmer: "Nông dân",
  cooperative: "Hợp tác xã",
  buyer: "Người mua",
  enterprise: "Doanh nghiệp",
  supplier: "Nhà cung cấp",
  state_agency: "Cơ quan NN",
  logistics: "Logistics",
  admin: "Quản trị viên",
};

interface SidebarProps {
  role: UserRole;
  userName?: string;
  userAvatar?: string;
}

export function Sidebar({ role, userName = "Người dùng", userAvatar }: SidebarProps) {
  const pathname = usePathname();
  const navItems = ROLE_NAV[role] ?? [];

  return (
    <aside className="w-[260px] shrink-0 h-screen sticky top-0 bg-surface-soft border-r border-hairline flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-hairline">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-primary">AgriLink</span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-hairline">
        <Link href="/profile" className="flex items-center gap-3 p-3 rounded-xl bg-surface-green hover:bg-surface-soft transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:ring-2 group-hover:ring-primary/20 transition-all">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink truncate group-hover:text-primary transition-colors">{userName}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-primary text-white mt-0.5">
              {ROLE_LABEL[role]}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                active
                  ? "bg-primary-ultra-light text-primary font-semibold"
                  : "text-muted hover:text-ink hover:bg-surface-strong"
              )}
            >
              <Icon
                size={18}
                className={cn(active ? "text-primary" : "text-muted group-hover:text-ink")}
              />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
              {active && <ChevronRight size={14} className="text-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-4 border-t border-hairline flex flex-col gap-2">
        <Link
          href="/dashboard/qr-scan"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-ink hover:bg-surface-strong transition-colors"
        >
          <QrCode size={18} />
          Quét QR truy xuất
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-red-50 transition-colors w-full">
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
