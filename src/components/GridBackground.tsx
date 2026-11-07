/**
 * Fundo em grade: preto em cima, azul DAFA embaixo.
 * A grade desliza devagar e o brilho azul "respira" (parado em movimento reduzido).
 */
export default function GridBackground({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* degradê vertical: preto → azul profundo */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#07080c_0%,#07080c_38%,#06073a_72%,#10119a_100%)]" />

      {/* brilho azul embaixo, respirando */}
      <div className="animate-glow absolute inset-x-[-15%] bottom-[-35%] h-[75%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(51,51,255,.6),rgba(16,16,236,.25)_55%,transparent)] blur-2xl" />

      {/* grade de linhas finas, deslizando */}
      <div className="animate-grid absolute -inset-[48px] [background-image:linear-gradient(rgba(255,255,255,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.11)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,.35),#000_55%)]" />
    </div>
  );
}
