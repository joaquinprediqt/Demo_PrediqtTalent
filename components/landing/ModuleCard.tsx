import type { ReactNode } from "react";

interface ModuleCardProps {
  icono: ReactNode;
  /** "accent" para Learning, "steel" para Talent, segun el canvas. */
  tono: "accent" | "steel";
  titulo: string;
  descripcion: string;
}

export function ModuleCard({ icono, tono, titulo, descripcion }: ModuleCardProps) {
  const fondoIcono = tono === "accent" ? "bg-accent-soft text-accent" : "bg-steel-soft text-steel";

  return (
    <article className="flex gap-[14px] rounded-card border border-line bg-surface px-[22px] py-[20px]">
      <span className={`grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[9px] ${fondoIcono}`}>
        {icono}
      </span>
      <div>
        <h3 className="text-[18px] font-bold text-ink">{titulo}</h3>
        <p className="mt-1 text-body-md text-muted">{descripcion}</p>
      </div>
    </article>
  );
}
