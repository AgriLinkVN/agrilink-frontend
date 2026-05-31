import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CampaignTable } from "./components/CampaignTable";

const TABS = [
  { label: "Chờ duyệt",  value: "pending_approval" },
  { label: "Đang chạy",  value: "active" },
  { label: "Từ chối",    value: "rejected" },
  { label: "Tất cả",     value: "" },
] as const;

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminAdsPage({ searchParams }: Props) {
  const { tab = "" } = await searchParams;
  const activeTab = TABS.find((t) => t.value === tab) ?? TABS[3];

  return (
    <DashboardLayout
      role="admin"
      userName="Admin AgriLink"
      pageTitle="Quản lý quảng cáo"
      pageDescription="Duyệt và theo dõi các chiến dịch quảng cáo từ nhà cung cấp"
    >
      {/* Tab navigation */}
      <div className="flex gap-1 bg-surface-soft p-1 rounded-xl border border-hairline mb-6 w-fit">
        {TABS.map((t) => (
          <a
            key={t.value}
            href={`/dashboard/admin/ads${t.value ? `?tab=${t.value}` : ""}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab.value === t.value
                ? "bg-white text-primary shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      <CampaignTable status={activeTab.value || undefined} />
    </DashboardLayout>
  );
}
