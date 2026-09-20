'use client';

import { useEffect, useRef } from 'react';

const GLYPHS =
  '01アイウエオカキクケコサシスセソタチツテトナニヌネノ<>/{}[]$#';

type Stream = {
  head: number;
  speed: number;
  length: number;
  seed: number;
};

function glyphAt(stream: Stream, row: number, frame: number) {
  const index = Math.abs(
    Math.floor(stream.seed + row * 7 + frame * stream.speed * 0.035),
  );
  return GLYPHS[index % GLYPHS.length];
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let columns = 0;
    let streams: Stream[] = [];
    let frame = 0;
    let lastFrame = 0;
    let animationFrame = 0;
    let scrollIdleTimer = 0;
    let scrolling = false;

    const reset = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const spacing = width < 720 ? 24 : 25;
      columns = Math.ceil(width / spacing);
      streams = Array.from({ length: columns }, (_, index) => ({
        head: Math.random() * height * 1.5 - height * 0.5,
        speed: 0.55 + Math.random() * 1.25,
        length: 5 + Math.floor(Math.random() * 12),
        seed: index * 19 + Math.random() * 120,
      }));
    };

    const draw = (advance: boolean) => {
      context.clearRect(0, 0, width, height);
      context.font = `${width < 720 ? 11 : 12}px ui-monospace, SFMono-Regular, Consolas, monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      const spacing = width / columns;
      streams.forEach((stream, column) => {
        const x = (column + 0.5) * spacing;
        for (let trail = 0; trail < stream.length; trail++) {
          const y = stream.head - trail * 17;
          if (y < -20 || y > height + 20) continue;
          const strength = 1 - trail / stream.length;
          context.fillStyle =
            trail === 0
              ? `rgba(239, 255, 224, ${0.72 * strength})`
              : `rgba(174, 255, 105, ${0.38 * strength * strength})`;
          context.fillText(glyphAt(stream, trail, frame), x, y);
        }
        if (!advance) return;
        stream.head += stream.speed * 8.5;
        if (stream.head - stream.length * 17 > height) {
          stream.head = -40 - Math.random() * height * 0.9;
          stream.speed = 0.55 + Math.random() * 1.25;
          stream.length = 5 + Math.floor(Math.random() * 12);
          stream.seed = Math.random() * 240;
        }
      });
    };

    const animate = (time: number) => {
      animationFrame = requestAnimationFrame(animate);
      if (document.hidden || scrolling || time - lastFrame < 38) return;
      lastFrame = time;
      frame++;
      draw(true);
    };

    const onScroll = () => {
      scrolling = true;
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        scrolling = false;
      }, 90);
    };

    const start = () => {
      cancelAnimationFrame(animationFrame);
      if (reducedQuery.matches) draw(false);
      else animationFrame = requestAnimationFrame(animate);
    };

    const resize = () => {
      reset();
      start();
    };
    reset();
    start();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    reducedQuery.addEventListener('change', start);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(scrollIdleTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      reducedQuery.removeEventListener('change', start);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-rain" aria-hidden="true" />;
}
