import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProductionReportView } from './components/ProductionReportView';

export default function ProductionReportPage() {
  return (
    <DashboardLayout
      role="cooperative"
      pageTitle="Báo cáo sản lượng"
      pageDescription="Tổng hợp sản lượng dự kiến và thực tế theo thành viên và theo tháng"
    >
      <ProductionReportView />
    </DashboardLayout>
  );
}
