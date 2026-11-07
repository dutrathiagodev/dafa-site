import type { ReactNode } from "react";

/** Etiqueta pequena (serviços de um projeto, categorias). */
export function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`rounded-full bg-white/[.09] px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur ${className}`}
    >
      {children}
    </span>
  );
}
