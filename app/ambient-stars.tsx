'use client';

import { useEffect, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  radius: number;
  base: number;
  phase: number;
  pulse: number;
  dimAt: number;
  dimUntil: number;
};

function seeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export default function AmbientStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const random = seeded(4103);
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let frame = 0;
    let lastDraw = 0;
    let visible = !document.hidden;
    let scrolling = false;
    let scrollIdleTimer = 0;

    const makeStars = () => {
      const count = width < 700 ? 42 : 72;
      stars = Array.from({ length: count }, () => ({
        x: random() * width,
        y: random() * height,
        radius: 0.45 + random() * 0.85,
        base: 0.24 + random() * 0.58,
        phase: random() * Math.PI * 2,
        pulse: 0.00035 + random() * 0.0006,
        dimAt: 1800 + random() * 9000,
        dimUntil: 0,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const density = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(density, 0, 0, density, 0, 0);
      makeStars();
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        if (!reduceMotion && time >= star.dimAt) {
          star.dimUntil = time + 500 + Math.random() * 1250;
          star.dimAt = star.dimUntil + 2600 + Math.random() * 8400;
        }
        const pulsing = reduceMotion
          ? 0.82
          : 0.68 + Math.sin(time * star.pulse + star.phase) * 0.32;
        const dimmed = time < star.dimUntil ? 0.08 : 1;
        const alpha = star.base * pulsing * dimmed;
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(218, 238, 211, ${alpha})`;
        context.fill();
      }
    };

    const tick = (time: number) => {
      const frameInterval = width < 700 ? 72 : 50;
      if (
        visible &&
        !scrolling &&
        (reduceMotion || time - lastDraw > frameInterval)
      ) {
        lastDraw = time;
        draw(time);
      }
      if (!reduceMotion) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      scrolling = true;
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        scrolling = false;
      }, 140);
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && reduceMotion) draw(performance.now());
    };

    resize();
    if (reduceMotion) draw(0);
    else frame = requestAnimationFrame(tick);
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(scrollIdleTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-stars" aria-hidden="true" />;
}
