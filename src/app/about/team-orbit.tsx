"use client";

import { useState } from "react";
import Image from "next/image";
import { Crown } from "lucide-react";

const MEMBERS = [
  {
    name: "Lê Trí Trung",
    role: "Trưởng nhóm",
    desc: "Khởi xướng & dẫn dắt dự án. Full-stack developer.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format",
    isLeader: true,
  },
  {
    name: "Văn Ân",
    role: "Thành viên",
    desc: "Phân tích nghiệp vụ & thiết kế quy trình",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face&auto=format",
  },
  {
    name: "Tiến Đạt",
    role: "Thành viên",
    desc: "Nghiên cứu thị trường & nội dung",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&auto=format",
  },
  {
    name: "Hoàng Huy",
    role: "Thành viên",
    desc: "UI/UX & trải nghiệm người dùng",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face&auto=format",
  },
  {
    name: "Phạm Ngọc Hoàng Anh",
    role: "Thành viên",
    desc: "Dữ liệu & báo cáo phân tích",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face&auto=format",
  },
  {
    name: "Võ Văn Tin",
    role: "Thành viên",
    desc: "Kiểm thử & đảm bảo chất lượng",
    img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face&auto=format",
  },
];

// 6 members on orbit: angles evenly spaced starting from top
const ORBIT_R = 270; // px radius from center
const ANGLES = [270, 330, 30, 90, 150, 210]; // degrees, starting top → clockwise

function toXY(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
}

export function TeamOrbit() {
  const [active, setActive] = useState<number | null>(null);

  // Container is 600×600, center at 300,300
  const SIZE = 740;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F0FFF4 0%, #FFFFFF 60%)" }}
    >
      {/* Blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: "radial-gradient(circle, #2D6A4F 0%, transparent 70%)" }} />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: "radial-gradient(circle, #52B788 0%, transparent 70%)" }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-surface-green text-primary border border-primary/20 mb-4">
            Đội ngũ thực hiện
          </span>
          <h2 className="text-3xl font-bold text-ink mb-3">Những người tạo ra AgriLink</h2>
          <p className="text-muted text-sm max-w-lg mx-auto leading-relaxed">
            Dự án sinh viên khởi nghiệp từ Đà Nẵng — cùng nhau cống hiến cho nền nông nghiệp Việt Nam minh bạch và bền vững hơn.
          </p>
        </div>

        {/* Orbit diagram */}
        <div className="flex justify-center">
          <div
            className="relative"
            style={{ width: SIZE, height: SIZE, maxWidth: "100%" }}
          >
            {/* Orbit ring */}
            <div
              className="absolute rounded-full border border-dashed border-primary/20"
              style={{
                width: ORBIT_R * 2,
                height: ORBIT_R * 2,
                top: CY - ORBIT_R,
                left: CX - ORBIT_R,
              }}
            />
            {/* Outer ring hint */}
            <div
              className="absolute rounded-full border border-dashed border-primary/10"
              style={{
                width: ORBIT_R * 2 + 48,
                height: ORBIT_R * 2 + 48,
                top: CY - ORBIT_R - 24,
                left: CX - ORBIT_R - 24,
              }}
            />

            {/* Center — Advisor */}
            <div
              className="absolute flex flex-col items-center gap-2"
              style={{ top: CY - 60, left: CX - 60, width: 120 }}
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face&auto=format"
                  alt="Trần Quốc Huy"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <div className="text-[9px] font-bold uppercase tracking-widest text-primary leading-tight">
                  Giảng viên
                </div>
                <div className="text-xs font-bold text-ink leading-tight">Trần Quốc Huy</div>
                <div className="text-[9px] text-muted">Môn Mác-Lênin</div>
              </div>
            </div>

            {/* Connector lines from center to each orbit node */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={SIZE}
              height={SIZE}
            >
              {ANGLES.map((deg, i) => {
                const { x, y } = toXY(deg, ORBIT_R);
                return (
                  <line
                    key={i}
                    x1={CX}
                    y1={CY}
                    x2={CX + x}
                    y2={CY + y}
                    stroke="#2D6A4F"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity={active === i ? 0.4 : 0.15}
                    style={{ transition: "opacity 0.3s" }}
                  />
                );
              })}
            </svg>

            {/* Orbit members */}
            {MEMBERS.map((m, i) => {
              const { x, y } = toXY(ANGLES[i], ORBIT_R);
              const isActive = active === i;
              const avatarSize = m.isLeader ? 72 : 60;

              return (
                <div
                  key={m.name}
                  className="absolute flex flex-col items-center cursor-pointer"
                  style={{
                    width: 120,
                    top: CY + y - avatarSize / 2 - 4,
                    left: CX + x - 60,
                    zIndex: isActive ? 20 : 10,
                  }}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                >
                  {/* Avatar */}
                  <div
                    className="relative rounded-full overflow-hidden shadow-lg transition-all duration-300"
                    style={{
                      width: avatarSize,
                      height: avatarSize,
                      outline: isActive
                        ? `3px solid #2D6A4F`
                        : m.isLeader
                        ? `3px solid #F59E0B`
                        : `2px solid #B7DEC9`,
                      outlineOffset: "3px",
                      transform: isActive ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    <Image
                      src={m.img}
                      alt={m.name}
                      fill
                      className="object-cover"
                    />
                    {/* Leader crown overlay */}
                    {m.isLeader && (
                      <div className="absolute inset-0 bg-amber-400/10" />
                    )}
                  </div>

                  {/* Crown for leader */}
                  {m.isLeader && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
                      <Crown size={11} className="text-white" />
                    </div>
                  )}

                  {/* Name tag */}
                  <div
                    className="mt-2 text-center transition-all duration-300"
                    style={{ transform: isActive ? "translateY(2px)" : "translateY(0)" }}
                  >
                    <div
                      className="text-[11px] font-bold leading-tight"
                      style={{ color: m.isLeader ? "#B45309" : "#1A1A1A" }}
                    >
                      {m.name}
                    </div>
                    <div className="text-[9px] text-muted">{m.role}</div>
                  </div>

                  {/* Tooltip on hover */}
                  {isActive && (
                    <div
                      className="absolute z-30 bg-white border border-primary/20 rounded-xl shadow-xl px-3 py-2 text-center pointer-events-none"
                      style={{
                        width: 148,
                        top: avatarSize + 36,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="text-[10px] font-bold text-ink mb-0.5">{m.name}</div>
                      <div className="text-[9px] text-primary font-semibold mb-1">{m.role}</div>
                      <div className="text-[9px] text-muted leading-relaxed">{m.desc}</div>
                      {/* Arrow */}
                      <div
                        className="absolute w-2 h-2 bg-white border-l border-t border-primary/20 rotate-45"
                        style={{ top: -5, left: "50%", marginLeft: -4 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-muted/50 mt-4 leading-relaxed">
          🌱 Cùng nhau xây dựng AgriLink Vietnam — hệ sinh thái nông sản số vì cộng đồng nông dân Việt.
        </p>
      </div>
    </section>
  );
}
