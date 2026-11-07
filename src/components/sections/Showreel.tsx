"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { asset } from "@/lib/asset";
import { showreel } from "@/content/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Vídeo de apresentação: toca sozinho (sem som, em loop), sem botão de play.
 * Clicar no vídeo ou no ícone liga/desliga o som ali mesmo.
 * Ele "abre" conforme entra na tela e pausa quando sai.
 */
export default function Showreel() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.play().catch(() => {});
    setMuted(v.muted);
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-reel-frame]",
        { scale: 0.82, borderRadius: 48, rotateX: 14 },
        {
          scale: 1,
          borderRadius: 24,
          rotateX: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "center center",
            scrub: true,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      id="showreel"
      ref={root}
      aria-label="Vídeo de apresentação da DAFA"
      className="relative px-4 pt-16 pb-24 sm:px-8 sm:pt-28 [perspective:1400px]"
    >
      <div
        data-reel-frame
        className="group relative mx-auto aspect-video max-w-[1200px] overflow-hidden rounded-3xl border border-white/10 bg-navy shadow-[0_40px_120px_-30px_rgba(16,16,236,.7)] will-change-transform"
      >
        <video
          ref={video}
          src={asset(showreel.src)}
          poster={asset(showreel.poster)}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          onClick={toggleSound}
          aria-label={`${showreel.title}. Clique para ${muted ? "ligar" : "desligar"} o som.`}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={!muted}
          aria-label={muted ? "Ligar o som do vídeo" : "Desligar o som do vídeo"}
          className="absolute right-4 bottom-4 grid size-10 place-items-center rounded-full border border-white/15 bg-black/35 text-white/90 backdrop-blur-md transition hover:border-white/40 hover:bg-black/55 sm:right-6 sm:bottom-6"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      </div>
    </section>
  );
}
