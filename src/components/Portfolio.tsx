"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { asset } from "@/lib/asset";
import { projects, type Project } from "@/content/site";
import { useMediaModal } from "./VideoModal";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

import EditFrame from "./ui/edit-frame";
// Os projetos se repetem para fechar o cilindro do carrossel.
const ITEMS = [...projects, ...projects];
const N = ITEMS.length;
const STEP = 360 / N;
const norm = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;

function Card({ p, index }: { p: Project; index: number }) {
  return (
    <div
      data-idx={index}
      className="absolute top-0 left-0 aspect-[9/16] w-[var(--card-w)] overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[0_30px_80px_-30px_rgba(16,16,236,.7)] [backface-visibility:hidden]"
      style={{ transform: `rotateY(${index * STEP}deg) translateZ(var(--radius))` }}
    >
      {p.media.type === "video" ? (
        <video
          data-preview
          src={asset(p.media.preview)}
          poster={asset(p.media.poster)}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={asset(p.media.src)}
          alt=""
          fill
          sizes="240px"
          draggable={false}
          className="pointer-events-none object-cover"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
      <p className="pointer-events-none absolute inset-x-3 bottom-3 text-sm leading-tight font-semibold">
        {p.client}
      </p>
    </div>
  );
}

/**
 * Portfólio em carrossel 3D (cilindro):
 * gira sozinho; arrastar gira com inércia; setas/teclado avançam um card;
 * clicar abre o vídeo com som. Só os vídeos de frente tocam.
 */
export default function Portfolio() {
  const openModal = useMediaModal();
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const st = useRef({
    angle: 0,
    vel: 0,
    dragging: false,
    lastX: 0,
    downX: 0,
    downY: 0,
    lastInteract: 0,
    tweening: false,
  });
  const [active, setActive] = useState(0);
  const project = projects[active % projects.length];

  const open = (p: Project) =>
    p.media.type === "video"
      ? openModal({
          kind: "video",
          src: p.media.src,
          poster: p.media.poster,
          title: `${p.client} — ${p.services.join(", ")}`,
          format: p.format,
        })
      : openModal({ kind: "image", src: p.media.src, title: `${p.client} — ${p.segment}`, format: p.format });

  const goBy = (dir: 1 | -1) => {
    const s = st.current;
    s.vel = 0;
    s.lastInteract = performance.now();
    s.tweening = true;
    const target = Math.round(s.angle / STEP) * STEP - dir * STEP;
    gsap.to(s, {
      angle: target,
      duration: prefersReducedMotion() ? 0 : 0.7,
      ease: "power3.out",
      overwrite: true,
      onComplete: () => {
        s.tweening = false;
      },
    });
  };

  useEffect(() => {
    const el = stage.current!;
    const s = st.current;
    const reduce = prefersReducedMotion();
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-idx]"));
    const playing = new Array(N).fill(false);
    let radius = 0;

    const layout = () => {
      const w = cards[0]?.offsetWidth ?? 200;
      radius = w / 2 / Math.tan(Math.PI / N) + w * 0.12;
      el.style.setProperty("--radius", `${radius}px`);
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    let raf = 0;
    let last = performance.now();
    let lastActive = -1;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!s.dragging && !s.tweening) {
        s.angle += s.vel;
        s.vel *= 0.94;
        if (Math.abs(s.vel) < 0.02 && !reduce && now - s.lastInteract > 1800) s.angle -= dt * 9;
      }
      ring.current!.style.transform = `translateZ(${-radius}px) rotateY(${s.angle}deg)`;

      let best = 0;
      let bestAbs = 999;
      cards.forEach((c, i) => {
        const rel = norm(i * STEP + s.angle);
        const abs = Math.abs(rel);
        if (abs < bestAbs) {
          bestAbs = abs;
          best = i;
        }
        c.style.opacity = String(0.25 + 0.75 * Math.max(0, Math.cos((rel * Math.PI) / 180)));
        const v = c.querySelector<HTMLVideoElement>("[data-preview]");
        const shouldPlay = abs < 45 && !reduce;
        if (v && shouldPlay !== playing[i]) {
          playing[i] = shouldPlay;
          if (shouldPlay) {
            if (v.preload === "none") v.preload = "auto";
            v.play().catch(() => {});
          } else v.pause();
        }
      });
      if (best !== lastActive) {
        lastActive = best;
        setActive(best);
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(el);
    // Primeiro quadro já posicionado (antes de entrar na tela)
    frame(performance.now());
    cancelAnimationFrame(raf);

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    gsap.killTweensOf(s);
    s.tweening = false;
    s.dragging = true;
    s.vel = 0;
    s.lastX = s.downX = e.clientX;
    s.downY = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (!s.dragging) return;
    const d = (e.clientX - s.lastX) * 0.28;
    s.angle += d;
    s.vel = d;
    s.lastX = e.clientX;
    s.lastInteract = performance.now();
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (!s.dragging) return;
    s.dragging = false;
    s.lastInteract = performance.now();
    if (Math.hypot(e.clientX - s.downX, e.clientY - s.downY) < 6) {
      const hit = document
        .elementsFromPoint(e.clientX, e.clientY)
        .map((n) => (n as HTMLElement).closest?.("[data-idx]"))
        .find(Boolean) as HTMLElement | undefined;
      if (hit) open(ITEMS[Number(hit.dataset.idx)]);
    }
  };

  return (
    <section
      id="projetos"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-labelledby="projetos-title"
    >
      <div className="mx-auto mb-10 flex max-w-[1320px] flex-col justify-between gap-6 px-4 sm:px-8 md:flex-row md:items-end">
        <div>
          <p data-reveal className="text-xs tracking-[0.3em] text-muted uppercase">
            01 / Portfólio
          </p>
          <EditFrame label="Texto · Título">
            <h2
              id="projetos-title"
              className="mt-4 text-[clamp(2.4rem,6vw,4.75rem)] leading-[0.95] font-bold tracking-[-0.04em]"
            >
              Trabalhos que
              <br />
              <span className="font-display font-bold text-[#9a9cff] italic">mostram valor.</span>
            </h2>
          </EditFrame>
        </div>
        <p data-reveal className="max-w-sm text-muted">
          Arraste para girar e toque em um projeto para assistir com som.
        </p>
      </div>

      {/* Carrossel 3D */}
      <div
        ref={stage}
        tabIndex={0}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Projetos do portfólio. Use as setas do teclado para girar e Enter para abrir."
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") goBy(1);
          if (e.key === "ArrowLeft") goBy(-1);
          if (e.key === "Enter") open(project);
        }}
        data-cursor="Arrastar"
        className="relative mx-auto h-[calc(var(--card-w)*16/9+80px)] cursor-grab touch-pan-y select-none [--card-w:clamp(140px,17vw,230px)] [perspective:1100px] active:cursor-grabbing"
      >
        <div
          ref={ring}
          className="absolute top-10 left-1/2 -ml-[calc(var(--card-w)/2)] [transform-style:preserve-3d]"
        >
          {ITEMS.map((p, i) => (
            <Card key={`${p.slug}-${i}`} p={p} index={i} />
          ))}
        </div>
      </div>

      {/* Projeto em destaque */}
      <div className="mx-auto mt-4 flex max-w-xl flex-col items-center px-4 text-center">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => goBy(-1)}
            aria-label="Projeto anterior"
            className="grid size-11 place-items-center rounded-full border border-white/15 transition hover:border-electric hover:bg-electric/20"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div key={project.slug} className="animate-focus min-w-[14rem]">
            <h3 className="text-2xl font-semibold">{project.client}</h3>
            <p className="mt-1 text-sm text-muted">
              {project.ownBrand ? "Projeto da marca DAFA" : project.segment}
            </p>
          </div>
          <button
            type="button"
            onClick={() => goBy(1)}
            aria-label="Próximo projeto"
            className="grid size-11 place-items-center rounded-full border border-white/15 transition hover:border-electric hover:bg-electric/20"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {project.services.map((s) => (
            <span key={s} className="rounded-full bg-white/[.07] px-3 py-1 text-xs text-white/85">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-5">
          <button
            type="button"
            onClick={() => open(project)}
            className="inline-flex items-center gap-2 rounded-full bg-electric px-5 py-2.5 text-sm font-semibold transition hover:bg-[#4a4aff]"
          >
            <Play className="size-4 fill-white" />
            {project.media.type === "video" ? "Assistir com som" : "Ver foto"}
          </button>
          {project.instagram && (
            <a
              href={`https://www.instagram.com/${project.instagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted transition hover:text-ink"
            >
              @{project.instagram}
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Lista acessível (leitores de tela) */}
      <ul className="sr-only">
        {projects.map((p) => (
          <li key={p.slug}>
            <button type="button" onClick={() => open(p)}>
              {p.client} — {p.services.join(", ")}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
