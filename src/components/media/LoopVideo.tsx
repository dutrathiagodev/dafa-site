"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { prefersReducedMotion } from "@/lib/gsap";
import { runAlphaCanvas } from "@/lib/alpha-video";

type Props = {
  src: string;
  poster: string;
  /** Texto alternativo (o vídeo é decorativo se vazio). */
  label?: string;
  /**
   * Vídeo "empilhado" com recorte (cor em cima, máscara embaixo): desenha com fundo
   * transparente num canvas (src/lib/alpha-video.ts). O `poster` deve ser a imagem já recortada.
   */
  alpha?: boolean;
  className?: string;
};

/**
 * Vídeo curto em loop, sem som, que só toca quando está na tela.
 * Com movimento reduzido, fica parado na capa.
 */
export default function LoopVideo({ src, poster, label = "", alpha = false, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const v = ref.current!;
    if (prefersReducedMotion()) return;
    const target = alpha ? canvas.current! : v;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(target);
    const stop = alpha ? runAlphaCanvas(canvas.current!, () => v, () => setLive(true)) : null;
    return () => {
      io.disconnect();
      stop?.();
    };
  }, [alpha]);

  if (!alpha) {
    return (
      <video
        ref={ref}
        src={asset(src)}
        poster={asset(poster)}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        className={className}
      />
    );
  }

  return (
    <div role={label ? "img" : undefined} aria-label={label || undefined} className={`relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(poster)}
        alt=""
        draggable={false}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${live ? "opacity-0" : "opacity-100"}`}
      />
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${live ? "opacity-100" : "opacity-0"}`}
      />
      <video ref={ref} src={asset(src)} muted loop playsInline preload="auto" className="pointer-events-none absolute top-0 left-0 size-px opacity-0" />
    </div>
  );
}
