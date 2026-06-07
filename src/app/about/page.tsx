"use client";

import Link from "next/link";
import {
  Leaf, CheckCircle, LayoutDashboard,
  TrendingDown, Users, ShieldCheck, MapPin,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { useAuth, ROLE_LABELS, ROLE_DASHBOARD } from "@/lib/auth-context";
import { RoleExplorer } from "./role-explorer";
import { MissionTimeline } from "./mission-timeline";
import { ProblemCurve } from "./problem-curve";
import { TeamOrbit } from "./team-orbit";
import { ParticlesBg } from "@/components/ui/particles-bg";


/* ─── Roadmap ───────────────────────────────────────────────────── */

const ROADMAP = [
  {
    phase: "01",
    period: "Tháng 1–6",
    label: "MVP & Thí điểm",
    color: "#52B788",
    items: [
      "Đăng ký / đăng nhập OTP",
      "Đăng sản phẩm &amp; tìm kiếm",
      "Xem giá thị trường cơ bản",
      "Chat trực tiếp người mua – bán",
      "Thí điểm 2–3 tỉnh thành",
    ],
  },
  {
    phase: "02",
    period: "Tháng 6–18",
    label: "Mở rộng tính năng",
    color: "#2D6A4F",
    items: [
      "Bản đồ GIS 34 tỉnh trọng điểm",
      "Mã QR truy xuất nguồn gốc",
      "Kết nối logistics GHN / Viettel Post",
      "Dashboard HTX quản lý thành viên",
      "Mở rộng 10–15 tỉnh thành",
    ],
  },
  {
    phase: "03",
    period: "Tháng 18–36",
    label: "AI & Hệ sinh thái đầy đủ",
    color: "#1B4332",
    items: [
      "AI dự báo giá & sản lượng 4–8 tuần",
      "Phát hiện sâu bệnh bằng Computer Vision",
      "Blockchain truy xuất nguồn gốc bất biến",
      "IoT cảm biến đất, thời tiết thực tế",
      "100.000 nông dân — 34 tỉnh thành",
    ],
  },
];

/* ─── Team ──────────────────────────────────────────────────────── */

const TEAM = [
  { name: "Trung Lê", role: "Founder & Full-stack Dev", avatar: "T" },
  { name: "AgriLink Team", role: "Product · Design · Data", avatar: "A" },
];

/* ─── Page ──────────────────────────────────────────────────────── */

export default function AboutPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* ── Hero ── */}
      <PageHero variant="compact">
        <div className="flex items-center justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-4">
              <Leaf size={16} className="text-primary-ultra-light" />
              <span className="text-white text-sm font-medium">Về AgriLink Vietnam</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
              Hệ sinh thái số nông nghiệp<br />
              <span className="text-primary-ultra-light">minh bạch, công bằng, bền vững</span>
            </h1>
            <p className="text-white/80 text-sm max-w-xl mx-auto">
              AgriLink kết nối 8.6 triệu hộ nông dân Việt Nam trực tiếp với người mua — loại bỏ bất bình đẳng thông tin đã tồn tại hàng thập kỷ trong chuỗi nông sản 53 tỷ USD.
            </p>
            {user && (
              <div className="mt-4 inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2 text-white text-sm">
                <CheckCircle size={15} className="text-primary-ultra-light" />
                Xin chào, <strong className="mx-1">{user.full_name}</strong> · {ROLE_LABELS[user.role]}
              </div>
            )}
          </div>
        </div>
      </PageHero>

      {/* ── Problem Statement ── */}
      <ProblemCurve />

      {/* ── Mission & Values ── */}
      <MissionTimeline />

      {/* ── Roadmap — video background ── */}
      <section className="relative py-20 overflow-hidden">
        {/* Video bg */}
        <video autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-rice-field.mp4" type="video/mp4" />
        </video>
        {/* Dark green overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(27,67,50,0.88) 0%, rgba(45,106,79,0.80) 100%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/30 mb-4">
              Lộ trình phát triển
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">Từ MVP đến hệ sinh thái đầy đủ</h2>
            <p className="text-white/70 text-sm max-w-xl mx-auto">
              3 giai đoạn trong 36 tháng — từ thí điểm 2 tỉnh đến 34 tỉnh thành với AI và blockchain.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-[16.5%] right-[16.5%] h-px bg-linear-to-r from-white/20 via-white/50 to-white/20" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ROADMAP.map(({ phase, period, label, color, items }) => (
                <div key={phase} className="flex flex-col items-center text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-5 relative z-10 border-2 border-white/30"
                    style={{ background: color, boxShadow: `0 4px 20px ${color}60` }}
                  >
                    {phase}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider mb-1 text-white/60">
                    {period}
                  </span>
                  <h3 className="text-base font-bold text-white mb-4">{label}</h3>
                  <ul className="space-y-2 text-left w-full max-w-xs">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-white/75">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Role Explorer — floating leaf particles ── */}
      <div className="relative overflow-hidden border-t border-hairline" style={{ background: "#F0FFF4" }}>
        <ParticlesBg count={30} color="45,106,79" className="z-0 opacity-40" />
        <div className="relative z-10">
          <RoleExplorer currentRole={user?.role} />
        </div>
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

      {/* ── Story + Impact — split dark/light ── */}
      <section className="overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-120">
          {/* Left — dark story panel */}
          <div className="relative lg:w-1/2 py-16 px-8 lg:px-12 flex flex-col justify-center overflow-hidden"
            style={{ background: "#1B4332" }}>
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }} />
            <div className="relative z-10 max-w-lg">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/20 mb-6">
                Câu chuyện của chúng tôi
              </span>
              <h2 className="text-3xl font-bold text-white mb-6">Tại sao AgriLink ra đời?</h2>
              <div className="space-y-4 text-white/75 text-sm leading-relaxed">
                <p>
                  Năm 2023, một kilogram thanh long ở Bình Thuận được nông dân bán cho thương lái <strong className="text-white">2.000đ</strong>. Người tiêu dùng ở TP.HCM trả <strong className="text-white">25.000đ</strong> cho cùng sản phẩm. Khoảng cách 12 lần — không phải logistics, mà là <em className="text-primary-ultra-light">bất bình đẳng thông tin</em>.
                </p>
                <p>
                  AgriLink trao lại thông tin cho từng người: nông dân biết giá thị trường, người mua biết nguồn gốc, doanh nghiệp biết sản lượng vùng nguyên liệu.
                </p>
                <p className="text-white/50 text-xs">
                  Dự án khởi nghiệp sinh viên từ Đà Nẵng — nhắm đến 53 tỷ USD chuỗi nông sản Việt Nam.
                </p>
              </div>
            </div>
          </div>

          {/* Right — light impact panel */}
          <div className="lg:w-1/2 py-16 px-8 lg:px-12 flex flex-col justify-center bg-white">
            <h3 className="text-xl font-bold text-ink mb-8">Tác động kỳ vọng</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: TrendingDown, value: "+15–30%", label: "Thu nhập nông dân tăng", color: "#2D6A4F" },
                { icon: Users, value: "100.000+", label: "Nông dân đến 2027", color: "#40916C" },
                { icon: MapPin, value: "34 tỉnh", label: "Phủ sóng đến 2027", color: "#52B788" },
                { icon: ShieldCheck, value: "100%", label: "Giao dịch có truy xuất", color: "#1B4332" },
              ].map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="rounded-2xl p-5 border border-hairline hover:border-primary-light transition-colors"
                  style={{ background: `${color}08` }}>
                  <Icon size={22} className="mb-3" style={{ color }} />
                  <div className="text-2xl font-bold mb-1" style={{ color }}>{value}</div>
                  <div className="text-xs text-muted leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    

      {/* ── Team ── */}
      <TeamOrbit />

      {/* ── CTA bottom — video background ── */}
      <section className="relative py-20 overflow-hidden">
        <video autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-rice-field.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(27,67,50,0.90) 0%, rgba(45,106,79,0.78) 100%)" }} />
        <ParticlesBg count={35} color="255,255,255" className="z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {user
              ? `Sẵn sàng bắt đầu, ${user.full_name.split(" ").slice(-1)[0]}?`
              : "Cùng xây dựng nền nông nghiệp minh bạch hơn"}
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            {user
              ? `Truy cập dashboard ${ROLE_LABELS[user.role]} để sử dụng đầy đủ tính năng.`
              : "12 tháng đầu miễn phí cho nông dân và HTX. Đến 2030, AgriLink hướng đến hạ tầng số nông nghiệp toàn Đông Nam Á."}
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
