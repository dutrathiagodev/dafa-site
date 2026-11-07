"use client";

import { useRef } from "react";
import {
  CalendarDays,
  Camera,
  LayoutGrid,
  Megaphone,
  PenLine,
  Video,
  type LucideIcon,
} from "lucide-react";
import { services, whatsappUrl, type ServiceIcon } from "@/content/site";
import { SdCard } from "./ui/sd-card";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const icons: Record<ServiceIcon, LucideIcon> = {
  video: Video,
  camera: Camera,
  calendar: CalendarDays,
  pen: PenLine,
  grid: LayoutGrid,
  megaphone: Megaphone,
};

/** Posição de layout (ignora transforms) relativa a um ancestral posicionado. */
function layoutPos(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== ancestor) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 };
}

/**
 * Serviços: os cards saem voando de dentro do cartão de memória
 * conforme o scroll (desktop). No celular, entrada simples em sequência.
 */
export default function Services() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (min-height: 700px)", () => {
        const sd = stage.current!.querySelector<HTMLElement>("[data-sd]")!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-service]");
        const delta = (el: HTMLElement) => {
          const a = layoutPos(sd, stage.current!);
          const b = layoutPos(el, stage.current!);
          return { x: a.x - b.x, y: a.y - b.y };
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: "+=170%",
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          sd,
          { rotateY: -38, rotateX: 18, scale: 0.78, y: 40 },
          { rotateY: 0, rotateX: 0, scale: 1, y: 0, duration: 0.3, ease: "power2.out" },
        )
          .to(
            "[data-sd] [data-sd-pin]",
            { fill: "#5b5bff", duration: 0.12, stagger: 0.025 },
            0.12,
          )
          .to("[data-sd-glow]", { opacity: 1, scale: 1.15, duration: 0.2 }, 0.2)
          .fromTo(
            cards,
            {
              x: (_i: number, el: HTMLElement) => delta(el).x,
              y: (_i: number, el: HTMLElement) => delta(el).y,
              scale: 0.18,
              rotation: () => gsap.utils.random(-35, 35),
              autoAlpha: 0,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.06,
            },
            0.3,
          )
          .to("[data-sd]", { y: 10, scale: 0.94, duration: 0.3 }, 0.55)
          .to("[data-sd-glow]", { opacity: 0.45, duration: 0.3 }, 0.6);
      });

      mm.add("(max-width: 1023px), (max-height: 699px)", () => {
        gsap.from("[data-service]", {
          autoAlpha: 0,
          y: 50,
          scale: 0.9,
          rotation: (i: number) => (i % 2 ? 6 : -6),
          duration: 0.9,
          ease: "back.out(1.4)",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-services-grid]", start: "top 85%" },
        });
        gsap.from("[data-sd]", {
          rotateY: -40,
          scale: 0.8,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-sd]", start: "top 90%" },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="servicos"
      ref={root}
      aria-labelledby="servicos-title"
      className="relative"
    >
      <div
        ref={stage}
        className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-4 py-24 sm:px-8 lg:min-h-[100svh] lg:grid-cols-[0.85fr_1.15fr] lg:py-16"
      >
        <div className="relative">
          <p className="text-xs tracking-[0.3em] text-muted uppercase">
            04 / Serviços
          </p>
          <h2
            id="servicos-title"
            className="mt-4 text-[clamp(2.2rem,5vw,4.25rem)] leading-[0.95] font-bold tracking-[-0.04em]"
          >
            Tudo o que sua marca precisa{" "}
            <span className="font-display text-[#9a9cff] italic">
              para aparecer bem.
            </span>
          </h2>
          <p className="mt-5 max-w-md text-muted">
            A produção audiovisual é o coração do nosso trabalho. Em volta dela,
            planejamento, fotografia, redes sociais e anúncios.
          </p>

          <div className="relative mt-10 flex justify-center lg:justify-start lg:pl-10 [perspective:900px]">
            <div
              data-sd-glow
              className="absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/50 opacity-40 blur-[70px] lg:left-[calc(2.5rem+80px)]"
            />
            <div data-sd className="relative w-32 will-change-transform sm:w-40">
              <SdCard className="h-auto w-full drop-shadow-[0_20px_40px_rgba(16,16,236,.55)]" />
            </div>
          </div>
        </div>

        <ul
          data-services-grid
          className="grid gap-4 sm:grid-cols-2 lg:gap-5"
        >
          {services.map((s) => {
            const Icon = icons[s.icon];
            return (
              <li
                key={s.title}
                data-service
                className="group relative rounded-2xl border border-white/[.08] bg-gradient-to-b from-white/[.06] to-white/[.015] p-5 transition-colors duration-500 will-change-transform hover:border-electric/50 sm:p-6"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-electric/15 text-[#a9abff] ring-1 ring-electric/30 transition group-hover:bg-electric group-hover:text-white">
                  <Icon className="size-5" strokeWidth={1.7} />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {s.description}
                </p>
              </li>
            );
          })}
          <li className="sm:col-span-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl border border-dashed border-white/15 px-6 py-4 text-sm text-muted transition hover:border-electric hover:text-ink"
            >
              Não sabe por onde começar? Conte o que você precisa.
              <span className="font-semibold text-ink">Fale com a DAFA →</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
