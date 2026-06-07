"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  TrendingDown, Eye, QrCode, Database, Wifi, Trash2,
  type LucideIcon,
} from "lucide-react";

interface Problem {
  icon: LucideIcon;
  stat: string;
  title: string;
  desc: string;
  img: string;
  alt: string;
}

const PROBLEMS: Problem[] = [
  {
    icon: TrendingDown,
    stat: "4–6 tầng",
    title: "Chuỗi trung gian quá dài",
    desc: "Nông dân bán 2.000đ/kg thanh long, người tiêu dùng trả 25.000đ — chênh lệch 12 lần.",
    img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=260&fit=crop&auto=format",
    alt: "Nông dân bán hàng qua trung gian",
  },
  {
    icon: Eye,
    stat: "0 minh bạch",
    title: "Thiếu minh bạch giá cả",
    desc: "Thương lái độc quyền thông tin, ép giá mua thấp hơn thực tế 30–50%.",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=260&fit=crop&auto=format",
    alt: "Chợ nông sản thiếu minh bạch",
  },
  {
    icon: QrCode,
    stat: "Mờ nguồn gốc",
    title: "Không truy xuất nguồn gốc",
    desc: "Người tiêu dùng không biết nông sản đến từ đâu — mở đường cho hàng giả.",
    img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=260&fit=crop&auto=format",
    alt: "Rau củ quả không rõ nguồn gốc",
  },
  {
    icon: Database,
    stat: "Manh mún",
    title: "Dữ liệu nông nghiệp rời rạc",
    desc: "Không có hệ thống tổng hợp sản lượng, giá cả, vùng trồng — hoạch định chính sách khó.",
    img: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=260&fit=crop&auto=format",
    alt: "Dữ liệu nông nghiệp phân tán",
  },
  {
    icon: Wifi,
    stat: "~70% nông thôn",
    title: "Khoảng cách công nghệ",
    desc: "Nông dân thiếu công cụ số phù hợp, ngôn ngữ địa phương, giao diện thân thiện.",
    img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=260&fit=crop&auto=format",
    alt: "Nông dân vùng nông thôn",
  },
  {
    icon: Trash2,
    stat: "20–35% thất thoát",
    title: "Thất thoát sau thu hoạch",
    desc: "Thiếu kết nối logistics và thông tin thị trường khiến nông sản bị hỏng hoặc bán dưới giá.",
    img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=260&fit=crop&auto=format",
    alt: "Nông sản bị thất thoát sau thu hoạch",
  },
];

function ProblemCard({ problem, index }: { problem: Problem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = problem.icon;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div
        className="problem-card bg-white rounded-2xl overflow-hidden border border-hairline hover:border-primary-light transition-all duration-500 group hover:-translate-y-1.5"
        style={{ boxShadow: "0 2px 12px rgba(45,106,79,0.07), 0 1px 3px rgba(0,0,0,0.04)" }}
      >
        {/* Image */}
        <div className="relative h-36 overflow-hidden">
          <Image
            src={problem.img}
            alt={problem.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Green overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent" />
          {/* Stat badge */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1.5 bg-white/95 text-primary text-[11px] font-bold px-2.5 py-1 rounded-full">
              <Icon size={12} />
              {problem.stat}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-ink mb-1.5 leading-snug">{problem.title}</h3>
          <p className="text-xs text-muted leading-relaxed">{problem.desc}</p>
          <div className="mt-3 h-0.5 w-6 rounded-full bg-primary transition-all duration-300 group-hover:w-12" />
        </div>
      </div>
    </div>
  );
}

export function ProblemCurve() {
  return (
    <section className="relative py-20 overflow-hidden bg-white">
      {/* Animated blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #52B788, transparent 70%)", animation: "blobA 12s ease-in-out infinite" }} />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #2D6A4F, transparent 70%)", animation: "blobB 15s ease-in-out infinite" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-badge-organic-bg text-badge-organic-text mb-4">
            Bài toán cần giải
          </span>
          <h2 className="text-3xl font-bold text-ink mb-4">
            Nông nghiệp Việt Nam đang gặp phải gì?
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm leading-relaxed">
            53 tỷ USD giá trị xuất khẩu mỗi năm — nhưng nông dân vẫn là mắt xích thiệt thòi nhất.
            AgriLink ra đời để giải quyết 6 vấn đề cốt lõi này.
          </p>
        </div>

        {/* Desktop: curve between 2 rows */}
        <div className="hidden lg:block">
          {/* Row top — 3 cards */}
          <div className="grid grid-cols-3 gap-6">
            {PROBLEMS.slice(0, 3).map((p, i) => (
              <ProblemCard key={p.title} problem={p} index={i} />
            ))}
          </div>

          {/* SVG curve strip between rows */}
          <div className="relative" style={{ height: "96px" }}>
            <svg
              viewBox="0 0 1200 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%"   stopColor="#52B788" stopOpacity="0.15" />
                  <stop offset="30%"  stopColor="#2D6A4F" stopOpacity="0.55" />
                  <stop offset="70%"  stopColor="#2D6A4F" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#52B788" stopOpacity="0.15" />
                </linearGradient>
                {/* Glow filter for dots */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Soft wave — solid, gentle S */}
              <path
                d="M 0 48 C 200 8, 400 88, 600 48 C 800 8, 1000 88, 1200 48"
                stroke="url(#cg)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              {/* Shadow/glow layer */}
              <path
                d="M 0 48 C 200 8, 400 88, 600 48 C 800 8, 1000 88, 1200 48"
                stroke="#52B788"
                strokeWidth="6"
                strokeOpacity="0.12"
                fill="none"
                strokeLinecap="round"
              />

              {/* Top connector dots — where wave touches top (near 8px) */}
              <circle cx="200"  cy="10" r="5" fill="#ffffff" filter="url(#glow)" />
              <circle cx="200"  cy="10" r="5" fill="#2D6A4F" opacity="0.9" />
              <circle cx="600"  cy="10" r="5" fill="#ffffff" filter="url(#glow)" />
              <circle cx="600"  cy="10" r="5" fill="#2D6A4F" opacity="0.9" />
              <circle cx="1000" cy="10" r="5" fill="#ffffff" filter="url(#glow)" />
              <circle cx="1000" cy="10" r="5" fill="#2D6A4F" opacity="0.9" />

              {/* Bottom connector dots — where wave touches bottom (near 88px) */}
              <circle cx="200"  cy="86" r="5" fill="#ffffff" filter="url(#glow)" />
              <circle cx="200"  cy="86" r="5" fill="#52B788" opacity="0.85" />
              <circle cx="600"  cy="86" r="5" fill="#ffffff" filter="url(#glow)" />
              <circle cx="600"  cy="86" r="5" fill="#52B788" opacity="0.85" />
              <circle cx="1000" cy="86" r="5" fill="#ffffff" filter="url(#glow)" />
              <circle cx="1000" cy="86" r="5" fill="#52B788" opacity="0.85" />

              {/* Soft vertical connectors */}
              <line x1="200"  y1="10" x2="200"  y2="86" stroke="#2D6A4F" strokeWidth="1" strokeOpacity="0.15" />
              <line x1="600"  y1="10" x2="600"  y2="86" stroke="#2D6A4F" strokeWidth="1" strokeOpacity="0.15" />
              <line x1="1000" y1="10" x2="1000" y2="86" stroke="#2D6A4F" strokeWidth="1" strokeOpacity="0.15" />
            </svg>
          </div>

          {/* Row bottom — 3 cards */}
          <div className="grid grid-cols-3 gap-6">
            {PROBLEMS.slice(3).map((p, i) => (
              <ProblemCard key={p.title} problem={p} index={i + 3} />
            ))}
          </div>
        </div>

        {/* Mobile/tablet: normal grid */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROBLEMS.map((p, i) => (
            <ProblemCard key={p.title} problem={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
