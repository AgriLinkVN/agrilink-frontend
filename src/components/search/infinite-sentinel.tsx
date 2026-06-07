"use client";

import { useEffect, useRef } from "react";

interface Props {
  onIntersect: () => void;
  disabled?: boolean;
}

export function InfiniteSentinel({ onIntersect, disabled }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled || !ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onIntersect();
      },
      { rootMargin: "200px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onIntersect, disabled]);

  return <div ref={ref} aria-hidden className="h-px" />;
}
