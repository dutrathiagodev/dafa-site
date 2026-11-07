import { ArrowUpRight, Mail, Plus } from "lucide-react";
import LightArcs from "./LightArcs";
import { InstagramIcon, WhatsAppIcon } from "./brand-icons";
import {
  brand,
  contact,
  emailUrl,
  faq,
  instagramUrl,
  whatsappUrl,
} from "@/content/site";

import EditFrame from "./ui/edit-frame";
export default function Contact() {
  const channels = [
    {
      label: "WhatsApp",
      value: contact.whatsappDisplay,
      href: whatsappUrl,
      Icon: WhatsAppIcon,
      external: true,
    },
    {
      label: "E-mail",
      value: contact.email,
      href: emailUrl,
      Icon: Mail,
      external: false,
    },
    {
      label: "Instagram",
      value: `@${contact.instagram}`,
      href: instagramUrl,
      Icon: InstagramIcon,
      external: true,
    },
  ];

  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="relative px-4 pt-12 pb-24 sm:px-8"
    >
      <div className="grain relative isolate mx-auto max-w-[1320px] overflow-hidden rounded-[32px] border border-white/10 px-5 py-20 text-center sm:px-12 sm:py-28">
        <LightArcs />
        <p data-reveal className="relative text-xs tracking-[0.3em] text-muted uppercase">
          05 / Contato
        </p>
        <EditFrame label="Texto · Título" center>
          <h2
            id="contato-title"
            className="relative mx-auto mt-5 max-w-4xl text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.045em]"
          >
            Vamos dar{" "}
            <span className="text-gradient font-display italic">direção</span>{" "}
            ao seu conteúdo?
          </h2>
        </EditFrame>
        <p data-reveal className="relative mx-auto mt-6 max-w-xl text-lg text-muted">
          {brand.pitch}
        </p>
        <div data-reveal className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-3 rounded-full bg-electric px-8 text-base font-semibold shadow-[0_10px_50px_-10px_#3333ff] transition hover:bg-[#4a4aff]"
          >
            <WhatsAppIcon className="size-5" />
            Solicite um orçamento
          </a>
          <a
            href={emailUrl}
            className="inline-flex h-14 items-center gap-2 rounded-full border border-white/20 px-7 font-medium transition hover:border-white/50 hover:bg-white/5"
          >
            <Mail className="size-4" />
            Enviar e-mail
          </a>
        </div>

        <ul className="relative mx-auto mt-14 grid max-w-4xl gap-3 text-left sm:grid-cols-3">
          {channels.map(({ label, value, href, Icon, external }) => (
            <li key={label} data-reveal>
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="glass group flex items-center gap-3 rounded-2xl p-4 transition hover:border-electric/60"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-electric/20 text-[#b8baff]">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-muted">{label}</span>
                  <span className="block truncate text-sm font-medium">
                    {value}
                  </span>
                </span>
                <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted transition group-hover:text-ink" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-24 max-w-3xl" aria-labelledby="faq-title">
        <h2
          id="faq-title"
          data-reveal
          className="text-center text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-tight"
        >
          Perguntas frequentes
        </h2>
        <div className="mt-10 divide-y divide-white/[.08] border-y border-white/[.08]">
          {faq.map((f) => (
            <details key={f.q} data-reveal className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="size-5 shrink-0 text-[#9a9cff] transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="pb-6 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
