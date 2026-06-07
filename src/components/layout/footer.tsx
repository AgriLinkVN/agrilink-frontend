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
      { label: "Nông dân & Hộ sản xuất", href: "/for#farmers" },
      { label: "Hợp tác xã", href: "/for#cooperatives" },
      { label: "Người mua & Doanh nghiệp", href: "/for#buyers" },
      { label: "Nhà cung cấp nông cụ", href: "/for#suppliers" },
    ],
  },
  support: {
    title: "Hỗ trợ",
    links: [
      { label: "Trung tâm trợ giúp", href: "/support#help" },
      { label: "Hướng dẫn sử dụng", href: "/support#guide" },
      { label: "Liên hệ chúng tôi", href: "/support#contact" },
      { label: "Báo cáo sự cố", href: "/support#report" },
    ],
  },
  company: {
    title: "AgriLink Vietnam",
    links: [
      { label: "Về chúng tôi", href: "/about" },
      { label: "Tuyển dụng", href: "/company#careers" },
      { label: "Blog nông nghiệp", href: "/company#blog" },
      { label: "Đối tác", href: "/company#partners" },
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
                <Phone size={14} className="text-primary" /> +84912 158 715
              </a>
              <a href="mailto:hello@agrilink.vn" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail size={14} className="text-primary" /> letritrung2605@gmail.com
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

      {/* AD SLOT: partner logo strip — nhà tài trợ / đối tác nông cụ */}
      <div className="border-t border-hairline">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-[10px] text-muted/50 uppercase tracking-widest text-center mb-4">Đối tác & Nhà tài trợ</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { name: "Kubota", color: "#E65C00", abbr: "KBT", desc: "Máy nông nghiệp" },
              { name: "Netafim", color: "#0066CC", abbr: "NTF", desc: "Hệ thống tưới" },
              { name: "DJI Agri", color: "#1A1A1A", abbr: "DJI", desc: "Drone nông nghiệp" },
              { name: "BioFarm", color: "#2D6A4F", abbr: "BIO", desc: "Phân bón hữu cơ" },
              { name: "Yanmar", color: "#C41E3A", abbr: "YNM", desc: "Máy gặt đập" },
            ].map((p) => (
              <a
                key={p.name}
                href="#"
                className="flex items-center gap-2 opacity-40 hover:opacity-80 transition-opacity group"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-black shrink-0"
                  style={{ background: p.color }}
                >
                  {p.abbr}
                </div>
                <div>
                  <div className="text-xs font-bold text-ink leading-none">{p.name}</div>
                  <div className="text-[9px] text-muted leading-none mt-0.5">{p.desc}</div>
                </div>
              </a>
            ))}
          </div>
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
