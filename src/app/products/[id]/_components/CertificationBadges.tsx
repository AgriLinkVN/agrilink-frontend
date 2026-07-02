import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ProductDetailCertification } from "@/lib/products-api";
import { CERT_TYPE_LABELS } from "@/lib/products-api";

const VARIANT_MAP: Record<
  string,
  "organic" | "vietgap" | "globalgap" | "default" | "outline"
> = {
  organic: "organic",
  vietgap: "vietgap",
  globalgap: "globalgap",
  ocop: "default",
  other: "outline",
};

interface Props {
  certifications: ProductDetailCertification[];
}

export function CertificationBadges({ certifications }: Props) {
  const verified = certifications.filter(
    (c) => c.isVerified || c.status === "verified",
  );
  if (verified.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ShieldCheck size={16} className="text-emerald-600" />
      <span className="text-sm text-muted">Chứng nhận đã xác thực:</span>
      {verified.map((c) => (
        <Badge
          key={c.id}
          variant={VARIANT_MAP[c.certType] ?? "outline"}
          className="px-2 py-1 text-xs"
        >
          {CERT_TYPE_LABELS[c.certType] ?? c.certType.toUpperCase()}
        </Badge>
      ))}
    </div>
  );
}
