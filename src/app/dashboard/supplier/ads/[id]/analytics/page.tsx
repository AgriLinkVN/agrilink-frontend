import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CampaignAnalytics } from './components/CampaignAnalytics';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CampaignAnalyticsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <DashboardLayout
      role="supplier"
      pageTitle="Phân tích chiến dịch"
      pageDescription="Thống kê hiển thị, lượt click và CTR theo ngày"
    >
      <CampaignAnalytics campaignId={id} />
    </DashboardLayout>
  );
}
