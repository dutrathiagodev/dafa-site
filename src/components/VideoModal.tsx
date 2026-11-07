"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

type ModalMedia =
  | {
      kind: "video";
      src: string;
      poster?: string;
      title: string;
      format: "vertical" | "horizontal";
    }
  | {
      kind: "image";
      src: string;
      title: string;
      format: "vertical" | "horizontal";
    };

const Ctx = createContext<(m: ModalMedia) => void>(() => {});
export const useMediaModal = () => useContext(Ctx);

export function MediaModalProvider({ children }: { children: ReactNode }) {
  const [media, setMedia] = useState<ModalMedia | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((m: ModalMedia) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setMedia(m);
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d || !media) return;
    if (!d.open) d.showModal();
    window.dispatchEvent(new Event("dafa:lock-scroll"));
    document.documentElement.dataset.modal = "open";
  }, [media]);

  const onClose = () => {
    window.dispatchEvent(new Event("dafa:unlock-scroll"));
    delete document.documentElement.dataset.modal;
    setMedia(null);
    lastFocus.current?.focus();
  };

  const vertical = media?.format === "vertical";

  return (
    <Ctx.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        onClose={onClose}
        onClick={(e) => e.target === e.currentTarget && close()}
        aria-label={media?.title}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-md"
      >
        {media && (
          <div
            className="pointer-events-none flex h-full w-full items-center justify-center p-4 sm:p-8"
            data-lenis-prevent
          >
            <figure
              className={`pointer-events-auto relative flex max-h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_80px_-20px_rgba(51,51,255,.6)] ${
                vertical
                  ? "aspect-[9/16] h-[min(86dvh,calc((100vw-2rem)*16/9))]"
                  : "aspect-video w-[min(1100px,100%)]"
              }`}
            >
              {media.kind === "video" ? (
                <video
                  key={media.src}
                  src={media.src}
                  poster={media.poster}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full bg-black object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={media.src}
                  alt={media.title}
                  className="h-full w-full object-contain"
                />
              )}
              <figcaption className="sr-only">{media.title}</figcaption>
            </figure>
            <button
              type="button"
              onClick={close}
              className="pointer-events-auto absolute top-4 right-4 grid size-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              aria-label="Fechar"
            >
              <X className="size-5" />
            </button>
          </div>
        )}
      </dialog>
    </Ctx.Provider>
  );
}
