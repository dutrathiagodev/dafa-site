"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Cursor personalizado (só com mouse): um anel que segue o ponteiro e,
 * sobre elementos com `data-cursor="Texto"`, cresce e mostra o texto.
 */
export default function CursorFollower() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const el = ring.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.25, autoAlpha: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    let active = "";

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x(e.clientX);
      y(e.clientY);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const text = target?.dataset.cursor ?? "";
      if (text !== active) {
        active = text;
        if (label.current) label.current.textContent = text;
        gsap.to(el, {
          scale: text ? 1 : 0.25,
          autoAlpha: 1,
          backgroundColor: text ? "rgba(51,51,255,0.92)" : "rgba(51,51,255,0)",
          borderColor: text ? "rgba(51,51,255,0)" : "rgba(244,244,248,0.55)",
          duration: 0.4,
          ease: "power3.out",
        });
      } else {
        gsap.to(el, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
      }
    };
    const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 });
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none invisible fixed top-0 left-0 z-[60] grid size-20 place-items-center rounded-full border border-white/50 opacity-0 [html[data-modal]_&]:hidden"
    >
      <span ref={label} className="text-xs font-semibold tracking-wide text-white" />
    </div>
  );
}
