"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Rolagem suave (Lenis) sincronizada com o relógio do GSAP,
 * para que as animações presas ao scroll fiquem sempre no mesmo quadro.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener("dafa:lock-scroll", stop);
    window.addEventListener("dafa:unlock-scroll", start);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("dafa:lock-scroll", stop);
      window.removeEventListener("dafa:unlock-scroll", start);
      lenis.destroy();
    };
  }, []);

  return null;
}
