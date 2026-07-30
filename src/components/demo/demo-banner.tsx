import { FlaskConical } from "lucide-react";
import { runtimeConfig } from "@/config/runtime-config";

export function DemoBanner() {
  if (!runtimeConfig.demoMode) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-[100] flex min-h-8 items-center justify-center gap-2 border-b border-amber-300 bg-amber-50 px-4 py-1 text-center text-xs font-medium text-amber-950"
    >
      <FlaskConical aria-hidden="true" size={14} />
      Chế độ Demo: dữ liệu mô phỏng, không kết nối máy chủ thật.
    </div>
  );
}
