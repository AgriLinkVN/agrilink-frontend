import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/ui/page-hero";
import { HomeSearchIcon } from "@/components/home/home-search-icon";
import { StatsSection } from "@/components/home/stats-section";
import { LazySection } from "@/components/home/lazy-section";
import { AdCarouselHome } from "@/components/ads/ad-carousel-home";
import { AdBanner } from "@/components/ads/ad-banner";
import { AdSidebarHome } from "@/components/ads/ad-sidebar-home";
import {
  CategorySkeleton,
  CarouselSkeleton,
  SectionSkeleton,
} from "@/components/home/skeletons";

// Below-fold components — lazy loaded
const CategoryStrip = dynamic(
  () => import("@/components/home/category-strip").then((m) => m.CategoryStrip),
  { loading: () => <CategorySkeleton /> }
);
const FeaturedCarousel = dynamic(
  () => import("@/components/home/featured-carousel").then((m) => m.FeaturedCarousel),
  { loading: () => <CarouselSkeleton /> }
);
const FeaturesSection = dynamic(
  () => import("@/components/home/features-section").then((m) => m.FeaturesSection),
  { loading: () => <SectionSkeleton height="h-96" /> }
);
const HowItWorks = dynamic(
  () => import("@/components/home/how-it-works").then((m) => m.HowItWorks),
  { loading: () => <SectionSkeleton height="h-80" /> }
);
const MapCta = dynamic(
  () => import("@/components/home/map-cta").then((m) => m.MapCta),
  { loading: () => <SectionSkeleton height="h-64" /> }
);
const FarmerCta = dynamic(
  () => import("@/components/home/farmer-cta").then((m) => m.FarmerCta),
  { loading: () => <SectionSkeleton height="h-64" /> }
);
const Footer = dynamic(
  () => import("@/components/layout/footer").then((m) => m.Footer),
  { loading: () => <SectionSkeleton height="h-32" /> }
);


export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* ===== HERO ===== */}
      <PageHero variant="full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32" style={{ animation: "heroFadeUp 0.8s ease-out both" }}>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline" className="border-white/40 text-white text-xs backdrop-blur-sm bg-white/10">
                🌾 AgriTech Vietnam 2025
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
              Kết nối nông dân Việt Nam <br />
              <span className="text-primary-ultra-light">trực tiếp với thị trường</span>
            </h1>
            <p className="text-lg text-white/85 mb-10 leading-relaxed max-w-xl drop-shadow">
              Nền tảng số minh bạch hóa giá cả, truy xuất nguồn gốc và kết nối 8.6 triệu hộ nông dân với người mua trên toàn quốc.
            </p>

            {/* Hero search bar */}
            <div className="flex items-center gap-0 bg-white/95 backdrop-blur-sm rounded-full p-2 max-w-lg shadow-2xl mb-6">
              <HomeSearchIcon />
              <input
                type="text"
                placeholder="Tìm nông sản, tỉnh thành, HTX..."
                className="flex-1 px-4 py-2 bg-transparent text-ink text-sm outline-none placeholder:text-muted-soft"
              />
              <button className="h-11 px-6 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-active transition-colors shrink-0">
                Tìm ngay
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-white/70">
              <span>Phổ biến:</span>
              {["Xoài", "Gạo ST25", "Thanh long", "Rau hữu cơ", "Cà phê"].map((tag) => (
                <Link
                  key={tag}
                  href={`/marketplace?q=${tag}`}
                  className="text-white/90 hover:text-white hover:underline transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </PageHero>

      {/* P5: BannerSlider — Quảng cáo nhà cung cấp */}
      {/* Nhờ P6 (Lê Trí Trung) uncomment dòng dưới và đặt vào đúng vị trí trong layout của họ */}
      {/* <BannerSlider /> */}

      {/* ===== STATS ===== */}
      <StatsSection />

      {/* ===== 3-COLUMN LAYOUT: left ad | main | right ad (xl+) ===== */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 xl:gap-6 items-start">

          {/* LEFT AD SIDEBAR — visible only xl+ */}
          <div className="hidden xl:block w-[200px] shrink-0 sticky top-20 pt-4">
            <AdSidebarHome side="left" />
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">

            {/* AD SLOT: home-carousel */}
            <div className="pb-2 pt-2">
              <AdCarouselHome />
            </div>

            {/* CATEGORY STRIP */}
            <LazySection fallback={<CategorySkeleton />} rootMargin="300px">
              <CategoryStrip />
            </LazySection>

            {/* FEATURED PRODUCTS */}
            <LazySection fallback={<CarouselSkeleton />} rootMargin="200px">
              <FeaturedCarousel />
            </LazySection>

            {/* AD SLOT: below-hero banner */}
            <div className="pb-4">
              <AdBanner slotId="below-hero" index={0} />
            </div>

            {/* FEATURES */}
            <LazySection fallback={<SectionSkeleton height="h-96" />}>
              <FeaturesSection />
            </LazySection>

            {/* HOW IT WORKS */}
            <LazySection fallback={<SectionSkeleton height="h-80" />}>
              <HowItWorks />
            </LazySection>

          </div>

          {/* RIGHT AD SIDEBAR — visible only xl+ */}
          <div className="hidden xl:block w-[200px] shrink-0 sticky top-20 pt-4">
            <AdSidebarHome side="right" />
          </div>

        </div>
      </div>

      {/* ===== MAP PREVIEW CTA ===== */}
      <LazySection fallback={<SectionSkeleton height="h-64" />}>
        <MapCta />
      </LazySection>

      {/* ===== FOR FARMERS CTA ===== */}
      <LazySection fallback={<SectionSkeleton height="h-64" />}>
        <FarmerCta />
      </LazySection>

      <LazySection fallback={<SectionSkeleton height="h-32" />}>
        <Footer />
      </LazySection>
    </div>
  );
}
