"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { whatsappUrl } from "@/content/site";

const links = [
  { href: "#projetos", label: "Projetos" },
  { href: "#processo", label: "Processo" },
  { href: "#servicos", label: "Serviços" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? "border-b border-white/[.06] bg-bg/70 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-4 sm:px-8">
        <a href="#inicio" aria-label="DAFA — início" className="shrink-0">
          <Image
            src="/media/img/logo-dafa-crop.png"
            alt="DAFA — Gerenciamento de Conteúdo"
            width={1391}
            height={341}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-8 text-sm text-muted lg:flex"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.04] px-4 py-2.5 text-sm font-medium transition hover:border-electric hover:bg-electric"
        >
          Fale com a DAFA
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </header>
  );
}
