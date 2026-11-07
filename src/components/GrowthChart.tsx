"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { brand } from "@/content/site";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const PHASES = [
  {
    label: "Postar por postar",
    text: "Postar por postar.",
    tone: "text-[#ff6b86]",
    d: "M50,230 L78,172 L100,204 L124,140 L150,192 L174,160 L196,216 L220,118 L246,178 L270,150 L294,204 L320,110 L344,168 L362,132",
  },
  {
    label: "Constância",
    text: "Constância.",
    tone: "text-ink",
    d: "M50,236 L362,148",
  },
  {
    label: "Constância + direção",
    text: "Constância + direção.",
    tone: "text-[#a9abff]",
    d: "M50,242 C210,238 305,200 362,36",
  },
];
const STROKES = ["#ff4f72", "#e9eaff", "url(#expGrad)"];
const GLYPHS = "abcdefghijklmnopqrstuvwxyz+.";

/** Efeito de "digitação embaralhada" ao trocar de frase. */
function scramble(el: HTMLElement, final: string) {
  const st = { p: 0 };
  return gsap.to(st, {
    p: 1,
    duration: 0.7,
    ease: "power2.out",
    onUpdate: () => {
      const reveal = Math.floor(st.p * final.length);
      el.textContent = final
        .split("")
        .map((c, i) =>
          i < reveal || c === " " ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        )
        .join("");
    },
    onComplete: () => {
      el.textContent = final;
    },
  });
}

/**
 * Gráfico conceitual (sem dados) e interativo, sem travar o scroll:
 * botões desenham cada linha, avançam sozinhos até alguém clicar,
 * e um ponto de luz segue o mouse por cima da linha ativa.
 */
export default function GrowthChart() {
  const root = useRef<HTMLElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const lines = useRef<(SVGPathElement | null)[]>([]);
  const dot = useRef<SVGGElement>(null);
  const samples = useRef<{ x: number; y: number }[][]>([]);
  const userPicked = useRef(false);
  const [phase, setPhase] = useState(0);

  const show = useCallback((n: number) => {
    const reduce = prefersReducedMotion();
    lines.current.forEach((el, i) => {
      if (!el) return;
      if (i === n) {
        gsap.fromTo(
          el,
          { strokeDashoffset: reduce ? 0 : 1, opacity: 1 },
          { strokeDashoffset: 0, duration: reduce ? 0 : 1.3, ease: "power2.inOut" },
        );
      } else {
        gsap.to(el, { opacity: i < n ? 0.16 : 0, duration: 0.4 });
      }
    });
    gsap.to("[data-chart-glow]", { opacity: n === 2 ? 1 : 0, duration: 0.6, delay: n === 2 ? 0.7 : 0 });
    if (label.current) {
      label.current.className = `font-semibold transition-colors duration-500 ${PHASES[n].tone}`;
      if (reduce) label.current.textContent = PHASES[n].text;
      else scramble(label.current, PHASES[n].text);
    }
    setPhase(n);
  }, []);

  useEffect(() => {
    // Pontos de cada linha para o ponto de luz seguir o mouse
    samples.current = lines.current.map((el) => {
      if (!el) return [];
      const len = el.getTotalLength();
      return Array.from({ length: 120 }, (_, i) => {
        const p = el.getPointAtLength((i / 119) * len);
        return { x: p.x, y: p.y };
      });
    });
    lines.current.forEach((el) => el && gsap.set(el, { strokeDashoffset: 1, opacity: 0 }));

    let timer: ReturnType<typeof setInterval> | undefined;
    let current = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !timer) {
          show(current);
          if (prefersReducedMotion()) return;
          timer = setInterval(() => {
            if (userPicked.current) return clearInterval(timer);
            current = (current + 1) % PHASES.length;
            show(current);
          }, 3400);
        } else if (!e.isIntersecting && timer) {
          clearInterval(timer);
          timer = undefined;
        }
      },
      { threshold: 0.4 },
    );
    io.observe(root.current!);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [show]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const local = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const pts = samples.current[phase];
    if (!pts?.length || !dot.current) return;
    const near = pts.reduce((a, b) => (Math.abs(b.x - local.x) < Math.abs(a.x - local.x) ? b : a));
    gsap.to(dot.current, { x: near.x, y: near.y, opacity: 1, duration: 0.25, ease: "power2.out" });
  };

  return (
    <section ref={root} aria-labelledby="direcao-title" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_45%,rgba(16,16,236,.18),transparent_70%)]" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center">
        <p className="text-xs tracking-[0.3em] text-muted uppercase">Por que direção importa</p>
        <h2 id="direcao-title" className="sr-only">
          Por que conteúdo com direção faz diferença
        </h2>

        <div role="group" aria-label="Escolha um cenário" className="mt-6 flex flex-wrap justify-center gap-2">
          {PHASES.map((p, i) => (
            <button
              key={p.label}
              type="button"
              aria-pressed={phase === i}
              onClick={() => {
                userPicked.current = true;
                show(i);
              }}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                phase === i
                  ? "border-electric bg-electric text-white shadow-[0_0_24px_-4px_#3333ff]"
                  : "border-white/12 text-muted hover:border-white/35 hover:text-ink"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <svg
          viewBox="0 0 400 300"
          onPointerMove={onMove}
          onPointerLeave={() => dot.current && gsap.to(dot.current, { opacity: 0, duration: 0.3 })}
          className="mt-6 w-[min(560px,92vw)] cursor-crosshair overflow-visible"
          role="img"
          aria-label="Ilustração conceitual: postar sem estratégia oscila; constância cresce de forma linear; constância com direção cresce cada vez mais."
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="expGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#3333ff" />
              <stop offset="1" stopColor="#b8baff" />
            </linearGradient>
          </defs>
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1={40 + i * 40} x2={40 + i * 40} y1="30" y2="260" stroke="rgba(255,255,255,.05)" />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`h${i}`} x1="40" x2="370" y1={30 + i * 46} y2={30 + i * 46} stroke="rgba(255,255,255,.05)" />
          ))}
          <path d="M40 30V260H370" fill="none" stroke="rgba(244,244,248,.7)" strokeWidth="2" />

          <g data-chart-glow opacity="0">
            <path d={PHASES[2].d} fill="none" stroke="#3333ff" strokeWidth="14" opacity=".35" filter="url(#glow)" />
          </g>
          {PHASES.map((p, i) => (
            <path
              key={p.label}
              ref={(el) => {
                lines.current[i] = el;
              }}
              d={p.d}
              pathLength={1}
              strokeDasharray="1"
              fill="none"
              stroke={STROKES[i]}
              strokeWidth={i === 2 ? 3 : 2.4}
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          ))}
          <g ref={dot} opacity="0" style={{ pointerEvents: "none" }}>
            <circle r="9" fill="#3333ff" opacity=".35" />
            <circle r="4" fill="#ffffff" />
          </g>
        </svg>

        <div className="mt-4 h-[1.3em] text-[clamp(1.6rem,4.5vw,3rem)] tracking-tight">
          <p ref={label} className="font-semibold text-[#ff6b86]">
            {PHASES[0].text}
          </p>
        </div>

        <blockquote className="mt-8 max-w-2xl text-lg leading-snug text-muted sm:text-2xl">
          “{brand.quote}”
        </blockquote>
        <p className="mt-4 text-[11px] text-muted/50">Ilustração conceitual, sem dados reais.</p>
      </div>
    </section>
  );
}
