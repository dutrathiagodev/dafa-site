import { asset } from "@/lib/asset";
import Image from "next/image";
import {
  brand,
  contact,
  emailUrl,
  instagramUrl,
  whatsappUrl,
} from "@/content/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/[.06] px-4 pt-14 pb-28 sm:px-8 sm:pb-14">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Image
            src={asset("/media/img/logo-dafa-crop.png")}
            alt="DAFA — Gerenciamento de Conteúdo"
            width={1391}
            height={341}
            className="h-10 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm text-muted">
            {brand.tagline} · {contact.city} – {contact.state} e região.
          </p>
        </div>
        <nav aria-label="Contatos" className="flex flex-col gap-2 text-sm text-muted sm:flex-row sm:gap-8">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            WhatsApp {contact.whatsappDisplay}
          </a>
          <a href={emailUrl} className="hover:text-ink">
            {contact.email}
          </a>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
            @{contact.instagram}
          </a>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-[1320px] text-xs text-muted/60">
        © {new Date().getFullYear()} DAFA — Gerenciamento de Conteúdo.
      </p>
    </footer>
  );
}
