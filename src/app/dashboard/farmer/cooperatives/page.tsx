import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MyCooperatives } from './components/MyCooperatives';

export default function FarmerMyCooperativesPage() {
  return (
    <DashboardLayout
      role="farmer"
      pageTitle="HTX của tôi"
      pageDescription="Các hợp tác xã mà bạn đang là thành viên active"
    >
      <MyCooperatives />
    </DashboardLayout>
  );
}
