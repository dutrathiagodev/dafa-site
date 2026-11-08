"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Clapperboard, Expand, Play } from "lucide-react";
import { asset } from "@/lib/asset";
import { projects, type Project } from "@/content/site";
import { useMediaModal } from "@/components/media/VideoModal";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";

/** Mídia de um reel: vídeo (prévia sem som) ou foto, sempre em 9:16. */
function ReelMedia({ p, playing }: { p: Project; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) {
      if (v.preload === "none") v.preload = "auto";
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [playing]);

  if (p.media.type === "image")
    return (
      <Image
        src={asset(p.media.src)}
        alt={`${p.client} — ${p.segment}`}
        fill
        sizes="(max-width: 1024px) 80vw, 360px"
        className="object-cover"
      />
    );

  return (
    <video
      ref={ref}
      src={asset(p.media.preview)}
      poster={asset(p.media.poster)}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

/** Informações do reel aberto (cliente, serviços e ações). */
function ReelInfo({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {p.services.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </div>
      <h3 className="text-xl leading-tight font-semibold">{p.client}</h3>
      <p className="mt-0.5 text-sm text-white/70">{p.ownBrand ? "Projeto da marca DAFA" : p.segment}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold whitespace-nowrap text-bg transition hover:bg-white/85"
        >
          {p.media.type === "video" ? <Play className="size-4 fill-current" /> : <Expand className="size-4" />}
          {p.media.type === "video" ? "Assistir com som" : "Ver foto"}
        </button>
        {p.instagram && (
          <a
            href={`https://www.instagram.com/${p.instagram}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"
          >
            @{p.instagram}
            <ArrowUpRight className="size-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * Portfólio em formato de Reels.
 * Desktop: galeria que expande — o reel sob o mouse/foco abre em 9:16 e toca.
 * Celular: reels deslizando na horizontal; o que está na frente toca.
 */
export default function Portfolio() {
  const openModal = useMediaModal();
  const [active, setActive] = useState(0);
  const [mobileActive, setMobileActive] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const section = useRef<HTMLElement>(null);

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

  // Só toca vídeo com a seção na tela
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(section.current!);
    return () => io.disconnect();
  }, []);

  // Celular: descobre qual reel está centralizado
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-reel]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setMobileActive(Number((e.target as HTMLElement).dataset.reel));
        });
      },
      { root: el, threshold: 0.6 },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="projetos"
      ref={section}
      aria-labelledby="projetos-title"
      className="relative mx-auto max-w-[1320px] py-24 sm:py-32"
    >
      <div className="mb-12 flex flex-col justify-between gap-6 px-4 sm:px-8 md:flex-row md:items-end">
        <SectionHeading
          id="projetos-title"
          size="lg"
          title={
            <>
              Trabalhos que
              <br />
              <Accent>mostram valor.</Accent>
            </>
          }
        />
        <p data-reveal className="max-w-sm text-muted">
          Reels, vídeos e fotos produzidos pela DAFA para empresas da região.
        </p>
      </div>

      {/* Desktop: galeria que expande */}
      <div className="hidden h-[min(72svh,640px)] gap-3 px-8 lg:flex">
        {projects.map((p, i) => {
          const isActive = active === i;
          return (
            <div
              key={p.slug}
              onMouseEnter={() => setActive(i)}
              onFocusCapture={() => setActive(i)}
              className={`group relative h-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-surface transition-[flex-grow,flex-basis,border-color,box-shadow] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
                isActive
                  ? "w-[calc(min(72svh,640px)*9/16)] flex-none border-electric/50 shadow-[0_30px_90px_-30px_rgba(51,51,255,.8)]"
                  : "flex-1 hover:border-white/25"
              }`}
            >
              <button
                type="button"
                onClick={() => (isActive ? open(p) : setActive(i))}
                aria-label={`${p.client} — ${isActive ? "abrir com som" : "ver reel"}`}
                aria-expanded={isActive}
                className="absolute inset-0 cursor-pointer"
              >
                <ReelMedia p={p} playing={isActive && inView} />
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive ? "bg-gradient-to-t from-black/85 via-black/5 to-black/30" : "bg-black/45"
                  }`}
                />
                {!isActive && (
                  <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rotate-180 text-sm font-semibold whitespace-nowrap text-white/85 [writing-mode:vertical-rl]">
                    {p.client}
                  </span>
                )}
              </button>
              {isActive && (
                <>
                  <span className="pointer-events-none absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/90">
                    <Clapperboard className="size-4" />
                    Reels
                  </span>
                  <ReelInfo p={p} onOpen={() => open(p)} />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Celular/tablet: reels deslizando */}
      <div
        ref={strip}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-[11vw] pb-4 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((p, i) => (
          <article
            key={p.slug}
            data-reel={i}
            className="relative aspect-[9/16] w-[78vw] max-w-[360px] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-surface"
          >
            <button
              type="button"
              onClick={() => open(p)}
              aria-label={`Abrir ${p.client} com som`}
              className="absolute inset-0"
            >
              <ReelMedia p={p} playing={mobileActive === i && inView} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-black/30" />
            </button>
            <span className="pointer-events-none absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/90">
              <Clapperboard className="size-4" />
              Reels
            </span>
            <ReelInfo p={p} onOpen={() => open(p)} />
          </article>
        ))}
      </div>
    </section>
  );
}
