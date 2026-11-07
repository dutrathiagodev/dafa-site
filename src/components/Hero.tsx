"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowDown } from "lucide-react";
import LightArcs from "./LightArcs";
import { WhatsAppIcon } from "./brand-icons";
import { brand, contact, whatsappUrl } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

// three.js só carrega no navegador e fora do bundle inicial
const Camera3D = dynamic(() => import("./Camera3D"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <div className="size-40 rounded-full bg-electric/25 blur-3xl" />
    </div>
  ),
});

/** Cantos do enquadramento do visor. */
function Corners({ className = "" }: { className?: string }) {
  const c = "absolute size-5 border-white/50 sm:size-7";
  return (
    <div className={className} aria-hidden="true">
      <span className={`${c} top-0 left-0 border-t border-l`} />
      <span className={`${c} top-0 right-0 border-t border-r`} />
      <span className={`${c} bottom-0 left-0 border-b border-l`} />
      <span className={`${c} right-0 bottom-0 border-r border-b`} />
    </div>
  );
}

/**
 * Abertura: a tela é o visor de uma câmera gravando.
 * Obturador abrindo, título entrando em foco, HUD com REC e timecode,
 * ponto de autofoco seguindo o mouse e a câmera DAFA em 3D.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const timecode = useRef<HTMLSpanElement>(null);

  // Timecode HH:MM:SS:FF a 24 fps desde que a página abriu
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const start = performance.now();
    let raf = 0;
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      const f = Math.floor(((performance.now() - start) / 1000) * 24);
      const s = Math.floor(f / 24);
      if (timecode.current)
        timecode.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 24)}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Ponto de autofoco seguindo o mouse
      const reticle = root.current!.querySelector<HTMLElement>("[data-reticle]")!;
      const x = gsap.quickTo(reticle, "x", { duration: 0.45, ease: "power3.out" });
      const y = gsap.quickTo(reticle, "y", { duration: 0.45, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = root.current!.getBoundingClientRect();
        gsap.to(reticle, { autoAlpha: 1, duration: 0.3 });
        x(e.clientX - r.left);
        y(e.clientY - r.top);
      };
      const onLeave = () => gsap.to(reticle, { autoAlpha: 0, duration: 0.3 });
      const onDown = () =>
        gsap.fromTo(reticle, { scale: 1.35 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
      const sec = root.current!;
      sec.addEventListener("pointermove", onMove);
      sec.addEventListener("pointerleave", onLeave);
      sec.addEventListener("pointerdown", onDown);

      // Ao rolar, o texto sobe e some de leve
      gsap.to("[data-hero-content]", {
        yPercent: -12,
        autoAlpha: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => {
        sec.removeEventListener("pointermove", onMove);
        sec.removeEventListener("pointerleave", onLeave);
        sec.removeEventListener("pointerdown", onDown);
      };
    },
    { scope: root },
  );

  return (
    <section
      id="inicio"
      ref={root}
      className="grain relative isolate min-h-[100svh] overflow-hidden"
    >
      <LightArcs className="opacity-55" />

      {/* Obturador abrindo */}
      <div aria-hidden="true" className="animate-shutter absolute inset-x-0 top-0 z-30 h-1/2 origin-top bg-black" />
      <div aria-hidden="true" className="animate-shutter absolute inset-x-0 bottom-0 z-30 h-1/2 origin-bottom bg-black" />

      {/* HUD do visor */}
      <div
        aria-hidden="true"
        className="animate-hud pointer-events-none absolute inset-x-4 top-[84px] bottom-4 z-20 font-mono text-[10px] tracking-[0.18em] text-white/60 uppercase sm:inset-x-8 sm:bottom-8 sm:text-[11px]"
      >
        <Corners className="absolute inset-0" />
        <div className="absolute top-3 left-4 flex items-center gap-2 sm:top-4 sm:left-6">
          <span className="animate-rec size-2 rounded-full bg-[#ff3b4f] shadow-[0_0_10px_#ff3b4f]" />
          <span className="text-white/85">Rec</span>
          <span ref={timecode} className="tabular-nums">00:00:00:00</span>
        </div>
        <div className="absolute top-3 right-4 sm:top-4 sm:right-6">4K · 24 fps</div>
        <div className="absolute bottom-3 left-4 hidden gap-5 sm:bottom-4 sm:left-6 sm:flex">
          <span>ISO 400</span>
          <span>f/2.8</span>
          <span>1/50</span>
        </div>
        <div className="absolute right-4 bottom-3 flex items-center gap-2 sm:right-6 sm:bottom-4">
          <span className="hidden sm:inline">{contact.city} · {contact.state}</span>
          <span className="relative h-2.5 w-5 rounded-[2px] border border-white/60 after:absolute after:top-1/2 after:-right-[3px] after:h-1 after:w-[2px] after:-translate-y-1/2 after:bg-white/60">
            <span className="absolute inset-[1px] right-[25%] bg-white/70" />
          </span>
        </div>
      </div>

      {/* Ponto de autofoco */}
      <div
        data-reticle
        aria-hidden="true"
        className="pointer-events-none invisible absolute top-0 left-0 z-20 -mt-7 -ml-7 size-14 opacity-0"
      >
        <Corners className="absolute inset-0 [&>span]:size-3 [&>span]:border-[#9a9cff]" />
        <span className="absolute top-1/2 left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9a9cff]" />
      </div>

      <div
        data-hero-content
        className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1320px] items-center gap-2 px-6 pt-28 pb-16 sm:px-12 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-12"
      >
        <div className="text-center lg:text-left">
          <p className="animate-focus text-xs tracking-[0.3em] text-muted uppercase [animation-delay:1s]">
            Produção audiovisual · Conteúdo · Tráfego
          </p>

          <h1 className="mt-5 text-[clamp(3rem,8.4vw,7.25rem)] leading-[0.9] font-bold tracking-[-0.05em]">
            <span className="animate-focus block [animation-delay:1.05s]">Conteúdo</span>
            <span className="animate-focus block [animation-delay:1.2s]">
              com{" "}
              <span className="text-gradient font-display pr-[0.06em] font-bold tracking-[-0.02em] italic">
                direção.
              </span>
            </span>
          </h1>

          <p className="animate-focus mx-auto mt-6 max-w-[520px] text-base leading-relaxed text-muted [animation-delay:1.4s] sm:text-lg lg:mx-0">
            {brand.pitch}
          </p>

          <div className="animate-focus mt-8 flex flex-col items-center gap-3 [animation-delay:1.55s] sm:flex-row sm:justify-center lg:justify-start">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-electric px-7 text-base font-semibold shadow-[0_10px_50px_-10px_#3333ff] transition hover:bg-[#4a4aff] hover:shadow-[0_10px_60px_-6px_#3333ff]"
            >
              <WhatsAppIcon className="size-5" />
              Solicite um orçamento
            </a>
            <a
              href="#projetos"
              className="inline-flex h-14 items-center gap-2 rounded-full border border-white/15 px-7 text-base font-medium text-ink transition hover:border-white/40 hover:bg-white/5"
            >
              Ver projetos
              <ArrowDown className="size-4" />
            </a>
          </div>
        </div>

        <Camera3D className="h-[46svh] w-full sm:h-[52svh] lg:h-[74svh]" />
      </div>
    </section>
  );
}
