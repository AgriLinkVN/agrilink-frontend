import Link from "next/link";
import { Leaf, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FarmerCta() {
  return (
    <section className="hero-gradient py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
