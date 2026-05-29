"use client";

import Link from "next/link";
import { Leaf, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticlesBg } from "@/components/ui/particles-bg";

export function FarmerCta() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-rice-field.mp4" type="video/mp4" />
      </video>

      {/* Dark green overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(27,67,50,0.90) 0%, rgba(45,106,79,0.78) 100%)" }}
      />

      {/* Particles */}
      <ParticlesBg count={35} color="255,255,255" className="z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Nông dân đăng ký hoàn toàn miễn phí
        </h2>
        <p className="text-white/80 mb-8 text-lg max-w-2xl mx-auto">
          12 tháng đầu miễn phí 100% cho nông dân và HTX. Không cần thẻ tín dụng.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-primary hover:bg-surface-green" asChild>
            <Link href="/auth/register">
              <Leaf size={20} /> Đăng ký ngay — Miễn phí
            </Link>
          </Button>
          <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 border border-white/30" asChild>
            <Link href="/about">Tìm hiểu thêm</Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm">
          {["Miễn phí 12 tháng", "Không phí ẩn", "Hỗ trợ 24/7", "OTP bảo mật"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-primary-ultra-light" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
