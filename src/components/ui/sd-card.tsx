import { useId, type SVGProps } from "react";

/**
 * Cartão de memória (SD) estilizado com a identidade DAFA.
 * Os contatos têm `data-sd-pin` para poderem ser acesos pela animação.
 */
export function SdCard({
  label = "DAFA",
  ...props
}: SVGProps<SVGSVGElement> & { label?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 160" fill="none" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a1a3a" />
          <stop offset=".55" stopColor="#0a0a24" />
          <stop offset="1" stopColor="#05050f" />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8f92ff" />
          <stop offset=".5" stopColor="#3333ff" />
          <stop offset="1" stopColor="#1010ec" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3d27a" />
          <stop offset="1" stopColor="#b68a2e" />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1010ec" />
          <stop offset="1" stopColor="#3333ff" />
        </linearGradient>
      </defs>
      {/* corpo com o canto chanfrado */}
      <path
        d="M10 2h72l36 36v110a10 10 0 0 1-10 10H10A10 10 0 0 1 0 148V12A10 10 0 0 1 10 2Z"
        fill={`url(#${id}b)`}
        stroke={`url(#${id}s)`}
        strokeWidth="1.6"
      />
      {/* contatos */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          data-sd-pin
          x={12 + i * 11}
          y={i === 6 ? 22 : 12}
          width="7"
          height={i === 6 ? 14 : 22}
          rx="1.5"
          fill={`url(#${id}g)`}
        />
      ))}
      {/* trava lateral */}
      <rect x="-3" y="52" width="4" height="20" rx="1" fill="#2a2a55" />
      {/* etiqueta */}
      <rect
        x="12"
        y="62"
        width="96"
        height="78"
        rx="6"
        fill={`url(#${id}l)`}
        opacity=".95"
      />
      <path
        d="M12 118c30-22 64-26 96-14v30a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6Z"
        fill="#fff"
        opacity=".08"
      />
      <text
        x="60"
        y="104"
        textAnchor="middle"
        fill="#fafafa"
        fontSize="22"
        fontWeight="800"
        letterSpacing="2"
        fontFamily="var(--font-creato), system-ui, sans-serif"
      >
        {label}
      </text>
      <text
        x="60"
        y="124"
        textAnchor="middle"
        fill="#fafafa"
        opacity=".75"
        fontSize="7"
        letterSpacing="2.4"
        fontFamily="var(--font-creato), system-ui, sans-serif"
      >
        CONTEÚDO
      </text>
    </svg>
  );
}
