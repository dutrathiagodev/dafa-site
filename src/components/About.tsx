import { Camera } from "lucide-react";
import { contact } from "@/content/site";

export default function About() {
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="relative mx-auto max-w-[1320px] px-4 py-24 sm:px-8 sm:py-32"
    >
      <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <p data-reveal className="text-xs tracking-[0.3em] text-muted uppercase">
            03 / Quem somos
          </p>
          <h2
            id="sobre-title"
            data-reveal
            className="mt-4 text-[clamp(2.2rem,5vw,4.25rem)] leading-[0.95] font-bold tracking-[-0.04em]"
          >
            A DAFA é{" "}
            <span className="font-display text-[#9a9cff] italic">
              Daniel e Fabi.
            </span>
          </h2>
          <div data-reveal className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
            <p>
              Somos uma empresa de gerenciamento de conteúdo de{" "}
              {contact.city} – {contact.state}. Trabalhamos com produção
              audiovisual, fotografia, criação e gerenciamento de conteúdo e
              tráfego pago, unindo criatividade e estratégia na comunicação das
              empresas.
            </p>
            <p>
              Nosso objetivo é ajudar cada negócio a mostrar seu valor com
              conteúdos bem planejados e bem executados. Os dois “A” do nosso
              símbolo representam essa parceria.
            </p>
          </div>
        </div>

        <article
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-white/[.08] bg-gradient-to-b from-white/[.05] to-transparent p-6 sm:p-8"
          aria-labelledby="daniel-title"
        >
          {/* TODO(DAFA): trocar pelo retrato profissional do Daniel. */}
          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-navy/60 text-center text-sm text-muted">
            <Camera className="size-7 text-[#9a9cff]" strokeWidth={1.5} />
            Foto do Daniel
            <span className="text-xs text-muted/60">(pendente)</span>
          </div>
          <h3 id="daniel-title" className="mt-6 text-2xl font-semibold">
            Daniel
          </h3>
          <p className="text-sm text-[#9a9cff]">Sócio da DAFA</p>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted">
            <p>
              Daniel atua com produção audiovisual, criação e gerenciamento de
              conteúdo e tráfego pago. Seu trabalho une olhar criativo e
              estratégia para transformar ideias em vídeos, imagens e conteúdos
              que comuniquem a identidade e o valor de cada negócio.
            </p>
            <p>
              Com atuação em Santo Antônio da Platina e região, desenvolve
              projetos para empresas de diferentes segmentos, cuidando tanto da
              qualidade visual quanto da mensagem que cada conteúdo precisa
              transmitir.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
