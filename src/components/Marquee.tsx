const items = [
  "Produção audiovisual",
  "Fotografia",
  "Gerenciamento de conteúdo",
  "Roteiros",
  "Reels",
  "Tráfego pago",
];

export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-10 pr-10"
    >
      {items.map((t) => (
        <li key={t} className="flex items-center gap-10 whitespace-nowrap">
          <span>{t}</span>
          <span className="text-electric glow-blue" aria-hidden="true">
            ✳
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative overflow-hidden border-y border-white/[.06] bg-surface/60 py-6 text-[clamp(1.5rem,4vw,2.75rem)] font-semibold tracking-tight text-ink/90 uppercase">
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
