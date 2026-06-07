import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { HarvestCalendar } from './components/HarvestCalendar';

export default function HarvestPage() {
  return (
    <DashboardLayout
      role="cooperative"
      pageTitle="Lịch thu hoạch"
      pageDescription="Theo dõi và ghi nhận sản lượng thu hoạch từ các thành viên"
    >
      <HarvestCalendar />
    </DashboardLayout>
  );
}
