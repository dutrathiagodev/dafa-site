"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const KEY = "dafa:scroll-y";

/**
 * Ao recarregar (F5) a página volta para onde estava. O navegador sozinho
 * não consegue: as seções presas ao scroll só ganham altura depois que o
 * GSAP mede tudo, então guardamos a posição e restauramos após o `load`.
 */
function rememberScroll(scrollTo: (y: number) => void) {
  history.scrollRestoration = "manual";
  const save = () => {
    try {
      sessionStorage.setItem(KEY, String(Math.round(window.scrollY)));
    } catch {}
  };
  window.addEventListener("pagehide", save);

  let saved = 0;
  try {
    saved = Number(sessionStorage.getItem(KEY)) || 0;
  } catch {}
  if (saved > 0 && !location.hash) {
    const restore = () =>
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        scrollTo(saved);
      });
    if (document.readyState === "complete") restore();
    else window.addEventListener("load", restore, { once: true });
  }
  return () => window.removeEventListener("pagehide", save);
}

/**
 * Rolagem suave (Lenis) sincronizada com o relógio do GSAP,
 * para que as animações presas ao scroll fiquem sempre no mesmo quadro.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return rememberScroll((y) => window.scrollTo(0, y));

    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener("dafa:lock-scroll", stop);
    window.addEventListener("dafa:unlock-scroll", start);
    const forget = rememberScroll((y) => lenis.scrollTo(y, { immediate: true, force: true }));

    return () => {
      forget();
      gsap.ticker.remove(tick);
      window.removeEventListener("dafa:lock-scroll", stop);
      window.removeEventListener("dafa:unlock-scroll", start);
      lenis.destroy();
    };
  }, []);

  return null;
}
