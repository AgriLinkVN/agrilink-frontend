import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CooperativeOverview } from './components/CooperativeOverview';

export default function CooperativeDashboardPage() {
  return (
    <DashboardLayout
      role="cooperative"
      pageTitle="Tổng quan HTX"
      pageDescription="Quản lý thành viên, lô hàng và báo cáo sản lượng"
    >
      <CooperativeOverview />
    </DashboardLayout>
  );
}
