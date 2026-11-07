"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { CAMERA_MEDIA } from "./config";
import { createCameraController } from "./camera-controller";

/**
 * Câmera do hero em "3D" (Sony ZV-E10 + Sigma 16mm f/1.4), feita com vídeos reais
 * e SEM recorte (a câmera fica 100% sólida; só a borda do vídeo se funde no fundo).
 * Gira sozinha; arrastar gira para os dois lados e inclina para cima/baixo; o mouse
 * inclina; clique/toque (ou a cada duas voltas) desmonta e monta. Aberta, também gira.
 * Estados e arraste: camera-controller.ts. Arquivos e tempos: config.ts.
 */
export default function Camera3D({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const spin = useRef<HTMLVideoElement>(null);
  const spinReverse = useRef<HTMLVideoElement>(null);
  const explode = useRef<HTMLVideoElement>(null);
  const toggle = useRef<() => void>(() => {});
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctrl = createCameraController({
      root: root.current!,
      stage: stage.current!,
      spin: spin.current!,
      spinReverse: spinReverse.current!,
      explode: explode.current!,
      onReady: () => setLive(true),
    });
    toggle.current = ctrl.toggle;

    // carrega os vídeos depois que a página já apareceu
    const t = window.setTimeout(() => {
      const load = (v: HTMLVideoElement | null, src: string) => {
        if (!v) return;
        v.src = asset(src);
        v.load();
      };
      load(spin.current, CAMERA_MEDIA.spin);
      load(spinReverse.current, CAMERA_MEDIA.spinReverse);
      load(explode.current, CAMERA_MEDIA.explode);
    }, 300);

    const float = gsap.to(stage.current, { y: -10, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

    return () => {
      window.clearTimeout(t);
      float.kill();
      ctrl.destroy();
    };
  }, []);

  // só o vídeo marcado com data-on aparece
  const layer =
    "absolute inset-0 h-full w-full object-contain opacity-0 data-[on]:opacity-100";

  return (
    <div
      ref={root}
      role="img"
      aria-label="Câmera Sony ZV-E10 com lente Sigma 16mm f/1.4. Arraste para girar; toque para ver as peças."
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle.current();
        }
      }}
      className={`relative cursor-grab touch-pan-y select-none [perspective:1100px] active:cursor-grabbing ${className}`}
    >
      {/* a borda do vídeo some suavemente no fundo do site */}
      <div
        ref={stage}
        className="fade-edges relative h-full w-full will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(CAMERA_MEDIA.poster)}
          alt=""
          width={1280}
          height={720}
          fetchPriority="high"
          draggable={false}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${live ? "opacity-0" : "opacity-100"}`}
        />
        <video ref={spin} muted playsInline preload="auto" className={layer} />
        <video ref={spinReverse} muted playsInline loop preload="auto" className={layer} />
        <video ref={explode} muted playsInline preload="auto" className={layer} />
      </div>
    </div>
  );
}
