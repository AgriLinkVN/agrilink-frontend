"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search, Bell, ChevronDown, Menu, X, Leaf,
  ShoppingCart, MapPin, TrendingUp, LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Sàn nông sản", href: "/marketplace", icon: ShoppingCart },
  { label: "Bản đồ vùng", href: "/map", icon: MapPin },
  { label: "Giá thị trường", href: "/prices", icon: TrendingUp },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-hairline">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-primary hidden sm:block">
              AgriLink
            </span>
          </Link>

          {/* Search bar — pill shaped */}
          <div
            className={cn(
              "flex-1 max-w-lg mx-4 hidden md:flex items-center gap-2 h-11 px-4 rounded-full border transition-all duration-200 cursor-text",
              searchFocused
                ? "border-primary ring-2 ring-primary/20 bg-white"
                : "border-hairline bg-surface-soft hover:border-border-strong"
            )}
          >
            <Search size={16} className="text-muted shrink-0" />
            <input
              type="text"
              placeholder="Tìm nông sản, vùng trồng, HTX..."
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted-soft outline-none"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary-active transition-colors shrink-0">
              <Search size={14} className="text-white" />
            </button>
          </div>

          {/* Nav links — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-muted hover:text-primary hover:bg-surface-green transition-colors"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notification bell */}
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-soft transition-colors text-muted hover:text-ink">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
            </button>

            {/* Auth buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Đăng nhập</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Đăng ký</Link>
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-soft transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-hairline bg-white">
          <div className="max-w-[1280px] mx-auto px-4 py-4 flex flex-col gap-2">
            {/* Mobile search */}
            <div className="flex items-center gap-2 h-11 px-4 rounded-full border border-hairline bg-surface-soft mb-2">
              <Search size={16} className="text-muted" />
              <input
                type="text"
                placeholder="Tìm nông sản..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft"
              />
            </div>
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-ink hover:bg-surface-green transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} className="text-primary" />
                {label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2 border-t border-hairline mt-2">
              <Button variant="secondary" asChild>
                <Link href="/auth/login">
                  <LogIn size={16} /> Đăng nhập
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Đăng ký miễn phí</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
