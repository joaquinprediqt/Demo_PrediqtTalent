import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils/cn";
import type { Coincidencia } from "@/lib/data/candidatos";

/** Tarjeta de candidato con barra de afinidad (5.5). */
export function MatchCard({ coincidencia }: { coincidencia: Coincidencia }) {
  return (
    <article className="flex flex-col rounded-card border border-line bg-surface px-5 py-[17px]">
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

      <ProgressBar
        valor={coincidencia.afinidad}
        tono={coincidencia.tono}
        className="mt-2.5"
      />

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
          href="/perfil"
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
          className="rounded-[8px] border border-line-input px-[13px] py-2 text-[13px] font-semibold text-muted transition-colors hover:text-ink"
        >
          Comparar
        </button>
      </div>
    </article>
  );
}
