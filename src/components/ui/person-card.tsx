import Image from "next/image";
import { asset } from "@/lib/asset";
import type { TeamMember } from "@/content/site";

/** Cartão de pessoa da equipe: foto em retrato (4:5), nome e cargo. */
export function PersonCard({ member }: { member: TeamMember }) {
  return (
    <figure data-reveal className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-navy">
        {member.photo ? (
          <Image
            src={asset(member.photo)}
            alt={`${member.name}, ${member.role} da DAFA`}
            fill
            sizes="(max-width: 640px) 90vw, 320px"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid h-full w-full place-items-center bg-[radial-gradient(80%_80%_at_50%_100%,#1010ec_0%,#030326_60%)] font-display text-7xl font-bold text-white/85 italic"
          >
            {member.name[0]}
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-3">
        <span className="text-xl font-semibold">{member.name}</span>
        <span className="rounded-full border border-electric/40 bg-electric/10 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-[#b8baff] uppercase">
          {member.role}
        </span>
      </figcaption>
    </figure>
  );
}
