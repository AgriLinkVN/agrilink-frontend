import Link from 'next/link';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { BulkListingsTable } from './components/BulkListingsTable';

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function BulkListingsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  return (
    <DashboardLayout
      role="cooperative"
      pageTitle="Lô hàng lớn (Bulk listings)"
      pageDescription="Đăng các lô hàng tổng hợp từ nhiều thành viên trong HTX"
      actions={
        <Button asChild>
          <Link href="/dashboard/cooperative/bulk-listings/new">
            <Plus size={16} /> Đăng lô hàng mới
          </Link>
        </Button>
      }
    >
      <BulkListingsTable initialStatus={status} />
    </DashboardLayout>
  );
}
