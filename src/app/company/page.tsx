// Server component — no "use client"
// Route: /company
// Anchors: #careers, #blog, #partners

import Link from "next/link";
import {
  Heart,
  BookOpen,
  Wifi,
  Briefcase,
  MapPin,
  Mail,
  Leaf,
  Calendar,
  ArrowRight,
  Truck,
  CreditCard,
  Award,
  CheckCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// ─── Careers data ───────────────────────────────────────────────────────────

const VALUES = [
  {
    icon: Heart,
    title: "Làm việc có ý nghĩa",
    desc: "Mỗi dòng code bạn viết tác động trực tiếp đến cuộc sống của hàng triệu nông dân Việt Nam. Đây không chỉ là công việc — đây là sứ mệnh.",
  },
  {
    icon: BookOpen,
    title: "Học hỏi liên tục",
    desc: "Môi trường startup nơi bạn tiếp xúc đầy đủ stack công nghệ: Next.js, FastAPI, GIS, AI/ML. Chúng tôi trả tiền cho khóa học và sách kỹ thuật.",
  },
  {
    icon: Wifi,
    title: "Remote-friendly",
    desc: "Làm việc từ bất kỳ đâu trên lãnh thổ Việt Nam. Họp team online mỗi sáng thứ Hai, phần còn lại là async và tự chủ.",
  },
];

const JOBS = [
  {
    title: "Full-stack Developer",
    stack: "React + Node.js",
    location: "Remote",
    type: "Toàn thời gian",
    desc: "Xây dựng và duy trì nền tảng AgriLink — từ giao diện người dùng đến API backend và cơ sở dữ liệu PostgreSQL. Yêu cầu tối thiểu 1 năm kinh nghiệm với React.",
  },
  {
    title: "Data Engineer",
    stack: "Python + SQL",
    location: "Đà Nẵng",
    type: "Toàn thời gian",
    desc: "Xây dựng pipeline dữ liệu nông sản, tích hợp dữ liệu giá thị trường từ Bộ NN&PTNT, triển khai mô hình dự báo giá. Yêu cầu thành thạo Python và PostgreSQL.",
  },
  {
    title: "UI/UX Designer",
    stack: "Figma",
    location: "Remote",
    type: "Bán thời gian",
    desc: "Thiết kế trải nghiệm người dùng cho ứng dụng phục vụ nông dân — đơn giản, trực quan, phù hợp với người dùng nông thôn. Portfolio thiết kế mobile là bắt buộc.",
  },
];

// ─── Blog data ───────────────────────────────────────────────────────────────

const FEATURED = {
  title: "AgriLink ra mắt: Hành trình số hóa chuỗi nông sản Việt",
  date: "15/01/2025",
  tag: "Tin tức",
  excerpt:
    "Sau hơn 6 tháng nghiên cứu và phát triển, AgriLink chính thức ra mắt phiên bản beta — nền tảng kết nối trực tiếp hàng triệu nông dân Việt Nam với người mua trên toàn quốc. Chúng tôi bắt đầu hành trình số hóa chuỗi nông sản 53 tỷ USD với sứ mệnh xóa bỏ bất bình đẳng thông tin đã tồn tại hàng thập kỷ.",
};

const POSTS = [
  {
    title: "5 lý do nông dân nên dùng nền tảng số",
    date: "20/01/2025",
    tag: "Kiến thức",
    excerpt:
      "Từ nắm bắt giá thị trường đến mở rộng kênh phân phối, công nghệ số đang mang lại lợi thế cạnh tranh rõ ràng cho người nông dân hiện đại.",
  },
  {
    title: "Hướng dẫn đăng ký VietGAP cho hộ nhỏ",
    date: "25/01/2025",
    tag: "Hướng dẫn",
    excerpt:
      "Quy trình đăng ký VietGAP không còn phức tạp nếu bạn chuẩn bị đúng hồ sơ. Bài viết này hướng dẫn chi tiết từng bước cho hộ canh tác dưới 1 ha.",
  },
  {
    title: "Bản đồ GIS: Công cụ không thể thiếu cho HTX",
    date: "01/02/2025",
    tag: "Công nghệ",
    excerpt:
      "GIS không chỉ dành cho nhà khoa học — các HTX nông nghiệp đang dùng bản đồ số để lên kế hoạch mùa vụ, theo dõi diện tích và dự báo sản lượng.",
  },
  {
    title: "Thị trường nông sản ASEAN: Cơ hội cho Việt Nam",
    date: "10/02/2025",
    tag: "Phân tích",
    excerpt:
      "Với vị thế top 3 xuất khẩu gạo toàn cầu, Việt Nam có lợi thế cạnh tranh rõ ràng. Nhưng để tận dụng thị trường ASEAN 680 triệu dân, cần chuỗi cung ứng minh bạch hơn.",
  },
  {
    title: "Giảm thất thoát sau thu hoạch với logistics số",
    date: "15/02/2025",
    tag: "Giải pháp",
    excerpt:
      "Việt Nam mất khoảng 30% sản lượng nông sản mỗi năm do thất thoát sau thu hoạch. Logistics số và cold chain đang thay đổi con số đáng lo ngại này.",
  },
];

const TAG_COLORS: Record<string, string> = {
  "Tin tức": "bg-blue-50 text-blue-700 border-blue-200",
  "Kiến thức": "bg-[#F0FFF4] text-[#2D6A4F] border-[#2D6A4F]/20",
  "Hướng dẫn": "bg-orange-50 text-orange-700 border-orange-200",
  "Công nghệ": "bg-purple-50 text-purple-700 border-purple-200",
  "Phân tích": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Giải pháp": "bg-teal-50 text-teal-700 border-teal-200",
};

// ─── Partners data ────────────────────────────────────────────────────────────

const PARTNER_CATEGORIES = [
  {
    icon: Truck,
    title: "Logistics",
    partners: ["GHN", "Viettel Post", "GHTK"],
  },
  {
    icon: CreditCard,
    title: "Thanh toán",
    partners: ["VNPay", "MoMo", "ZaloPay"],
  },
  {
    icon: Award,
    title: "Chứng nhận",
    partners: ["VietGAP", "GlobalGAP", "Bộ NN&PTNT"],
  },
];

const PARTNER_BENEFITS = [
  "Tiếp cận 8.6 triệu nông dân, HTX và doanh nghiệp thu mua trên AgriLink",
  "Logo hiển thị trên AgriLink và tài liệu marketing chính thức",
  "Ưu đãi API tích hợp và hỗ trợ kỹ thuật ưu tiên",
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero-gradient relative overflow-hidden py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            AgriLink Vietnam
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
            Tuyển dụng · Blog nông nghiệp · Đối tác
          </p>
          {/* Anchor pills */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="#careers"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold rounded-full px-5 py-2 hover:bg-white/25 transition-colors"
            >
              <Briefcase size={15} /> Tuyển dụng
            </Link>
            <Link
              href="#blog"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold rounded-full px-5 py-2 hover:bg-white/25 transition-colors"
            >
              <BookOpen size={15} /> Blog
            </Link>
            <Link
              href="#partners"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-semibold rounded-full px-5 py-2 hover:bg-white/25 transition-colors"
            >
              <Award size={15} /> Đối tác
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CAREERS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="careers" className="bg-white py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink mb-3">
              Cùng xây dựng tương lai nông nghiệp Việt Nam
            </h2>
            <p className="text-muted text-sm max-w-xl mx-auto">
              AgriLink đang tìm kiếm những người tin rằng công nghệ có thể thay đổi cuộc sống của 8.6 triệu hộ nông dân.
            </p>
          </div>

          {/* Culture cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-hairline p-6 hover:border-[#2D6A4F] transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F0FFF4] flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#2D6A4F]" />
                </div>
                <h3 className="font-bold text-ink mb-2">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Job listings */}
          <div className="space-y-4">
            {JOBS.map((job) => (
              <div
                key={job.title}
                className="bg-white rounded-2xl border border-hairline p-6 hover:border-[#2D6A4F] transition-colors flex flex-col sm:flex-row sm:items-center gap-5"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-ink text-lg">{job.title}</h3>
                    <span className="text-xs font-medium bg-[#F0FFF4] text-[#2D6A4F] border border-[#2D6A4F]/20 rounded-full px-2.5 py-0.5">
                      {job.stack}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} /> {job.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{job.desc}</p>
                </div>
                <Link
                  href="mailto:hello@agrilink.vn"
                  className="shrink-0 inline-flex items-center gap-2 bg-[#2D6A4F] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#1B4332] transition-colors"
                >
                  <Mail size={15} /> Ứng tuyển
                </Link>
              </div>
            ))}
          </div>

          {/* Free CV banner */}
          <div className="mt-10 bg-[#F9FBF9] rounded-2xl border border-hairline p-8 text-center">
            <h3 className="text-lg font-bold text-ink mb-2">
              Không thấy vị trí phù hợp?
            </h3>
            <p className="text-sm text-muted mb-5 max-w-lg mx-auto">
              Chúng tôi luôn chào đón những tài năng xuất sắc. Gửi CV và giới thiệu bản thân — chúng tôi sẽ liên hệ khi có vị trí phù hợp.
            </p>
            <Link
              href="mailto:hello@agrilink.vn?subject=CV%20tự%20do%20—%20AgriLink"
              className="inline-flex items-center gap-2 border border-[#2D6A4F] text-[#2D6A4F] font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-[#F0FFF4] transition-colors"
            >
              <Mail size={15} /> Gửi CV tự do →
            </Link>
          </div>
        </div>
      </section>

      <div className="border-t border-hairline" />

      {/* ═══════════════════════════════════════════════════════════════════════
          BLOG
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="blog" className="bg-[#F9FBF9] py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink mb-3">
              Blog AgriLink — Kiến thức nông nghiệp số
            </h2>
            <p className="text-muted text-sm max-w-xl mx-auto">
              Tin tức, hướng dẫn và phân tích chuyên sâu về chuyển đổi số trong nông nghiệp Việt Nam.
            </p>
          </div>

          {/* Featured post */}
          <div className="mb-10">
            <Link
              href="#"
              className="group block bg-white rounded-2xl border border-hairline hover:border-[#2D6A4F] transition-colors overflow-hidden lg:flex gap-6"
            >
              {/* Banner / thumbnail */}
              <div className="lg:w-72 shrink-0 bg-[#F0FFF4] h-48 lg:h-auto flex items-center justify-center rounded-xl lg:rounded-none lg:rounded-l-2xl">
                <Leaf size={64} className="text-[#2D6A4F] opacity-40" />
              </div>
              {/* Content */}
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-xs font-semibold border rounded-full px-3 py-1 ${TAG_COLORS[FEATURED.tag]}`}
                  >
                    {FEATURED.tag}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Calendar size={12} /> {FEATURED.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-ink mb-3 group-hover:text-[#2D6A4F] transition-colors leading-snug">
                  {FEATURED.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-5">
                  {FEATURED.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#2D6A4F]">
                  Đọc tiếp <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          </div>

          {/* Post grid — 5 posts (3 + 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {POSTS.map((post) => (
              <Link
                key={post.title}
                href="#"
                className="group bg-white rounded-2xl border border-hairline hover:border-[#2D6A4F] transition-colors flex flex-col overflow-hidden"
              >
                <div className="h-28 bg-gradient-to-r from-[#F0FFF4] to-[#D8F3DC] flex items-end p-4">
                  <span
                    className={`text-xs font-semibold border rounded-full px-2.5 py-0.5 ${
                      TAG_COLORS[post.tag] ?? "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {post.tag}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="flex items-center gap-1 text-xs text-muted mb-2">
                    <Calendar size={12} /> {post.date}
                  </span>
                  <h4 className="font-semibold text-ink text-sm mb-2 group-hover:text-[#2D6A4F] transition-colors leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed flex-1 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D6A4F]">
                    Đọc tiếp <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-hairline" />

      {/* ═══════════════════════════════════════════════════════════════════════
          PARTNERS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="partners" className="bg-white py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink mb-3">
              Hệ sinh thái đối tác AgriLink
            </h2>
            <p className="text-muted text-sm max-w-xl mx-auto">
              Chúng tôi hợp tác với các doanh nghiệp hàng đầu trong lĩnh vực logistics, thanh toán và chứng nhận để mang lại trải nghiệm hoàn chỉnh nhất cho người dùng AgriLink.
            </p>
          </div>

          {/* Partner category cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {PARTNER_CATEGORIES.map(({ icon: Icon, title, partners }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-hairline p-6 hover:border-[#2D6A4F] transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F0FFF4] flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[#2D6A4F]" />
                </div>
                <h3 className="font-bold text-ink mb-4">{title}</h3>
                <div className="flex flex-wrap gap-2">
                  {partners.map((name) => (
                    <span
                      key={name}
                      className="bg-[#F0FFF4] rounded-lg px-3 py-1.5 text-sm font-medium text-[#2D6A4F]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Become a partner CTA */}
          <div className="bg-[#F0FFF4] rounded-2xl p-8 border border-[#2D6A4F]/20">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-ink mb-3">
                Trở thành đối tác AgriLink
              </h3>
              <p className="text-sm text-muted mb-6">
                Hãy cùng chúng tôi xây dựng hạ tầng số nông nghiệp Việt Nam. Chúng tôi đang mở rộng hệ sinh thái và tìm kiếm đối tác chiến lược trong mọi lĩnh vực.
              </p>
              <ul className="text-left space-y-3 mb-8 max-w-sm mx-auto">
                {PARTNER_BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-ink">
                    <CheckCircle
                      size={16}
                      className="text-[#2D6A4F] shrink-0 mt-0.5"
                    />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="mailto:hello@agrilink.vn?subject=Đề%20xuất%20hợp%20tác%20—%20AgriLink"
                className="inline-flex items-center gap-2 bg-[#2D6A4F] text-white font-semibold text-sm px-8 py-3 rounded-full hover:bg-[#1B4332] transition-colors"
              >
                <Mail size={16} /> Liên hệ hợp tác
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
