import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MembersList } from './components/MembersList';

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function CooperativeMembersPage({ searchParams }: Props) {
  const { status = 'pending' } = await searchParams;

  return (
    <DashboardLayout
      role="cooperative"
      pageTitle="Quản lý thành viên"
      pageDescription="Duyệt yêu cầu gia nhập, quản lý thành viên active / suspended"
    >
      <MembersList initialStatus={status} />
    </DashboardLayout>
  );
}
