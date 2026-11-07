"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { runAlphaCanvas } from "@/lib/alpha-video";
import { CAMERA_MEDIA, CAMERA_TIMING as T, MODEL_POSE } from "./config";
import { createModelViewer } from "./model-viewer";

type State = "closed" | "opening" | "open" | "closing";

/**
 * Câmera do hero (Sony ZV-E10 + Sigma 16mm f/1.4).
 *  - Fechada: modelo 3D real — arraste para girar em qualquer direção (lados, cima/baixo,
 *    diagonais e no próprio plano), com inércia; parada, gira sozinha.
 *  - Clique/toque (ou sozinha de tempos em tempos): volta de frente e se desmonta
 *    (vídeo recortado por IA, fundo transparente). Aberta, arrastar inclina; clique monta.
 * Sem WebGL ou com movimento reduzido, mostra a foto parada (recortada).
 */
export default function Camera3D({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const gl = useRef<HTMLCanvasElement>(null);
  const vc = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const toggleRef = useRef<() => void>(() => {});
  const [ready3d, setReady3d] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let alive = true;
    let state: State = "closed";
    let lastInput = performance.now();
    let openedAt = 0;
    let autoOpened = false;
    let pauseTimer = 0;
    const v = video.current!;
    const el = root.current!;
    let viewer: Awaited<ReturnType<typeof createModelViewer>> | null = null;

    const stopVideoCanvas = runAlphaCanvas(vc.current!, () => v);

    const open = async (auto = false) => {
      if (state !== "closed" || !viewer || v.readyState < 2) return;
      state = "opening";
      autoOpened = auto;
      await viewer.resetPose(0.7);
      v.currentTime = 0;
      await v.play().catch(() => {});
      setShowVideo(true);
      // garante a parada exata quando a câmera está toda aberta
      window.clearTimeout(pauseTimer);
      pauseTimer = window.setTimeout(() => {
        if (state !== "opening") return;
        v.pause();
        state = "open";
        openedAt = performance.now();
      }, (T.openAt - v.currentTime) * 1000);
    };
    const close = () => {
      if (state !== "open") return;
      state = "closing";
      autoOpened = false;
      gsap.to(tilt.current, { rotationX: 0, rotationY: 0, duration: 0.5, ease: "power2.inOut" });
      v.currentTime = T.closeFrom;
      v.play().catch(() => {});
    };
    const toggle = () => (state === "closed" ? open() : state === "open" ? close() : undefined);
    toggleRef.current = toggle;

    const onTime = () => {
      if (state === "opening" && v.currentTime >= T.openAt - 0.06) {
        v.pause();
        state = "open";
        openedAt = performance.now();
      }
    };
    const onEnded = () => {
      setShowVideo(false);
      state = "closed";
      lastInput = performance.now();
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    // timeupdate é espaçado: confere a cada quadro também
    const tick = () => onTime();
    gsap.ticker.add(tick);

    // abre sozinha de tempos em tempos e fecha depois de um tempo aberta
    const timer = window.setInterval(() => {
      const now = performance.now();
      if (state === "closed" && now - lastInput > T.autoOpenEvery * 1000) open(true);
      if (state === "open" && autoOpened && now - openedAt > T.holdOpen * 1000 && now - lastInput > 2500) close();
    }, 500);

    // clique (sem arrastar) abre/monta; aberta, arrastar inclina
    let downX = 0;
    let downY = 0;
    let lastX = 0;
    let lastY = 0;
    let dragging = false;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      downX = lastX = e.clientX;
      downY = lastY = e.clientY;
      lastInput = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      lastInput = performance.now();
      if (state === "open") {
        const t = tilt.current!;
        const rx = gsap.utils.clamp(-T.maxTilt, T.maxTilt, Number(gsap.getProperty(t, "rotationX")) - (e.clientY - lastY) * 0.25);
        const ry = gsap.utils.clamp(-T.maxTilt, T.maxTilt, Number(gsap.getProperty(t, "rotationY")) + (e.clientX - lastX) * 0.25);
        gsap.to(t, { rotationX: rx, rotationY: ry, duration: 0.4, ease: "power3.out", overwrite: true });
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      lastInput = performance.now();
      if (Math.hypot(e.clientX - downX, e.clientY - downY) < 6) toggle();
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    // carrega o vídeo e o modelo depois que a página já apareceu
    const t = window.setTimeout(async () => {
      v.src = asset(CAMERA_MEDIA.explode);
      v.load();
      try {
        const vw = await createModelViewer(gl.current!, asset(CAMERA_MEDIA.model), {
          pose: MODEL_POSE,
          onReady: () => alive && setReady3d(true),
        });
        if (!alive) vw.destroy();
        else viewer = vw;
      } catch {
        // sem WebGL: fica a foto parada
      }
    }, 400);

    const float = gsap.to(tilt.current!.parentElement, { y: -10, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

    return () => {
      alive = false;
      window.clearTimeout(t);
      window.clearInterval(timer);
      window.clearTimeout(pauseTimer);
      gsap.ticker.remove(tick);
      float.kill();
      stopVideoCanvas?.();
      viewer?.destroy();
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const fade = "absolute inset-0 h-full w-full transition-opacity duration-500";

  return (
    <div
      ref={root}
      role="img"
      aria-label="Câmera Sony ZV-E10 com lente Sigma 16mm f/1.4 em 3D. Arraste para girar em qualquer direção; toque para ver as peças."
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleRef.current();
        }
      }}
      className={`relative cursor-grab touch-none select-none [perspective:1100px] active:cursor-grabbing ${className}`}
    >
      <div className="relative h-full w-full">
        <div ref={tilt} className="relative h-full w-full will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(CAMERA_MEDIA.poster)}
            alt=""
            width={1280}
            height={720}
            fetchPriority="high"
            draggable={false}
            className={`${fade} object-contain ${ready3d ? "opacity-0" : "opacity-100"}`}
          />
          <canvas ref={gl} aria-hidden="true" className={`${fade} ${ready3d && !showVideo ? "opacity-100" : "pointer-events-none opacity-0"}`} />
          <canvas ref={vc} aria-hidden="true" className={`${fade} object-contain ${showVideo ? "opacity-100" : "opacity-0"} pointer-events-none`} />
        </div>
      </div>
      <video ref={video} muted playsInline preload="auto" className="pointer-events-none absolute top-0 left-0 size-px opacity-0" />
    </div>
  );
}
