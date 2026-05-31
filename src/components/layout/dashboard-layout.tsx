import { Sidebar } from "./sidebar";
import { type UserRole } from "@/types";
import { Search } from "lucide-react";
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
  return (
    <div className="flex h-screen bg-surface-soft overflow-hidden">
      <Sidebar role={role} userName={userName} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dashboard topbar */}
        <header className="h-16 bg-white border-b border-hairline flex items-center gap-4 px-6 shrink-0">
          <div className="flex-1 flex items-center gap-2 max-w-sm h-9 px-3 rounded-lg border border-hairline bg-surface-soft">
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
          <div className="bg-white border-b border-hairline px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-ink">{pageTitle}</h1>
              {pageDescription && (
                <p className="text-sm text-muted mt-0.5">{pageDescription}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
