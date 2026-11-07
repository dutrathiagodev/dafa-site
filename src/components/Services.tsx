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
import { asset } from "@/lib/asset";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

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
 * Serviços: quando a seção aparece, os cards saem voando de dentro do
 * cartão de memória (uma vez, sem travar o scroll). O cartão inclina com
 * o mouse e, clicado, recolhe e solta os cards de novo.
 */
export default function Services() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const replay = useRef<() => void>(() => {});

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const sd = stage.current!.querySelector<HTMLElement>("[data-sd]")!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-service]");
      const delta = (el: HTMLElement) => {
        const a = layoutPos(sd, stage.current!);
        const b = layoutPos(el, stage.current!);
        return { x: a.x - b.x, y: a.y - b.y };
      };

      const from = {
        x: (_i: number, el: HTMLElement) => delta(el).x,
        y: (_i: number, el: HTMLElement) => delta(el).y,
        scale: 0.15,
        rotation: () => gsap.utils.random(-40, 40),
        autoAlpha: 0,
      };

      // Loop lento: o cartão acende, os cards saem devagar, ficam um tempo
      // na tela e voltam para dentro. Pausa com o mouse sobre os cards.
      let hovering = false;
      const tl = gsap.timeline({ repeat: -1, paused: true });
      tl.fromTo(
        sd,
        { rotateY: -38, rotateX: 18, scale: 0.78 },
        { rotateY: 0, rotateX: 0, scale: 1, duration: 1.4, ease: "power3.out" },
      )
        .fromTo(sd, { filter: "brightness(0.55)" }, { filter: "brightness(1.15)", duration: 0.9, ease: "power2.out" }, 0.3)
        .to(sd, { filter: "brightness(1)", duration: 1.2 }, 1.2)
        .fromTo("[data-sd-glow]", { opacity: 0.3 }, { opacity: 1, duration: 0.8 }, 0.5)
        .fromTo(
          cards,
          from,
          {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            autoAlpha: 1,
            duration: 2.2,
            ease: "power3.out",
            stagger: 0.18,
          },
          1,
        )
        .to("[data-sd-glow]", { opacity: 0.45, duration: 1.2 }, 2.4)
        .to({}, { duration: 6 })
        .addLabel("collect")
        .call(() => {
          if (hovering) tl.pause();
        })
        .to(cards, { ...from, rotation: 0, duration: 1.4, ease: "power3.inOut", stagger: 0.1 })
        .to(sd, { filter: "brightness(0.55)", duration: 0.8 }, "<0.6")
        .to({}, { duration: 0.6 });

      gsap.set(cards, { autoAlpha: 0 });
      ScrollTrigger.create({
        trigger: stage.current,
        start: "top 65%",
        end: "bottom 20%",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });

      const grid = root.current!.querySelector<HTMLElement>("[data-services-grid]")!;
      const onEnter = () => {
        hovering = true;
      };
      const onLeave = () => {
        hovering = false;
        if (tl.paused() && ScrollTrigger.isInViewport(grid)) tl.play();
      };
      grid.addEventListener("pointerenter", onEnter);
      grid.addEventListener("pointerleave", onLeave);

      // Clicar no cartão: recolhe os cards e solta de novo
      replay.current = () => {
        hovering = false;
        if (tl.time() < tl.labels.collect) tl.seek("collect");
        tl.play();
      };

      // Inclinação 3D do cartão seguindo o mouse
      const rx = gsap.quickTo(sd, "rotateX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(sd, "rotateY", { duration: 0.6, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = sd.getBoundingClientRect();
        const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const ny = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        ry(gsap.utils.clamp(-30, 30, nx * 60));
        rx(gsap.utils.clamp(-25, 25, -ny * 50));
      };
      const sec = root.current!;
      sec.addEventListener("pointermove", onMove);
      return () => {
        sec.removeEventListener("pointermove", onMove);
        grid.removeEventListener("pointerenter", onEnter);
        grid.removeEventListener("pointerleave", onLeave);
      };
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
        className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-4 py-24 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-32"
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
              className="absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/50 opacity-40 blur-[70px] lg:left-[calc(2.5rem+120px)]"
            />
            <button
              type="button"
              data-sd
              onClick={() => replay.current()}
              aria-label="Soltar os serviços do cartão de novo"
              className="relative w-48 cursor-pointer will-change-transform sm:w-60"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/media/camera/cartao-sd-dafa.webp")}
                alt="Cartão de memória com fita escrita DAFA conteúdos"
                width={900}
                height={900}
                draggable={false}
                className="h-auto w-full"
              />
            </button>
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
