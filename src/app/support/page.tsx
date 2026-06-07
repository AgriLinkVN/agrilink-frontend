"use client";
// Route: /support
// Anchors: #help, #guide, #contact, #report

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ShieldCheck,
  ShoppingBasket,
  CreditCard,
  ChevronRight,
  Sprout,
  ShoppingBag,
  Building2,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Send,
  CheckCircle2,
  HelpCircle,
  LifeBuoy,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/* ─── Help data ──────────────────────────────────────────────────────── */

const CATEGORIES = [
  {
    icon: BookOpen,
    title: "Bắt đầu sử dụng",
    color: "#2D6A4F",
    bg: "#F0FFF4",
    faqs: [
      { q: "Làm thế nào để tạo tài khoản AgriLink?", href: "#" },
      { q: "Tôi cần những gì để đăng ký là nông dân?", href: "#" },
      { q: "Hướng dẫn đăng sản phẩm lần đầu", href: "#" },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Tài khoản & Bảo mật",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    faqs: [
      { q: "Cách thay đổi mật khẩu tài khoản", href: "#" },
      { q: "Xác minh số điện thoại qua OTP", href: "#" },
      { q: "Tài khoản bị khóa — phải làm gì?", href: "#" },
    ],
  },
  {
    icon: ShoppingBasket,
    title: "Sàn nông sản",
    color: "#92400E",
    bg: "#FFFBEB",
    faqs: [
      { q: "Cách tìm kiếm sản phẩm theo vùng", href: "#" },
      { q: "Xem truy xuất nguồn gốc sản phẩm", href: "#" },
      { q: "Đặt hàng số lượng lớn cho doanh nghiệp", href: "#" },
    ],
  },
  {
    icon: CreditCard,
    title: "Thanh toán & Đơn hàng",
    color: "#7C3AED",
    bg: "#F5F3FF",
    faqs: [
      { q: "Các phương thức thanh toán được hỗ trợ", href: "#" },
      { q: "Theo dõi đơn hàng sau khi đặt", href: "#" },
      { q: "Chính sách hoàn tiền và đổi trả", href: "#" },
    ],
  },
];

/* ─── Guide data ─────────────────────────────────────────────────────── */

const FARMER_STEPS = [
  {
    num: 1,
    title: "Đăng ký bằng SĐT → Xác minh OTP",
    desc: "Nhập số điện thoại và xác thực qua mã OTP 6 số. Quá trình chỉ mất 2 phút.",
  },
  {
    num: 2,
    title: "Tạo hồ sơ nông dân + vùng trồng",
    desc: "Điền thông tin vùng canh tác, diện tích, loại cây trồng và chứng nhận (VietGAP, hữu cơ…).",
  },
  {
    num: 3,
    title: "Đăng sản phẩm với ảnh + giá",
    desc: "Tải ảnh, nhập tên, mô tả, giá niêm yết và số lượng sẵn có. Hệ thống tự tạo mã QR truy xuất.",
  },
  {
    num: 4,
    title: "Nhận đơn và xác nhận giao hàng",
    desc: "Xem đơn hàng mới trên dashboard, xác nhận và sắp xếp giao hàng qua đối tác logistics liên kết.",
  },
  {
    num: 5,
    title: "Nhận thanh toán qua ví/ngân hàng",
    desc: "Tiền được chuyển về ví AgriLink hoặc tài khoản ngân hàng của bạn sau khi người mua xác nhận nhận hàng.",
  },
];

const BUYER_STEPS = [
  {
    num: 1,
    title: "Tìm kiếm sản phẩm theo vùng/loại",
    desc: "Dùng bộ lọc theo tỉnh, loại nông sản, chứng nhận chất lượng hoặc giá để tìm đúng sản phẩm.",
  },
  {
    num: 2,
    title: "Xem nguồn gốc và chứng nhận",
    desc: "Quét mã QR hoặc xem chi tiết hồ sơ nông dân — địa chỉ canh tác, lịch sử kiểm định và đánh giá.",
  },
  {
    num: 3,
    title: "Đặt hàng và chọn logistics",
    desc: "Chọn số lượng, địa chỉ giao hàng, đơn vị vận chuyển và phương thức thanh toán phù hợp.",
  },
  {
    num: 4,
    title: "Đánh giá sau khi nhận hàng",
    desc: "Chấm điểm sản phẩm và nông dân để giúp cộng đồng có thêm thông tin đáng tin cậy.",
  },
];

const HTX_STEPS = [
  {
    num: 1,
    title: "Đăng ký tài khoản HTX với mã số",
    desc: "Cung cấp giấy phép hoạt động, thông tin ban lãnh đạo và số lượng thành viên để được xét duyệt.",
  },
  {
    num: 2,
    title: "Thêm thành viên và vùng trồng",
    desc: "Mời nông dân thành viên qua số điện thoại. Họ được liên kết vào tài khoản HTX sau khi chấp nhận.",
  },
  {
    num: 3,
    title: "Quản lý đơn hàng tập thể",
    desc: "Gộp sản phẩm từ nhiều thành viên vào một đơn hàng lớn, đàm phán giá và phân chia doanh thu tự động.",
  },
];

/* ─── Contact data ───────────────────────────────────────────────────── */

const CONTACT_SUBJECTS = [
  "Hỗ trợ kỹ thuật",
  "Hợp tác kinh doanh",
  "Báo cáo sự cố",
  "Khác",
];

/* ─── Report data ────────────────────────────────────────────────────── */

type ReporterType = "farmer" | "buyer" | "business";

const REPORTER_OPTIONS: { value: ReporterType; label: string; desc: string }[] = [
  { value: "farmer", label: "Nông dân", desc: "Tôi là người sản xuất / bán hàng" },
  { value: "buyer", label: "Người mua", desc: "Tôi là người mua sản phẩm" },
  { value: "business", label: "Đơn vị kinh doanh", desc: "Tổ chức, doanh nghiệp, HTX" },
];

const INCIDENT_TYPES = [
  "Gian lận thông tin",
  "Sản phẩm kém chất lượng",
  "Lỗi thanh toán",
  "Vấn đề kỹ thuật",
  "Khác",
];

/* ─── Sub-components ────────────────────────────────────────────────── */

function StepItem({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
        {num}
      </div>
      <div className="pb-5 border-b border-hairline flex-1 last:border-0 last:pb-0">
        <h4 className="font-semibold text-ink mb-1 text-sm">{title}</h4>
        <p className="text-muted text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

const INPUT_CLS =
  "w-full border border-hairline rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors";

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function SupportPage() {
  /* contact form */
  const [contact, setContact] = useState({ name: "", email: "", subject: "", message: "" });
  /* report form */
  const [report, setReport] = useState({
    reporterType: "" as ReporterType | "",
    incidentType: "",
    description: "",
    contactInfo: "",
  });
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Đã gửi! Chúng tôi sẽ phản hồi trong 2 giờ.");
    setContact({ name: "", email: "", subject: "", message: "" });
  }

  function handleReportSubmit(e: React.FormEvent) {
    e.preventDefault();
    setReportLoading(true);
    setTimeout(() => {
      setReportLoading(false);
      setReportSubmitted(true);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* ════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════ */}
      <section className="hero-gradient relative overflow-hidden py-20">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(82,183,136,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
            <LifeBuoy size={16} className="text-primary-ultra-light" />
            <span className="text-white text-sm font-medium">Hỗ trợ 24/7</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Hỗ trợ &amp; Trung tâm trợ giúp
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
            Mọi thứ bạn cần để sử dụng AgriLink hiệu quả
          </p>

          {/* Anchor pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { href: "#help", label: "Trợ giúp" },
              { href: "#guide", label: "Hướng dẫn" },
              { href: "#contact", label: "Liên hệ" },
              { href: "#report", label: "Báo cáo" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48L1440 48L1440 16C1200 48 960 0 720 16C480 32 240 0 0 16L0 48Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION: HELP  #help
      ════════════════════════════════════════════════════════════════ */}
      <section id="help" className="bg-white py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary mb-3">
              <HelpCircle size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Trợ giúp</span>
            </div>
            <h2 className="text-3xl font-bold text-ink mb-2">Trung tâm trợ giúp</h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Duyệt qua các danh mục hoặc tìm câu trả lời cho vấn đề cụ thể của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CATEGORIES.map(({ icon: Icon, title, color, bg, faqs }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-hairline p-5 card-shadow-hover"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: bg }}
                  >
                    <Icon size={22} style={{ color }} />
                  </div>
                  <h3 className="font-semibold text-ink text-base">{title}</h3>
                </div>
                <ul className="space-y-1">
                  {faqs.map(({ q, href }) => (
                    <li key={q}>
                      <Link
                        href={href}
                        className="flex items-center gap-2 text-sm text-body-text hover:text-primary py-2 px-3 rounded-lg hover:bg-surface-green transition-colors group"
                      >
                        <ChevronRight
                          size={14}
                          className="text-muted group-hover:text-primary shrink-0"
                        />
                        <span>{q}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION: GUIDE  #guide
      ════════════════════════════════════════════════════════════════ */}
      <section id="guide" className="bg-surface-soft py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary mb-3">
              <BookOpen size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Hướng dẫn</span>
            </div>
            <h2 className="text-3xl font-bold text-ink mb-2">Hướng dẫn sử dụng AgriLink</h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Từng bước rõ ràng cho mọi đối tượng — nông dân, người mua và hợp tác xã
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Nông dân */}
            <div className="bg-white rounded-2xl border border-hairline p-6 card-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#F0FFF4" }}>
                  <Sprout size={22} style={{ color: "#2D6A4F" }} />
                </div>
                <div>
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: "#F0FFF4", color: "#2D6A4F" }}
                  >
                    5 bước
                  </span>
                  <h3 className="font-bold text-ink text-base mt-0.5">Nông dân</h3>
                </div>
              </div>
              <div className="space-y-0">
                {FARMER_STEPS.map((step) => (
                  <StepItem key={step.num} {...step} />
                ))}
              </div>
            </div>

            {/* Người mua */}
            <div className="bg-white rounded-2xl border border-hairline p-6 card-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#EFF6FF" }}>
                  <ShoppingBag size={22} style={{ color: "#1D4ED8" }} />
                </div>
                <div>
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: "#EFF6FF", color: "#1D4ED8" }}
                  >
                    4 bước
                  </span>
                  <h3 className="font-bold text-ink text-base mt-0.5">Người mua</h3>
                </div>
              </div>
              <div className="space-y-0">
                {BUYER_STEPS.map((step) => (
                  <StepItem key={step.num} {...step} />
                ))}
              </div>
            </div>

            {/* HTX */}
            <div className="bg-white rounded-2xl border border-hairline p-6 card-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "#FFFBEB" }}>
                  <Building2 size={22} style={{ color: "#92400E" }} />
                </div>
                <div>
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: "#FFFBEB", color: "#92400E" }}
                  >
                    3 bước
                  </span>
                  <h3 className="font-bold text-ink text-base mt-0.5">HTX</h3>
                </div>
              </div>
              <div className="space-y-0">
                {HTX_STEPS.map((step) => (
                  <StepItem key={step.num} {...step} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION: CONTACT  #contact
      ════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="bg-white py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary mb-3">
              <Mail size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Liên hệ</span>
            </div>
            <h2 className="text-3xl font-bold text-ink mb-2">Liên hệ chúng tôi</h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Đội ngũ AgriLink luôn sẵn sàng hỗ trợ bạn — phản hồi trong 2 giờ làm việc
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left: contact info */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-hairline p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-ink">0236 3xx xxxx</p>
                  <p className="text-xs text-muted mt-0.5">Thứ 2–6, 8h–17h</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-hairline p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <a href="mailto:hello@agrilink.vn" className="font-semibold text-primary hover:underline">
                    hello@agrilink.vn
                  </a>
                  <p className="text-xs text-muted mt-0.5">Phản hồi trong 2 giờ làm việc</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-hairline p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-green flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-ink">Đà Nẵng, Việt Nam</p>
                  <p className="text-xs text-muted mt-0.5">Dự án khởi nghiệp sinh viên</p>
                </div>
              </div>
            </div>

            {/* Right: contact form */}
            <div className="bg-white rounded-2xl border border-hairline p-6 card-shadow">
              <h3 className="text-lg font-bold text-ink mb-1">Gửi tin nhắn</h3>
              <p className="text-muted text-sm mb-6">Điền form và chúng tôi sẽ liên hệ lại sớm nhất.</p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Họ và tên <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))}
                      required
                      placeholder="Nguyễn Văn A"
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Email <span className="text-error">*</span>
                    </label>
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                      required
                      placeholder="email@example.com"
                      className={INPUT_CLS}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Chủ đề <span className="text-error">*</span>
                  </label>
                  <select
                    value={contact.subject}
                    onChange={(e) => setContact((p) => ({ ...p, subject: e.target.value }))}
                    required
                    className={`${INPUT_CLS} bg-white`}
                  >
                    <option value="">-- Chọn chủ đề --</option>
                    {CONTACT_SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Nội dung <span className="text-error">*</span>
                  </label>
                  <textarea
                    value={contact.message}
                    onChange={(e) => setContact((p) => ({ ...p, message: e.target.value }))}
                    required
                    rows={5}
                    placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..."
                    className={`${INPUT_CLS} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-active transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Gửi tin nhắn
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION: REPORT  #report
      ════════════════════════════════════════════════════════════════ */}
      <section id="report" className="bg-surface-soft py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-error mb-3">
              <AlertTriangle size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Báo cáo</span>
            </div>
            <h2 className="text-3xl font-bold text-ink mb-2">Báo cáo sự cố</h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Giúp AgriLink duy trì môi trường giao dịch an toàn và minh bạch cho mọi người
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: report form (col-span-2) */}
            <div className="lg:col-span-2">
              {reportSubmitted ? (
                <div className="bg-white rounded-2xl border border-hairline p-10 text-center card-shadow">
                  <div className="w-16 h-16 rounded-full bg-surface-green flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-2">Đã ghi nhận</h3>
                  <p className="text-muted text-sm mb-6 max-w-sm mx-auto">
                    Đội ngũ kiểm duyệt AgriLink sẽ xem xét báo cáo của bạn và phản hồi trong vòng 24 giờ làm việc.
                  </p>
                  <button
                    onClick={() => {
                      setReportSubmitted(false);
                      setReport({ reporterType: "", incidentType: "", description: "", contactInfo: "" });
                    }}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    Gửi báo cáo khác
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-hairline p-6 card-shadow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                      <ShieldAlert size={20} className="text-error" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ink text-lg">Mẫu báo cáo sự cố</h3>
                      <p className="text-muted text-xs">Thông tin của bạn được bảo mật hoàn toàn</p>
                    </div>
                  </div>

                  <form onSubmit={handleReportSubmit} className="space-y-6">

                    {/* Reporter type */}
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-3">
                        Bạn là <span className="text-error">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {REPORTER_OPTIONS.map(({ value, label, desc }) => (
                          <label
                            key={value}
                            className={`flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              report.reporterType === value
                                ? "border-primary bg-surface-green"
                                : "border-hairline hover:border-primary-light"
                            }`}
                          >
                            <input
                              type="radio"
                              name="reporterType"
                              value={value}
                              checked={report.reporterType === value}
                              onChange={(e) =>
                                setReport((p) => ({ ...p, reporterType: e.target.value as ReporterType }))
                              }
                              className="sr-only"
                              required
                            />
                            <span className="font-semibold text-sm text-ink">{label}</span>
                            <span className="text-xs text-muted leading-tight">{desc}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Incident type */}
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-1.5">
                        Loại sự cố <span className="text-error">*</span>
                      </label>
                      <select
                        value={report.incidentType}
                        onChange={(e) => setReport((p) => ({ ...p, incidentType: e.target.value }))}
                        required
                        className={`${INPUT_CLS} bg-white`}
                      >
                        <option value="">-- Chọn loại sự cố --</option>
                        {INCIDENT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-1.5">
                        Mô tả sự cố <span className="text-error">*</span>
                      </label>
                      <textarea
                        value={report.description}
                        onChange={(e) => setReport((p) => ({ ...p, description: e.target.value }))}
                        required
                        rows={5}
                        placeholder="Mô tả chi tiết sự cố (tối thiểu 50 ký tự): thời gian, đối tượng liên quan, bằng chứng…"
                        className={`${INPUT_CLS} resize-none`}
                      />
                      <p className="text-xs text-muted mt-1">Càng chi tiết, chúng tôi càng xử lý nhanh hơn.</p>
                    </div>

                    {/* Contact info */}
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-1.5">
                        Thông tin liên hệ{" "}
                        <span className="text-muted font-normal">(tuỳ chọn)</span>
                      </label>
                      <input
                        type="text"
                        value={report.contactInfo}
                        onChange={(e) => setReport((p) => ({ ...p, contactInfo: e.target.value }))}
                        placeholder="Số điện thoại hoặc email để chúng tôi phản hồi"
                        className={INPUT_CLS}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reportLoading}
                      className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-active transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {reportLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                      {reportLoading ? "Đang gửi…" : "Gửi báo cáo"}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Right: sidebar (col-span-1) */}
            <div className="space-y-4">

              {/* Emergency card */}
              <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={18} className="text-error" />
                  <h3 className="font-bold text-error text-sm">Sự cố khẩn cấp?</h3>
                </div>
                <p className="text-sm text-red-700 mb-4 leading-relaxed">
                  Nếu bạn đang bị lừa đảo hoặc mất tiền ngay lúc này, hãy gọi hotline khẩn cấp ngay.
                </p>
                <a
                  href="tel:02363xxxxxx"
                  className="flex items-center gap-2 bg-error text-white px-4 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity w-full justify-center"
                >
                  <Phone size={16} />
                  0236 3xx xxxx
                </a>
              </div>

              {/* Response time table */}
              <div className="bg-white rounded-2xl border border-hairline p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-primary" />
                  <h3 className="font-semibold text-ink text-sm">Thời gian xử lý</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { type: "Khẩn cấp", time: "< 2 giờ", urgent: true },
                    { type: "Bình thường", time: "< 24 giờ", urgent: false },
                    { type: "Phản hồi chung", time: "< 72 giờ", urgent: false },
                  ].map(({ type, time, urgent }) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-muted text-xs">{type}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          urgent
                            ? "bg-red-50 text-error"
                            : "bg-surface-green text-primary"
                        }`}
                      >
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anonymous note */}
              <div className="bg-surface-green rounded-2xl border border-primary-light p-5">
                <div className="flex items-start gap-3">
                  <ShieldAlert size={18} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-ink text-sm mb-1">Báo cáo ẩn danh</h4>
                    <p className="text-xs text-muted leading-relaxed">
                      Bạn không bắt buộc để lại thông tin liên hệ. Mọi báo cáo đều được xem xét nghiêm túc, kể cả ẩn danh.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
