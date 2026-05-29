"use client";

import Link from "next/link";
import {
  Leaf, CheckCircle, LayoutDashboard,
  TrendingDown, Users, Eye, Database, Wifi, Trash2,
  ShieldCheck, MapPin, QrCode,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth, ROLE_LABELS, ROLE_DASHBOARD } from "@/lib/auth-context";
import { RoleExplorer } from "./role-explorer";
import { MissionTimeline } from "./mission-timeline";
import { ParticlesBg } from "@/components/ui/particles-bg";

/* ─── Problem Statement ─────────────────────────────────────────── */

const PROBLEMS = [
  {
    icon: TrendingDown,
    stat: "4–6 tầng",
    title: "Chuỗi trung gian quá dài",
    desc: "Nông dân bán 2.000đ/kg thanh long, người tiêu dùng trả 25.000đ — chênh lệch 12 lần do chuỗi trung gian 4–6 tầng.",
  },
  {
    icon: Eye,
    stat: "0 minh bạch",
    title: "Thiếu minh bạch giá cả",
    desc: "Nông dân không biết giá thị trường thực tế. Thương lái độc quyền thông tin, ép giá mua thấp hơn thực tế 30–50%.",
  },
  {
    icon: QrCode,
    stat: "Không rõ nguồn gốc",
    title: "Không truy xuất nguồn gốc",
    desc: "Người tiêu dùng không biết nông sản đến từ đâu, ai trồng, canh tác thế nào — mở đường cho hàng giả, hàng không đạt chuẩn.",
  },
  {
    icon: Database,
    stat: "Manh mún",
    title: "Dữ liệu nông nghiệp rời rạc",
    desc: "Không có hệ thống tổng hợp dữ liệu sản lượng, giá cả, vùng trồng — khiến hoạch định chính sách và kinh doanh đều khó.",
  },
  {
    icon: Wifi,
    stat: "~70% nông thôn",
    title: "Khoảng cách công nghệ",
    desc: "Phần lớn nông dân Việt Nam ở vùng nông thôn thiếu công cụ số phù hợp, ngôn ngữ địa phương, giao diện thân thiện.",
  },
  {
    icon: Trash2,
    stat: "20–35% thất thoát",
    title: "Thất thoát sau thu hoạch",
    desc: "Thiếu kết nối logistics và thông tin thị trường khiến 20–35% nông sản bị hỏng hoặc bán dưới giá thành sau thu hoạch.",
  },
];


/* ─── Roadmap ───────────────────────────────────────────────────── */

const ROADMAP = [
  {
    phase: "01",
    period: "Tháng 1–6",
    label: "MVP & Thí điểm",
    color: "#52B788",
    items: [
      "Đăng ký / đăng nhập OTP",
      "Đăng sản phẩm & tìm kiếm",
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
      <section className="hero-gradient relative overflow-hidden">
        <ParticlesBg count={55} color="255,255,255" className="z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
            <Leaf size={16} className="text-primary-ultra-light" />
            <span className="text-white text-sm font-medium">Về AgriLink Vietnam</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Hệ sinh thái số nông nghiệp<br />
            <span className="text-primary-ultra-light">minh bạch, công bằng, bền vững</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            AgriLink kết nối 8.6 triệu hộ nông dân Việt Nam trực tiếp với người mua — loại bỏ bất bình đẳng thông tin đã tồn tại hàng thập kỷ trong chuỗi nông sản 53 tỷ USD.
          </p>
          {user && (
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2.5 text-white text-sm">
              <CheckCircle size={16} className="text-primary-ultra-light" />
              Xin chào, <strong className="mx-1">{user.full_name}</strong> · {ROLE_LABELS[user.role]}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Problem Statement ── */}
      <section className="bg-surface-soft border-y border-hairline py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="organic" className="mb-4">Bài toán cần giải</Badge>
            <h2 className="text-3xl font-bold text-ink mb-4">
              Nông nghiệp Việt Nam đang gặp phải gì?
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-sm leading-relaxed">
              53 tỷ USD giá trị xuất khẩu mỗi năm — nhưng nông dân vẫn là mắt xích thiệt thòi nhất.
              AgriLink ra đời để giải quyết 6 vấn đề cốt lõi này.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROBLEMS.map(({ icon: Icon, stat, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-hairline p-5 flex gap-4 hover:border-primary-light transition-colors"
                style={{ boxShadow: "0 2px 12px rgba(45,106,79,0.05)" }}
              >
                <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">{stat}</span>
                  <h3 className="text-sm font-bold text-ink mb-1 mt-0.5">{title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Values ── */}
      <MissionTimeline />

      {/* ── Roadmap ── */}
      <section className="bg-surface-soft border-y border-hairline py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="organic" className="mb-4">Lộ trình phát triển</Badge>
            <h2 className="text-3xl font-bold text-ink mb-4">Từ MVP đến hệ sinh thái đầy đủ</h2>
            <p className="text-muted text-sm max-w-xl mx-auto">
              3 giai đoạn trong 36 tháng — từ thí điểm 2 tỉnh đến 34 tỉnh thành với AI và blockchain.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-[#52B788] via-[#2D6A4F] to-[#1B4332]" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ROADMAP.map(({ phase, period, label, color, items }) => (
                <div key={phase} className="flex flex-col items-center text-center">
                  {/* Phase circle */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-5 relative z-10"
                    style={{ background: color, boxShadow: `0 4px 16px ${color}40` }}
                  >
                    {phase}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color }}>
                    {period}
                  </span>
                  <h3 className="text-base font-bold text-ink mb-4">{label}</h3>
                  <ul className="space-y-2 text-left w-full max-w-xs">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
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

      {/* ── Role Explorer ── */}
      <div className="border-t border-hairline bg-white">
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

      {/* ── Story + Impact ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-10">
          <Badge variant="vietgap" className="mb-4">Câu chuyện của chúng tôi</Badge>
          <h2 className="text-3xl font-bold text-ink mb-4">Tại sao AgriLink ra đời?</h2>
        </div>
        <div className="prose prose-sm max-w-none text-muted leading-relaxed space-y-4 mb-12">
          <p>
            Năm 2023, một kilogram thanh long ở Bình Thuận được nông dân bán cho thương lái <strong className="text-ink">2.000đ</strong>. Cùng lúc đó, người tiêu dùng ở TP.HCM trả <strong className="text-ink">25.000đ</strong> cho cùng sản phẩm tại siêu thị. Khoảng cách 12 lần này không phải logistics — mà là <em>sự bất bình đẳng thông tin</em>.
          </p>
          <p>
            AgriLink ra đời để phá vỡ sự bất bình đẳng này. Không phải bằng cách thêm một tầng trung gian khác, mà bằng cách trao lại thông tin cho từng người trong chuỗi giá trị — từ nông dân biết giá thị trường, đến người mua biết nguồn gốc sản phẩm, đến doanh nghiệp biết sản lượng vùng nguyên liệu.
          </p>
          <p>
            Dự án khởi nghiệp sinh viên, xây dựng từ Đà Nẵng — nhưng nhắm đến toàn bộ chuỗi cung ứng nông nghiệp Việt Nam với 53 tỷ USD giá trị xuất khẩu mỗi năm.
          </p>
        </div>

        {/* Impact numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: TrendingDown, value: "+15–30%", label: "Thu nhập nông dân tăng (mục tiêu)" },
            { icon: Users, value: "100.000+", label: "Nông dân đến 2027" },
            { icon: MapPin, value: "34 tỉnh", label: "Phủ sóng đến 2027" },
            { icon: ShieldCheck, value: "100%", label: "Giao dịch có truy xuất nguồn gốc" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-surface-green rounded-xl border border-primary-light p-4 text-center">
              <Icon size={20} className="text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-primary mb-1">{value}</div>
              <div className="text-xs text-muted leading-tight">{label}</div>
            </div>
          ))}
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
