"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./brand-icons";
import { whatsappUrl } from "@/content/site";

/** Botão flutuante: aparece depois da primeira tela e some com o modal aberto. */
export default function WhatsAppFloat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale com a DAFA pelo WhatsApp"
      className={`fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_-6px_rgba(0,0,0,.6)] transition-[opacity,transform] duration-500 hover:scale-105 sm:right-6 sm:bottom-6 [html[data-modal]_&]:hidden ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
