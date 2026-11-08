"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { processSteps } from "@/content/site";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

import { Accent, SectionHeading } from "@/components/ui/section-heading";

const FRAME_COUNT = 138;
const FPS = 12;
const frameSrc = (i: number) =>
  asset(`/media/sequence/f${String(i + 1).padStart(3, "0")}.webp`);
const stepOf = (frame: number) =>
  Math.min(
    processSteps.length - 1,
    Math.floor((frame / FRAME_COUNT) * processSteps.length),
  );
// arredonda para cima: o primeiro frame cai DENTRO da etapa (com round, a etapa 5 caía na 4)
const firstFrameOf = (step: number) =>
  Math.ceil((step / processSteps.length) * FRAME_COUNT);

/**
 * Processo interativo (sem travar o scroll):
 * - mouse sobre o vídeo / arrastar o dedo → o vídeo acompanha;
 * - abas das etapas pulam para o trecho;
 * - barra de tempo (também pelo teclado);
 * - parado, o vídeo toca sozinho.
 * Os frames são desenhados num <canvas>.
 */
export default function ProcessSequence() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const state = useRef({ frame: 0, lastDrawn: -1, lastInteract: 0, visible: false });
  /** Etapa escolhida por clique: vale até o vídeo chegar lá (sem piscar pelas etapas do caminho). */
  const pinned = useRef<number | null>(null);
  const [step, setStep] = useState(0);

  const draw = useCallback(() => {
    const s = state.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    let i = Math.round(s.frame);
    while (i > 0 && !images.current[i]?.complete) i--;
    const img = images.current[i];
    if (!img?.complete || !img.naturalWidth || i === s.lastDrawn) return;
    s.lastDrawn = i;
    ctx.drawImage(img, 0, 0, 540, 960);
    if (rangeRef.current) rangeRef.current.value = String(Math.round(s.frame));
    if (pinned.current === null) setStep(stepOf(s.frame));
  }, []);

  const goTo = useCallback(
    (frame: number, animate = true, pin: number | null = null) => {
      const s = state.current;
      s.lastInteract = performance.now();
      pinned.current = pin;
      if (pin !== null) setStep(pin);
      gsap.to(s, {
        frame: Math.max(0, Math.min(FRAME_COUNT - 1, frame)),
        duration: animate && !prefersReducedMotion() ? 0.6 : 0,
        ease: "power2.out",
        overwrite: true,
        onUpdate: draw,
        onComplete: () => {
          pinned.current = null;
        },
      });
    },
    [draw],
  );

  useEffect(() => {
    const s = state.current;
    const load = (i: number) => {
      if (images.current[i]) return;
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(i);
      img.onload = () => {
        if (i === 0 || i === Math.round(s.frame)) {
          s.lastDrawn = -1;
          draw();
        }
      };
      images.current[i] = img;
    };
    load(0);

    // Carrega o resto quando a seção se aproxima; toca sozinho quando visível
    const io = new IntersectionObserver(
      ([e]) => {
        s.visible = e.isIntersecting;
        if (e.isIntersecting) for (let i = 1; i < FRAME_COUNT; i++) load(i);
      },
      { rootMargin: "60% 0px" },
    );
    io.observe(root.current!);

    const reduce = prefersReducedMotion();
    let acc = 0;
    const tick = (_t: number, dtMs: number) => {
      if (reduce || !s.visible) return;
      if (performance.now() - s.lastInteract < 2500) return;
      acc += dtMs / 1000;
      if (acc < 1 / FPS) return;
      acc = 0;
      s.frame = (Math.round(s.frame) + 1) % FRAME_COUNT;
      draw();
    };
    gsap.ticker.add(tick);
    return () => {
      io.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [draw]);

  // Mouse/toque sobre o vídeo
  const scrubFrom = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const s = state.current;
    s.lastInteract = performance.now();
    pinned.current = null;
    gsap.to(s, {
      frame: ratio * (FRAME_COUNT - 1),
      duration: 0.35,
      ease: "power2.out",
      overwrite: true,
      onUpdate: draw,
    });
  };

  return (
    <section
      id="processo"
      ref={root}
      aria-labelledby="processo-title"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_75%_50%,rgba(16,16,236,.22),transparent_70%)]" />

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_auto]">
        <div>
          <SectionHeading
            id="processo-title"
            size="sm"
            title={
              <>
                Da ideia ao <Accent>conteúdo pronto.</Accent>
              </>
            }
          />

          <div
            role="tablist"
            aria-label="Etapas do processo"
            className="mt-8 flex flex-wrap gap-2"
          >
            {processSteps.map((s, i) => (
              <button
                key={s.title}
                role="tab"
                type="button"
                aria-selected={step === i}
                onClick={() => goTo(firstFrameOf(i), true, i)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  step === i
                    ? "border-electric bg-electric text-white shadow-[0_0_24px_-4px_#3333ff]"
                    : "border-white/12 text-muted hover:border-white/35 hover:text-ink"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          <p
            key={step}
            role="tabpanel"
            aria-live="polite"
            className="animate-focus mt-6 min-h-[3.5rem] max-w-md text-lg leading-relaxed text-ink/90"
          >
            {processSteps[step].text}
          </p>
          <p className="mt-6 max-w-sm text-xs text-muted/70">
            Cada projeto pode envolver só parte dessas etapas, conforme o escopo
            combinado.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative aspect-[9/16] h-[62svh] max-h-[680px] min-h-[380px] overflow-hidden rounded-[28px] border border-white/10 bg-navy shadow-[0_40px_120px_-30px_rgba(16,16,236,.8)]">
            <canvas
              ref={canvasRef}
              width={540}
              height={960}
              onPointerMove={(e) => {
                if (e.pointerType === "mouse" || e.buttons) scrubFrom(e);
              }}
              onPointerDown={scrubFrom}
              className="h-full w-full cursor-ew-resize touch-pan-y"
              role="img"
              aria-label="Vídeo de um lançamento imobiliário produzido pela DAFA. Passe o mouse ou arraste para avançar."
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4 font-mono text-[10px] tracking-[0.18em] text-white/70 uppercase">
              <span>Projeto: lançamento imobiliário</span>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-center text-xs text-white/75">
              ← passe o mouse ou arraste →
            </div>
          </div>
          <label className="w-full max-w-[380px]">
            <span className="sr-only">Posição do vídeo</span>
            <input
              ref={rangeRef}
              type="range"
              min={0}
              max={FRAME_COUNT - 1}
              defaultValue={0}
              onChange={(e) => goTo(Number(e.target.value), false)}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-[#3333ff]"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
