"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search, Bell, Menu, X, Leaf,
  ShoppingCart, MapPin, TrendingUp, LogIn,
  LayoutDashboard, LogOut, User, ChevronDown, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth, ROLE_LABELS, ROLE_DASHBOARD } from "@/lib/auth-context";

const NAV_LINKS = [
  { label: "Sàn nông sản", href: "/marketplace", icon: ShoppingCart },
  { label: "Bản đồ vùng", href: "/map", icon: MapPin },
  { label: "Giá thị trường", href: "/prices", icon: TrendingUp },
  { label: "Về chúng tôi", href: "/about", icon: Info },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-hairline shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-primary hidden sm:block tracking-tight">AgriLink</span>
          </Link>

          {/* Nav links — center, takes remaining space */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13.5px] font-medium whitespace-nowrap transition-all duration-150",
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-body-text hover:text-primary hover:bg-surface-green"
                  )}
                >
                  <Icon size={14} className={cn("shrink-0", isActive ? "opacity-100" : "opacity-70")} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Search — expandable */}
            <div className="relative hidden md:flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-2 h-9 px-3 rounded-full border border-primary ring-2 ring-primary/15 bg-white w-56 transition-all">
                  <Search size={14} className="text-primary shrink-0" />
                  <input
                    ref={searchRef}
                    type="search"
                    placeholder="Tìm nông sản..."
                    className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted-soft outline-none"
                    onBlur={() => setSearchOpen(false)}
                  />
                  <button
                    onMouseDown={(e) => { e.preventDefault(); setSearchOpen(false); }}
                    className="text-muted hover:text-ink transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-primary hover:bg-surface-green transition-all"
                  aria-label="Tìm kiếm"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-hairline mx-1" />

            {/* Notification bell */}
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-primary hover:bg-surface-green transition-all">
              <Bell size={18} />
              {user && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-white" />
              )}
            </button>

            {user ? (
              /* User menu */
              <div className="relative hidden sm:block ml-1">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-hairline hover:border-primary-light hover:bg-surface-green transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-ink hidden md:block max-w-20 truncate">
                    {user.full_name.split(" ").slice(-1)[0]}
                  </span>
                  <ChevronDown
                    size={13}
                    className={cn("text-muted transition-transform shrink-0", userMenuOpen && "rotate-180")}
                  />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-hairline rounded-xl shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-hairline bg-surface-soft">
                        <p className="text-sm font-semibold text-ink truncate">{user.full_name}</p>
                        <p className="text-xs text-muted mt-0.5">{ROLE_LABELS[user.role]}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href={ROLE_DASHBOARD[user.role]}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-surface-green transition-colors"
                        >
                          <LayoutDashboard size={15} className="text-primary" />
                          Dashboard của tôi
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-surface-green transition-colors"
                        >
                          <User size={15} className="text-primary" />
                          Hồ sơ cá nhân
                        </Link>
                        <Link
                          href="/about"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-surface-green transition-colors"
                        >
                          <Info size={15} className="text-primary" />
                          Về AgriLink
                        </Link>
                      </div>
                      <div className="border-t border-hairline py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-[#FEE2E2] transition-colors"
                        >
                          <LogOut size={15} />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Guest auth */
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Đăng ký</Link>
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-muted hover:bg-surface-soft transition-colors ml-1"
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
          <div className="max-w-[1280px] mx-auto px-4 py-4 flex flex-col gap-1.5">
            {/* Mobile search */}
            <div className="flex items-center gap-2 h-10 px-4 rounded-full border border-hairline bg-surface-soft mb-2">
              <Search size={15} className="text-muted shrink-0" />
              <input
                type="search"
                placeholder="Tìm nông sản..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft"
              />
            </div>

            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-ink hover:bg-surface-green hover:text-primary"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={17} className={cn("shrink-0", isActive ? "opacity-100" : "text-primary")} />
                  {label}
                </Link>
              );
            })}

            <div className="pt-3 flex flex-col gap-2 border-t border-hairline mt-1">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 bg-surface-soft rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {user.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink leading-none">{user.full_name}</p>
                      <p className="text-xs text-muted mt-0.5">{ROLE_LABELS[user.role]}</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={ROLE_DASHBOARD[user.role]} onClick={() => setMobileOpen(false)}>
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                  >
                    <LogOut size={15} /> Đăng xuất
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                      <LogIn size={15} /> Đăng nhập
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                      Đăng ký miễn phí
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
