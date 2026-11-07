import DafaWorkflowBento from "./ui/dafa-workflow-bento";

export default function Workflow() {
  return (
    <section
      aria-labelledby="como-funciona-title"
      className="relative mx-auto max-w-[1180px] px-4 py-24 sm:px-8 sm:py-32"
    >
      <div className="mb-14 text-center">
        <span
          data-reveal
          className="inline-block rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs tracking-wide text-muted"
        >
          Como funciona
        </span>
        <h2
          id="como-funciona-title"
          data-reveal
          className="mt-5 text-[clamp(2rem,4.8vw,3.5rem)] leading-[1.02] font-bold tracking-[-0.035em]"
        >
          Ideias organizadas,
          <br />
          <span className="text-muted/60">conteúdo no ar.</span>
        </h2>
      </div>
      <DafaWorkflowBento />
    </section>
  );
}
