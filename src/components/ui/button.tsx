import type { AnchorHTMLAttributes, ReactNode } from "react";
import { WhatsAppIcon } from "./brand-icons";
import { whatsappUrl } from "@/content/site";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold transition";
const variants: Record<Variant, string> = {
  primary:
    "bg-electric text-white shadow-[0_10px_50px_-10px_#3333ff] hover:bg-[#4a4aff] hover:shadow-[0_10px_60px_-6px_#3333ff]",
  ghost: "border border-white/15 text-ink font-medium hover:border-white/40 hover:bg-white/5",
};
const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  /** Abre em nova aba com rel seguro. */
  external?: boolean;
  icon?: ReactNode;
  iconAfter?: ReactNode;
};

/** Link com aparência de botão (CTA). */
export function ButtonLink({
  variant = "primary",
  size = "lg",
  external,
  icon,
  iconAfter,
  className = "",
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon}
      {children}
      {iconAfter}
    </a>
  );
}

/** CTA principal do site: abre o WhatsApp com a mensagem inicial. */
export function WhatsAppButton({
  children = "Solicite um orçamento",
  ...rest
}: Omit<ButtonLinkProps, "href" | "external" | "icon">) {
  return (
    <ButtonLink href={whatsappUrl} external icon={<WhatsAppIcon className="size-5" />} {...rest}>
      {children}
    </ButtonLink>
  );
}
