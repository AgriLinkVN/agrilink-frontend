import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "green" | "harvest" | "accent";
  className?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default", className }: StatCardProps) {
  const trendPositive = (trend?.value ?? 0) >= 0;

  return (
    <div
      className={cn(
        "rounded-xl border p-6 flex flex-col gap-3",
        {
          "bg-white border-hairline card-shadow": variant === "default",
          "bg-surface-green border-primary-light": variant === "green",
          "bg-[#FFFBEB] border-[#FDE68A]": variant === "harvest",
          "bg-[#FFF7ED] border-[#FED7AA]": variant === "accent",
        },
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{title}</span>
        {Icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              {
                "bg-surface-green text-primary": variant === "default" || variant === "green",
                "bg-[#FDE68A] text-[#92400E]": variant === "harvest",
                "bg-[#FED7AA] text-[#C2410C]": variant === "accent",
              }
            )}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div>
        <div
          className={cn("text-3xl font-bold tracking-tight", {
            "text-primary": variant === "green",
            "text-[#92400E]": variant === "harvest",
            "text-[#C2410C]": variant === "accent",
            "text-ink": variant === "default",
          })}
        >
          {value}
        </div>
        {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 text-sm">
          <span className={cn("font-semibold", trendPositive ? "text-primary" : "text-error")}>
            {trendPositive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-muted">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
