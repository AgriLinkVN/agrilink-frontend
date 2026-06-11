import { Package2, Calendar, AlertCircle, MapPin, CalendarDays } from "lucide-react";
import type { ProductDetail } from "@/lib/products-api";
import { UNIT_LABELS } from "@/lib/products-api";

interface Props {
  product: ProductDetail;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1,
    ).padStart(2, "0")}/${d.getFullYear()}`;
  } catch {
    return null;
  }
}

interface Row {
  icon: React.ElementType;
  label: string;
  value: string;
}

export function ProductMeta({ product }: Props) {
  const unit = UNIT_LABELS[product.unit] ?? product.unit;

  const rows: Row[] = [];

  rows.push({
    icon: Package2,
    label: "Số lượng tồn",
    value: `${product.availableQuantity.toLocaleString("vi-VN")} ${unit}`,
  });

  if (product.minOrderQuantity != null) {
    rows.push({
      icon: Package2,
      label: "Đặt tối thiểu",
      value: `${product.minOrderQuantity.toLocaleString("vi-VN")} ${unit}`,
    });
  }

  const harvest = formatDate(product.harvestDate);
  if (harvest) rows.push({ icon: Calendar, label: "Ngày thu hoạch", value: harvest });

  const expiry = formatDate(product.expiryDate);
  if (expiry) rows.push({ icon: AlertCircle, label: "Hạn sử dụng", value: expiry });

  const locParts: string[] = [];
  if (product.district?.name) locParts.push(product.district.name);
  if (product.province?.name) locParts.push(product.province.name);
  if (locParts.length > 0) {
    rows.push({ icon: MapPin, label: "Xuất xứ", value: locParts.join(", ") });
  }

  const created = formatDate(product.createdAt);
  if (created) {
    rows.push({ icon: CalendarDays, label: "Ngày đăng", value: created });
  }

  return (
    <div className="rounded-xl border border-hairline bg-surface-soft p-4">
      <h3 className="text-sm font-semibold mb-3">Thông tin chi tiết</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.label} className="flex items-start gap-2 text-sm">
              <Icon size={16} className="mt-0.5 text-muted shrink-0" />
              <div className="min-w-0">
                <dt className="text-muted text-xs">{r.label}</dt>
                <dd className="font-medium truncate">{r.value}</dd>
              </div>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
