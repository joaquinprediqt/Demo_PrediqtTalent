import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils/cn";
import type { Coincidencia } from "@/lib/data/candidatos";

interface Props {
  coincidencia: Coincidencia;
  seleccionado: boolean;
  onComparar: (id: number) => void;
}

/** Tarjeta de candidato con barra de afinidad (5.5). */
export function MatchCard({ coincidencia, seleccionado, onComparar }: Props) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-card border bg-surface px-5 py-[17px] transition-colors",
        seleccionado ? "border-accent shadow-focus" : "border-line",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[18px] font-semibold text-ink">{coincidencia.nombre}</h3>
        <span
          className={cn(
            "text-[18px] font-bold",
            coincidencia.tono === "accent" ? "text-accent" : "text-steel",
          )}
        >
          {coincidencia.afinidad}%
        </span>
      </div>

      <ProgressBar valor={coincidencia.afinidad} tono={coincidencia.tono} className="mt-2.5" />

      <p className="mt-3 text-[13.5px] leading-[1.5] text-muted">{coincidencia.justificacion}</p>

      <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
        {coincidencia.habilidades.map((habilidad) => (
          <Chip key={habilidad} tono="accent">
            {habilidad}
          </Chip>
        ))}
        {coincidencia.carencias.map((carencia) => (
          <Chip key={carencia} tono="outline">
            {carencia}
          </Chip>
        ))}
      </div>

      <div className="mt-3 flex gap-2 border-t border-line-soft pt-[11px]">
        <Link
          href={`/perfil?id=${coincidencia.id}`}
          className={cn(
            "flex-1 rounded-[8px] py-2 text-center text-[13px] font-semibold transition-colors",
            coincidencia.destacado
              ? "bg-navy text-white hover:bg-[#12564F]"
              : "border border-line-input text-ink hover:border-line-strong",
          )}
        >
          Ver perfil completo
        </Link>
        <button
          type="button"
          onClick={() => onComparar(coincidencia.id)}
          aria-pressed={seleccionado}
          className={cn(
            "rounded-[8px] border px-[13px] py-2 text-[13px] font-semibold transition-colors",
            seleccionado
              ? "border-accent bg-accent-soft text-accent-strong"
              : "border-line-input text-muted hover:text-ink",
          )}
        >
          {seleccionado ? "Quitar" : "Comparar"}
        </button>
      </div>
    </article>
  );
}
