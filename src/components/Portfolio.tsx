"use client";

import { asset } from "@/lib/asset";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Expand, Play } from "lucide-react";
import { projects, type Project } from "@/content/site";
import { useMediaModal } from "./VideoModal";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const openModal = useMediaModal();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Prévia muda: toca quando o card está na tela, pausa quando sai.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload === "none") v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.45 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // Inclinação 3D + brilho seguindo o mouse
  const tilt = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${nx * 100}%`);
    el.style.setProperty("--my", `${ny * 100}%`);
    gsap.to(el, {
      rotateY: (nx - 0.5) * 12,
      rotateX: -(ny - 0.5) * 12,
      transformPerspective: 900,
      duration: 0.5,
      ease: "power3.out",
    });
  };
  const untilt = (e: React.PointerEvent<HTMLButtonElement>) =>
    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.6)" });

  const open = () =>
    p.media.type === "video"
      ? openModal({
          kind: "video",
          src: p.media.src,
          poster: p.media.poster,
          title: `${p.client} — ${p.services.join(", ")}`,
          format: p.format,
        })
      : openModal({
          kind: "image",
          src: p.media.src,
          title: `${p.client} — ${p.segment}`,
          format: p.format,
        });

  return (
    <article
      data-project
      className="group relative"
      style={{ "--i": index } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={open}
        onPointerMove={tilt}
        onPointerLeave={untilt}
        data-cursor={p.media.type === "video" ? "Assistir" : "Ver foto"}
        className="relative block aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/[.08] bg-surface text-left transition-[border-color,box-shadow] duration-500 hover:border-electric/60 hover:shadow-[0_20px_80px_-20px_rgba(51,51,255,.6)]"
        aria-label={`Abrir ${p.media.type === "video" ? "vídeo" : "foto"}: ${p.client}`}
      >
        {p.media.type === "video" ? (
          <video
            ref={videoRef}
            src={asset(p.media.preview)}
            poster={asset(p.media.poster)}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <Image
            src={asset(p.media.src)}
            alt={`${p.client} — ${p.segment}`}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,.16), transparent 45%)",
          }}
        />

        <span className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur-md transition group-hover:bg-electric">
          {p.media.type === "video" ? (
            <Play className="size-4 translate-x-px fill-white" />
          ) : (
            <Expand className="size-4" />
          )}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {p.services.map((s) => (
              <span
                key={s}
                className="rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/90 backdrop-blur sm:text-[11px]"
              >
                {s}
              </span>
            ))}
          </div>
          <h3 className="text-base leading-tight font-semibold sm:text-xl">
            {p.client}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-white/65 sm:text-sm">
            {p.ownBrand ? "Projeto da marca DAFA" : p.segment}
          </p>
        </div>
      </button>

      {p.instagram && (
        <a
          href={`https://www.instagram.com/${p.instagram}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 px-1 text-xs text-muted transition hover:text-ink"
        >
          @{p.instagram}
          <ArrowUpRight className="size-3" />
        </a>
      )}
    </article>
  );
}

export default function Portfolio() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      // Desktop: colunas em velocidades diferentes (efeito Pinterest em paralaxe)
      mm.add("(min-width: 1024px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-col]").forEach((col, i) => {
          gsap.fromTo(
            col,
            { y: [60, 160, 100][i % 3] },
            {
              y: [-40, -120, -60][i % 3],
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });
      // Só os cards da grade visível (mobile ou desktop) entram animados.
      const cards = gsap.utils
        .toArray<HTMLElement>("[data-project]")
        .filter((el) => el.offsetParent !== null);
      gsap.set(cards, { autoAlpha: 0, y: 80, scale: 0.94 });
      ScrollTrigger.batch(cards, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.08,
          }),
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Distribui os projetos em 3 colunas (desktop) mantendo a ordem de leitura no mobile.
  const cols = [0, 1, 2].map((c) => projects.filter((_, i) => i % 3 === c));

  return (
    <section
      id="projetos"
      ref={root}
      className="relative mx-auto max-w-[1320px] px-4 py-24 sm:px-8 sm:py-32"
      aria-labelledby="projetos-title"
    >
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div data-reveal>
          <p className="text-xs tracking-[0.3em] text-muted uppercase">
            01 / Portfólio
          </p>
          <h2
            id="projetos-title"
            className="mt-4 text-[clamp(2.4rem,6vw,4.75rem)] leading-[0.95] font-bold tracking-[-0.04em]"
          >
            Trabalhos que
            <br />
            <span className="font-display font-bold text-[#9a9cff] italic">
              mostram valor.
            </span>
          </h2>
        </div>
        <p data-reveal className="max-w-sm text-muted">
          Vídeos, fotos e conteúdos produzidos pela DAFA para empresas da
          região. Toque em um projeto para assistir com som.
        </p>
      </div>

      {/* Mobile/tablet: grade de 2 colunas na ordem natural */}
      <div data-grid className="grid grid-cols-2 gap-3 sm:gap-5 lg:hidden">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} p={p} index={i} />
        ))}
      </div>

      {/* Desktop: 3 colunas com paralaxe */}
      <div data-grid className="hidden grid-cols-3 gap-6 lg:grid">
        {cols.map((col, c) => (
          <div key={c} data-col className="flex flex-col gap-6">
            {col.map((p) => (
              <ProjectCard key={p.slug} p={p} index={projects.indexOf(p)} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
