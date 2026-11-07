"use client";

import { useRef } from "react";
import { brand } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const PHASES = [
  {
    text: "postar por postar.",
    color: "#ff6b86",
    d: "M50,230 L78,172 L100,204 L124,140 L150,192 L174,160 L196,216 L220,118 L246,178 L270,150 L294,204 L320,110 L344,168 L362,132",
  },
  { text: "constância.", color: "#e9eaff", d: "M50,236 L362,148" },
  { text: "constância + direção.", color: "#a9abff", d: "M50,242 C210,238 305,200 362,36" },
];
const STROKES = ["#ff4f72", "#e9eaff", "url(#expGrad)"];
const GLYPHS = "abcdefghijklmnopqrstuvwxyz";

/**
 * Gráfico em motion design: uma animação contínua em loop (como um vídeo),
 * sem cortes. Os eixos se desenham, cada linha entra com o texto sendo
 * digitado, sai, e a próxima entra; no fim a curva azul acende e o ciclo
 * recomeça. Toca só quando está na tela.
 */
export default function GrowthChart() {
  const root = useRef<HTMLElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<SVGPathElement>("[data-line]");
      const axes = root.current!.querySelector("[data-axes]");
      const grid = root.current!.querySelector("[data-grid]");
      const glow = root.current!.querySelector("[data-chart-glow]");
      const svg = root.current!.querySelector("[data-chart-svg]");
      const el = label.current!;

      if (prefersReducedMotion()) {
        gsap.set(lines, { strokeDashoffset: 0, opacity: (i: number) => (i === 2 ? 1 : 0.18) });
        gsap.set([axes, glow], { strokeDashoffset: 0, opacity: 1 });
        el.textContent = PHASES[2].text;
        el.style.color = PHASES[2].color;
        return;
      }

      // Digita o texto letra por letra
      const typeIn = (text: string, color: string, duration: number) => {
        const st = { n: 0 };
        return gsap.to(st, {
          n: text.length,
          duration,
          ease: "none",
          onStart: () => {
            el.style.color = color;
          },
          onUpdate: () => {
            el.textContent = text.slice(0, Math.round(st.n));
          },
        });
      };
      // Some com um embaralhado rápido (glitch de edição)
      const glitchOut = (text: string, duration: number) => {
        const st = { p: 0 };
        return gsap.to(st, {
          p: 1,
          duration,
          ease: "power1.in",
          onUpdate: () => {
            const keep = Math.round(text.length * (1 - st.p));
            el.textContent = text
              .slice(0, keep)
              .split("")
              .map((c) => (c !== " " && Math.random() < 0.45 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : c))
              .join("");
          },
          onComplete: () => {
            el.textContent = "";
          },
        });
      };

      const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "none" } });
      tl.set(lines, { strokeDashoffset: 1, opacity: 1 })
        .set(glow, { opacity: 0 })
        .set(svg, { scale: 1, transformOrigin: "50% 60%" })
        .call(() => {
          el.textContent = "";
        })
        .fromTo(axes, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" })
        .fromTo(grid, { opacity: 0 }, { opacity: 1, duration: 0.6 }, "<0.2");

      PHASES.forEach((p, i) => {
        const line = lines[i];
        const last = i === PHASES.length - 1;
        tl.add(typeIn(p.text, p.color, 0.7), ">-0.1").to(
          line,
          { strokeDashoffset: 0, duration: last ? 2 : 1.7, ease: "power1.inOut" },
          "<",
        );
        if (last) {
          tl.to(glow, { opacity: 1, duration: 0.8 }, "-=0.9")
            .to(svg, { scale: 1.04, duration: 2.6, ease: "sine.inOut" }, "<")
            .to("[data-chart-quote]", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "<0.3")
            .to({}, { duration: 1.6 })
            // Saída: tudo se apaga suavemente e o loop recomeça
            .add(glitchOut(p.text, 0.5))
            .to(line, { strokeDashoffset: -1, duration: 1, ease: "power1.in" }, "<")
            .to(glow, { opacity: 0, duration: 0.6 }, "<")
            .to(axes, { strokeDashoffset: -1, duration: 0.8, ease: "power2.in" }, "<0.3")
            .to(grid, { opacity: 0, duration: 0.5 }, "<")
            .to(svg, { scale: 1, duration: 0.8 }, "<");
        } else {
          tl.to({}, { duration: 1 })
            .add(glitchOut(p.text, 0.45))
            .to(line, { strokeDashoffset: -1, duration: 0.9, ease: "power1.in" }, "<");
        }
      });

      gsap.set("[data-chart-quote]", { opacity: 0, y: 16 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 75%",
        end: "bottom 15%",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="direcao-title" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_45%,rgba(16,16,236,.18),transparent_70%)]" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center">
        <p className="text-xs tracking-[0.3em] text-muted uppercase">Por que direção importa</p>
        <h2 id="direcao-title" className="sr-only">
          Por que conteúdo com direção faz diferença: postar por postar oscila, constância cresce
          em linha e constância com direção cresce cada vez mais.
        </h2>

        <svg
          data-chart-svg
          viewBox="0 0 400 300"
          className="mt-8 w-[min(560px,92vw)] overflow-visible"
          aria-hidden="true"
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
          <g data-grid>
            {Array.from({ length: 9 }, (_, i) => (
              <line key={`v${i}`} x1={40 + i * 40} x2={40 + i * 40} y1="30" y2="260" stroke="rgba(255,255,255,.05)" />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <line key={`h${i}`} x1="40" x2="370" y1={30 + i * 46} y2={30 + i * 46} stroke="rgba(255,255,255,.05)" />
            ))}
          </g>
          <path
            data-axes
            d="M40 30V260H370"
            pathLength={1}
            strokeDasharray="1"
            fill="none"
            stroke="rgba(244,244,248,.75)"
            strokeWidth="2"
          />
          <g data-chart-glow opacity="0">
            <path d={PHASES[2].d} fill="none" stroke="#3333ff" strokeWidth="14" opacity=".35" filter="url(#glow)" />
          </g>
          {PHASES.map((p, i) => (
            <path
              key={p.text}
              data-line
              d={p.d}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              fill="none"
              stroke={STROKES[i]}
              strokeWidth={i === 2 ? 3 : 2.4}
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#glow)"
            />
          ))}
        </svg>

        <p
          aria-hidden="true"
          className="mt-6 flex h-[1.3em] items-center text-[clamp(1.6rem,4.5vw,3rem)] font-semibold tracking-tight"
        >
          <span ref={label} className="text-[#ff6b86]" />
          <span className="animate-rec ml-1 inline-block h-[0.9em] w-[3px] bg-current text-white/70" />
        </p>

        <blockquote data-chart-quote className="mt-8 max-w-2xl text-lg leading-snug text-muted sm:text-2xl">
          “{brand.quote}”
        </blockquote>
        <p className="mt-4 text-[11px] text-muted/50">Ilustração conceitual, sem dados reais.</p>
      </div>
    </section>
  );
}
