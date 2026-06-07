"use client";

import Link from "next/link";
import { MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapboxCanvas } from "@/components/map/mapbox-canvas";

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

        {/* Right — live map preview */}
        <div className="relative lg:w-1/2 min-h-72 lg:min-h-105 overflow-hidden group/map">
          <MapboxCanvas interactive={false} styleKey="terrain" className="absolute inset-0" />

          {/* Left fade blend into dark panel */}
          <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #1B4332, transparent)" }} />

          {/* Top fade */}
          <div className="absolute inset-x-0 top-0 h-10 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, rgba(27,67,50,0.4), transparent)" }} />

          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-10 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(27,67,50,0.3), transparent)" }} />

          {/* LIVE badge */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-primary">LIVE</span>
          </div>

          {/* Hover CTA */}
          <Link
            href="/map"
            className="absolute inset-0 z-20 flex items-end justify-center pb-5"
            aria-label="Xem bản đồ vùng trồng"
          >
            <span className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg translate-y-2 opacity-0 group-hover/map:opacity-100 group-hover/map:translate-y-0 transition-all duration-250">
              <MapPin size={13} /> Mở bản đồ đầy đủ
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
