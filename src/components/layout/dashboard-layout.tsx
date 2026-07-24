"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { type UserRole } from "@/types";
import { Menu, Search, X } from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName?: string;
  pageTitle?: string;
  pageDescription?: string;
  actions?: React.ReactNode;
}

export function DashboardLayout({
  children,
  role,
  userName,
  pageTitle,
  pageDescription,
  actions,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-soft overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar role={role} userName={userName} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0">
            <Sidebar role={role} userName={userName} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dashboard topbar */}
        <header className="h-16 bg-white border-b border-hairline flex items-center gap-4 px-4 sm:px-6 shrink-0">
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-strong"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden flex-1 items-center gap-2 h-9 max-w-sm rounded-lg border border-hairline bg-surface-soft px-3 sm:flex">
            <Search size={15} className="text-muted" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-soft"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>

        {/* Page header */}
        {pageTitle && (
          <div className="bg-white border-b border-hairline px-4 py-4 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-ink">{pageTitle}</h1>
              {pageDescription && (
                <p className="text-sm text-muted mt-0.5">{pageDescription}</p>
              )}
            </div>
            {actions && <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">{actions}</div>}
          </div>
        )}

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
