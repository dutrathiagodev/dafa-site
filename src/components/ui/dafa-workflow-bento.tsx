"use client";

/**
 * Bento "Como funciona" — adaptado do ink-orbit-features (21st.dev) para a DAFA:
 * tema escuro azul, cartão de memória como hub e nenhum dado/métrica inventado.
 *
 *  1. Fluxo: roteiro, captação, edição e design entram no cartão DAFA
 *     e saem como uma pilha de peças (Reels, post, carrossel, foto).
 *  2. Formatos: o hub distribui uma peça por vez para feed, Reels, stories e anúncios.
 *  3. Calendário: as pautas do mês acendem uma a uma.
 */

import React from "react";
import {
  Camera,
  CircleDashed,
  Clapperboard,
  LayoutGrid,
  Lightbulb,
  Megaphone,
  Palette,
  PenLine,
  Scissors,
  type LucideIcon,
} from "lucide-react";

/* ----------------------------------------------------------------- hooks */

function useInView(threshold = 0.2) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);
  return [ref, inView] as const;
}

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/* ---------------------------------------------------------------- pieces */

function Brackets() {
  return (
    <>
      <span className="db-c db-c-tl" aria-hidden="true" />
      <span className="db-c db-c-tr" aria-hidden="true" />
      <span className="db-c db-c-bl" aria-hidden="true" />
      <span className="db-c db-c-br" aria-hidden="true" />
    </>
  );
}

/** Mini cartão SD desenhado dentro dos diagramas. */
function MiniSd({ x, y, w = 46 }: { x: number; y: number; w?: number }) {
  const s = w / 120;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path
        d="M10 2h72l36 36v110a10 10 0 0 1-10 10H10A10 10 0 0 1 0 148V12A10 10 0 0 1 10 2Z"
        className="db-sd"
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={12 + i * 11}
          y={12}
          width="7"
          height="22"
          rx="1.5"
          className="db-pin"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
      <rect x="12" y="62" width="96" height="78" rx="6" fill="#1700f5" />
      <text
        x="60"
        y="108"
        textAnchor="middle"
        fontSize="24"
        fontWeight="800"
        letterSpacing="2"
        fill="#fafafa"
        fontFamily="var(--font-creato), system-ui, sans-serif"
      >
        DAFA
      </text>
    </g>
  );
}

function SvgIcon({
  Icon,
  cx,
  cy,
  size = 14,
}: {
  Icon: LucideIcon;
  cx: number;
  cy: number;
  size?: number;
}) {
  return (
    <Icon
      x={cx - size / 2}
      y={cy - size / 2}
      width={size}
      height={size}
      strokeWidth={1.8}
      color="currentColor"
    />
  );
}

/* --------------------------------------------------------------- 1. fluxo */

const PIECES = [
  { label: "REELS", kind: "reels" },
  { label: "POST", kind: "post" },
  { label: "CARROSSEL", kind: "carousel" },
  { label: "FOTO", kind: "photo" },
] as const;

function PieceArt({ kind }: { kind: (typeof PIECES)[number]["kind"] }) {
  if (kind === "reels")
    return (
      <g>
        <rect x="14" y="26" width="38" height="66" rx="4" className="db-art" />
        <path d="M29 52v14l12-7z" fill="#fafafa" />
        <rect x="62" y="34" width="62" height="5" rx="1" className="db-ink" />
        <rect x="62" y="45" width="50" height="3" rx="1" className="db-soft" />
        <rect x="62" y="52" width="56" height="3" rx="1" className="db-soft" />
        <rect x="62" y="74" width="40" height="12" rx="6" className="db-chip" />
      </g>
    );
  if (kind === "post")
    return (
      <g>
        <rect x="14" y="26" width="58" height="58" rx="4" className="db-art" />
        <circle cx="58" cy="40" r="6" fill="#fafafa" opacity=".8" />
        <path d="M14 76l20-22 14 14 10-8 14 14v2a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" fill="#fafafa" opacity=".35" />
        <rect x="82" y="34" width="42" height="5" rx="1" className="db-ink" />
        <rect x="82" y="45" width="36" height="3" rx="1" className="db-soft" />
        <rect x="82" y="52" width="40" height="3" rx="1" className="db-soft" />
      </g>
    );
  if (kind === "carousel")
    return (
      <g>
        {[2, 1, 0].map((k) => (
          <rect
            key={k}
            x={14 + k * 16}
            y={26 + k * 4}
            width="50"
            height="50"
            rx="4"
            className="db-art"
            opacity={1 - k * 0.28}
          />
        ))}
        {[0, 1, 2, 3].map((d) => (
          <circle key={d} cx={40 + d * 9} cy="90" r="2" className={d === 0 ? "db-dot-on" : "db-soft"} />
        ))}
      </g>
    );
  return (
    <g>
      <rect x="14" y="26" width="110" height="62" rx="4" className="db-art" />
      <circle cx="100" cy="42" r="7" fill="#fafafa" opacity=".85" />
      <path d="M14 80l30-28 22 20 16-12 42 30v2a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z" fill="#fafafa" opacity=".3" />
    </g>
  );
}

function FlowCard({ reduced, inView }: { reduced: boolean; inView: boolean }) {
  const [n, setN] = React.useState(0);
  const [side, setSide] = React.useState<"" | "left" | "right">("");
  React.useEffect(() => {
    if (reduced || !inView) return;
    const t = setInterval(() => setN((v) => v + 1), 2600);
    return () => clearInterval(t);
  }, [reduced, inView]);

  const inputs: { x: number; y: number; name: string; Icon: LucideIcon }[] = [
    { x: 52, y: 34, name: "Roteiro", Icon: PenLine },
    { x: 104, y: 18, name: "Captação", Icon: Camera },
    { x: 156, y: 36, name: "Edição", Icon: Scissors },
    { x: 44, y: 104, name: "Design", Icon: Palette },
  ];
  const L1 = "M117,67 C196,67 240,98 297,98";
  const L2 = "M117,73 C186,73 236,122 297,122";
  const R1 = "M343,98 C392,98 410,86 450,86";
  const R2 = "M343,122 C392,122 410,134 450,134";

  return (
    <div className="db-frame db-hover db-wide">
      <Brackets />
      <div className="db-card" style={{ padding: 0, overflow: "hidden" }}>
        <svg
          className="db-diagram"
          viewBox="0 0 640 178"
          role="img"
          aria-label="Roteiro, captação, edição e design passam pela DAFA e viram Reels, posts, carrosséis e fotos"
        >
          <defs>
            <radialGradient id="dbGlow" cx="320" cy="110" r="210" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1010ec" stopOpacity=".35" />
              <stop offset="1" stopColor="#1010ec" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="dbRays" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3333ff" stopOpacity=".45" />
              <stop offset="1" stopColor="#3333ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="640" height="178" fill="url(#dbGlow)" />
          {[-62, -38, -14, 14, 38, 62].map((a, i) => {
            const r = (d: number) => (d * Math.PI) / 180;
            return (
              <path
                key={i}
                d={`M320,110 L${320 + Math.sin(r(a)) * 260},${110 - Math.cos(r(a)) * 260} L${320 + Math.sin(r(a + 7)) * 260},${110 - Math.cos(r(a + 7)) * 260}Z`}
                fill="url(#dbRays)"
                opacity=".45"
              />
            );
          })}

          {/* etapas de entrada */}
          <g onMouseEnter={() => setSide("left")} onMouseLeave={() => setSide("")}>
            <rect x="20" y="4" width="170" height="134" fill="transparent" />
            {inputs.map((m) => (
              <line key={m.name} x1={m.x} y1={m.y} x2="104" y2="70" className="db-tie" />
            ))}
            <g style={{ color: "#c9cbff" }}>
              <rect x="91" y="57" width="26" height="26" rx="6" className="db-node" />
              <SvgIcon Icon={Lightbulb} cx={104} cy={70} size={13} />
            </g>
            {inputs.map((m) => (
              <g key={m.name} className="db-av" tabIndex={0} role="img" aria-label={m.name}>
                <circle cx={m.x} cy={m.y} r="13" className="db-node" />
                <g style={{ color: "#e6e7ff" }}>
                  <SvgIcon Icon={m.Icon} cx={m.x} cy={m.y} size={12} />
                </g>
                <g className="db-tip" transform={`translate(${m.x},${m.y - 22})`}>
                  <rect x={-m.name.length * 2.6 - 7} y="-9" width={m.name.length * 5.2 + 14} height="15" rx="3" fill="#f4f4f8" />
                  <text x="0" y="1.5" textAnchor="middle" fontSize="8" fill="#07080c" fontFamily="var(--font-creato), system-ui">
                    {m.name}
                  </text>
                </g>
              </g>
            ))}
          </g>

          {/* conexões */}
          {[L1, L2].map((d, i) => (
            <path key={d} d={d} className={`db-flow${side === "left" ? " db-flow-on" : ""}${i ? " db-dash" : ""}`} />
          ))}
          {[R1, R2].map((d, i) => (
            <path key={d} d={d} className={`db-flow${side === "right" ? " db-flow-on" : ""}${i ? " db-dash" : ""}`} />
          ))}
          {!reduced &&
            [L1, L2, R1, R2].map((d, i) => (
              <circle key={i} r="2.4" className="db-pkt">
                <animateMotion dur={`${2.2 + (i % 2) * 0.6}s`} begin={`${i * 0.35}s`} repeatCount="indefinite" path={d} />
              </circle>
            ))}

          {/* hub: cartão de memória */}
          <rect x="289" y="72" width="62" height="74" rx="10" fill="none" className={reduced ? "db-ring" : "db-ring db-glow"} />
          <MiniSd x={297} y={79} w={46} />

          {/* pilha de peças prontas */}
          <g onMouseEnter={() => setSide("right")} onMouseLeave={() => setSide("")}>
            {[2, 1, 0].map((k) => {
              const piece = PIECES[(n + k) % PIECES.length];
              return (
                <g key={`${n}-${k}`} transform={`translate(${450 + k * 12},${40 - k * 10})`} opacity={1 - k * 0.28}>
                  <g className={k === 0 ? "db-sheet db-sheet-new" : "db-sheet"}>
                    <rect width="138" height="102" rx="5" className="db-paper" />
                    {k === 0 && (
                      <>
                        <text x="10" y="16" fontSize="7" letterSpacing="1" className="db-mono">
                          {piece.label} · PRONTO
                        </text>
                        <PieceArt kind={piece.kind} />
                      </>
                    )}
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
        <div className="db-wide-copy">
          <div>
            <h3>Da ideia ao arquivo final</h3>
            <p>
              Roteiro, captação, edição e design passam pelo mesmo fluxo, com a
              identidade da sua marca.
            </p>
          </div>
          <div>
            <h3>Conteúdo pronto para publicar</h3>
            <p>
              Reels, posts, carrosséis e fotos no formato certo para cada
              canal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- 2. formatos */

function FormatsCard({ reduced }: { reduced: boolean }) {
  const tools: { name: string; Icon: LucideIcon }[] = [
    { name: "Feed", Icon: LayoutGrid },
    { name: "Reels", Icon: Clapperboard },
    { name: "Stories", Icon: CircleDashed },
    { name: "Anúncios", Icon: Megaphone },
  ];
  const [hover, setHover] = React.useState(-1);
  const [auto, setAuto] = React.useState(0);
  React.useEffect(() => {
    if (reduced || hover >= 0) return;
    const t = setInterval(() => setAuto((a) => (a + 1) % 4), 1700);
    return () => clearInterval(t);
  }, [reduced, hover]);
  const on = hover >= 0 ? hover : reduced ? -1 : auto;
  const tiles = [
    { x: 62, y: 34 },
    { x: 62, y: 116 },
    { x: 238, y: 34 },
    { x: 238, y: 116 },
  ];
  const path = (i: number) => {
    const t = tiles[i];
    const dir = t.x < 150 ? -1 : 1;
    return `M${150 + dir * 20},75 H${150 + dir * 46} V${t.y} H${t.x - dir * 16}`;
  };
  return (
    <div className="db-frame db-hover">
      <Brackets />
      <div className="db-card">
        <svg className="db-diagram" viewBox="0 0 300 150" role="group" aria-label="Formatos: feed, Reels, stories e anúncios">
          {tiles.map((_, i) => (
            <path key={i} d={path(i)} className={`db-flow${on === i ? " db-flow-on" : ""}`} />
          ))}
          {!reduced && on >= 0 && (
            <circle key={on} r="2.4" className="db-pkt">
              <animateMotion dur="1.1s" repeatCount="indefinite" path={path(on)} />
            </circle>
          )}
          <MiniSd x={135} y={55} w={30} />
          {tiles.map((t, i) => {
            const { Icon, name } = tools[i];
            return (
              <g
                key={name}
                className={`db-tool${on === i ? " db-tool-on" : ""}`}
                tabIndex={0}
                role="img"
                aria-label={name}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(-1)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(-1)}
              >
                <rect x={t.x - 16} y={t.y - 16} width="32" height="32" rx="8" className="db-node" />
                <g style={{ color: on === i ? "#ffffff" : "#b9bbd0" }}>
                  <SvgIcon Icon={Icon} cx={t.x} cy={t.y} size={14} />
                </g>
                <text
                  x={t.x}
                  y={t.y + (t.y < 75 ? -22 : 30)}
                  textAnchor="middle"
                  fontSize="8.5"
                  fill="#b9bbd0"
                  fontFamily="var(--font-creato), system-ui"
                  opacity={on === i ? 1 : 0}
                  style={{ transition: "opacity .25s" }}
                >
                  {name}
                </text>
              </g>
            );
          })}
          <text x="150" y="128" textAnchor="middle" fontSize="7" className="db-mono">
            {on >= 0 ? `adaptando · ${tools[on].name.toLowerCase()}` : "4 formatos"}
          </text>
        </svg>
        <div style={{ marginTop: "auto" }}>
          <h3>Um conteúdo, vários formatos</h3>
          <p>Cada peça é adaptada para feed, Reels, stories e anúncios.</p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- 3. calendário */

const WEEK = ["S", "T", "Q", "Q", "S", "S", "D"];
const WEEK_FULL = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];
type Kind = "reels" | "post" | "carrossel";
// Exemplo ilustrativo de distribuição de pautas (não é dado de cliente).
const PLAN: Record<number, Kind> = {
  0: "reels", 2: "post", 4: "carrossel",
  7: "post", 9: "reels", 11: "post",
  14: "reels", 16: "carrossel", 18: "post",
  21: "post", 23: "reels", 25: "carrossel",
};
const PLAN_ORDER = Object.keys(PLAN).map(Number);

function CalendarCard({ reduced, inView }: { reduced: boolean; inView: boolean }) {
  const [lit, setLit] = React.useState(reduced ? PLAN_ORDER.length : 0);
  const [hover, setHover] = React.useState(-1);
  React.useEffect(() => {
    if (reduced) {
      setLit(PLAN_ORDER.length);
      return;
    }
    if (!inView) return;
    const t = setInterval(
      () => setLit((v) => (v >= PLAN_ORDER.length + 4 ? 0 : v + 1)),
      520,
    );
    return () => clearInterval(t);
  }, [reduced, inView]);

  const cw = 34;
  const ch = 21;
  const ox = 31;
  const oy = 22;
  const litSet = new Set(PLAN_ORDER.slice(0, Math.min(lit, PLAN_ORDER.length)));
  const hk = hover >= 0 ? PLAN[hover] : undefined;

  return (
    <div className="db-frame db-hover">
      <Brackets />
      <div className="db-card">
        <svg className="db-diagram" viewBox="0 0 300 150" role="img" aria-label="Calendário de pautas do mês (ilustrativo)">
          {WEEK.map((d, i) => (
            <text key={i} x={ox + i * (cw + 2) + cw / 2} y="14" textAnchor="middle" fontSize="7" className="db-mono">
              {d}
            </text>
          ))}
          {Array.from({ length: 28 }, (_, i) => {
            const col = i % 7;
            const row = Math.floor(i / 7);
            const kind = PLAN[i];
            const on = kind && litSet.has(i);
            return (
              <g
                key={i}
                onMouseEnter={() => kind && setHover(i)}
                onMouseLeave={() => setHover(-1)}
                className={kind ? "db-day db-day-plan" : "db-day"}
              >
                <rect
                  x={ox + col * (cw + 2)}
                  y={oy + row * (ch + 3)}
                  width={cw}
                  height={ch}
                  rx="4"
                  className={on ? `db-cell db-cell-${kind}` : "db-cell"}
                />
                <text x={ox + col * (cw + 2) + 4} y={oy + row * (ch + 3) + 8} fontSize="5.5" className="db-mono">
                  {i + 1}
                </text>
              </g>
            );
          })}
          {hover >= 0 && hk && (
            <g transform={`translate(${Math.min(250, Math.max(50, ox + (hover % 7) * (cw + 2) + cw / 2))},${oy + Math.floor(hover / 7) * (ch + 3) - 4})`}>
              <rect x="-30" y="-12" width="60" height="14" rx="3" fill="#f4f4f8" />
              <text x="0" y="-2" textAnchor="middle" fontSize="7.5" fill="#07080c" fontFamily="var(--font-creato), system-ui">
                {WEEK_FULL[hover % 7]} · {hk}
              </text>
            </g>
          )}
          {(["reels", "post", "carrossel"] as Kind[]).map((k, i) => (
            <g key={k} transform={`translate(${ox + i * 64},${oy + 4 * (ch + 3) + 12})`}>
              <rect width="8" height="8" rx="2" className={`db-cell-${k}`} />
              <text x="12" y="7" fontSize="7" className="db-mono">
                {k}
              </text>
            </g>
          ))}
        </svg>
        <div style={{ marginTop: "auto" }}>
          <h3>Pautas planejadas</h3>
          <p>
            A comunicação organizada em um calendário pensado para os objetivos
            de cada cliente.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- component */

export default function DafaWorkflowBento({
  className = "",
}: {
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView(0.12);

  return (
    <div className={`db-root ${className}`}>
      <style>{DB_CSS}</style>
      <div className="db-reveal" ref={ref} data-in={inView}>
        <div className="db-bento">
          <FlowCard reduced={reduced} inView={inView} />
          <FormatsCard reduced={reduced} />
          <CalendarCard reduced={reduced} inView={inView} />
        </div>
      </div>
    </div>
  );
}

const DB_CSS = `
.db-root{--db-paper:#0c0d14;--db-card:#101116;--db-raise:#151626;--db-ink:#f4f4f8;--db-muted:#b9bbd0;--db-faint:#5d5f78;--db-line:#23243a;--db-line-strong:#34365a;--db-accent:#3333ff;position:relative;width:100%;container-type:inline-size;color:var(--db-ink)}
.db-root :where(svg){display:block;max-width:none}
.db-reveal{opacity:0;transform:translateY(24px);transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)}
.db-reveal[data-in="true"]{opacity:1;transform:none}
.db-frame{position:relative}
.db-c{position:absolute;width:14px;height:14px;border-color:var(--db-line-strong);border-style:solid;border-width:0;pointer-events:none;transition:border-color .3s,transform .35s cubic-bezier(.2,.8,.2,1)}
.db-c-tl{top:-7px;left:-7px;border-top-width:1.5px;border-left-width:1.5px}
.db-c-tr{top:-7px;right:-7px;border-top-width:1.5px;border-right-width:1.5px}
.db-c-bl{bottom:-7px;left:-7px;border-bottom-width:1.5px;border-left-width:1.5px}
.db-c-br{bottom:-7px;right:-7px;border-bottom-width:1.5px;border-right-width:1.5px}
.db-hover:hover>.db-c{border-color:var(--db-accent)}
.db-hover:hover>.db-c-tl{transform:translate(-3px,-3px)}
.db-hover:hover>.db-c-tr{transform:translate(3px,-3px)}
.db-hover:hover>.db-c-bl{transform:translate(-3px,3px)}
.db-hover:hover>.db-c-br{transform:translate(3px,3px)}
.db-bento{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(22px,3cqw,34px)}
@container (min-width:720px){.db-bento{grid-template-columns:repeat(2,minmax(0,1fr))}.db-wide{grid-column:1 / -1}}
.db-bento>.db-frame{display:flex;flex-direction:column}
.db-bento>.db-frame>.db-card{flex:1}
.db-card{background:linear-gradient(180deg,var(--db-raise),var(--db-card));background-image:linear-gradient(180deg,rgba(21,22,38,.92),rgba(16,17,22,.96)),repeating-linear-gradient(135deg,rgba(255,255,255,.035) 0 1px,transparent 1px 10px);border:1px solid var(--db-line);border-radius:18px;padding:clamp(16px,2.4cqw,24px);display:flex;flex-direction:column;gap:16px;transition:border-color .3s,box-shadow .35s}
.db-card:hover{border-color:var(--db-line-strong);box-shadow:0 20px 60px -24px rgba(51,51,255,.55)}
.db-card h3{font-size:15px;font-weight:600;letter-spacing:-.01em}
.db-card p{font-size:13.5px;line-height:1.55;color:var(--db-muted);max-width:44ch;margin-top:4px}
.db-diagram{width:100%;height:auto;overflow:visible}
.db-wide-copy{display:grid;grid-template-columns:1fr;gap:16px;padding:0 24px 22px}
@container (min-width:560px){.db-wide-copy{grid-template-columns:1fr 1fr}}
.db-flow{stroke:var(--db-line-strong);fill:none;stroke-width:1.3;transition:stroke .3s}
.db-flow-on{stroke:#8f92ff}
.db-dash{stroke-dasharray:3 4;animation:db-dash 1.2s linear infinite}
.db-tie{stroke:var(--db-line-strong);stroke-dasharray:2 3}
.db-pkt{fill:#9a9cff;filter:drop-shadow(0 0 4px #3333ff) drop-shadow(0 0 8px #3333ff)}
.db-node{fill:var(--db-raise);stroke:var(--db-line-strong);transition:stroke .3s}
.db-sd{fill:#0a0a24;stroke:#5b5bff;stroke-width:3}
.db-pin{fill:#d9b45a;animation:db-pin 2.4s ease-in-out infinite}
.db-ring{stroke:var(--db-line-strong)}
.db-av{cursor:pointer;transition:transform .35s cubic-bezier(.2,.8,.2,1);transform-box:fill-box;transform-origin:center}
.db-av:hover,.db-av:focus-visible{transform:scale(1.15)}
.db-av:hover .db-node,.db-av:focus-visible .db-node{stroke:#8f92ff}
.db-tip{opacity:0;transition:opacity .2s;pointer-events:none}
.db-av:hover .db-tip,.db-av:focus .db-tip{opacity:1}
.db-paper{fill:#1a1b2e;stroke:var(--db-line-strong)}
.db-art{fill:#2121c9}
.db-ink{fill:var(--db-ink);opacity:.8}
.db-soft{fill:var(--db-line-strong)}
.db-chip{fill:#3333ff}
.db-dot-on{fill:#9a9cff}
.db-mono{fill:var(--db-faint);font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace}
.db-sheet{transition:transform .7s cubic-bezier(.2,.8,.2,1),opacity .7s}
.db-sheet-new{animation:db-sheet-in .7s cubic-bezier(.2,.8,.2,1) both}
.db-tool{cursor:pointer;transition:transform .3s cubic-bezier(.2,.8,.2,1);transform-box:fill-box;transform-origin:center}
.db-tool:hover,.db-tool-on{transform:translateY(-2px)}
.db-tool-on rect.db-node{stroke:#8f92ff;fill:#1c1d52}
.db-cell{fill:rgba(255,255,255,.035);stroke:var(--db-line);transition:fill .45s,stroke .45s}
.db-day-plan{cursor:pointer}
.db-cell-reels{fill:#3333ff;stroke:#5b5bff}
.db-cell-post{fill:#8f92ff;stroke:#a9abff}
.db-cell-carrossel{fill:#1d1d6e;stroke:#5b5bff}
.db-glow{animation:db-pulse 2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes db-dash{to{stroke-dashoffset:-14}}
@keyframes db-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.08)}}
@keyframes db-pin{0%,100%{fill:#d9b45a}50%{fill:#8f92ff}}
@keyframes db-sheet-in{from{opacity:0;transform:translate(16px,-12px) rotate(5deg)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
.db-reveal{opacity:1;transform:none;transition:none}
.db-dash,.db-glow,.db-sheet-new,.db-pin{animation:none}
}
`;
