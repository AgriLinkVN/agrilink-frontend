"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
}

export function LazySection({ children, fallback = null, rootMargin = "200px" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // mounted: false on server → renders nothing → no hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  // Server: render empty div (no skeleton) → no mismatch
  // Client after mount: show skeleton until intersection fires
  return (
    <div ref={ref} suppressHydrationWarning>
      {mounted ? (visible ? children : fallback) : null}
    </div>
  );
}
