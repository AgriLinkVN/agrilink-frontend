import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { BulkListingDetail } from './components/BulkListingDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BulkListingDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <DashboardLayout
      role="cooperative"
      pageTitle="Chi tiết lô hàng"
      pageDescription="Thông tin chi tiết, đóng góp từ các thành viên HTX"
    >
      <BulkListingDetail id={id} />
    </DashboardLayout>
  );
}
