"use client";

import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Animação de entrada discreta para qualquer elemento com `data-reveal`.
 * Se o visitante prefere menos movimento, os elementos aparecem direto.
 */
export default function Reveals() {
  useGSAP(() => {
    const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    if (prefersReducedMotion()) return;

    gsap.set(els, { autoAlpha: 0, y: 36 });
    ScrollTrigger.batch(els, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          overwrite: true,
        }),
    });
  });

  return null;
}
