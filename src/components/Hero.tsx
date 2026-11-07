"use client";

import { useRef } from "react";
import {
  Aperture,
  ArrowDown,
  Camera,
  Clapperboard,
  Film,
  Megaphone,
  Mic,
  PenLine,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import LightArcs from "./LightArcs";
import { WhatsAppIcon } from "./brand-icons";
import { brand, contact, whatsappUrl } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Ícones de ferramentas flutuando em volta do título (seguem o mouse). */
const floaters: {
  Icon: LucideIcon;
  x: string;
  y: string;
  depth: number;
  mobile?: boolean;
}[] = [
  { Icon: Camera, x: "9%", y: "26%", depth: 1.2, mobile: true },
  { Icon: Clapperboard, x: "86%", y: "22%", depth: 0.9, mobile: true },
  { Icon: Mic, x: "16%", y: "66%", depth: 0.6 },
  { Icon: Aperture, x: "80%", y: "62%", depth: 1.4 },
  { Icon: Film, x: "4%", y: "47%", depth: 0.4 },
  { Icon: Megaphone, x: "93%", y: "44%", depth: 0.7 },
  { Icon: PenLine, x: "28%", y: "14%", depth: 0.5 },
  { Icon: TrendingUp, x: "70%", y: "12%", depth: 1, mobile: true },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (reduce) return;

      // Entrada do título palavra por palavra
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from("[data-hero-word]", {
          yPercent: 115,
          rotate: 4,
          duration: 1.4,
          stagger: 0.09,
          delay: 0.15,
        })
        .from(
          "[data-hero-fade]",
          { autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.1 },
          "-=1",
        )
        .from(
          "[data-floater]",
          {
            autoAlpha: 0,
            scale: 0.4,
            duration: 1.2,
            stagger: 0.06,
            ease: "back.out(1.6)",
          },
          "-=1.1",
        );

      // Paralaxe com o mouse (desktop)
      const items = gsap.utils.toArray<HTMLElement>("[data-floater]");
      const movers = items.map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
        d: Number(el.dataset.depth),
      }));
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * 70 * m.d);
          m.y(ny * 50 * m.d);
        });
      };
      window.addEventListener("pointermove", onMove);

      // Ao rolar, o conteúdo do hero sobe e desfoca levemente
      gsap.to("[data-hero-content]", {
        yPercent: -18,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  const words = ["Conteúdo", "com"];

  return (
    <section
      id="inicio"
      ref={root}
      className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-28"
    >
      <LightArcs />

      {floaters.map(({ Icon, x, y, depth, mobile }, i) => (
        <div
          key={i}
          data-floater
          data-depth={depth}
          className={`absolute z-0 ${mobile ? "" : "hidden md:block"}`}
          style={{ left: x, top: y }}
          aria-hidden="true"
        >
          <div
            className="glass animate-float grid size-11 place-items-center rounded-2xl text-[#b8baff] shadow-[0_0_30px_-6px_rgba(51,51,255,.8)] sm:size-14"
            style={{ animationDelay: `${i * -0.7}s` }}
          >
            <Icon className="size-5 glow-blue sm:size-6" strokeWidth={1.6} />
          </div>
        </div>
      ))}

      <div
        data-hero-content
        className="relative z-10 mx-auto w-full max-w-[1100px] px-4 text-center sm:px-8"
      >
        <p
          data-hero-fade
          className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs tracking-wide text-muted sm:text-sm"
        >
          <span className="size-1.5 rounded-full bg-electric shadow-[0_0_12px_#3333ff]" />
          {contact.city} – {contact.state} e região
        </p>

        <h1 className="mt-7 text-[clamp(3rem,11vw,8.5rem)] leading-[0.92] font-bold tracking-[-0.045em]">
          <span className="sr-only">
            DAFA — Gerenciamento de Conteúdo. Conteúdo com direção.
          </span>
          <span aria-hidden="true" className="block">
            {words.map((w) => (
              <span
                key={w}
                className="mr-[0.22em] inline-block overflow-hidden pb-[0.06em] align-bottom last:mr-0"
              >
                <span data-hero-word className="inline-block">
                  {w}
                </span>
              </span>
            ))}
          </span>
          <span
            aria-hidden="true"
            className="block overflow-hidden pb-[0.12em]"
          >
            <span
              data-hero-word
              className="text-gradient inline-block pr-[0.08em] font-display font-bold italic tracking-[-0.02em]"
            >
              direção.
            </span>
          </span>
        </h1>

        <p
          data-hero-fade
          className="mx-auto mt-6 max-w-[620px] text-base leading-relaxed text-muted sm:text-lg"
        >
          {brand.pitch}
        </p>

        <div
          data-hero-fade
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
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

      {/* Indicador de rolagem (mouse) */}
      <a
        href="#showreel"
        data-hero-fade
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[0.25em] text-muted uppercase"
        aria-label="Rolar para o vídeo de apresentação"
      >
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/30">
          <span className="animate-wheel mt-2 h-2 w-0.5 rounded-full bg-white" />
        </span>
        Role
      </a>
    </section>
  );
}
