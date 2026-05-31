"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  dAlpha: number;
}

interface Props {
  count?: number;
  color?: string;
  className?: string;
}

export function ParticlesBg({ count = 48, color = "255,255,255", className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.1,
      r: Math.random() * 2.5 + 0.5,
      alpha: 0,
      dAlpha: Math.random() * 0.005 + 0.002,
    });

    const init = () => {
      resize();
      particles = Array.from({ length: count }, spawn);
      // Spread initial progress so they don't all start at same phase
      particles.forEach((p) => {
        p.alpha = Math.random() * 0.5;
        p.y = Math.random() * canvas.height;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        // Fade in then out cycle
        p.alpha += p.dAlpha;
        if (p.alpha >= 0.55) p.dAlpha = -Math.abs(p.dAlpha);
        if (p.alpha <= 0) {
          // Respawn at bottom
          Object.assign(p, spawn());
          p.y = canvas.height + 4;
          p.alpha = 0;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap horizontally
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.alpha.toFixed(3)})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    init();
    draw();

    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
