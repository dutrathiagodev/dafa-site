"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Animação de entrada discreta para qualquer elemento com `data-reveal`.
 * Usa IntersectionObserver (não depende de posições calculadas no carregamento),
 * então funciona mesmo quando vídeos e imagens mudam a altura da página depois.
 * Se o visitante prefere menos movimento, os elementos aparecem direto.
 */
export default function Reveals() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    gsap.set(els, { autoAlpha: 0, y: 32 });

    let queue: HTMLElement[] = [];
    let scheduled = false;
    const flush = () => {
      gsap.to(queue, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.07,
        overwrite: true,
      });
      queue = [];
      scheduled = false;
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          queue.push(e.target as HTMLElement);
        });
        if (queue.length && !scheduled) {
          scheduled = true;
          requestAnimationFrame(flush);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
