import type { DataSourceMetadata } from "@/features/p4-demo/contracts";
import { cn } from "@/lib/utils";

interface DemoDataBadgeProps {
  metadata: DataSourceMetadata;
  className?: string;
  showAsOfDate?: boolean;
}

function formatIsoDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

export function DemoDataBadge({
  metadata,
  className,
  showAsOfDate = true,
}: DemoDataBadgeProps) {
  const isMock = metadata.mode === "mock";

  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-semibold",
        isMock
          ? "border-amber-300 bg-amber-50 text-amber-900"
          : "border-emerald-300 bg-emerald-50 text-emerald-900",
        className,
      )}
      title={metadata.disclosure}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          isMock ? "bg-amber-500" : "bg-emerald-600",
        )}
      />
      <span>{isMock ? "Dữ liệu minh họa" : "Dữ liệu API"}</span>
      {showAsOfDate && metadata.asOfDate ? (
        <span className="border-l border-current/25 pl-2 font-medium opacity-80">
          Mốc {formatIsoDate(metadata.asOfDate)}
        </span>
      ) : null}
    </span>
  );
}
