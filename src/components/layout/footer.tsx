import Link from "next/link";
import { Leaf, Share2, Mail, Phone, MapPin, PlayCircle } from "lucide-react";

const FOOTER_LINKS = {
  platform: {
    title: "Nền tảng",
    links: [
      { label: "Sàn nông sản", href: "/marketplace" },
      { label: "Bản đồ vùng trồng", href: "/map" },
      { label: "Giá thị trường", href: "/prices" },
      { label: "Truy xuất nguồn gốc", href: "/trace" },
    ],
  },
  users: {
    title: "Đối tượng",
    links: [
      { label: "Nông dân & Hộ sản xuất", href: "/for/farmers" },
      { label: "Hợp tác xã", href: "/for/cooperatives" },
      { label: "Người mua & Doanh nghiệp", href: "/for/buyers" },
      { label: "Nhà cung cấp nông cụ", href: "/for/suppliers" },
    ],
  },
  support: {
    title: "Hỗ trợ",
    links: [
      { label: "Trung tâm trợ giúp", href: "/help" },
      { label: "Hướng dẫn sử dụng", href: "/guide" },
      { label: "Liên hệ chúng tôi", href: "/contact" },
      { label: "Báo cáo sự cố", href: "/report" },
    ],
  },
  company: {
    title: "AgriLink Vietnam",
    links: [
      { label: "Về chúng tôi", href: "/about" },
      { label: "Tuyển dụng", href: "/careers" },
      { label: "Blog nông nghiệp", href: "/blog" },
      { label: "Đối tác", href: "/partners" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-surface-soft border-t border-hairline">
      {/* Main footer */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand col */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Leaf size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-primary">AgriLink</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Hệ sinh thái số kết nối nông nghiệp Việt Nam — minh bạch, công bằng, bền vững.
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted">
              <a href="tel:02363xxxxxx" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone size={14} className="text-primary" /> 0236 3xx xxxx
              </a>
              <a href="mailto:hello@agrilink.vn" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail size={14} className="text-primary" /> hello@agrilink.vn
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-primary" /> Đà Nẵng, Việt Nam
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.values(FOOTER_LINKS).map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-ink mb-4">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Legal band */}
      <div className="border-t border-hairline bg-surface-soft">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © 2025 AgriLink Vietnam. Bảo lưu mọi quyền. Dự án khởi nghiệp sinh viên.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-muted hover:text-primary transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="text-xs text-muted hover:text-primary transition-colors">
              Điều khoản sử dụng
            </Link>
            <div className="flex items-center gap-3 ml-2">
              <a href="#" className="text-muted hover:text-primary transition-colors">
                <Share2 size={16} />
              </a>
              <a href="#" className="text-muted hover:text-primary transition-colors">
                <PlayCircle size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
