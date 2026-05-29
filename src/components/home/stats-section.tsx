"use client";

import { useEffect, useRef, useState } from "react";
import { Users, MapPin, Globe, BarChart3 } from "lucide-react";

const STATS = [
  { value: 8.6, suffix: "M+", label: "Hộ nông dân tiềm năng", icon: Users, decimals: 1 },
  { value: 34,  suffix: "",   label: "Tỉnh thành phủ sóng",   icon: MapPin, decimals: 0 },
  { value: 53,  suffix: "B USD", label: "Xuất khẩu nông sản 2023", icon: Globe, decimals: 0 },
  { value: 20,  suffix: "-35%", label: "Lãng phí cần giảm",   icon: BarChart3, decimals: 0 },
];

function useCountUp(target: number, decimals: number, duration = 1800, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, decimals, duration]);
  return count;
}

function StatCard({
  stat,
  active,
  index,
}: {
  stat: (typeof STATS)[number];
  active: boolean;
  index: number;
}) {
  const count = useCountUp(stat.value, stat.decimals, 1800, active);
  const Icon = stat.icon;
  const display =
    stat.decimals > 0 ? count.toFixed(stat.decimals) : Math.round(count).toString();

  return (
    <div
      className="bg-white rounded-2xl p-7 text-center"
      style={{
        boxShadow: "0 2px 16px rgba(45,106,79,0.07), 0 1px 4px rgba(0,0,0,0.04)",
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
      }}
    >
      <div className="w-11 h-11 rounded-xl bg-surface-green flex items-center justify-center mx-auto mb-4">
        <Icon size={20} className="text-primary" />
      </div>
      <div className="text-3xl font-bold text-primary mb-1 tabular-nums">
        {display}
        <span className="text-xl">{stat.suffix}</span>
      </div>
      <div className="text-xs text-muted leading-snug">{stat.label}</div>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} active={active} index={i} />
        ))}
      </div>
    </div>
  );
}
