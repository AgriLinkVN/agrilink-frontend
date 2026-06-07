import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { NewBulkListingForm } from './components/NewBulkListingForm';

export default function NewBulkListingPage() {
  return (
    <DashboardLayout
      role="cooperative"
      pageTitle="Đăng lô hàng lớn"
      pageDescription="Tổng hợp nông sản từ nhiều thành viên HTX và đưa lên marketplace"
    >
      <NewBulkListingForm />
    </DashboardLayout>
  );
}
