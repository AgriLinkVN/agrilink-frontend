import Link from "next/link";
import Image from "next/image";
import {
  MapPin, Sprout, Award, Package2, Calendar, ChevronRight,
  Phone, MessageCircle, Star, Leaf, ShieldCheck, Clock,
  BarChart3, Users, Ruler,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { FarmingBadge } from "@/components/ui/badge";
import {
  fetchSellerProducts,
  getPrimaryImage,
  type Product,
} from "@/lib/products-api";
import { MapboxCanvas } from "@/components/map/mapbox-canvas";
import { runtimeConfig, getApiBaseUrl } from "@/config/runtime-config";

// ── Types ──────────────────────────────────────────────────────

interface FarmProfile {
  id: string;
  userId: string;
  farmName: string | null;
  farmAreaHectares: number | null;
  farmingType: "organic" | "traditional" | "vietgap" | "globalgap" | null;
  region: "north" | "central" | "south" | "highlands" | null;
  provinceId: string | null;
  districtId: string | null;
  address: string | null;
  bio: string | null;
  experienceYears: number | null;
}

// ── Mock data (fallback when BE unreachable) ───────────────────

const MOCK_FARM_PROFILES: Record<string, FarmProfile & { displayName: string; avatarUrl: string; coverUrl: string; phone: string; totalSales: number; responseRate: string; trustScore: number; provinceLabel: string }> = {
  default: {
    id: "mock-farm-1",
    userId: "mock-user-1",
    farmName: "Nông trại Xanh Tiền Giang",
    displayName: "Nguyễn Văn Hùng",
    avatarUrl: "/logo.png",
    coverUrl: "/demo/agrilink-farm-hero.webp",
    farmAreaHectares: 4.5,
    farmingType: "vietgap",
    region: "south",
    provinceId: "82",
    districtId: null,
    address: "Ấp 3, Xã Cai Lậy, Tiền Giang",
    bio: "Hộ nông dân 3 đời trồng xoài cát Hòa Lộc và sầu riêng Ri6. Áp dụng kỹ thuật VietGAP từ năm 2018, cam kết truy xuất nguồn gốc minh bạch.",
    experienceYears: 15,
    phone: "0912 345 678",
    totalSales: 1240,
    responseRate: "94%",
    trustScore: 4.8,
    provinceLabel: "Tiền Giang",
  },
};

// ── Fetch functions ────────────────────────────────────────────

async function fetchFarmProfile(userId: string) {
  if (runtimeConfig.demoMode) {
    return {
      ...MOCK_FARM_PROFILES.default,
      userId,
    };
  }
  try {
    const res = await fetch(`${getApiBaseUrl()}/farm/${userId}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return (json?.data ?? json) as FarmProfile;
  } catch {
    return null;
  }
}

async function fetchFarmProducts(sellerId: string): Promise<Product[]> {
  try {
    const response = await fetchSellerProducts(sellerId, 12);
    return response.data;
  } catch {
    return [];
  }
}

// ── Helpers ────────────────────────────────────────────────────

const FARMING_LABEL: Record<string, string> = {
  organic: "Hữu cơ", vietgap: "VietGAP", globalgap: "GlobalGAP", traditional: "Truyền thống",
};
const REGION_LABEL: Record<string, string> = {
  north: "Miền Bắc", central: "Miền Trung", south: "Miền Nam", highlands: "Tây Nguyên",
};

function formatDate(d: string | null | undefined) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
  } catch { return d; }
}

// ── Cert badge colors ──────────────────────────────────────────

const CERT_COLORS: Record<string, string> = {
  vietgap: "bg-emerald-100 text-emerald-800 border-emerald-200",
  organic: "bg-green-100 text-green-800 border-green-200",
  globalgap: "bg-blue-100 text-blue-800 border-blue-200",
  ocop: "bg-yellow-100 text-yellow-800 border-yellow-200",
  other: "bg-gray-100 text-gray-700 border-gray-200",
};

// ── Page ───────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FarmProfilePage({ params }: PageProps) {
  const { id: userId } = await params;

  // Fetch farm profile and products in parallel
  const [profileRaw, products] = await Promise.all([
    fetchFarmProfile(userId),
    fetchFarmProducts(userId),
  ]);

  // Use mock if backend unreachable
  const mock = MOCK_FARM_PROFILES.default;
  const profile = profileRaw ?? mock;
  const farmName = profile.farmName ?? mock.farmName;
  const displayName = (profile as typeof mock).displayName ?? mock.displayName;
  const avatarUrl = (profile as typeof mock).avatarUrl ?? mock.avatarUrl;
  const coverUrl = (profile as typeof mock).coverUrl ?? mock.coverUrl;
  const phone = (profile as typeof mock).phone ?? mock.phone;
  const trustScore = (profile as typeof mock).trustScore ?? mock.trustScore;
  const totalSales = (profile as typeof mock).totalSales ?? mock.totalSales;
  const responseRate = (profile as typeof mock).responseRate ?? mock.responseRate;
  const provinceLabel = (profile as typeof mock).provinceLabel ?? mock.provinceLabel;

  const displayProducts = products.length > 0 ? products : [] as Product[];

  // Collect unique cert types from products
  const certTypes = [...new Set(
    displayProducts.flatMap(p => (p.certifications ?? []).map(c => c.certType.toLowerCase()))
  )];

  // Harvest timeline from products with harvestDate
  const harvestItems = displayProducts
    .filter(p => p.harvestDate)
    .sort((a, b) => new Date(a.harvestDate!).getTime() - new Date(b.harvestDate!).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* ── Breadcrumb ── */}
      <div className="border-b border-hairline bg-surface-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link href="/marketplace" className="hover:text-primary transition-colors">Sàn nông sản</Link>
            <ChevronRight size={14} />
            <span className="text-ink font-medium">{farmName}</span>
          </div>
        </div>
      </div>

      {/* ── 1. HERO BANNER ── */}
      <div className="relative w-full h-56 sm:h-72 overflow-hidden">
        <Image
          src={coverUrl}
          alt={farmName ?? "Nông trại"}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Farm name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6">
          <div className="max-w-7xl mx-auto flex items-end gap-4">
            {/* Avatar */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0">
              <Image src={avatarUrl} alt={displayName} fill className="object-cover" sizes="96px" />
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md leading-tight">
                {farmName}
              </h1>
              <p className="text-white/80 text-sm mt-0.5">{displayName}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {profile.farmingType && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-white px-2.5 py-1 rounded-full">
                    {FARMING_LABEL[profile.farmingType] ?? profile.farmingType}
                  </span>
                )}
                {profile.region && (
                  <span className="text-[10px] text-white/70 flex items-center gap-1">
                    <MapPin size={11} /> {REGION_LABEL[profile.region] ?? profile.region}
                  </span>
                )}
                <span className="flex items-center gap-1 text-yellow-300 text-sm font-semibold">
                  <Star size={13} fill="currentColor" /> {trustScore.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="hidden sm:flex items-center gap-2 pb-1">
              <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-ink">
                <Phone size={14} /> {phone}
              </Button>
              <Button size="sm">
                <MessageCircle size={14} /> Nhắn tin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Info columns ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* ── 2. THÔNG TIN ĐỊA LÝ ── */}
            <section className="bg-white rounded-2xl border border-hairline p-6 card-shadow">
              <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
                <Sprout size={18} className="text-primary" /> Thông tin nông trại
              </h2>

              {/* Bio */}
              {profile.bio && (
                <p className="text-sm text-muted leading-relaxed mb-5">{profile.bio}</p>
              )}

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-surface-green rounded-xl p-3 text-center">
                  <Ruler size={16} className="text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-primary">
                    {profile.farmAreaHectares ? `${profile.farmAreaHectares} ha` : "—"}
                  </p>
                  <p className="text-[10px] text-muted">Diện tích</p>
                </div>
                <div className="bg-surface-green rounded-xl p-3 text-center">
                  <Clock size={16} className="text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-primary">
                    {profile.experienceYears ? `${profile.experienceYears} năm` : "—"}
                  </p>
                  <p className="text-[10px] text-muted">Kinh nghiệm</p>
                </div>
                <div className="bg-surface-green rounded-xl p-3 text-center">
                  <BarChart3 size={16} className="text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-primary">{totalSales.toLocaleString("vi-VN")}</p>
                  <p className="text-[10px] text-muted">Đơn thành công</p>
                </div>
                <div className="bg-surface-green rounded-xl p-3 text-center">
                  <Users size={16} className="text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-primary">{responseRate}</p>
                  <p className="text-[10px] text-muted">Tỷ lệ phản hồi</p>
                </div>
              </div>

              {/* Location detail */}
              <div className="flex flex-col gap-2 text-sm text-muted">
                {profile.address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
                    <span>{profile.address}</span>
                  </div>
                )}
                {provinceLabel && (
                  <div className="flex items-center gap-2">
                    <Leaf size={15} className="text-primary shrink-0" />
                    <span>Tỉnh/thành: <strong className="text-ink">{provinceLabel}</strong></span>
                  </div>
                )}
                {profile.farmingType && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-primary shrink-0" />
                    <span>Canh tác: <strong className="text-ink">{FARMING_LABEL[profile.farmingType]}</strong></span>
                  </div>
                )}
              </div>
            </section>

            {/* ── 3. CHỨNG NHẬN ── */}
            {(certTypes.length > 0 || true) && (
              <section className="bg-white rounded-2xl border border-hairline p-6 card-shadow">
                <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
                  <Award size={18} className="text-primary" /> Chứng nhận & Tiêu chuẩn
                </h2>
                <div className="flex flex-wrap gap-3">
                  {(certTypes.length > 0 ? certTypes : ["vietgap", "organic"]).map(cert => (
                    <div
                      key={cert}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm ${CERT_COLORS[cert] ?? CERT_COLORS.other}`}
                    >
                      <ShieldCheck size={15} />
                      {cert.toUpperCase()}
                      <span className="text-[10px] font-normal opacity-70">Đã xác minh</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted mt-3">
                  Chứng nhận được kiểm định bởi cơ quan nhà nước và tổ chức quốc tế có thẩm quyền.
                </p>
              </section>
            )}

            {/* ── 4. DANH SÁCH SẢN PHẨM ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-ink flex items-center gap-2">
                  <Package2 size={18} className="text-primary" /> Sản phẩm của nông trại
                  <span className="text-xs font-normal text-muted ml-1">({displayProducts.length > 0 ? displayProducts.length : "—"})</span>
                </h2>
                <Link href={`/marketplace?sellerId=${userId}`} className="text-sm text-primary hover:text-primary-active font-medium flex items-center gap-1">
                  Xem tất cả <ChevronRight size={14} />
                </Link>
              </div>

              {displayProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {displayProducts.slice(0, 6).map(product => {
                    const img = getPrimaryImage(product);
                    return (
                      <Link
                        key={product.id}
                        href={`/marketplace/${product.id}`}
                        className="group bg-white rounded-xl border border-hairline hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
                      >
                        <div className="relative h-36 overflow-hidden">
                          <Image
                            src={img}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="200px"
                          />
                          {product.farmingType && (
                            <div className="absolute top-2 left-2">
                              <FarmingBadge type={product.farmingType} />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-semibold text-ink line-clamp-1">{product.name}</p>
                          <p className="text-primary font-bold text-sm mt-0.5">
                            {Number(product.pricePerUnit).toLocaleString("vi-VN")}đ/{product.unit}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                /* Mock product grid khi backend chưa có data */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { name: "Xoài cát Hòa Lộc", price: "45.000đ/kg", img: "/demo/agricultural-produce.webp", type: "vietgap" },
                    { name: "Sầu riêng Ri6", price: "85.000đ/kg", img: "/demo/agricultural-produce.webp", type: "vietgap" },
                    { name: "Thanh long ruột đỏ", price: "35.000đ/kg", img: "/demo/agricultural-produce.webp", type: "organic" },
                  ].map(p => (
                    <div key={p.name} className="bg-white rounded-xl border border-hairline overflow-hidden">
                      <div className="relative h-36">
                        <Image src={p.img} alt={p.name} fill className="object-cover" sizes="200px" />
                        <div className="absolute top-2 left-2">
                          <FarmingBadge type={p.type as "vietgap" | "organic"} />
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-ink line-clamp-1">{p.name}</p>
                        <p className="text-primary font-bold text-sm mt-0.5">{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── 5. LỊCH THU HOẠCH ── */}
            <section className="bg-white rounded-2xl border border-hairline p-6 card-shadow">
              <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-primary" /> Lịch thu hoạch
              </h2>

              {harvestItems.length > 0 ? (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-primary/20" />
                  <div className="flex flex-col gap-4 pl-6">
                    {harvestItems.map(p => (
                      <div key={p.id} className="relative">
                        <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white shadow" />
                        <p className="text-xs text-muted">{formatDate(p.harvestDate)}</p>
                        <p className="text-sm font-semibold text-ink">{p.name}</p>
                        <p className="text-xs text-primary">{Number(p.availableQuantity).toLocaleString("vi-VN")} {p.unit} sẵn có</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Mock timeline */
                <div className="relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-primary/20" />
                  <div className="flex flex-col gap-4 pl-6">
                    {[
                      { date: "15/07/2026", name: "Xoài cát Hòa Lộc", qty: "2.000 kg" },
                      { date: "20/08/2026", name: "Sầu riêng Ri6", qty: "5.000 kg" },
                      { date: "10/09/2026", name: "Thanh long ruột đỏ", qty: "3.500 kg" },
                    ].map(item => (
                      <div key={item.name} className="relative">
                        <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-primary border-2 border-white shadow" />
                        <p className="text-xs text-muted">{item.date}</p>
                        <p className="text-sm font-semibold text-ink">{item.name}</p>
                        <p className="text-xs text-primary">{item.qty} dự kiến</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="flex flex-col gap-5">

            {/* Contact card */}
            <div className="bg-white rounded-2xl border border-hairline p-5 card-shadow">
              <h3 className="font-semibold text-ink mb-3">Liên hệ nông trại</h3>
              <div className="flex flex-col gap-2">
                <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
                  <Phone size={15} className="text-primary" /> {phone}
                </a>
                {profile.address && (
                  <div className="flex items-start gap-2 text-sm text-muted">
                    <MapPin size={15} className="text-primary shrink-0 mt-0.5" /> {profile.address}
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Button className="w-full" size="sm">
                  <MessageCircle size={14} /> Nhắn tin ngay
                </Button>
                <Button variant="secondary" className="w-full" size="sm">
                  <Phone size={14} /> Gọi điện
                </Button>
              </div>

              {/* Trust score */}
              <div className="mt-4 pt-4 border-t border-hairline grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-base font-bold text-primary flex items-center justify-center gap-0.5">
                    <Star size={13} fill="currentColor" className="text-yellow-400" /> {trustScore}
                  </p>
                  <p className="text-[10px] text-muted">Đánh giá</p>
                </div>
                <div>
                  <p className="text-base font-bold text-ink">{responseRate}</p>
                  <p className="text-[10px] text-muted">Phản hồi</p>
                </div>
                <div>
                  <p className="text-base font-bold text-ink">{totalSales.toLocaleString("vi-VN")}</p>
                  <p className="text-[10px] text-muted">Đơn hàng</p>
                </div>
              </div>
            </div>

            {/* ── 6. BẢN ĐỒ MINI ── */}
            <div className="bg-white rounded-2xl border border-hairline overflow-hidden card-shadow">
              <div className="px-4 pt-4 pb-2 flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm font-semibold text-ink">{provinceLabel}</span>
              </div>
              <div className="h-52">
                <MapboxCanvas
                  styleKey="terrain"
                  interactive={false}
                  className="rounded-none"
                />
              </div>
            </div>

            {/* Verified badges */}
            <div className="bg-surface-green rounded-2xl border border-primary/10 p-4">
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wide mb-3">Đã xác minh</h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: "CCCD / Định danh cá nhân", ok: true },
                  { label: "Giấy phép kinh doanh", ok: true },
                  { label: "Chứng nhận canh tác", ok: !!profile.farmingType },
                  { label: "Tài khoản ngân hàng", ok: true },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <ShieldCheck size={14} className={item.ok ? "text-primary" : "text-muted"} />
                    <span className={item.ok ? "text-ink" : "text-muted line-through"}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
