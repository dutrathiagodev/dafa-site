"use client";

import { useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Câmera do hero com fotos realistas (Sony ZV-E10 + Sigma 16mm f/1.4).
 * Clicar na câmera abre a vista explodida; clicar de novo monta.
 * Com o mouse por cima ela inclina de leve; parada, flutua.
 * O fundo preto das fotos some sobre a página (mix-blend lighten).
 */
export default function CameraPhotos({ className = "" }: { className?: string }) {
  const root = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<() => void>(() => {});

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const closed = root.current!.querySelector("[data-cam-closed]");
      const opened = root.current!.querySelector("[data-cam-open]");
      const flash = root.current!.querySelector("[data-cam-flash]");
      const stage = root.current!.querySelector("[data-cam-stage]");
      let isOpen = false;

      gsap.set(opened, { autoAlpha: 0, scale: 0.94, filter: "blur(8px)" });

      if (!reduce) {
        // Entrada: a câmera surge do escuro
        gsap.from(closed, { autoAlpha: 0, scale: 0.9, filter: "blur(12px)", duration: 1.6, delay: 1.2, ease: "power3.out" });
        // Flutuar
        gsap.to(stage, { y: -12, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }

      toggleRef.current = () => {
        isOpen = !isOpen;
        setOpen(isOpen);
        const d = reduce ? 0 : 1.2;
        const tl = gsap.timeline({ defaults: { duration: d, ease: "power3.inOut", overwrite: "auto" } });
        tl.fromTo(flash, { opacity: 0 }, { opacity: 0.9, duration: d * 0.35, yoyo: true, repeat: 1, ease: "power2.out" }, 0);
        if (isOpen) {
          tl.to(closed, { autoAlpha: 0, scale: 1.08, filter: "blur(10px)" }, 0).to(
            opened,
            { autoAlpha: 1, scale: 1, filter: "blur(0px)" },
            d * 0.15,
          );
        } else {
          tl.to(opened, { autoAlpha: 0, scale: 0.94, filter: "blur(8px)" }, 0).to(
            closed,
            { autoAlpha: 1, scale: 1, filter: "blur(0px)" },
            d * 0.15,
          );
        }
      };

      // Inclinação leve com o mouse
      if (reduce) return;
      const rx = gsap.quickTo(stage, "rotateX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(stage, "rotateY", { duration: 0.8, ease: "power3.out" });
      const el = root.current!;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 14);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
      };
      const onLeave = () => {
        rx(0);
        ry(0);
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root },
  );

  return (
    <button
      ref={root}
      type="button"
      onClick={() => toggleRef.current()}
      aria-pressed={open}
      aria-label={open ? "Montar a câmera" : "Abrir a câmera e ver as peças"}
      className={`relative block cursor-pointer [perspective:1200px] ${className}`}
    >
      <div data-cam-stage className="relative h-full w-full [transform-style:preserve-3d]">
        <div
          data-cam-flash
          aria-hidden="true"
          className="pointer-events-none absolute inset-[15%] rounded-full bg-electric opacity-0 blur-[80px]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-cam-closed
          src={asset("/media/camera/zve10-montada.webp")}
          alt="Câmera Sony ZV-E10 com lente Sigma 16mm f/1.4"
          width={1400}
          height={1400}
          fetchPriority="high"
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain mix-blend-lighten [mask-image:radial-gradient(closest-side,#000_70%,transparent)]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-cam-open
          src={asset("/media/camera/zve10-explodida.webp")}
          alt="Vista explodida da câmera: lente, sensor, placas e botões separados"
          width={1400}
          height={1400}
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain mix-blend-lighten [mask-image:radial-gradient(closest-side,#000_70%,transparent)]"
        />
      </div>
    </button>
  );
}
