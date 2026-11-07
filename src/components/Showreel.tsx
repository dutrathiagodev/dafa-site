"use client";

import { asset } from "@/lib/asset";
import { useRef } from "react";
import { Play } from "lucide-react";
import { showreel } from "@/content/site";
import { useMediaModal } from "./VideoModal";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Vídeo de apresentação que "abre" conforme entra na tela. */
export default function Showreel() {
  const root = useRef<HTMLElement>(null);
  const openModal = useMediaModal();

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
      className="relative px-4 pb-24 sm:px-8 [perspective:1400px]"
    >
      <div
        data-reel-frame
        className="relative mx-auto aspect-video max-w-[1200px] overflow-hidden rounded-3xl border border-white/10 bg-navy shadow-[0_40px_120px_-30px_rgba(16,16,236,.7)] will-change-transform"
      >
        <video
          src={asset(showreel.preview)}
          poster={asset(showreel.poster)}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <button
          type="button"
          onClick={() =>
            openModal({
              kind: "video",
              src: showreel.src,
              poster: showreel.poster,
              title: showreel.title,
              format: "horizontal",
            })
          }
          className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-white"
          aria-label="Assistir ao vídeo de apresentação com som"
        >
          <span className="relative grid size-20 place-items-center rounded-full bg-white/15 backdrop-blur-md transition-transform duration-500 group-hover:scale-110 sm:size-24">
            <span className="absolute inset-0 animate-ping rounded-full bg-electric/40 [animation-duration:2.4s]" />
            <Play className="relative size-8 translate-x-0.5 fill-white" />
          </span>
          <span className="text-sm font-medium tracking-wide opacity-90">
            Assistir com som
          </span>
        </button>
      </div>
    </section>
  );
}
