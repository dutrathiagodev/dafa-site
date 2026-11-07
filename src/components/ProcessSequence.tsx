"use client";

import { useRef } from "react";
import { processSteps } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const FRAME_COUNT = 138;
const frameSrc = (i: number) =>
  `/media/sequence/f${String(i + 1).padStart(3, "0")}.webp`;

/**
 * Vídeo que avança com o scroll: os frames do projeto imobiliário
 * são desenhados num <canvas> (bem mais fluido que mexer no currentTime).
 */
export default function ProcessSequence() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const images: HTMLImageElement[] = [];
      const state = { frame: 0 };
      let lastDrawn = -1;

      const draw = () => {
        const target = Math.round(state.frame);
        // usa o frame carregado mais próximo
        let i = target;
        while (i > 0 && !images[i]?.complete) i--;
        const img = images[i];
        if (!img?.complete || !img.naturalWidth || i === lastDrawn) return;
        lastDrawn = i;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      // Carrega o primeiro frame já; o resto quando a seção se aproxima.
      const load = (i: number) => {
        if (images[i]) return;
        const img = new Image();
        img.decoding = "async";
        img.src = frameSrc(i);
        img.onload = () => {
          if (i === 0 || i === Math.round(state.frame)) {
            lastDrawn = -1;
            draw();
          }
        };
        images[i] = img;
      };
      load(0);
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 250%",
        once: true,
        onEnter: () => {
          for (let i = 1; i < FRAME_COUNT; i++) load(i);
        },
      });

      const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
      const dots = gsap.utils.toArray<HTMLElement>("[data-step-dot]");
      const setActive = (n: number) => {
        steps.forEach((s, i) => s.toggleAttribute("data-active", i === n));
        dots.forEach((d, i) => d.toggleAttribute("data-active", i <= n));
      };
      setActive(0);

      if (prefersReducedMotion()) {
        state.frame = FRAME_COUNT * 0.55;
        load(Math.round(state.frame));
        return;
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 0px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=320%",
            pin: "[data-pin]",
            scrub: 0.6,
            onUpdate: (self) =>
              setActive(
                Math.min(
                  processSteps.length - 1,
                  Math.floor(self.progress * processSteps.length),
                ),
              ),
          },
        });
        tl.to(state, {
          frame: FRAME_COUNT - 1,
          ease: "none",
          onUpdate: draw,
        }).fromTo(
          "[data-seq-frame]",
          { scale: 0.92, rotate: -2 },
          { scale: 1, rotate: 0, ease: "none" },
          0,
        );
        tl.to("[data-seq-progress]", { scaleY: 1, ease: "none" }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="processo"
      ref={root}
      aria-labelledby="processo-title"
      className="relative"
    >
      <div
        data-pin
        className="relative flex h-[100svh] items-start overflow-hidden pt-20 lg:items-center lg:pt-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_50%,rgba(16,16,236,.28),transparent_70%)]" />

        <div className="relative mx-auto grid w-full max-w-[1320px] items-center gap-8 px-4 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
          {/* Texto */}
          <div className="relative z-10 order-2 lg:order-1">
            <p className="text-xs tracking-[0.3em] text-muted uppercase">
              02 / Processo
            </p>
            <h2
              id="processo-title"
              className="mt-3 text-[clamp(2rem,4.5vw,3.75rem)] leading-[0.98] font-bold tracking-[-0.035em]"
            >
              Da ideia ao{" "}
              <span className="font-display text-[#9a9cff] italic">
                conteúdo pronto.
              </span>
            </h2>

            <ol className="mt-6 grid gap-1 sm:mt-8">
              {processSteps.map((s, i) => (
                <li
                  key={s.title}
                  data-step
                  className="group/step grid grid-cols-[2.25rem_1fr] items-baseline rounded-xl px-1 py-1.5 text-muted/50 transition-colors duration-500 data-active:text-ink sm:py-2"
                >
                  <span className="font-mono text-xs">0{i + 1}</span>
                  <div>
                    <p className="text-lg font-semibold sm:text-2xl">
                      {s.title}
                    </p>
                    <p className="hidden max-h-0 overflow-hidden text-sm text-muted opacity-0 transition-all duration-500 group-data-active/step:max-h-16 group-data-active/step:opacity-100 sm:block">
                      {s.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 max-w-sm text-xs text-muted/70">
              Cada projeto pode envolver só parte dessas etapas, conforme o
              escopo combinado.
            </p>
          </div>

          {/* Canvas com o vídeo */}
          <div className="order-1 flex justify-center lg:order-2">
            <div
              data-seq-frame
              className="relative aspect-[9/16] h-[42svh] overflow-hidden rounded-[28px] border border-white/10 bg-navy shadow-[0_40px_120px_-30px_rgba(16,16,236,.8)] will-change-transform sm:h-[60svh] lg:h-[78svh]"
            >
              <canvas
                ref={canvasRef}
                width={540}
                height={960}
                className="h-full w-full"
                role="img"
                aria-label="Trecho de um vídeo imobiliário produzido pela DAFA: do terreno ao projeto finalizado"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-xs text-white/80">
                Projeto: lançamento imobiliário
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="order-3 hidden items-center justify-end gap-5 lg:flex">
            <div className="relative h-[46svh] w-px bg-white/10">
              <div
                data-seq-progress
                className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-electric to-[#9a9cff] shadow-[0_0_14px_#3333ff]"
              />
            </div>
            <ul className="flex h-[46svh] flex-col justify-between">
              {processSteps.map((s) => (
                <li
                  key={s.title}
                  data-step-dot
                  className="flex items-center gap-3 text-xs tracking-[0.2em] text-muted/40 uppercase transition-colors duration-500 data-active:text-ink"
                >
                  {s.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
