import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Award,
  BadgeCheck,
  Building2,
  ChevronRight,
  Factory,
  MapPin,
  MessageCircle,
  Package2,
  Phone,
  ShieldCheck,
  Sprout,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CERT_TYPE_LABELS,
  FARMING_TYPE_LABELS,
  SELLER_TYPE_LABELS,
  fetchProductDetail,
  fetchSellerProducts,
  getPrimaryImage,
  getProductProvince,
  getVerifiedCertifications,
  type Product,
  type ProductDetail,
  type ProductDetailSeller,
} from "@/lib/products-api";
import {
  SellerProfileTabs,
  type SellerReviewItem,
} from "./_components/SellerProfileTabs";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";
const BASE = `${BACKEND}/api/v1`;

type SellerType = ProductDetailSeller["sellerType"];

interface PageProps {
  params: Promise<{ id: string }>;
}

interface RawReview {
  id: string;
  productId?: string;
  product_id?: string;
  rating: number;
  comment?: string | null;
  reply?: string | null;
  sellerReply?: string | null;
  createdAt?: string;
  created_at?: string;
  reviewer?: {
    fullName?: string | null;
    full_name?: string | null;
  } | null;
}

interface ReviewsPayload {
  data?: RawReview[];
  total?: number;
}

const SELLER_META: Record<SellerType, { label: string; icon: LucideIcon }> = {
  farmer: { label: "Hộ sản xuất", icon: Sprout },
  cooperative: { label: "Hợp tác xã", icon: Building2 },
  supplier: { label: "Nhà cung cấp", icon: Factory },
};

function getSellerOrgName(seller: ProductDetailSeller | null, fallbackType: SellerType) {
  if (!seller) return SELLER_TYPE_LABELS[fallbackType] ?? "Người bán";
  if (seller.sellerType === "cooperative") return seller.cooperativeName ?? seller.fullName;
  if (seller.sellerType === "supplier") return seller.companyName ?? seller.fullName;
  return seller.farmName ?? seller.fullName;
}

function getSellerDisplayName(seller: ProductDetailSeller | null, fallbackType: SellerType) {
  return getSellerOrgName(seller, fallbackType) ?? seller?.fullName ?? "Người bán AgriLink";
}

function normalizePhone(phone: string | null | undefined) {
  return phone?.replace(/\D/g, "") ?? "";
}

function isValidPhone(phone: string | null | undefined) {
  return /^0\d{9}$/.test(normalizePhone(phone));
}

function formatPhone(phone: string) {
  const digits = normalizePhone(phone);
  if (digits.length !== 10) return phone;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

function average(values: number[]) {
  const valid = values.filter((value) => Number.isFinite(value) && value > 0);
  if (valid.length === 0) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function getProductRating(product: Product) {
  return Number(product.avgRating ?? 0);
}

function getProductSoldCount(product: Product) {
  return Number(product.soldCount ?? 0);
}

function getProductQuantity(product: Product) {
  return Number(product.availableQuantity ?? 0);
}

function getSellerProvince(
  seller: ProductDetailSeller | null,
  detail: ProductDetail | null,
  products: Product[],
) {
  return (
    seller?.province?.name ??
    detail?.province?.name ??
    (products[0] ? getProductProvince(products[0]) : "Việt Nam")
  );
}

function getVerifiedCertLabels(products: Product[]) {
  const labels = new Map<string, string>();
  for (const product of products) {
    for (const cert of getVerifiedCertifications(product.certifications)) {
      labels.set(cert.certType, CERT_TYPE_LABELS[cert.certType] ?? cert.certType.toUpperCase());
    }
  }
  return [...labels.values()];
}

async function fetchSellerReviews(products: Product[]): Promise<{
  reviews: SellerReviewItem[];
  total: number;
  average: number | null;
}> {
  const reviewGroups = await Promise.all(
    products.slice(0, 8).map(async (product) => {
      if (product.id.startsWith("mock-")) return { reviews: [] as SellerReviewItem[], total: 0 };

      try {
        const res = await fetch(`${BASE}/reviews/product/${product.id}?page=1&limit=3`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const payload = (json?.data ?? json) as ReviewsPayload;
        const rawReviews = Array.isArray(payload.data) ? payload.data : [];

        return {
          total: payload.total ?? rawReviews.length,
          reviews: rawReviews.map((review) => ({
            id: review.id,
            productId: review.productId ?? review.product_id ?? product.id,
            productName: product.name,
            reviewerName:
              review.reviewer?.fullName ??
              review.reviewer?.full_name ??
              "Khách hàng AgriLink",
            rating: Number(review.rating ?? 0),
            comment: review.comment ?? null,
            sellerReply: review.sellerReply ?? review.reply ?? null,
            createdAt: review.createdAt ?? review.created_at ?? new Date().toISOString(),
          })),
        };
      } catch {
        return { reviews: [] as SellerReviewItem[], total: 0 };
      }
    }),
  );

  const reviews = reviewGroups
    .flatMap((group) => group.reviews)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
  const total = reviewGroups.reduce((sum, group) => sum + group.total, 0);
  const reviewAverage = average(reviews.map((review) => review.rating));

  return { reviews, total, average: reviewAverage };
}

async function getSellerPageData(sellerId: string) {
  const productResult = await fetchSellerProducts(sellerId, 24);
  const products = productResult.data ?? [];
  if (products.length === 0) return null;

  const primaryDetail = await fetchProductDetail(products[0].id);
  const seller = primaryDetail?.seller ?? null;
  const fallbackType = seller?.sellerType ?? products[0].sellerType;
  const reviewSummary = await fetchSellerReviews(products);

  return {
    products,
    seller,
    primaryDetail,
    fallbackType,
    reviewSummary,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getSellerPageData(id);
  if (!data) return { title: "Không tìm thấy người bán | AgriLink" };

  const displayName = getSellerDisplayName(data.seller, data.fallbackType);
  const province = getSellerProvince(data.seller, data.primaryDetail, data.products);

  return {
    title: `${displayName} | Hồ sơ người bán AgriLink`,
    description: `Xem hồ sơ, sản phẩm đang bán và đánh giá của ${displayName} tại ${province}.`,
  };
}

export default async function SellerProfilePage({ params }: PageProps) {
  const { id: sellerId } = await params;
  const data = await getSellerPageData(sellerId);
  if (!data) notFound();

  const { products, seller, primaryDetail, fallbackType, reviewSummary } = data;
  const displayName = getSellerDisplayName(seller, fallbackType);
  const orgName = getSellerOrgName(seller, fallbackType);
  const sellerType = seller?.sellerType ?? fallbackType;
  const meta = SELLER_META[sellerType] ?? SELLER_META.farmer;
  const Icon = meta.icon;
  const province = getSellerProvince(seller, primaryDetail, products);
  const coverImage = getPrimaryImage(products[0]);
  const initial = displayName.trim().charAt(0).toUpperCase() || "A";
  const phone = seller?.phone ?? null;
  const normalizedPhone = normalizePhone(phone);
  const hasPhone = isValidPhone(phone);
  const verifiedCerts = getVerifiedCertLabels(products);
  const farmingTypes = [
    ...new Set(products.map((product) => product.farmingType).filter(Boolean)),
  ] as NonNullable<Product["farmingType"]>[];
  const categories = [
    ...new Set(products.map((product) => product.category?.name).filter(Boolean)),
  ] as string[];
  const totalViews = products.reduce((sum, product) => sum + Number(product.viewCount ?? 0), 0);
  const totalSold = products.reduce((sum, product) => sum + getProductSoldCount(product), 0);
  const totalQuantity = products.reduce((sum, product) => sum + getProductQuantity(product), 0);
  const productAverage = average(products.map(getProductRating));
  const detailAverage =
    primaryDetail && Number(primaryDetail.avgRating) > 0 ? Number(primaryDetail.avgRating) : null;
  const reviewAverage = reviewSummary.average ?? productAverage ?? detailAverage;
  const trustScore = reviewAverage;
  const bio =
    seller?.bio ??
    primaryDetail?.description ??
    `${SELLER_TYPE_LABELS[sellerType] ?? "Người bán"} đang cung cấp nông sản trên AgriLink.`;

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main>
        <section className="relative min-h-[360px] overflow-hidden bg-ink">
          <Image
            src={coverImage}
            alt={displayName}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

          <div className="relative z-10 mx-auto flex min-h-[360px] max-w-7xl flex-col justify-end px-4 pb-8 pt-24 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center gap-2 text-sm text-white/75">
              <Link href="/" className="hover:text-white">Trang chủ</Link>
              <ChevronRight size={14} />
              <Link href="/marketplace" className="hover:text-white">Sàn nông sản</Link>
              <ChevronRight size={14} />
              <span className="font-medium text-white">{displayName}</span>
            </div>

            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-primary text-3xl font-bold text-white shadow-lg">
                  {seller?.avatarUrl ? (
                    <Image
                      src={seller.avatarUrl}
                      alt={displayName}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>

                <div className="min-w-0 text-white">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge className="bg-white text-ink">
                      <Icon size={12} />
                      {meta.label}
                    </Badge>
                    <Badge className="border border-white/30 bg-white/10 text-white">
                      <BadgeCheck size={12} />
                      Hồ sơ công khai
                    </Badge>
                    {trustScore != null ? (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-400 px-2 py-1 text-[11px] font-bold text-amber-950">
                        <Star size={12} fill="currentColor" />
                        {trustScore.toFixed(1)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[11px] font-semibold text-white">
                        <Star size={12} />
                        Chưa có đánh giá
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{displayName}</h1>
                  {seller?.fullName && seller.fullName !== orgName && (
                    <p className="mt-1 text-sm text-white/80">{seller.fullName}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} />
                      {province}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Package2 size={14} />
                      {products.length.toLocaleString("vi-VN")} sản phẩm đang bán
                    </span>
                    {seller?.experienceYears != null && (
                      <span className="inline-flex items-center gap-1">
                        <TrendingUp size={14} />
                        {seller.experienceYears} năm kinh nghiệm
                      </span>
                    )}
                    {seller?.memberCount != null && (
                      <span className="inline-flex items-center gap-1">
                        <Users size={14} />
                        {seller.memberCount} thành viên
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                {hasPhone ? (
                  <>
                    <Button size="sm" className="bg-white text-primary hover:bg-white/90" asChild>
                      <a href={`tel:${normalizedPhone}`}>
                        <Phone size={15} />
                        {formatPhone(normalizedPhone)}
                      </a>
                    </Button>
                    <Button size="sm" className="bg-[#0068FF] hover:bg-[#0055D4]" asChild>
                      <a
                        href={`https://zalo.me/${normalizedPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle size={15} />
                        Zalo
                      </a>
                    </Button>
                  </>
                ) : (
                  <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80">
                    Chưa cập nhật số điện thoại
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-hairline bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-hairline px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
            {[
              { label: "Sản phẩm", value: products.length.toLocaleString("vi-VN") },
              { label: "Đã bán", value: totalSold > 0 ? totalSold.toLocaleString("vi-VN") : "0" },
              { label: "Lượt xem", value: totalViews.toLocaleString("vi-VN") },
              { label: "Tồn kho", value: totalQuantity.toLocaleString("vi-VN") },
            ].map((item) => (
              <div key={item.label} className="bg-white px-4 py-5 text-center">
                <p className="text-2xl font-bold text-ink">{item.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <section className="rounded-xl border border-hairline bg-white p-5">
                <h2 className="text-lg font-bold text-ink">Thông tin người bán</h2>
                <p className="mt-3 text-sm leading-7 text-body-text">{bio}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {farmingTypes.map((type) => (
                    <Badge key={type} variant={type}>
                      <Sprout size={12} />
                      {FARMING_TYPE_LABELS[type]}
                    </Badge>
                  ))}
                  {categories.slice(0, 6).map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-hairline bg-white p-5">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-primary" />
                  <h2 className="text-lg font-bold text-ink">Chứng nhận nổi bật</h2>
                </div>

                {verifiedCerts.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {verifiedCerts.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800"
                      >
                        <ShieldCheck size={15} />
                        {cert}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">Chưa có chứng nhận sản phẩm đã xác thực.</p>
                )}
              </section>
            </div>

            <aside className="space-y-4">
              <section className="rounded-xl border border-hairline bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Tổng quan</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs text-muted">Loại người bán</p>
                    <p className="mt-1 font-semibold text-ink">
                      {SELLER_TYPE_LABELS[sellerType] ?? meta.label}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Khu vực</p>
                    <p className="mt-1 font-semibold text-ink">{province}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Điểm tin cậy</p>
                    {trustScore != null ? (
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-semibold text-ink">{trustScore.toFixed(1)}/5</span>
                        <Star size={15} className="fill-amber-400 text-amber-400" />
                      </div>
                    ) : (
                      <p className="mt-1 font-semibold text-ink">Chưa có đánh giá</p>
                    )}
                  </div>
                  {seller?.supplierType && (
                    <div>
                      <p className="text-xs text-muted">Nhóm cung ứng</p>
                      <p className="mt-1 font-semibold capitalize text-ink">{seller.supplierType}</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-xl border border-hairline bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Liên hệ</p>
                {hasPhone ? (
                  <div className="mt-4 space-y-2">
                    <Button className="w-full" asChild>
                      <a href={`tel:${normalizedPhone}`}>
                        <Phone size={16} />
                        Gọi {formatPhone(normalizedPhone)}
                      </a>
                    </Button>
                    <Button className="w-full bg-[#0068FF] hover:bg-[#0055D4]" asChild>
                      <a
                        href={`https://zalo.me/${normalizedPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle size={16} />
                        Chat Zalo
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">Người bán chưa cập nhật số điện thoại liên hệ.</p>
                )}
              </section>
            </aside>
          </div>

          <SellerProfileTabs
            sellerId={sellerId}
            products={products}
            reviews={reviewSummary.reviews}
            reviewAverage={reviewAverage}
            reviewTotal={reviewSummary.total}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
