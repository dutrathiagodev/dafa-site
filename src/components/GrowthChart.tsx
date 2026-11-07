"use client";

import { useRef } from "react";
import { brand } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const PHASES = [
  { text: "Postar por postar.", tone: "text-[#ff6b86]" },
  { text: "Constância.", tone: "text-ink" },
  { text: "Constância + direção.", tone: "text-[#a9abff]" },
];

const GLYPHS = "abcdefghijklmnopqrstuvwxyz+.";

/** Efeito de "digitação embaralhada" ao trocar de frase. */
function scramble(el: HTMLElement, final: string) {
  const state = { p: 0 };
  gsap.killTweensOf(state);
  return gsap.to(state, {
    p: 1,
    duration: 0.7,
    ease: "power2.out",
    onUpdate: () => {
      const reveal = Math.floor(state.p * final.length);
      el.textContent = final
        .split("")
        .map((c, i) =>
          i < reveal || c === " "
            ? c
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        )
        .join("");
    },
    onComplete: () => {
      el.textContent = final;
    },
  });
}

/**
 * Gráfico conceitual (sem dados): postar sem estratégia oscila,
 * constância cresce em linha, constância com direção acelera.
 */
export default function GrowthChart() {
  const root = useRef<HTMLElement>(null);
  const label = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<SVGPathElement>("[data-line]");
      const reduce = prefersReducedMotion();

      if (reduce) {
        gsap.set(lines, { strokeDashoffset: 0 });
        gsap.set(lines.slice(0, 2), { opacity: 0.25 });
        return;
      }

      gsap.set(lines, { strokeDashoffset: 1 });
      let phase = -1;
      const setPhase = (n: number) => {
        if (n === phase || !label.current) return;
        phase = n;
        label.current.className = `font-semibold transition-colors duration-500 ${PHASES[n].tone}`;
        scramble(label.current, PHASES[n].text);
      };
      setPhase(0);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=260%",
          pin: "[data-chart-pin]",
          scrub: 0.6,
          onUpdate: (self) => {
            const t = self.progress;
            setPhase(t < 0.36 ? 0 : t < 0.68 ? 1 : 2);
          },
        },
      });

      tl.to(lines[0], { strokeDashoffset: 0, duration: 1 })
        .to({}, { duration: 0.3 })
        .to(lines[0], { opacity: 0.12, duration: 0.3 })
        .to(lines[1], { strokeDashoffset: 0, duration: 1 }, "<")
        .to({}, { duration: 0.3 })
        .to(lines[1], { opacity: 0.18, duration: 0.3 })
        .to(lines[2], { strokeDashoffset: 0, duration: 1.2 }, "<")
        .fromTo(
          "[data-chart-glow]",
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.6",
        )
        .fromTo(
          "[data-chart-quote]",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.5 },
          "-=0.4",
        )
        .to({}, { duration: 0.3 });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="direcao-title"
      className="relative"
    >
      <div
        data-chart-pin
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center"
      >
        <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_45%,rgba(16,16,236,.18),transparent_70%)]" />
        <p className="relative text-xs tracking-[0.3em] text-muted uppercase">
          Por que direção importa
        </p>
        <h2 id="direcao-title" className="sr-only">
          Por que conteúdo com direção faz diferença
        </h2>

        <svg
          viewBox="0 0 400 300"
          className="relative mt-6 w-[min(560px,92vw)] overflow-visible"
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
          {/* grade */}
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={40 + i * 40}
              x2={40 + i * 40}
              y1="30"
              y2="260"
              stroke="rgba(255,255,255,.05)"
            />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line
              key={`h${i}`}
              x1="40"
              x2="370"
              y1={30 + i * 46}
              y2={30 + i * 46}
              stroke="rgba(255,255,255,.05)"
            />
          ))}
          <path
            d="M40 30V260H370"
            fill="none"
            stroke="rgba(244,244,248,.7)"
            strokeWidth="2"
          />

          <path
            data-line
            pathLength={1}
            strokeDasharray="1"
            d="M50,230 L78,172 L100,204 L124,140 L150,192 L174,160 L196,216 L220,118 L246,178 L270,150 L294,204 L320,110 L344,168 L362,132"
            fill="none"
            stroke="#ff4f72"
            strokeWidth="2.4"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
          <path
            data-line
            pathLength={1}
            strokeDasharray="1"
            d="M50,236 L362,148"
            fill="none"
            stroke="#e9eaff"
            strokeWidth="2.4"
            filter="url(#glow)"
          />
          <g data-chart-glow opacity="0">
            <path
              d="M50,242 C210,238 305,200 362,36"
              fill="none"
              stroke="#3333ff"
              strokeWidth="14"
              opacity=".35"
              filter="url(#glow)"
            />
          </g>
          <path
            data-line
            pathLength={1}
            strokeDasharray="1"
            d="M50,242 C210,238 305,200 362,36"
            fill="none"
            stroke="url(#expGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
          />
        </svg>

        <div className="relative mt-6 h-[1.3em] text-[clamp(1.6rem,4.5vw,3rem)] tracking-tight">
          <p ref={label} className="font-semibold text-[#ff6b86]" aria-live="off">
            {PHASES[0].text}
          </p>
        </div>

        <blockquote
          data-chart-quote
          className="relative mt-8 max-w-2xl text-lg leading-snug text-muted sm:text-2xl"
        >
          “{brand.quote}”
        </blockquote>
        <p className="relative mt-4 text-[11px] text-muted/50">
          Ilustração conceitual, sem dados reais.
        </p>
      </div>
    </section>
  );
}
