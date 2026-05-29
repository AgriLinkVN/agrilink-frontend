import Link from "next/link";
import { MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function MapCta() {
  return (
    <section className="overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-80">
        {/* Left — dark panel */}
        <div
          className="relative lg:w-1/2 py-16 px-8 lg:px-14 flex flex-col justify-center overflow-hidden"
          style={{ background: "#1B4332" }}
        >
          {/* Dot pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Blob accent */}
          <div
            className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #52B788, transparent 70%)", animation: "blobC 10s ease-in-out infinite" }}
          />
          <div className="relative z-10 max-w-lg">
            <Badge variant="organic" className="mb-4">Bản đồ GIS</Badge>
            <h2 className="text-3xl font-bold text-white mb-4">
              Khám phá 34 vùng nông sản trọng điểm
            </h2>
            <p className="text-white/70 mb-8 leading-relaxed text-sm">
              Bản đồ số hóa hiển thị vùng trồng, sản lượng dự kiến, mùa vụ và loại nông sản đặc trưng của từng tỉnh thành. Tìm nguồn hàng chính xác theo địa lý.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-white text-primary hover:bg-surface-green">
                <Link href="/map">
                  <MapPin size={16} /> Xem bản đồ vùng trồng
                </Link>
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 border border-white/30" asChild>
                <Link href="/prices">
                  <TrendingUp size={16} /> Bảng giá thị trường
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Right — light map mockup panel */}
        <div className="lg:w-1/2 py-16 px-8 lg:px-14 flex items-center justify-center bg-surface-green">
          <div className="w-full max-w-sm">
            <div className="bg-white rounded-2xl border border-primary-light p-6 card-shadow aspect-4/3 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin size={40} className="text-primary" />
                </div>
                <p className="text-sm font-semibold text-primary">Bản đồ GIS tương tác</p>
                <p className="text-xs text-muted mt-1">MapBox GL · 34 tỉnh thành</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
