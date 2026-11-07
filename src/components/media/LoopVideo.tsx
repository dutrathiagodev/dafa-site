"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";
import { prefersReducedMotion } from "@/lib/gsap";

type Props = {
  src: string;
  poster: string;
  /** Texto alternativo (o vídeo é decorativo se vazio). */
  label?: string;
  /** Funde a borda do vídeo no fundo (para vídeos de produto com fundo preto). */
  fadeEdges?: boolean;
  className?: string;
};

/**
 * Vídeo curto em loop, sem som, que só toca quando está na tela.
 * Com movimento reduzido, fica parado na capa.
 */
export default function LoopVideo({ src, poster, label = "", fadeEdges = false, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current!;
    if (prefersReducedMotion()) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

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
      className={`${fadeEdges ? "fade-edges" : ""} ${className}`}
    />
  );
}
