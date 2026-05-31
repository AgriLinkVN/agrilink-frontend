import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CampaignList } from "./components/CampaignList";

export default function SupplierAdsPage() {
  return (
    <DashboardLayout
      role="supplier"
      userName="Cty Vật Tư Nông Nghiệp XYZ"
      pageTitle="Chiến dịch quảng cáo"
      pageDescription="Quản lý và theo dõi hiệu quả quảng cáo của bạn"
      actions={
        <Button asChild>
          <Link href="/dashboard/supplier/ads/new">
            <Plus size={16} />
            Tạo chiến dịch mới
          </Link>
        </Button>
      }
    >
      <CampaignList />
    </DashboardLayout>
  );
}
