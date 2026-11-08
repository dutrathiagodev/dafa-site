"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { runAlphaCanvas } from "@/lib/alpha-video";
import { CAMERA_MEDIA, CAMERA_TIMING as T } from "./config";

type State = "closed" | "opening" | "open" | "closing";

/**
 * Câmera do hero: a foto/vídeo reais da Sony ZV-E10, com fundo transparente.
 *  - Mouse por cima ou arrastando: a câmera inclina em perspectiva e volta ao soltar.
 *  - Clique/toque (ou sozinha de tempos em tempos): desmonta em peças (vídeo) e monta de novo.
 * Com movimento reduzido, mostra só a foto parada.
 */
export default function Camera({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const vc = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const toggleRef = useRef<() => void>(() => {});
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let state: State = "closed";
    let lastInput = performance.now();
    let openedAt = 0;
    let autoOpened = false;
    let pauseTimer = 0;
    const v = video.current!;
    const el = root.current!;
    const t = tilt.current!;

    const stopVideoCanvas = runAlphaCanvas(vc.current!, () => v);

    const rx = gsap.quickTo(t, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(t, "rotationY", { duration: 0.6, ease: "power3.out" });
    const setTilt = (x: number, y: number, max: number) => {
      rx(gsap.utils.clamp(-max, max, x));
      ry(gsap.utils.clamp(-max, max, y));
    };

    const open = async (auto = false) => {
      if (state !== "closed" || v.readyState < 2) return;
      state = "opening";
      autoOpened = auto;
      setTilt(0, 0, 0);
      v.currentTime = 0;
      await v.play().catch(() => {});
      setShowVideo(true);
      // garante a parada exata quando a câmera está toda aberta
      window.clearTimeout(pauseTimer);
      pauseTimer = window.setTimeout(onOpened, Math.max(0, (T.openAt - v.currentTime) * 1000));
    };
    const onOpened = () => {
      if (state !== "opening") return;
      v.pause();
      state = "open";
      openedAt = performance.now();
    };
    const close = () => {
      if (state !== "open") return;
      state = "closing";
      autoOpened = false;
      v.currentTime = T.closeFrom;
      v.play().catch(() => {});
    };
    const toggle = () => (state === "closed" ? open() : state === "open" ? close() : undefined);
    toggleRef.current = toggle;

    const onTime = () => {
      if (state === "opening" && v.currentTime >= T.openAt - 0.06) onOpened();
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

    // abre sozinha de tempos em tempos e monta de novo depois de um tempo aberta
    const timer = window.setInterval(() => {
      const now = performance.now();
      if (state === "closed" && now - lastInput > T.autoOpenEvery * 1000) open(true);
      if (state === "open" && autoOpened && now - openedAt > T.holdOpen * 1000 && now - lastInput > 2500) close();
    }, 500);

    // mouse por cima inclina de leve; arrastando, inclina mais; clique sem arrastar abre/monta
    let downX = 0;
    let downY = 0;
    let dragging = false;
    const aim = (e: PointerEvent, max: number) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      setTilt(-ny * max, nx * max, max);
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      downX = e.clientX;
      downY = e.clientY;
      lastInput = performance.now();
      aim(e, T.maxTilt);
    };
    const onMove = (e: PointerEvent) => {
      if (dragging) {
        lastInput = performance.now();
        aim(e, T.maxTilt);
      } else if (e.pointerType === "mouse" && el.matches(":hover")) {
        lastInput = performance.now();
        aim(e, T.hoverTilt);
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      lastInput = performance.now();
      if (Math.hypot(e.clientX - downX, e.clientY - downY) < 6) toggle();
      if (e.pointerType !== "mouse") setTilt(0, 0, 0);
    };
    const onLeave = () => {
      if (!dragging) setTilt(0, 0, 0);
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    // carrega o vídeo depois que a página já apareceu
    const load = window.setTimeout(() => {
      v.src = asset(CAMERA_MEDIA.explode);
      v.load();
    }, 400);

    const bob = gsap.to(float.current!, { y: -10, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

    return () => {
      window.clearTimeout(load);
      window.clearInterval(timer);
      window.clearTimeout(pauseTimer);
      gsap.ticker.remove(tick);
      bob.kill();
      stopVideoCanvas?.();
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const layer = "absolute inset-0 h-full w-full object-contain transition-opacity duration-300";

  return (
    <div
      ref={root}
      role="img"
      aria-label="Câmera Sony ZV-E10 com lente Sigma 16mm f/1.4. Passe o mouse para inclinar; toque para ver as peças."
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleRef.current();
        }
      }}
      className={`relative cursor-pointer touch-pan-y select-none [perspective:1100px] ${className}`}
    >
      <div ref={float} className="relative h-full w-full">
        <div ref={tilt} className="relative h-full w-full will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(CAMERA_MEDIA.poster)}
            alt=""
            width={1280}
            height={720}
            fetchPriority="high"
            draggable={false}
            className={`${layer} ${showVideo ? "opacity-0" : "opacity-100"}`}
          />
          <canvas ref={vc} aria-hidden="true" className={`${layer} pointer-events-none ${showVideo ? "opacity-100" : "opacity-0"}`} />
        </div>
      </div>
      <video ref={video} muted playsInline preload="auto" className="pointer-events-none absolute top-0 left-0 size-px opacity-0" />
    </div>
  );
}
