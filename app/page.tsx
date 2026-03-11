"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const sparkleCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const weddingDate = new Date("2026-04-12T11:00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // sparkle canvas on main content
  useEffect(() => {
    if (!showContent) return;
    const canvas = sparkleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      size: number; alpha: number;
      decay: number; color: string;
      shape: "star" | "circle" | "diamond";
      rotation: number; vrot: number;
    };

    const colors = ["#c9a84c", "#f0d080", "#e8c84a", "#d45e00", "#fdf8ee", "#b87461"];
    const particles: Particle[] = [];

    const spawn = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.5 - Math.random() * 1.2,
        size: 1.5 + Math.random() * 3.5,
        alpha: 0,
        decay: 0.004 + Math.random() * 0.006,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: ["star", "circle", "diamond"][Math.floor(Math.random() * 3)] as "star" | "circle" | "diamond",
        rotation: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.08,
      });
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = rot + (i * Math.PI * 2) / 5 - Math.PI / 2;
        const inner = rot + ((i + 0.5) * Math.PI * 2) / 5 - Math.PI / 2;
        if (i === 0) ctx.moveTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
        else ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r);
        ctx.lineTo(x + Math.cos(inner) * r * 0.4, y + Math.sin(inner) * r * 0.4);
      }
      ctx.closePath();
    };

    let spawnTimer = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spawnTimer++;
      if (spawnTimer % 8 === 0 && particles.length < 60) spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.alpha < 0.8 && p.vy < 0) p.alpha += 0.03;
        else p.alpha -= p.decay;

        if (p.alpha <= 0) { particles.splice(i, 1); continue; }

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vrot;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "star") {
          drawStar(ctx, p.x, p.y, p.size * 1.2, p.rotation);
          ctx.fill();
        } else {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size, 0);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [showContent]);

  // scroll-triggered fade-ins
  useEffect(() => {
    if (!showContent) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".scroll-reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [showContent]);

  const handleOpen = () => {
    setOpened(true);
    setTimeout(() => setShowContent(true), 1200);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@300;400;500;600;700&family=Noto+Serif+Malayalam:wght@300;400;500;600;700&family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --cream: #fdf8ee;
          --gold: #b8860b;
          --gold-light: #d4a017;
          --gold-pale: #f0d080;
          --gold-border: #c9a84c;
          --maroon: #7b1c1c;
          --dark: #2a1a00;
          --muted: #6b4c1e;
          --orange: #d45e00;
        }

        html { scroll-behavior: smooth; }

        body {
          background: #e8dfc8;
          font-family: 'Noto Sans Malayalam', sans-serif;
          color: var(--dark);
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem 1rem 4rem;
        }

        /* ── SPARKLE CANVAS ── */
        .sparkle-canvas {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        /* ── SCROLL REVEAL ── */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.75s ease, transform 0.75s ease;
        }
        .scroll-reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        .scroll-reveal.delay-1 { transition-delay: 0.1s; }
        .scroll-reveal.delay-2 { transition-delay: 0.2s; }
        .scroll-reveal.delay-3 { transition-delay: 0.35s; }
        .scroll-reveal.delay-4 { transition-delay: 0.5s; }
        .envelope-screen {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #1a0800;
          transition: opacity 0.8s ease 0.9s, visibility 0.8s ease 0.9s;
        }
        .envelope-screen.hide {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .curtain-left, .curtain-right {
          position: absolute;
          top: 0; bottom: 0;
          width: 50%;
          z-index: 20;
          transition: transform 0.9s cubic-bezier(0.77, 0, 0.18, 1);
          background: linear-gradient(180deg, #4a0e0e 0%, #2d0808 40%, #1a0800 100%);
          overflow: hidden;
        }
        .curtain-left  { left: 0;  transform-origin: left center; }
        .curtain-right { right: 0; transform-origin: right center; }
        .curtain-left.open  { transform: translateX(-100%); }
        .curtain-right.open { transform: translateX(100%); }

        .curtain-left::after {
          content: '';
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, transparent, var(--gold-border), #f0d080, var(--gold-border), transparent);
        }
        .curtain-right::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, transparent, var(--gold-border), #f0d080, var(--gold-border), transparent);
        }

        .curtain-left .silk, .curtain-right .silk {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            170deg,
            transparent 0px,
            rgba(255,255,255,0.02) 2px,
            transparent 4px
          );
        }

        .mandala-ring {
          position: absolute;
          width: min(380px, 90vw);
          height: min(380px, 90vw);
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.1);
          animation: rotateSlow 20s linear infinite;
          z-index: 1;
        }
        .mandala-ring::before {
          content: '';
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          border: 1px dashed rgba(201,168,76,0.12);
        }
        .mandala-ring::after {
          content: '';
          position: absolute;
          inset: 28px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.08);
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .diya {
          position: absolute;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: radial-gradient(circle, #ffd700, #ff8c00);
          box-shadow: 0 0 8px 3px rgba(255,180,0,0.4);
          animation: twinkle ease-in-out infinite alternate;
          pointer-events: none;
        }
        @keyframes twinkle {
          from { opacity: 0.3; transform: scale(0.8); }
          to   { opacity: 1;   transform: scale(1.2); }
        }

        .centre-card {
          position: relative;
          z-index: 10;
          width: min(300px, 82vw);
          background: linear-gradient(160deg, #fffdf5, #fdf3d8 60%, #f5e0a8);
          border: 2px solid var(--gold-border);
          border-radius: 4px;
          box-shadow:
            0 0 0 1px #f0d080,
            0 0 0 4px rgba(201,168,76,0.3),
            0 20px 60px rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          animation: cardGlow 3s ease-in-out infinite alternate;
        }
        @keyframes cardGlow {
          from { box-shadow: 0 0 0 1px #f0d080, 0 0 0 4px rgba(201,168,76,0.3), 0 20px 60px rgba(0,0,0,0.6), 0 0 20px rgba(201,168,76,0.0); }
          to   { box-shadow: 0 0 0 1px #f0d080, 0 0 0 4px rgba(201,168,76,0.4), 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.2); }
        }

        .card-inner-border {
          position: absolute;
          inset: 7px;
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 2px;
          pointer-events: none;
          z-index: 1;
        }
        .card-corner {
          position: absolute;
          width: 18px; height: 18px;
          border-color: var(--gold-border);
          border-style: solid;
          opacity: 0.7;
          z-index: 2;
        }
        .card-corner.tl { top: 10px; left: 10px; border-width: 2px 0 0 2px; }
        .card-corner.tr { top: 10px; right: 10px; border-width: 2px 2px 0 0; }
        .card-corner.bl { bottom: 10px; left: 10px; border-width: 0 0 2px 2px; }
        .card-corner.br { bottom: 10px; right: 10px; border-width: 0 2px 2px 0; }

        .card-top-band {
          width: 100%;
          padding: 0.9rem 1rem 0.6rem;
          text-align: center;
          background: linear-gradient(to bottom, rgba(201,168,76,0.12), transparent);
          border-bottom: 1px solid rgba(201,168,76,0.2);
          position: relative;
          z-index: 3;
        }

        .card-om {
          font-size: 2.8rem;
          color: var(--orange);
          line-height: 1;
          display: block;
          text-shadow: 0 2px 12px rgba(212,94,0,0.4);
          animation: omPulse 2.5s ease-in-out infinite alternate;
        }
        @keyframes omPulse {
          from { text-shadow: 0 2px 12px rgba(212,94,0,0.3); }
          to   { text-shadow: 0 2px 24px rgba(212,94,0,0.7), 0 0 40px rgba(212,94,0,0.2); }
        }

        .card-sri {
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 0.65rem;
          color: var(--gold);
          letter-spacing: 0.3em;
          margin-top: 0.2rem;
          display: block;
        }

        .card-body {
          padding: 1.1rem 1.2rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          z-index: 3;
          width: 100%;
        }

        .card-divider {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
        }
        .card-div-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--gold-border), transparent);
        }
        .card-div-diamond {
          width: 5px; height: 5px;
          background: var(--gold-border);
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        .card-name {
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--maroon);
          text-align: center;
          line-height: 1.3;
        }

        .card-amp {
          font-family: 'Cinzel', serif;
          font-size: 1.4rem;
          color: var(--gold);
          line-height: 1;
        }

        .card-date-row {
          background: rgba(201,168,76,0.1);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 3px;
          padding: 0.45rem 1rem;
          text-align: center;
          width: 100%;
          margin-top: 0.3rem;
        }
        .card-date-main {
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--dark);
          display: block;
        }
        .card-date-sub {
          font-size: 0.58rem;
          color: var(--muted);
          letter-spacing: 0.08em;
          display: block;
          margin-top: 0.1rem;
        }

        .card-bottom-band {
          width: 100%;
          height: 6px;
          background: repeating-linear-gradient(
            90deg,
            var(--gold-border) 0px, #f0d080 3px, var(--gold-border) 6px
          );
          opacity: 0.45;
        }

        .open-btn {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 25;
          background: linear-gradient(135deg, #7b1c1c, #a02828, #7b1c1c);
          border: none;
          outline: none;
          color: #fdf8ee;
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 1rem;
          padding: 0.8rem 2.6rem;
          border-radius: 3px;
          cursor: pointer;
          letter-spacing: 0.06em;
          white-space: nowrap;
          box-shadow:
            0 0 0 1px rgba(201,168,76,0.6),
            0 0 0 4px rgba(123,28,28,0.5),
            0 0 0 5px rgba(201,168,76,0.25),
            0 8px 24px rgba(0,0,0,0.5);
          animation: btnPulse 2.2s ease-in-out infinite;
          transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
        }
        .open-btn:hover {
          background: linear-gradient(135deg, #9a2020, #c03030, #9a2020);
          transform: translateX(-50%) translateY(-3px);
          box-shadow:
            0 0 0 1px rgba(240,208,128,0.9),
            0 0 0 4px rgba(123,28,28,0.6),
            0 0 0 5px rgba(201,168,76,0.4),
            0 12px 32px rgba(0,0,0,0.6);
        }
        .open-btn.hide { opacity: 0; pointer-events: none; transition: opacity 0.3s; }

        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(201,168,76,0.6), 0 0 0 4px rgba(123,28,28,0.5), 0 0 0 5px rgba(201,168,76,0.25), 0 8px 24px rgba(0,0,0,0.5); }
          50%       { box-shadow: 0 0 0 1px rgba(201,168,76,0.8), 0 0 0 4px rgba(123,28,28,0.5), 0 0 0 8px rgba(201,168,76,0.1), 0 8px 24px rgba(0,0,0,0.5); }
        }

        /* ════════════════════════════
           MAIN INVITATION CONTENT
        ════════════════════════════ */
        .invitation-wrap {
          width: 100%;
          max-width: 640px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .invitation-wrap.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .outer-frame {
          width: 100%;
          background: var(--cream);
          border: 3px solid var(--gold-border);
          border-radius: 4px;
          box-shadow:
            0 0 0 6px var(--cream),
            0 0 0 9px var(--gold-border),
            0 8px 40px rgba(0,0,0,0.25);
          position: relative;
          overflow: hidden;
        }

        .outer-frame::before,
        .outer-frame::after {
          content: '❀';
          position: absolute;
          font-size: 1.4rem;
          color: var(--gold-border);
          opacity: 0.5;
          pointer-events: none;
        }
        .outer-frame::before { top: 14px; left: 14px; }
        .outer-frame::after  { bottom: 14px; right: 14px; transform: rotate(180deg); }

        .inner-content {
          padding: 2.5rem 2.2rem 2.8rem;
          position: relative;
          background:
            radial-gradient(ellipse 90% 40% at 50% 0%, rgba(212,160,23,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 60% 30% at 50% 100%, rgba(212,160,23,0.05) 0%, transparent 70%),
            var(--cream);
        }

        .top-band { text-align: center; margin-bottom: 1rem; }

        .ganesha-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 0.6rem;
        }

        .ganesha-icon {
          font-size: 3.8rem;
          line-height: 1;
          margin-bottom: 0.2rem;
          color: var(--orange);
          text-shadow: 0 2px 8px rgba(212,94,0,0.3);
        }

        .sri-text {
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 0.85rem;
          color: var(--gold);
          letter-spacing: 0.15em;
          margin-bottom: 0.1rem;
        }

        .kshanaptram {
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 1rem;
          color: var(--maroon);
          font-weight: 600;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin: 1rem 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--gold-border), transparent);
        }
        .divider-diamond {
          width: 8px; height: 8px;
          background: var(--gold-border);
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        .couple-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0.5rem;
          align-items: start;
          margin: 1.2rem 0;
          text-align: center;
        }

        .person-role {
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          color: var(--muted);
          margin-bottom: 0.3rem;
        }

        .person-name {
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--maroon);
          line-height: 1.2;
          margin-bottom: 0.4rem;
        }

        .person-parents {
          font-size: 0.75rem;
          color: var(--muted);
          line-height: 1.7;
        }

        .person-phone {
          font-size: 0.72rem;
          color: var(--gold);
          margin-top: 0.3rem;
          font-weight: 500;
        }

        .couple-center {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 1.4rem;
        }

        .om-symbol {
          font-size: 2rem;
          color: var(--gold);
          opacity: 0.7;
        }

        .vivaha-title {
          text-align: center;
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--dark);
          margin: 0.5rem 0 1rem;
        }

        .info-boxes {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.6rem;
          margin-bottom: 1.5rem;
        }

        .info-box {
          border: 1.5px solid var(--gold-border);
          border-radius: 6px;
          padding: 0.9rem 0.5rem;
          text-align: center;
          background: rgba(255,255,255,0.5);
        }

        .info-box-icon {
          font-size: 1.1rem;
          margin-bottom: 0.3rem;
          display: block;
          color: var(--gold);
        }

        .info-box-label {
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          color: var(--muted);
          margin-bottom: 0.4rem;
          font-weight: 500;
        }

        .info-box-main {
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--dark);
          line-height: 1.3;
        }

        .info-box-sub {
          font-size: 0.68rem;
          color: var(--muted);
          margin-top: 0.25rem;
          line-height: 1.5;
        }

        .countdown-section { margin: 0 0 1.5rem; }

        .countdown-label {
          text-align: center;
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          color: var(--gold);
          text-transform: uppercase;
          margin-bottom: 0.8rem;
          opacity: 0.8;
        }

        .countdown-grid {
          display: flex;
          border: 1.5px solid var(--gold-border);
          border-radius: 6px;
          overflow: hidden;
          background: rgba(255,255,255,0.4);
        }

        .countdown-unit {
          flex: 1;
          text-align: center;
          padding: 0.9rem 0.4rem;
          border-right: 1px solid rgba(201,168,76,0.3);
        }
        .countdown-unit:last-child { border-right: none; }

        .cd-num {
          font-family: 'Cinzel', serif;
          font-size: 1.8rem;
          color: var(--maroon);
          line-height: 1;
          display: block;
          font-weight: 500;
        }

        .cd-lbl {
          font-size: 0.5rem;
          letter-spacing: 0.15em;
          color: var(--muted);
          text-transform: uppercase;
          margin-top: 0.3rem;
          display: block;
        }

        .reception-block {
          background: linear-gradient(135deg, rgba(212,160,23,0.08), rgba(212,160,23,0.03));
          border: 1px solid rgba(201,168,76,0.35);
          border-radius: 6px;
          padding: 1.2rem 1.4rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .reception-intro { font-size: 0.82rem; color: var(--muted); margin-bottom: 0.4rem; }

        .reception-date {
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--maroon);
          margin-bottom: 0.3rem;
        }

        .reception-time { font-size: 0.78rem; color: var(--muted); margin-bottom: 0.7rem; }

        .reception-venue {
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--dark);
          line-height: 1.6;
        }

        .reception-invite {
          font-size: 0.8rem;
          color: var(--muted);
          margin-top: 0.6rem;
          line-height: 1.7;
        }

        .map-section { margin-bottom: 1.5rem; }

        .map-section-title {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.8rem;
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          color: var(--gold);
          text-transform: uppercase;
          font-weight: 600;
        }
        .map-section-title span {
          flex: 1; height: 1px;
          background: linear-gradient(to right, var(--gold-border), transparent);
        }

        .maps-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
        }

        .map-card-label {
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--maroon);
          margin-bottom: 0.45rem;
          text-align: center;
        }

        .map-card-sub {
          font-size: 0.6rem;
          color: var(--muted);
          text-align: center;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .map-container {
          width: 100%;
          height: 170px;
          border: 1.5px solid var(--gold-border);
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        .map-container iframe {
          width: 100%; height: 100%;
          border: none;
          filter: sepia(0.25) saturate(0.85);
        }

        .map-dir-btn {
          position: absolute;
          bottom: 0.5rem; right: 0.5rem;
          background: var(--maroon);
          color: #fdf8ee;
          font-size: 0.52rem;
          letter-spacing: 0.08em;
          padding: 0.35rem 0.6rem;
          text-decoration: none;
          border-radius: 3px;
          font-family: 'Noto Sans Malayalam', sans-serif;
          font-weight: 500;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .map-dir-btn:hover { background: var(--dark); }

        @media (max-width: 480px) {
          .maps-grid { grid-template-columns: 1fr; }
          .map-container { height: 200px; }
        }

        .hosts-block { text-align: center; margin-bottom: 1.2rem; }

        .hosts-names {
          font-family: 'Noto Serif Malayalam', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--dark);
          line-height: 1.7;
        }

        .hosts-sub {
          font-size: 0.72rem;
          color: var(--muted);
          margin-top: 0.4rem;
          line-height: 1.6;
        }

        .note-tag {
          display: inline-block;
          border: 1px solid var(--gold-border);
          border-radius: 20px;
          padding: 0.35rem 1rem;
          font-size: 0.72rem;
          color: var(--maroon);
          font-weight: 600;
          font-family: 'Noto Serif Malayalam', serif;
        }

        .note-row { text-align: center; margin-top: 0.5rem; }

        .gold-border-top, .gold-border-bottom {
          height: 8px;
          background: repeating-linear-gradient(
            90deg,
            var(--gold-border) 0px,
            var(--gold-pale) 4px,
            var(--gold-border) 8px
          );
          opacity: 0.5;
        }

        .corner-tl, .corner-tr, .corner-bl, .corner-br {
          position: absolute;
          width: 40px; height: 40px;
          border-color: var(--gold-border);
          border-style: solid;
          opacity: 0.6;
        }
        .corner-tl { top: 18px; left: 18px; border-width: 2px 0 0 2px; }
        .corner-tr { top: 18px; right: 18px; border-width: 2px 2px 0 0; }
        .corner-bl { bottom: 18px; left: 18px; border-width: 0 0 2px 2px; }
        .corner-br { bottom: 18px; right: 18px; border-width: 0 2px 2px 0; }

        @media (max-width: 480px) {
          .couple-grid { grid-template-columns: 1fr; gap: 1rem; }
          .couple-center { display: none; }
          .info-boxes { grid-template-columns: 1fr; gap: 0.7rem; }
          .info-box { padding: 1rem; }
          .inner-content { padding: 2rem 1.2rem 2.2rem; }
        }

        /* ── BRAND FOOTER ── */
        .brand-footer {
          margin-top: 2rem;
          padding: 1.8rem 1.5rem 1.6rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.55rem;
          background: linear-gradient(to bottom, rgba(42,26,0,0.0), rgba(42,26,0,0.03));
          border-radius: 0 0 4px 4px;
        }

        .brand-divider {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
          margin-bottom: 0.6rem;
        }

        .brand-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent);
        }

        .brand-icon {
          font-size: 0.7rem;
          color: var(--gold-border);
          opacity: 0.7;
        }

        .brand-made {
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--muted);
          opacity: 0.6;
          text-transform: uppercase;
          line-height: 1;
        }

        .brand-heart {
          font-size: 0.85rem;
          color: #c0392b;
          opacity: 0.7;
          animation: heartbeat 1.8s ease-in-out infinite;
          line-height: 1;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14%       { transform: scale(1.25); }
          28%       { transform: scale(1); }
          42%       { transform: scale(1.15); }
          56%       { transform: scale(1); }
        }

        .brand-name {
          font-family: 'Cormorant Garamond', 'Cinzel', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--dark);
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .brand-name span {
          color: var(--gold);
        }

        .brand-tagline {
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          color: var(--muted);
          opacity: 0.55;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
        }

        .wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #1a7a3c, #25a850, #1a7a3c);
          color: #fff;
          font-family: 'Noto Sans Malayalam', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 0.65rem 1.4rem;
          border-radius: 30px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(37,168,80,0.35), 0 0 0 1px rgba(37,168,80,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          margin-top: 0.3rem;
        }

        .wa-btn:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #1e8f45, #2dbc5c, #1e8f45);
          box-shadow: 0 8px 24px rgba(37,168,80,0.45), 0 0 0 1px rgba(37,168,80,0.4);
        }

        .wa-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
      `}</style>

      {/* ── OPENING SCREEN — CURTAIN + CENTRE CARD ── */}
      <div className={`envelope-screen${opened ? " hide" : ""}`}>

        {/* spinning mandala ring */}
        <div className="mandala-ring" />

        {/* floating diya dots */}
        {[...Array(14)].map((_, i) => (
          <div key={i} className="diya" style={{
            left: `${5 + (i * 6.8) % 90}%`,
            top: `${8 + (i * 13) % 80}%`,
            animationDuration: `${1.2 + (i * 0.3) % 2}s`,
            animationDelay: `${(i * 0.4) % 2}s`,
            width: `${4 + (i % 3) * 2}px`,
            height: `${4 + (i % 3) * 2}px`,
          }} />
        ))}

        {/* silk curtains */}
        <div className={`curtain-left${opened ? " open" : ""}`}>
          <div className="silk" />
        </div>
        <div className={`curtain-right${opened ? " open" : ""}`}>
          <div className="silk" />
        </div>

        {/* centre invitation card */}
        <div className="centre-card">
          <div className="card-inner-border" />
          <div className="card-corner tl" />
          <div className="card-corner tr" />
          <div className="card-corner bl" />
          <div className="card-corner br" />

          <div className="card-top-band">
            <span className="card-om">ॐ</span>
            <span className="card-sri">ശ്രീ · ക്ഷണപത്രം</span>
          </div>

          <div className="card-body">
            <div className="card-divider">
              <span className="card-div-line" />
              <span className="card-div-diamond" />
              <span className="card-div-line" />
            </div>
            <div className="card-name">അരുൺകുമാർ</div>
            <div className="card-amp">&amp;</div>
            <div className="card-name">അമൃതലക്ഷ്മി</div>
            <div className="card-divider">
              <span className="card-div-line" />
              <span className="card-div-diamond" />
              <span className="card-div-line" />
            </div>
            <div className="card-date-row">
              <span className="card-date-main">2026 ഏപ്രിൽ 12 · ഞായറാഴ്ച</span>
              <span className="card-date-sub">സുദിനം ഓഡിറ്റോറിയം · കിഴൂർ</span>
            </div>
          </div>

          <div className="card-bottom-band" />
        </div>

        {/* open button */}
        <button
          className={`open-btn${opened ? " hide" : ""}`}
          onClick={handleOpen}
        >
          ക്ഷണം തുറക്കുക
        </button>
      </div>

      {/* ── MAIN INVITATION ── */}
      <div className={`invitation-wrap${showContent ? " visible" : ""}`}>

        {/* sparkle particles */}
        {showContent && <canvas ref={sparkleCanvasRef} className="sparkle-canvas" />}
        <div className="outer-frame">
          <div className="gold-border-top" />
          <div className="corner-tl" />
          <div className="corner-tr" />
          <div className="corner-bl" />
          <div className="corner-br" />

          <div className="inner-content">

            <div className="top-band scroll-reveal">
              <div className="ganesha-wrap">
                <span className="ganesha-icon">ॐ</span>
                <span className="sri-text">ശ്രീ</span>
                <span className="kshanaptram">ക്ഷണപത്രം</span>
              </div>
            </div>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-diamond" />
              <span className="divider-line" />
            </div>

            <div className="couple-grid scroll-reveal delay-1">
              <div className="person-block">
                <div className="person-role">വരൻ:</div>
                <div className="person-name">അരുൺകുമാർ</div>
                <div className="person-parents">
                  S/o. പത്മനാഭൻ &amp; ഉമാദേവി<br />
                  ശ്രീശക്തി, കിഴൂർ
                </div>
                <div className="person-phone">📞 9946829269</div>
              </div>

              <div className="couple-center">
                <div className="om-symbol">🔱</div>
              </div>

              <div className="person-block">
                <div className="person-role">വധു:</div>
                <div className="person-name">അമൃതലക്ഷ്മി</div>
                <div className="person-parents">
                  D/o. രവീന്ദ്രൻ &amp; പ്രീത<br />
                  മണ്ടോളക്കാമ്പ്രത്ത്<br />
                  താറോപ്പൊയിൽ
                </div>
              </div>
            </div>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-diamond" />
              <span className="divider-line" />
            </div>

            <div className="vivaha-title scroll-reveal delay-1">വിവാഹസുദിനം</div>

            <div className="info-boxes scroll-reveal delay-2">
              <div className="info-box">
                <span className="info-box-icon">📅</span>
                <div className="info-box-label">തീയതി</div>
                <div className="info-box-main">2026 ഏപ്രിൽ 12</div>
                <div className="info-box-sub">ഞായറാഴ്ച<br />(1201 മീനം 29)</div>
              </div>
              <div className="info-box">
                <span className="info-box-icon">📍</span>
                <div className="info-box-label">വിവാഹവേദി</div>
                <div className="info-box-main">സുദിനം<br />ഓഡിറ്റോറിയം</div>
                <div className="info-box-sub">അവള മഠത്തിൽമുക്ക്</div>
              </div>
              <div className="info-box">
                <span className="info-box-icon">🕐</span>
                <div className="info-box-label">മുഹൂർത്തം</div>
                <div className="info-box-main">പകൽ</div>
                <div className="info-box-sub">11നും 12നും<br />മദ്ധ്യേ</div>
              </div>
            </div>

            <div className="countdown-section scroll-reveal delay-2">
              <div className="countdown-label">ശുഭദിനം വരെ</div>
              <div className="countdown-grid">
                {[
                  { n: timeLeft.days, l: "ദിവസം" },
                  { n: timeLeft.hours, l: "മണിക്കൂർ" },
                  { n: timeLeft.minutes, l: "മിനിറ്റ്" },
                  { n: timeLeft.seconds, l: "സെക്കൻഡ്" },
                ].map(({ n, l }) => (
                  <div key={l} className="countdown-unit">
                    <span className="cd-num">{String(n).padStart(2, "0")}</span>
                    <span className="cd-lbl">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="reception-block scroll-reveal delay-1">
              <div className="reception-intro">ഇവർ തമ്മിലുള്ള വിവാഹത്തിലും</div>
              <div className="reception-date">2026 ഏപ്രിൽ 13 തിങ്കളാഴ്ച</div>
              <div className="reception-time">വൈകുന്നേരം 4 മണി മുതൽ രാത്രി 9 മണിവരെ</div>
              <div className="reception-venue">
                പയ്യോളി പെരുമ ഓഡിറ്റോറിയത്തിൽ ഒരുക്കുന്ന<br />
                സൗഹൃദ-സൽക്കാരത്തിലും
              </div>
              <div className="reception-invite">താങ്കളെ കുടുംബസമേതം ക്ഷണിക്കുന്നു.</div>
            </div>

            <div className="map-section scroll-reveal delay-2">
              <div className="map-section-title">
                വേദി
                <span />
              </div>
              <div className="maps-grid">

                {/* Sudhinam — Ceremony */}
                <div>
                  <div className="map-card-label">വിവാഹവേദി</div>
                  <div className="map-card-sub">സുദിനം ഓഡിറ്റോറിയം</div>
                  <div className="map-container">
                    <iframe
                      src="https://www.openstreetmap.org/export/embed.html?bbox=75.6981%2C11.5822%2C75.7181%2C11.6022&layer=mapnik&marker=11.5922%2C75.7081"
                      allowFullScreen
                      loading="lazy"
                      title="Sudhinam Auditorium"
                    />
                    <a
                      href="https://maps.app.goo.gl/w6kLP12soaDz7bcv5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-dir-btn"
                    >
                      വഴി കാണുക →
                    </a>
                  </div>
                </div>

                {/* Peruma — Reception */}
                <div>
                  <div className="map-card-label">സൽക്കാരവേദി</div>
                  <div className="map-card-sub">പെരുമ ഓഡിറ്റോറിയം</div>
                  <div className="map-container">
                    <iframe
                      src="https://www.openstreetmap.org/export/embed.html?bbox=75.9160%2C11.5030%2C75.9360%2C11.5230&layer=mapnik&marker=11.5130%2C75.9260"
                      allowFullScreen
                      loading="lazy"
                      title="Peruma Auditorium"
                    />
                    <a
                      href="https://maps.app.goo.gl/TKaEDHwQbQD6ph21A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-dir-btn"
                    >
                      വഴി കാണുക →
                    </a>
                  </div>
                </div>

              </div>
            </div>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-diamond" />
              <span className="divider-line" />
            </div>

            <div className="hosts-block scroll-reveal delay-1">
              <div className="hosts-names">
                പത്മനാഭൻ മണന്തല<br />
                ഉമാദേവി പത്മനാഭൻ
              </div>
              <div className="hosts-sub">
                ഉപചാരപൂർവ്വം: വരുൺ, മണന്തല ഫാമിലി &amp; മേലത്ത് ഫാമിലി
              </div>
            </div>

            <div className="note-row scroll-reveal delay-2">
              <span className="note-tag">തലേദിവസം പാർട്ടി ഉണ്ടായിരിക്കുന്നതല്ല</span>
            </div>

          </div>
          <div className="gold-border-bottom" />

          {/* ── Brand Footer ── */}
          <div className="brand-footer">
            <div className="brand-divider">
              <span className="brand-line" /><span className="brand-icon">✦</span><span className="brand-line" />
            </div>
            <p className="brand-made">Crafted with</p>
            <div className="brand-heart">♥</div>
            <div className="brand-name">Invite<span>ly</span></div>
            <p className="brand-tagline">Premium Digital Invitations</p>
            <a href="https://wa.me/919846932069?text=Hi%2C%20I%27d%20like%20to%20create%20a%20premium%20digital%20invitation%20for%20my%20event%20%F0%9F%8C%B8" target="_blank" rel="noopener noreferrer" className="wa-btn">
              <svg viewBox="0 0 24 24" className="wa-icon" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Create Your Invitation
            </a>
          </div>

        </div>

      </div>
    </>
  );
}