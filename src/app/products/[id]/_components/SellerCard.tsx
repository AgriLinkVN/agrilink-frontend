import Link from "next/link";
import Image from "next/image";
import { Sprout, Building2, Factory, BadgeCheck, MapPin } from "lucide-react";
import type { ProductDetailSeller } from "@/lib/products-api";

interface Props {
  seller: ProductDetailSeller | null;
}

const SELLER_META: Record<
  string,
  { icon: React.ElementType; label: string }
> = {
  farmer: { icon: Sprout, label: "Nông dân" },
  cooperative: { icon: Building2, label: "Hợp tác xã" },
  supplier: { icon: Factory, label: "Nhà cung cấp" },
};

export function SellerCard({ seller }: Props) {
  if (!seller) {
    return (
      <div className="rounded-2xl border border-hairline p-4 bg-white">
        <p className="text-sm text-muted">Thông tin người bán chưa khả dụng.</p>
      </div>
    );
  }

  const meta = SELLER_META[seller.sellerType] ?? SELLER_META.farmer;
  const Icon = meta.icon;

  const orgName =
    seller.sellerType === "cooperative"
      ? seller.cooperativeName
      : seller.sellerType === "supplier"
        ? seller.companyName
        : seller.farmName;

  const displayName = seller.fullName ?? orgName ?? "Người bán";
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="rounded-2xl border border-hairline p-4 bg-white">
      <p className="text-xs uppercase tracking-wide text-muted font-semibold mb-3">
        Người bán
      </p>

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
          {seller.avatarUrl ? (
            <Image
              src={seller.avatarUrl}
              alt={displayName}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-primary">{initial}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate">{displayName}</p>

          <div className="mt-1 flex items-center gap-1 text-xs text-muted">
            <Icon size={13} />
            <span>{orgName ?? meta.label}</span>
          </div>

          {seller.province?.name && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted">
              <MapPin size={12} />
              <span>{seller.province.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats / Bio */}
      {seller.sellerType === "farmer" && seller.experienceYears != null && (
        <p className="mt-3 text-xs text-muted">
          Kinh nghiệm: <span className="font-medium text-foreground">{seller.experienceYears} năm</span>
        </p>
      )}
      {seller.sellerType === "cooperative" && seller.memberCount != null && (
        <p className="mt-3 text-xs text-muted">
          Thành viên: <span className="font-medium text-foreground">{seller.memberCount}</span>
        </p>
      )}
      {seller.bio && (
        <p className="mt-3 text-xs text-foreground/80 line-clamp-3">
          {seller.bio}
        </p>
      )}

      <Link
        href={`/seller/${seller.id}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Xem hồ sơ
        <BadgeCheck size={14} />
      </Link>
    </div>
  );
}
