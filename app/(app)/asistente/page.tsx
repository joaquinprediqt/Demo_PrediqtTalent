"use client";

import { useState } from "react";
import { MatchCard } from "@/components/asistente/MatchCard";
import { Button } from "@/components/ui/Button";
import { IconSend, IconSparkle } from "@/components/ui/icons";
import {
  COINCIDENCIAS,
  REQUERIMIENTO_EJEMPLO,
  SINTESIS_ASISTENTE,
  SUGERENCIAS,
} from "@/lib/data/candidatos";
import { useSesion } from "@/lib/session/SesionProvider";
import { ETIQUETA_ROL } from "@/lib/data/usuarios";

/** Pantalla 5.5 — Asistente de selección. */
export default function AsistentePage() {
  const { usuario } = useSesion();
  const [borrador, setBorrador] = useState(REQUERIMIENTO_EJEMPLO);
  const [consultado, setConsultado] = useState(REQUERIMIENTO_EJEMPLO);

  if (!usuario) return null;

  const hayResultado = consultado.trim().length > 0;

  return (
    <div className="mx-auto flex w-full max-w-screenframe flex-col gap-3.5 px-5 py-6 lg:px-9">
      <div>
        <h1 className="text-display-md text-ink">Asistente de selección</h1>
        <p className="mt-0.5 text-[15.5px] text-muted">
          Describe el puesto y sus requisitos: el asistente revisa CVs y capacidades para proponer
          candidatos internos.
        </p>
      </div>

      <section className="rounded-card border border-line bg-surface p-[18px]">
        <label htmlFor="requerimiento" className="sr-only">
          Requerimiento del puesto
        </label>
        <textarea
          id="requerimiento"
          rows={2}
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          placeholder="Ej. Necesito un ingeniero de datos con GCP y BigQuery para un proyecto de 3 meses"
          className="w-full resize-y rounded-[10px] border border-line-input bg-transparent px-4 py-3 text-[15px] leading-[1.5] text-ink outline-none placeholder:text-faint focus:border-accent focus:shadow-focus"
        />

        <div className="mt-3 flex flex-col items-stretch justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            {SUGERENCIAS.map((sugerencia) => (
              <button
                key={sugerencia}
                type="button"
                onClick={() => setBorrador(sugerencia)}
                className="max-w-[320px] truncate rounded-full bg-chip px-[13px] py-[7px] text-left text-[13px] font-medium text-ink-2 transition-opacity hover:opacity-80"
              >
                {sugerencia}
              </button>
            ))}
          </div>

          <Button
            variante="accent"
            tamano="lg"
            className="shrink-0 rounded-control"
            onClick={() => setConsultado(borrador)}
          >
            <IconSend size={15} />
            Buscar candidatos
          </Button>
        </div>
      </section>

      {hayResultado && (
        <>
          <section className="rounded-card border border-line bg-chip px-[18px] py-3">
            <p className="text-[10.5px] font-semibold tracking-[0.16em] text-muted">
              REQUERIMIENTO
            </p>
            <p className="mt-1 text-[15.5px] font-medium text-ink">{consultado}</p>
          </section>

          <section className="rounded-card border border-line bg-surface px-5 py-[15px]">
            <div className="flex items-center gap-2">
              <IconSparkle size={15} className="text-accent" />
              <span className="text-[10.5px] font-semibold tracking-[0.16em] text-accent">
                SÍNTESIS DEL ASISTENTE
              </span>
            </div>
            <p className="mt-2 text-[14.5px] leading-[1.55] text-ink-2">{SINTESIS_ASISTENTE}</p>
          </section>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {COINCIDENCIAS.map((coincidencia) => (
              <MatchCard key={coincidencia.id} coincidencia={coincidencia} />
            ))}
          </div>
        </>
      )}

      <p className="text-[12.5px] text-faint">
        La consulta y los perfiles revisados quedan registrados en la auditoría de accesos (rol{" "}
        {ETIQUETA_ROL[usuario.rol]} · {usuario.cuenta}).
      </p>
    </div>
  );
}
