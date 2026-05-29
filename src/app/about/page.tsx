"use client";

import Link from "next/link";
import {
  Leaf, Target, Heart, Globe, CheckCircle, LayoutDashboard,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth, ROLE_LABELS, ROLE_DASHBOARD } from "@/lib/auth-context";
import { RoleExplorer } from "./role-explorer";

/* ─── Shared static data ──────────────────────────────────────── */

const MISSION_VALUES = [
  {
    icon: Target,
    title: "Sứ mệnh",
    desc: "Xoá bỏ bất bình đẳng thông tin trong chuỗi giá trị nông sản. Mỗi nông dân Việt Nam xứng đáng biết giá thực của mặt hàng mình trồng.",
  },
  {
    icon: Heart,
    title: "Giá trị cốt lõi",
    desc: "Minh bạch — Công bằng — Bền vững. Ba nguyên tắc chi phối mọi quyết định thiết kế, vận hành và phát triển sản phẩm của AgriLink.",
  },
  {
    icon: Globe,
    title: "Tầm nhìn",
    desc: "Đến 2030, trở thành hạ tầng số nông nghiệp của Đông Nam Á — nơi mọi giao dịch nông sản đều được số hoá, truy xuất và bảo đảm.",
  },
];

const PLATFORM_STATS = [
  { value: "8.6M+", label: "Hộ nông dân tiềm năng" },
  { value: "34", label: "Tỉnh thành trọng điểm" },
  { value: "7", label: "Nhóm đối tượng phục vụ" },
  { value: "53B USD", label: "Giá trị xuất khẩu 2023" },
];

const TEAM = [
  { name: "Trung Lê", role: "Founder & Full-stack Dev", avatar: "T" },
  { name: "AgriLink Team", role: "Product · Design · Data", avatar: "A" },
];

/* ─── Page ─────────────────────────────────────────────────────── */

export default function AboutPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
            <Leaf size={16} className="text-primary-ultra-light" />
            <span className="text-white text-sm font-medium">Về AgriLink Vietnam</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Hệ sinh thái số nông nghiệp<br />
            <span className="text-primary-ultra-light">minh bạch, công bằng, bền vững</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            AgriLink kết nối 8.6 triệu hộ nông dân Việt Nam trực tiếp với người mua, doanh nghiệp và thị trường — loại bỏ sự bất bình đẳng thông tin đã tồn tại hàng thập kỷ.
          </p>
          {user && (
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2.5 text-white text-sm">
              <CheckCircle size={16} className="text-primary-ultra-light" />
              Xin chào, <strong className="mx-1">{user.full_name}</strong> · {ROLE_LABELS[user.role]}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORM_STATS.map(({ value, label }) => (
            <div key={label} className="bg-white rounded-xl border border-hairline p-6 card-shadow text-center">
              <div className="text-2xl font-bold text-primary mb-1">{value}</div>
              <div className="text-xs text-muted">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission & Values ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MISSION_VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-surface-soft rounded-xl border border-hairline p-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-base font-bold text-ink mb-2">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Role Explorer — interactive, works for both guest & logged-in ── */}
      <div className="border-t border-hairline bg-surface-soft">
        <RoleExplorer currentRole={user?.role} />
      </div>

      {/* ── Extra content for logged-in users ── */}
      {user && (
        <section className="bg-white border-y border-hairline py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-surface-green rounded-2xl border border-primary-light p-6">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                <span className="text-white text-2xl font-bold">{user.full_name.charAt(0)}</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm text-muted mb-1">Đang đăng nhập với vai trò</p>
                <h3 className="text-lg font-bold text-ink">{user.full_name}</h3>
                <p className="text-sm text-primary font-medium">{ROLE_LABELS[user.role]}</p>
              </div>
              <Button asChild className="shrink-0">
                <Link href={ROLE_DASHBOARD[user.role]}>
                  <LayoutDashboard size={16} /> Vào Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── Story ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-10">
          <Badge variant="vietgap" className="mb-4">Câu chuyện của chúng tôi</Badge>
          <h2 className="text-3xl font-bold text-ink mb-4">Tại sao AgriLink ra đời?</h2>
        </div>
        <div className="prose prose-sm max-w-none text-muted leading-relaxed space-y-4">
          <p>
            Năm 2023, một kilogram thanh long ở Bình Thuận được nông dân bán cho thương lái <strong className="text-ink">2,000đ</strong>. Cùng lúc đó, người tiêu dùng ở TP.HCM trả <strong className="text-ink">25,000đ</strong> cho cùng sản phẩm tại siêu thị. Khoảng cách 12 lần này không phải logistics — mà là <em>sự bất bình đẳng thông tin</em>.
          </p>
          <p>
            AgriLink ra đời để phá vỡ sự bất bình đẳng này. Không phải bằng cách thêm một tầng trung gian khác, mà bằng cách trao lại thông tin cho từng người trong chuỗi giá trị — từ nông dân biết giá thị trường, đến người mua biết nguồn gốc sản phẩm, đến doanh nghiệp biết sản lượng vùng nguyên liệu.
          </p>
          <p>
            Dự án khởi nghiệp sinh viên, xây dựng từ Đà Nẵng — nhưng nhắm đến toàn bộ chuỗi cung ứng nông nghiệp Việt Nam với 53 tỷ USD giá trị xuất khẩu mỗi năm.
          </p>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-surface-soft border-y border-hairline py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-ink mb-2">Đội ngũ</h2>
            <p className="text-muted text-sm">Những người xây dựng AgriLink</p>
          </div>
          <div className="flex justify-center gap-6 flex-wrap">
            {TEAM.map(({ name, role, avatar }) => (
              <div key={name} className="bg-white rounded-xl border border-hairline p-6 text-center w-44 card-shadow">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                  {avatar}
                </div>
                <p className="text-sm font-semibold text-ink">{name}</p>
                <p className="text-xs text-muted mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA bottom ── */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {user
              ? `Sẵn sàng bắt đầu, ${user.full_name.split(" ").slice(-1)[0]}?`
              : "Tham gia AgriLink ngay hôm nay"}
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            {user
              ? `Truy cập dashboard ${ROLE_LABELS[user.role]} để sử dụng đầy đủ tính năng.`
              : "12 tháng đầu miễn phí cho nông dân và HTX. Không cần thẻ tín dụng."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button size="lg" className="bg-white text-primary hover:bg-surface-green" asChild>
                <Link href={ROLE_DASHBOARD[user.role]}>
                  <LayoutDashboard size={20} /> Vào Dashboard của tôi
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="bg-white text-primary hover:bg-surface-green" asChild>
                  <Link href="/auth/register">
                    <Leaf size={20} /> Đăng ký miễn phí
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 border border-white/30" asChild>
                  <Link href="/marketplace">Khám phá sàn nông sản</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
