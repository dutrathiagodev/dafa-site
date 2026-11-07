/**
 * Arcos de luz azul inspirados na identidade visual da DAFA.
 * Movimento lento e sutil (pausado em "movimento reduzido").
 */
export default function LightArcs({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,#1010ec_0%,#030326_45%,transparent_75%)] opacity-70" />
      <div className="absolute -top-1/3 left-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,16,236,.35),transparent_60%)] blur-3xl" />
      <div
        className="light-arc animate-drift"
        style={
          {
            "--r": "-18deg",
            width: "140vmax",
            height: "140vmax",
            left: "-30vmax",
            top: "38%",
          } as React.CSSProperties
        }
      />
      <div
        className="light-arc animate-drift opacity-60 [animation-delay:-6s]"
        style={
          {
            "--r": "24deg",
            width: "110vmax",
            height: "110vmax",
            left: "15vmax",
            top: "55%",
          } as React.CSSProperties
        }
      />
      <div
        className="light-arc animate-drift opacity-40 [animation-delay:-12s]"
        style={
          {
            "--r": "-40deg",
            width: "90vmax",
            height: "90vmax",
            right: "-55vmax",
            top: "-30%",
          } as React.CSSProperties
        }
      />
    </div>
  );
}
