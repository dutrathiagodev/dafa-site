"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Caixa de seleção de editor (estilo After Effects/Figma) em volta de um bloco.
 * Entrada: a caixa se desenha, as alças aparecem e o conteúdo entra em foco;
 * depois a caixa some. Passando o mouse, a seleção volta.
 */
export default function EditFrame({
  children,
  label = "Texto",
  className = "",
  center = false,
}: {
  children: ReactNode;
  label?: string;
  className?: string;
  center?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const frame = root.current!.querySelector("[data-ef-frame]");
      const handles = root.current!.querySelectorAll("[data-ef-handle]");
      const tag = root.current!.querySelector("[data-ef-tag]");
      const content = root.current!.querySelector("[data-ef-content]");

      gsap.set(content, { opacity: 0.12, filter: "blur(14px)" });
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        })
        .fromTo(
          frame,
          { opacity: 1, clipPath: "inset(0 100% 100% 0)" },
          { clipPath: "inset(0 0% 0% 0)", duration: 0.6, ease: "power3.inOut" },
        )
        .fromTo(handles, { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(3)", stagger: 0.05 }, 0.35)
        .fromTo(tag, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, 0.4)
        .to(content, { opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power2.out" }, 0.3)
        .to([frame, tag], { opacity: 0, duration: 0.5, delay: 0.5 })
        .set([frame, tag], { clearProps: "opacity,clipPath,transform" })
        .set(content, { clearProps: "filter" });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`group relative w-fit ${center ? "mx-auto" : ""} ${className}`}>
      <div data-ef-content>{children}</div>

      <div
        data-ef-frame
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-3 -inset-y-2 border border-[#8f92ff]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-right-1 -bottom-1"].map((pos) => (
          <span
            key={pos}
            data-ef-handle
            className={`absolute ${pos} size-2 border border-[#8f92ff] bg-bg`}
          />
        ))}
      </div>
      <span
        data-ef-tag
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 -left-3 rounded-sm bg-electric px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-white uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        {label}
      </span>
    </div>
  );
}
