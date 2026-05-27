import { cn } from "@/lib/utils";
import { type FarmingType, type OrderStatus } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "organic" | "vietgap" | "globalgap" | "traditional" | "outline" | "harvest";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold leading-none rounded",
        {
          "bg-primary text-white": variant === "default",
          "bg-[#DCFCE7] text-[#2D6A4F]": variant === "organic",
          "bg-[#DBEAFE] text-[#1D4ED8]": variant === "vietgap",
          "bg-[#F0FFF4] text-[#065F46] border border-[#52B788]": variant === "globalgap",
          "bg-[#FEF3C7] text-[#92400E]": variant === "traditional",
          "bg-transparent border border-current text-primary": variant === "outline",
          "bg-[#FFF7ED] text-[#C2410C]": variant === "harvest",
        },
        className
      )}
    >
      {children}
    </span>
  );
}

const farmingTypeBadge: Record<FarmingType, { label: string; variant: BadgeProps["variant"] }> = {
  organic: { label: "Hữu cơ", variant: "organic" },
  vietgap: { label: "VietGAP", variant: "vietgap" },
  globalgap: { label: "GlobalGAP", variant: "globalgap" },
  traditional: { label: "Truyền thống", variant: "traditional" },
};

export function FarmingBadge({ type }: { type: FarmingType }) {
  const { label, variant } = farmingTypeBadge[type];
  return <Badge variant={variant}>{label}</Badge>;
}

const orderStatusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Chờ xác nhận", className: "bg-[#FEF9C3] text-[#854D0E]" },
  confirmed: { label: "Đã xác nhận", className: "bg-[#D1FAE5] text-[#065F46]" },
  preparing: { label: "Đang chuẩn bị", className: "bg-[#E0E7FF] text-[#3730A3]" },
  shipping: { label: "Đang giao", className: "bg-[#DBEAFE] text-[#1E40AF]" },
  delivered: { label: "Đã giao", className: "bg-[#D8F3DC] text-[#2D6A4F]" },
  completed: { label: "Hoàn thành", className: "bg-[#D8F3DC] text-[#2D6A4F]" },
  disputed: { label: "Tranh chấp", className: "bg-[#FEE2E2] text-[#991B1B]" },
  cancelled: { label: "Đã huỷ", className: "bg-[#F3F4F6] text-[#6B7280]" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = orderStatusConfig[status];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold", className)}>
      {label}
    </span>
  );
}
