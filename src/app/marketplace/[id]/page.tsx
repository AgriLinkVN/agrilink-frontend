import Link from "next/link";
import {
  MapPin, Star, QrCode, Phone, MessageCircle, ShieldCheck,
  Truck, ChevronRight, Calendar, Eye, Package2, Award,
  FileText, User, Building2, Sprout,
} from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge, FarmingBadge } from "@/components/ui/badge";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import {
  fetchProduct,
  fetchProducts,
  getPrimaryImage,
  getProductProvince,
  getVerifiedCertifications,
  type Product,
} from "@/lib/products-api";
import { notFound } from "next/navigation";
import { AdBanner } from "@/components/ads/ad-banner";

const SELLER_TYPE_LABEL: Record<string, { label: string; icon: React.ElementType }> = {
  farmer: { label: "Hộ cá nhân", icon: User },
  cooperative: { label: "Hợp tác xã", icon: Building2 },
  supplier: { label: "Nhà cung cấp", icon: Building2 },
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  // If already formatted (dd/mm/yyyy) return as-is
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id: productId } = await params;

  const product: Product | null = await fetchProduct(productId);
  if (!product) return notFound();

  // Similar products (same farming type, exclude current)
  const { data: similar } = await fetchProducts({ limit: 4 });
  const similarProducts = similar.filter((p) => p.id !== product.id).slice(0, 3);

  const imageUrl = getPrimaryImage(product);
  const province = getProductProvince(product);
  const sellerType = product.seller?.sellerType ?? product.sellerType;
  const sellerName = product.seller?.fullName ?? "Người bán AgriLink";
  const sellerPhone = product.seller?.phone ?? null;
  const SellerIcon = SELLER_TYPE_LABEL[sellerType]?.icon ?? User;
  const sellerLabel = SELLER_TYPE_LABEL[sellerType]?.label ?? "Người bán";
  const qrCode = `QR-${product.id.slice(0, 8).toUpperCase()}`;
  const verifiedCertifications = getVerifiedCertifications(product.certifications);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-hairline bg-surface-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link href="/marketplace" className="hover:text-primary transition-colors">Sàn nông sản</Link>
            <ChevronRight size={14} />
            <span className="text-ink font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left col: product info ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Image gallery */}
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-4 sm:col-span-3 aspect-4/3 bg-surface-green rounded-xl relative overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 60vw"
                  priority
                />
              </div>
              <div className="hidden sm:flex flex-col gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex-1 rounded-lg relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all bg-surface-green">
                    <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="120px" />
                  </div>
                ))}
              </div>
            </div>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-badge-organic-bg text-[#2D6A4F] text-xs font-semibold">
                  Đang bán
                </span>
                {product.farmingType && <FarmingBadge type={product.farmingType} />}
              </div>

              <h1 className="text-2xl font-bold text-ink mb-4">{product.name}</h1>

              <div className="flex items-center flex-wrap gap-x-5 gap-y-2 text-sm text-muted mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary shrink-0" />
                  {province}
                </span>
                {product.harvestDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary shrink-0" />
                    Thu hoạch: <span className="font-medium text-ink">{formatDate(product.harvestDate)}</span>
                  </span>
                )}
                {product.expiryDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-warning shrink-0" />
                    Hạn dùng: <span className="font-medium text-ink">{formatDate(product.expiryDate)}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Eye size={14} className="text-muted shrink-0" />
                  {product.viewCount.toLocaleString("vi-VN")} lượt xem
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill={s <= 5 ? "#F59E0B" : "#E5E7EB"} stroke="none" />
                  ))}
                </div>
                <span className="text-muted text-sm">(Chưa có đánh giá)</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t border-hairline pt-6">
                <h2 className="text-lg font-semibold text-ink mb-3">Mô tả sản phẩm</h2>
                <p className="text-body-text leading-relaxed text-sm">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            <div className="border-t border-hairline pt-6">
              <h2 className="text-lg font-semibold text-ink mb-4">Thông tin sản phẩm</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Đơn vị tính", value: product.unit, icon: Package2 },
                  { label: "Số lượng còn", value: `${Number(product.availableQuantity).toLocaleString("vi-VN")} ${product.unit}`, icon: Package2 },
                  ...(product.minOrderQuantity ? [{ label: "Đặt tối thiểu", value: `${product.minOrderQuantity} ${product.unit}`, icon: Package2 }] : []),
                  ...(product.farmingType ? [{ label: "Loại canh tác", value: product.farmingType.toUpperCase(), icon: Sprout }] : []),
                  ...(product.harvestDate ? [{ label: "Ngày thu hoạch", value: formatDate(product.harvestDate), icon: Calendar }] : []),
                  ...(product.expiryDate ? [{ label: "Hạn sử dụng", value: formatDate(product.expiryDate), icon: Calendar }] : []),
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-surface-soft rounded-lg p-3 border border-hairline">
                    <p className="text-xs text-muted mb-1 flex items-center gap-1">
                      <Icon size={11} className="text-primary" />{label}
                    </p>
                    <p className="text-sm font-semibold text-ink">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {verifiedCertifications.length > 0 && (
              <div className="border-t border-hairline pt-6">
                <h2 className="text-lg font-semibold text-ink mb-4">Chứng nhận chất lượng</h2>
                <div className="flex flex-col gap-3">
                  {verifiedCertifications.map((cert) => (
                    <div key={cert.id} className="bg-white rounded-xl border border-hairline p-4 card-shadow flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-green flex items-center justify-center shrink-0">
                        <Award size={20} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-bold text-ink">{cert.certType.toUpperCase()}</span>
                          {cert.certNumber && (
                            <span className="font-mono text-xs text-muted bg-surface-soft px-2 py-0.5 rounded">
                              {cert.certNumber}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                          {cert.issuedBy && (
                            <span className="flex items-center gap-1">
                              <FileText size={11} /> Cấp bởi: <span className="text-ink font-medium">{cert.issuedBy}</span>
                            </span>
                          )}
                          {cert.issuedDate && <span>Ngày cấp: <span className="text-ink">{formatDate(cert.issuedDate)}</span></span>}
                          {cert.expiryDate && <span>Hiệu lực đến: <span className="text-ink font-medium">{formatDate(cert.expiryDate)}</span></span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QR Traceability */}
            <div className="bg-surface-green rounded-xl border-2 border-primary-light p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-hairline shrink-0">
                  <QrCode size={32} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ink text-sm">Truy xuất nguồn gốc</h3>
                    <Badge variant="organic">Đã xác thực</Badge>
                  </div>
                  <p className="text-xs text-muted mb-3">
                    Mã lô: <span className="font-mono font-semibold text-primary">{qrCode}</span>
                  </p>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/trace/${qrCode}`}>
                      <QrCode size={13} /> Xem toàn bộ hành trình sản phẩm
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Seller info */}
            <div className="border-t border-hairline pt-6">
              <h2 className="text-lg font-semibold text-ink mb-4">Thông tin người bán</h2>
              <div className="bg-white rounded-xl border border-hairline p-5 card-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <SellerIcon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">{sellerName}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="vietgap">{sellerLabel} · Đã xác thực</Badge>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <MapPin size={11} className="text-primary" />{province}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <MessageCircle size={14} /> Nhắn tin
                  </Button>
                  {sellerPhone ? (
                    <Button variant="ghost" size="sm" className="flex-1" asChild>
                      <a href={`tel:${sellerPhone}`}>
                        <Phone size={14} /> Gọi ngay
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right col: contact card ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border border-hairline card-shadow p-6 flex flex-col gap-5">
              <div>
                <span className="text-3xl font-bold text-primary">{Number(product.pricePerUnit).toLocaleString("vi-VN")}đ</span>
                <span className="text-muted text-sm">/{product.unit}</span>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Còn lại</span>
                  <span className="font-semibold text-ink">{Number(product.availableQuantity).toLocaleString("vi-VN")} {product.unit}</span>
                </div>
                {product.minOrderQuantity && (
                  <div className="flex justify-between">
                    <span className="text-muted">Đặt tối thiểu</span>
                    <span className="font-semibold text-ink">{product.minOrderQuantity} {product.unit}</span>
                  </div>
                )}
                {product.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-muted">Hạn sử dụng</span>
                    <span className="font-semibold text-ink">{formatDate(product.expiryDate)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-hairline pt-4">
                <Button size="lg" className="w-full">
                  <Phone size={17} /> Liên hệ người bán
                </Button>
                <Button variant="secondary" size="lg" className="w-full">
                  <MessageCircle size={16} /> Yêu cầu báo giá
                </Button>
              </div>

              <div className="flex flex-col gap-2 border-t border-hairline pt-4">
                {[
                  { icon: ShieldCheck, text: "Người bán đã được xác thực danh tính" },
                  ...(verifiedCertifications.length > 0
                    ? [{ icon: Award, text: "Sản phẩm có chứng nhận chất lượng" }]
                    : []),
                  { icon: Truck, text: "Hỗ trợ giao hàng toàn quốc" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-2 text-xs text-muted">
                    <Icon size={13} className="text-primary mt-0.5 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>

              {/* AD SLOT: sidebar — nông cụ / vật tư */}
              <div className="border-t border-hairline pt-4 flex flex-col gap-3">
                <AdBanner slotId="sidebar" index={0} />
                <AdBanner slotId="sidebar" index={1} />
              </div>
            </div>
          </div>
        </div>

        {/* AD SLOT: inline banner — between main content and similar products */}
        <div className="mt-12">
          <AdBanner slotId="inline" index={0} />
        </div>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-ink mb-6">Sản phẩm tương tự</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {similarProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/marketplace/${p.id}`}
                  className="bg-white rounded-xl border border-hairline p-4 card-shadow card-shadow-hover flex items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-xl bg-surface-green relative overflow-hidden shrink-0">
                    <Image src={getPrimaryImage(p)} alt={p.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink leading-tight mb-1 truncate">{p.name}</p>
                    <p className="text-xs text-muted flex items-center gap-1 mb-1">
                      <MapPin size={10} />{getProductProvince(p)}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-primary">{Number(p.pricePerUnit).toLocaleString("vi-VN")}đ/{p.unit}</p>
                      {p.farmingType && <FarmingBadge type={p.farmingType} />}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reviews — only for real UUID products */}
      {/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewSection productId={productId} />
        </div>
      )}

      <Footer />
    </div>
  );
}
