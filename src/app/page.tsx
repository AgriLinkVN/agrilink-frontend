import Link from "next/link";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsSection } from "@/components/home/stats-section";
import { LazySection } from "@/components/home/lazy-section";
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
      <section className="relative overflow-hidden bg-primary-active" style={{ minHeight: "calc(100vh - 64px)", maxHeight: "800px" }}>
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: "heroKenBurns 20s ease-in-out infinite alternate" }}
        >
          <source src="/videos/hero-rice-field.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay — dark green tint for readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(27,67,50,0.82) 0%, rgba(45,106,79,0.65) 50%, rgba(27,67,50,0.45) 100%)",
          }}
        />

        {/* Fallback gradient (shows when video not loaded yet) */}
        <div className="hero-gradient absolute inset-0 -z-10" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl" style={{ animation: "heroFadeUp 0.8s ease-out both" }}>
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
              <Search size={18} className="ml-4 text-muted shrink-0" />
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

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <StatsSection />

      {/* ===== CATEGORY STRIP ===== */}
      <LazySection fallback={<CategorySkeleton />} rootMargin="300px">
        <CategoryStrip />
      </LazySection>

      {/* ===== FEATURED PRODUCTS ===== */}
      <LazySection fallback={<CarouselSkeleton />} rootMargin="200px">
        <FeaturedCarousel />
      </LazySection>

      {/* ===== FEATURES ===== */}
      <LazySection fallback={<SectionSkeleton height="h-96" />}>
        <FeaturesSection />
      </LazySection>

      {/* ===== HOW IT WORKS ===== */}
      <LazySection fallback={<SectionSkeleton height="h-80" />}>
        <HowItWorks />
      </LazySection>

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
