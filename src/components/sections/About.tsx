import { contact, team } from "@/content/site";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { PersonCard } from "@/components/ui/person-card";

/** Quem somos: a empresa, a equipe (Daniel — CEO, Fabiano — Partner) e a bio do Daniel. */
export default function About() {
  const [ceo] = team;
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="relative mx-auto max-w-[1320px] px-4 py-24 sm:px-8 sm:py-32"
    >
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading
            id="sobre-title"
            eyebrow="03 / Quem somos"
            title={
              <>
                Quem faz <Accent>a DAFA.</Accent>
              </>
            }
          />
          <div data-reveal className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
            <p>
              Somos uma empresa de gerenciamento de conteúdo de {contact.city} – {contact.state}.
              Trabalhamos com produção audiovisual, fotografia, criação e gerenciamento de conteúdo
              e tráfego pago, unindo criatividade e estratégia na comunicação das empresas.
            </p>
            <p>
              A DAFA é conduzida por {team.map((m) => m.name).join(" e ")}. Os dois “A” do nosso
              símbolo representam essa parceria.
            </p>
          </div>

          {ceo.bio && (
            <div data-reveal className="mt-10 border-l-2 border-electric/60 pl-5">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#b8baff] uppercase">
                {ceo.name} · {ceo.role}
              </p>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">
                {ceo.bio.map((t) => (
                  <p key={t.slice(0, 24)}>{t}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid content-start gap-6 sm:grid-cols-2">
          {team.map((m, i) => (
            <div key={m.name} className={i === 1 ? "sm:mt-16" : ""}>
              <PersonCard member={m} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
