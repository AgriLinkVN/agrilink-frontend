"use client";

import { useEffect, useRef, useState } from "react";
import {
  Target, Eye, Handshake, Recycle, Globe,
  type LucideIcon,
} from "lucide-react";

interface Item {
  icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
}

const ITEMS: Item[] = [
  {
    icon: Target,
    tag: "Sứ mệnh",
    title: "Xoá bỏ bất bình đẳng thông tin",
    desc: "Mỗi nông dân Việt Nam xứng đáng biết giá thực của mặt hàng mình trồng. AgriLink đưa dữ liệu thị trường trực tiếp vào tay người sản xuất.",
  },
  {
    icon: Eye,
    tag: "Minh bạch",
    title: "Mọi thông tin đều được công khai",
    desc: "Giá cả, nguồn gốc, chứng nhận VietGAP/GlobalGAP — số hóa và hiển thị đầy đủ. Không có thông tin bị che giấu trong chuỗi cung ứng.",
  },
  {
    icon: Handshake,
    tag: "Công bằng",
    title: "Thỏa thuận trực tiếp, không qua trung gian",
    desc: "Nông dân và người mua giao dịch trên nền tảng trung lập. Không bên nào có lợi thế thông tin bất công so với phía còn lại.",
  },
  {
    icon: Recycle,
    tag: "Bền vững",
    title: "Canh tác bền vững, giảm thất thoát",
    desc: "Khuyến khích canh tác hữu cơ, VietGAP, GlobalGAP. Đo lường và giảm 20–35% thất thoát sau thu hoạch — bảo vệ nông nghiệp dài hạn.",
  },
  {
    icon: Globe,
    tag: "Tầm nhìn 2030",
    title: "Hạ tầng số nông nghiệp Đông Nam Á",
    desc: "Đến 2030, mọi giao dịch nông sản trong khu vực đều được số hoá, truy xuất nguồn gốc và bảo đảm chất lượng qua AgriLink.",
  },
];

function TimelineCard({ item, index }: { item: Item; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = item.icon;
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex items-start gap-0 relative">
      {/* Card — alternates left/right on desktop */}
      <div
        className={[
          "w-full md:w-[calc(50%-2rem)] transition-all duration-700",
          isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8",
          visible
            ? "opacity-100 translate-y-0 rotate-0"
            : isLeft
            ? "opacity-0 translate-y-6 -rotate-1"
            : "opacity-0 translate-y-6 rotate-1",
        ].join(" ")}
        style={{ transitionDelay: `${index * 80}ms` }}
      >
        <div
          className="bg-white rounded-2xl border border-hairline p-4 hover:border-primary-light transition-colors group"
          style={{ boxShadow: "0 4px 24px rgba(45,106,79,0.12), 0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <Icon size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-surface-green px-2 py-0.5 rounded-full mb-2">
                {item.tag}
              </span>
              <h3 className="text-sm font-bold text-ink mb-1.5 leading-snug">{item.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
            </div>
          </div>
          {/* Bottom accent */}
          <div className="mt-4 h-0.5 w-8 rounded-full bg-primary transition-all duration-300 group-hover:w-16" />
        </div>
      </div>

      {/* Center dot — absolutely positioned on md+ */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-5 flex-col items-center z-10">
        <div
          className={[
            "w-4 h-4 rounded-full border-2 border-primary bg-white transition-all duration-500",
            visible ? "scale-100 bg-primary" : "scale-0",
          ].join(" ")}
          style={{ transitionDelay: `${index * 80 + 200}ms` }}
        />
      </div>
    </div>
  );
}

export function MissionTimeline() {
  return (
    <section className="relative py-14 overflow-hidden" style={{ background: "#FAFDF7" }}>
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #2D6A4F18 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-badge-vietgap-bg text-badge-vietgap-text mb-4">
          Giá trị cốt lõi
        </span>
        <h2 className="text-3xl font-bold text-ink mb-3">Sứ mệnh & Nguyên tắc</h2>
        <p className="text-muted text-sm max-w-xl mx-auto">
          Năm nguyên tắc chi phối mọi quyết định thiết kế, vận hành và phát triển của AgriLink.
        </p>
      </div>

      {/* Timeline container */}
      <div className="relative">
        {/* Vertical line */}
        <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-linear-to-b from-primary/10 via-primary/40 to-primary/10" />

        <div className="flex flex-col">
          {ITEMS.map((item, i) => (
            <div key={item.tag} style={{ marginTop: i === 0 ? 0 : "-1.75rem", zIndex: i + 1, position: "relative" }}>
              <TimelineCard item={item} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
    </section>
  );
}
