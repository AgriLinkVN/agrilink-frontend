import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShieldCheck, Users, AlertTriangle, Award, Check, X, Eye } from "lucide-react";

const STATS = [
  { title: "Chờ duyệt HTX/DN", value: "12", subtitle: "Cần xử lý trong 48h", icon: ShieldCheck, variant: "green" as const },
  { title: "Người dùng hoạt động", value: "2,340", subtitle: "Trên toàn hệ thống", icon: Users, variant: "default" as const },
  { title: "Tranh chấp chờ xử lý", value: "5", subtitle: "2 khẩn cấp", icon: AlertTriangle, variant: "harvest" as const },
  { title: "Chứng nhận cấp tháng này", value: "38", subtitle: "VietGAP, OCOP, Hữu cơ", icon: Award, variant: "accent" as const },
];

const APPROVAL_QUEUE = [
  { id: "HTX-001", name: "HTX Xoài Cát Cái Bè", type: "cooperative", province: "Tiền Giang", submitted: "20/06/2025", docs: 5 },
  { id: "DN-002", name: "Cty TNHH Rau Sạch Xanh", type: "enterprise", province: "Hà Nội", submitted: "19/06/2025", docs: 7 },
  { id: "HTX-003", name: "HTX Gạo Hữu Cơ Trà Vinh", type: "cooperative", province: "Trà Vinh", submitted: "18/06/2025", docs: 6 },
  { id: "DN-004", name: "Cty CP Chế Biến Đông Lạnh", type: "enterprise", province: "Cần Thơ", submitted: "17/06/2025", docs: 8 },
];

const DISPUTES = [
  { id: "TC-001", product: "Xoài cát Hòa Lộc", buyer: "Cty Rau Sạch HN", seller: "HTX TG", issue: "Hàng không đúng chất lượng", priority: "high", submitted: "21/06/2025" },
  { id: "TC-002", product: "Gạo ST25", buyer: "Hộ bà Lan", seller: "Hộ ông Cua", issue: "Giao hàng trễ hẹn", priority: "medium", submitted: "20/06/2025" },
];

export default function StateAgencyDashboardPage() {
  return (
    <DashboardLayout
      role="state_agency"
      userName="Sở NN&PTNT Tiền Giang"
      pageTitle="Quản lý & Giám sát"
      pageDescription="Dashboard cơ quan nhà nước — duyệt hồ sơ, cấp chứng nhận, xử lý tranh chấp"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Approval queue */}
        <div className="bg-white rounded-xl border border-hairline card-shadow">
          <div className="flex items-center justify-between p-5 border-b border-hairline">
            <h2 className="font-semibold text-ink">Hàng chờ duyệt HTX / Doanh nghiệp</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/state/approvals">Xem tất cả</Link>
            </Button>
          </div>
          <div className="divide-y divide-hairline-soft">
            {APPROVAL_QUEUE.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center text-xl shrink-0">
                  {item.type === "cooperative" ? "🏡" : "🏭"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{item.name}</p>
                  <p className="text-xs text-muted">{item.province} · {item.docs} tài liệu · {item.submitted}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button className="w-8 h-8 rounded-lg border border-hairline flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors">
                    <Eye size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-surface-green flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                    <Check size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-[#FEE2E2] flex items-center justify-center text-error hover:bg-error hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disputes */}
        <div className="bg-white rounded-xl border border-hairline card-shadow">
          <div className="flex items-center justify-between p-5 border-b border-hairline">
            <h2 className="font-semibold text-ink flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" /> Tranh chấp cần xử lý
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/state/disputes">Xem tất cả</Link>
            </Button>
          </div>
          <div className="divide-y divide-hairline-soft">
            {DISPUTES.map((d) => (
              <div key={d.id} className="p-4 hover:bg-surface-soft transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-ink">{d.product}</p>
                  <Badge variant={d.priority === "high" ? "harvest" : "traditional"}>
                    {d.priority === "high" ? "⚠ Khẩn cấp" : "Bình thường"}
                  </Badge>
                </div>
                <p className="text-xs text-muted mb-1">Người mua: {d.buyer} · Người bán: {d.seller}</p>
                <p className="text-xs text-ink font-medium">{d.issue}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted">{d.submitted}</span>
                  <Button size="sm" variant="secondary" className="text-xs h-7 px-3">Xử lý</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
