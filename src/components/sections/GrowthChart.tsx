"use client";

import { useRef } from "react";
import { brand } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Eyebrow } from "@/components/ui/section-heading";

/*
 * Roteiro (como o vídeo de referência):
 * 1. o gráfico nasce pequeno no canto e cresce enquanto a linha é desenhada;
 * 2. o texto é digitado, os pontinhos animam, embaralha e some;
 * 3. na última fase a linha muda de cor enquanto desenha (vermelho → verde → azul),
 *    o fundo dá um flash e a curva rompe o canto da grade: os quadradinhos
 *    de cima à direita quebram e voam para fora;
 * 4. tudo some e o loop recomeça.
 */
const JAGGED =
  "M50,230 L78,172 L100,204 L124,140 L150,192 L174,160 L196,216 L220,118 L246,178 L270,150 L294,204 L320,110 L344,168 L362,132";
const LINEAR = "M50,236 L362,148";
const EXP = "M50,242 C210,238 305,200 362,36";
const BREAK = "M362,36 C366,8 369,-30 372,-96";
const GLYPHS = "abcdefghijklmnopqrstuvwxyz";
const ORIGIN = "40 260"; // canto dos eixos (o gráfico cresce a partir daqui)
const GRID_LINE = "rgba(255,255,255,.07)";

/*
 * A grade é feita de quadradinhos independentes (só a borda de cima e a da
 * direita de cada um; os eixos fecham o resto). Os do canto de cima à direita
 * são os "cacos": quando a curva rompe o gráfico, eles quebram e saem voando.
 */
const COLS = 8;
const ROWS = 5;
const CW = 40;
const CH = 46;
const BREAK_AT = { x: 330, y: 70 }; // de onde os cacos se afastam
const cells = Array.from({ length: COLS * ROWS }, (_, k) => {
  const c = k % COLS;
  const r = Math.floor(k / COLS);
  const x = 40 + c * CW;
  const y = 30 + r * CH;
  const shard = (r <= 1 && c >= 5) || (r === 2 && c === 7);
  const dx = x + CW / 2 - BREAK_AT.x;
  const dy = y + CH / 2 - BREAK_AT.y;
  const len = Math.hypot(dx, dy) || 1;
  return { k, d: `M${x},${y}H${x + CW}V${y + CH}`, shard, ux: dx / len, uy: dy / len };
});
const shardCells = cells.filter((c) => c.shard);

export default function GrowthChart() {
  const root = useRef<HTMLElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const [jag, lin, exp, brk] = q("[data-line]") as unknown as SVGPathElement[];
      const chart = q("[data-chart]")[0];
      const axes = q("[data-axes]")[0];
      const grid = q("[data-grid]")[0];
      const glow = q("[data-chart-glow]")[0];
      const flash = q("[data-flash]")[0];
      const quote = q("[data-chart-quote]")[0];
      const shards = q("[data-shard]");
      const resetShards = { x: 0, y: 0, rotation: 0, opacity: 1, stroke: GRID_LINE };
      const el = label.current!;

      if (prefersReducedMotion()) {
        gsap.set([jag, lin], { opacity: 0 });
        gsap.set([exp, brk, axes], { strokeDashoffset: 0 });
        gsap.set(glow, { opacity: 1 });
        el.textContent = "constância + direção";
        el.style.color = "#a9abff";
        return;
      }

      const setText = (t: string) => {
        el.textContent = t;
      };
      // Digitação letra por letra
      const type = (text: string, color: string, duration: number) => {
        const st = { n: 0 };
        return gsap.to(st, {
          n: text.length,
          duration,
          ease: "none",
          onStart: () => {
            el.style.color = color;
            el.style.opacity = "1";
          },
          onUpdate: () => setText(text.slice(0, Math.round(st.n))),
        });
      };
      // Pontinhos: "texto." → "texto.." → "texto..."
      const dots = (text: string) =>
        gsap
          .timeline()
          .call(() => setText(`${text}.`))
          .call(() => setText(`${text}..`), [], 0.35)
          .call(() => setText(`${text}...`), [], 0.7)
          .to({}, { duration: 0.35 });
      // Embaralha e some (glitch de edição)
      const glitch = (text: string, duration: number) => {
        const st = { p: 0 };
        return gsap.to(st, {
          p: 1,
          duration,
          ease: "power1.in",
          onUpdate: () => {
            const keep = Math.round(text.length * (1 - st.p * 0.6));
            setText(
              text
                .slice(0, keep)
                .split("")
                .map((c) => (c !== " " && Math.random() < 0.5 ? GLYPHS[(Math.random() * 26) | 0] : c))
                .join(""),
            );
          },
          onComplete: () => setText(""),
        });
      };

      // Gráfico nasce pequeno e cresce enquanto a linha é desenhada
      const grow = (line: SVGPathElement, drawDur: number) =>
        gsap
          .timeline()
          .set(chart, { opacity: 1 })
          .set([axes, line], { strokeDashoffset: 1 })
          .fromTo(chart, { scale: 0.12, svgOrigin: ORIGIN }, { scale: 1, svgOrigin: ORIGIN, duration: drawDur * 0.85, ease: "expo.out" }, 0)
          .to(axes, { strokeDashoffset: 0, duration: drawDur * 0.45, ease: "power2.out" }, 0)
          .fromTo(grid, { opacity: 0 }, { opacity: 1, duration: drawDur * 0.6 }, 0.1)
          .to(line, { strokeDashoffset: 0, duration: drawDur, ease: "power2.inOut" }, 0.15);

      // Gráfico escurece e some
      const fadeOut = (line: SVGPathElement) =>
        gsap
          .timeline()
          .to(chart, { opacity: 0.25, duration: 0.35, ease: "power1.out" })
          .to(chart, { opacity: 0, duration: 0.35 })
          .set(line, { strokeDashoffset: 1 });

      const tl = gsap.timeline({ repeat: -1, paused: true });
      tl.set([jag, lin, exp, brk], { strokeDashoffset: 1 })
        .set(exp, { stroke: "#ff4f72" })
        .set([glow, flash], { opacity: 0 })
        .set(shards, resetShards)
        .set(chart, { opacity: 0, scale: 1, svgOrigin: ORIGIN })
        .call(() => setText(""));

      // 1. postar por postar
      tl.add(grow(jag, 1.6))
        .add(type("postar por postar", "#ff6b86", 0.7), "<0.1")
        .add(dots("postar por postar"), ">")
        .add(glitch("postar por postar", 0.45), ">0.2")
        .add(fadeOut(jag), "<0.05");

      // 2. constância
      tl.add(grow(lin, 1.5), ">0.15")
        .add(type("constância", "#e9eaff", 0.55), "<0.1")
        .add(dots("constância"), ">")
        .add(glitch("constância", 0.45), ">0.2")
        .add(fadeOut(lin), "<0.05");

      // 3. constância + direção: cor muda enquanto desenha, flash e quebra
      tl.add(grow(exp, 2.2), ">0.15")
        .to(exp, { keyframes: { stroke: ["#ff4f72", "#ffb347", "#3ddc84", "#6f6bff", "#8f92ff"] }, duration: 2.2, ease: "none" }, "<0.15")
        .add(type("constância + direção", "#ffffff", 0.9), "<")
        .to(glow, { opacity: 1, duration: 0.8 }, ">-0.5")
        .fromTo(flash, { opacity: 0 }, { opacity: 0.55, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" }, "<")
        .to(el, { color: "#a9abff", duration: 0.6 }, "<")
        .to(quote, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "<0.2")
        // a quebra: a curva sai do gráfico pelo topo e a "câmera" se afasta
        .to(brk, { strokeDashoffset: 0, duration: 0.9, ease: "power2.in" }, ">0.4")
        // o canto da grade racha (acende) e os cacos voam para fora
        .to(shards, { stroke: "rgba(169,171,255,.75)", duration: 0.12 }, "<0.45")
        .to(
          shards,
          {
            x: (i: number) => shardCells[i].ux * gsap.utils.random(70, 160),
            y: (i: number) => shardCells[i].uy * gsap.utils.random(70, 160) - 30,
            rotation: () => gsap.utils.random(-120, 120),
            opacity: 0,
            transformOrigin: "50% 50%",
            duration: 1.3,
            ease: "power3.out",
            stagger: { amount: 0.18, from: "end" },
          },
          ">",
        )
        .to(chart, { scale: 0.9, svgOrigin: "205 150", duration: 1.4, ease: "power2.out" }, "<")
        .to(el, { opacity: 0.45, duration: 0.8 }, "<0.4")
        .to({}, { duration: 1.4 })
        // saída
        .add(glitch("constância + direção", 0.5))
        .to(chart, { opacity: 0, duration: 0.7 }, "<")
        .to(glow, { opacity: 0, duration: 0.6 }, "<")
        .to({}, { duration: 0.4 });

      gsap.set(quote, { opacity: 0, y: 16 });
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
      <div
        data-flash
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_42%,rgba(143,146,255,.35),transparent_70%)] opacity-0"
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center">
        <Eyebrow>Por que direção importa</Eyebrow>
        <h2 id="direcao-title" className="sr-only">
          Por que conteúdo com direção faz diferença: postar por postar oscila, constância cresce
          em linha e constância com direção cresce cada vez mais.
        </h2>

        <svg viewBox="0 0 400 300" className="mt-10 w-[min(560px,92vw)] overflow-visible" aria-hidden="true">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g data-chart opacity="0">
            <g data-grid>
              {cells.map((c) => (
                <path
                  key={c.k}
                  d={c.d}
                  fill="none"
                  stroke={GRID_LINE}
                  strokeWidth="1"
                  {...(c.shard ? { "data-shard": "" } : {})}
                />
              ))}
            </g>
            <path
              data-axes
              d="M40 30V260H360"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              fill="none"
              stroke="rgba(244,244,248,.8)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <g data-chart-glow opacity="0">
              <path d={EXP} fill="none" stroke="#3333ff" strokeWidth="16" opacity=".35" filter="url(#glow)" />
            </g>
            {[
              { d: JAGGED, stroke: "#ff4f72", w: 2.4 },
              { d: LINEAR, stroke: "#5ee58b", w: 2.4 },
              { d: EXP, stroke: "#ff4f72", w: 3 },
              { d: BREAK, stroke: "#8f92ff", w: 3 },
            ].map((l) => (
              <path
                key={l.d}
                data-line
                d={l.d}
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="1"
                fill="none"
                stroke={l.stroke}
                strokeWidth={l.w}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#glow)"
              />
            ))}
          </g>
        </svg>

        <p
          aria-hidden="true"
          className="mt-8 flex h-[1.3em] items-center text-[clamp(1.6rem,4.5vw,3rem)] font-semibold tracking-tight"
        >
          <span ref={label} className="text-[#ff6b86]" />
          <span className="animate-rec ml-1 inline-block h-[0.9em] w-[3px] bg-white/70" />
        </p>

        <blockquote data-chart-quote className="mt-8 max-w-2xl text-lg leading-snug text-muted sm:text-2xl">
          “{brand.quote}”
        </blockquote>
        <p className="mt-4 text-[11px] text-muted/50">Ilustração conceitual, sem dados reais.</p>
      </div>
    </section>
  );
}
