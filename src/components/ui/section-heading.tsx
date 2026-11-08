import type { ReactNode } from "react";

/** Rótulo pequeno acima dos títulos (opcional, sem numeração). */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p data-reveal className={`text-xs tracking-[0.3em] text-muted uppercase ${className}`}>
      {children}
    </p>
  );
}

/** Trecho do título em itálico com a fonte de destaque (Callum IT). */
export function Accent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-display font-bold text-[#9a9cff] italic ${className}`}>{children}</span>
  );
}

const sizes = {
  lg: "text-[clamp(2.4rem,6vw,4.75rem)] leading-[0.95] tracking-[-0.04em]",
  md: "text-[clamp(2.2rem,5vw,4.25rem)] leading-[0.95] tracking-[-0.04em]",
  sm: "text-[clamp(2rem,4.5vw,3.75rem)] leading-[0.98] tracking-[-0.035em]",
};

/**
 * Cabeçalho de seção: rótulo + título (h2) + descrição opcional.
 * `id` vira o alvo do aria-labelledby da seção.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  size = "md",
  align = "left",
  className = "",
}: {
  id: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  size?: keyof typeof sizes;
  align?: "left" | "center";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "text-center" : ""} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} data-reveal className={`${eyebrow ? "mt-4 " : ""}font-bold ${sizes[size]}`}>
        {title}
      </h2>
      {description && (
        <p data-reveal className={`mt-5 max-w-md text-muted ${center ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </div>
  );
}
