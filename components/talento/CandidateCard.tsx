import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import type { Candidato } from "@/lib/db/consultas";

interface Props {
  candidato: Candidato;
  /** Habilidades buscadas que este perfil no tiene. */
  faltantes?: readonly string[];
}

/** Tarjeta de perfil de la rejilla de resultados (5.4). */
export function CandidateCard({ candidato, faltantes = [] }: Props) {
  return (
    <article className="flex flex-col rounded-card border border-line bg-surface px-5 py-[18px]">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-steel-soft text-[14px] font-semibold text-steel">
          {candidato.iniciales}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-semibold text-ink">{candidato.nombre}</h3>
          <p className="text-[13px] text-muted">
            {candidato.cargo} · {candidato.sede}
          </p>
        </div>
      </div>

      {candidato.resumen && (
        <p className="mt-3 text-[13.5px] leading-[1.5] text-muted">{candidato.resumen}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {candidato.habilidades.map((habilidad) => (
          <Chip key={habilidad} tono="accent" className="text-[12px]">
            {habilidad}
          </Chip>
        ))}
        {faltantes.map((carencia) => (
          <Chip key={carencia} tono="outline" className="text-[12px]">
            falta: {carencia}
          </Chip>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-line-soft pt-3">
        <span className="text-[12.5px] text-faint">
          Perfil {candidato.completitud}% completo · {candidato.disponibilidad}
        </span>
        <Link
          href={`/perfil?id=${candidato.id}`}
          className="text-[13px] font-semibold text-accent transition-opacity hover:opacity-80"
        >
          Ver perfil
        </Link>
      </div>
    </article>
  );
}
