"use client";

import { useState, useTransition } from "react";
import { MatchCard } from "@/components/asistente/MatchCard";
import { Button } from "@/components/ui/Button";
import { IconSend, IconSparkle } from "@/components/ui/icons";
import { REQUERIMIENTO_EJEMPLO, SUGERENCIAS } from "@/lib/data/candidatos";
import type { ResultadoAsistente } from "@/lib/asistente/motor";
import { accionConsultarAsistente } from "./acciones";
import { Chip } from "@/components/ui/Chip";
import { TablaComparacion } from "@/components/asistente/TablaComparacion";

interface Props {
  usuario: { rol: string; correo: string; etiquetaRol: string };
  inicial: ResultadoAsistente;
}

export function Asistente({ usuario, inicial }: Props) {
  const [borrador, setBorrador] = useState(REQUERIMIENTO_EJEMPLO);
  const [resultado, setResultado] = useState<ResultadoAsistente>(inicial);
  const [comparados, setComparados] = useState<number[]>([]);
  const [pendiente, iniciar] = useTransition();

  function alternarComparacion(id: number) {
    setComparados((previos) =>
      previos.includes(id) ? previos.filter((x) => x !== id) : [...previos, id],
    );
  }

  function consultar(texto: string) {
    iniciar(async () => {
      setResultado(await accionConsultarAsistente(texto));
      setComparados([]);
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-screenframe flex-col gap-3.5 px-4 py-6 sm:px-5 lg:px-9">
      <div>
        <h1 className="text-[1.625rem] font-bold tracking-[-0.8px] text-ink sm:text-display-md">
          Asistente de selección
        </h1>
        <p className="mt-0.5 text-[15.5px] text-muted">
          Describe el puesto y sus requisitos: el asistente revisa las habilidades declaradas y la
          disponibilidad para proponer candidatos internos.
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
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) consultar(borrador);
          }}
          placeholder="Ej. Necesito un ingeniero de datos con GCP y BigQuery para un proyecto de 3 meses"
          className="w-full resize-y rounded-[10px] border border-line-input bg-transparent px-4 py-3 text-[15px] leading-[1.5] text-ink outline-none placeholder:text-faint focus:border-accent focus:shadow-focus"
        />

        <div className="mt-3 flex flex-col items-stretch justify-between gap-3 xl:flex-row xl:items-center">
          <div className="flex flex-wrap gap-2">
            {SUGERENCIAS.map((sugerencia) => (
              <button
                key={sugerencia}
                type="button"
                onClick={() => {
                  setBorrador(sugerencia);
                  consultar(sugerencia);
                }}
                className="max-w-full truncate rounded-full bg-chip px-[13px] py-[7px] text-left text-[13px] font-medium text-ink-2 transition-opacity hover:opacity-80 sm:max-w-[320px]"
              >
                {sugerencia}
              </button>
            ))}
          </div>

          <Button
            variante="accent"
            tamano="lg"
            disabled={pendiente}
            className="shrink-0 rounded-control"
            onClick={() => consultar(borrador)}
          >
            <IconSend size={15} />
            {pendiente ? "Buscando…" : "Buscar candidatos"}
          </Button>
        </div>
      </section>

      {resultado.consulta.length > 0 && (
        <>
          <section className="rounded-card border border-line bg-chip px-[18px] py-3">
            <p className="text-[10.5px] font-semibold tracking-[0.16em] text-muted">
              REQUERIMIENTO
            </p>
            <p className="mt-1 text-[15.5px] font-medium text-ink">{resultado.consulta}</p>
            {resultado.pedidas.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[12px] text-faint">Habilidades reconocidas</span>
                {resultado.pedidas.map((h) => (
                  <Chip key={h} tono="accent">
                    {h}
                  </Chip>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-card border border-line bg-surface px-5 py-[15px]">
            <div className="flex items-center gap-2">
              <IconSparkle size={15} className="text-accent" />
              <span className="text-[10.5px] font-semibold tracking-[0.16em] text-accent">
                SÍNTESIS DEL ASISTENTE
              </span>
            </div>
            <p className="mt-2 text-[14.5px] leading-[1.55] text-ink-2">{resultado.sintesis}</p>
          </section>

          {resultado.coincidencias.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {resultado.coincidencias.map((coincidencia) => (
                <MatchCard
                  key={coincidencia.id}
                  coincidencia={coincidencia}
                  seleccionado={comparados.includes(coincidencia.id)}
                  onComparar={alternarComparacion}
                />
              ))}
            </div>
          )}

          <TablaComparacion
            seleccionados={resultado.coincidencias.filter((c) => comparados.includes(c.id))}
            pedidas={resultado.pedidas}
            onLimpiar={() => setComparados([])}
          />
        </>
      )}

      <p className="text-[12.5px] text-faint">
        La consulta y los perfiles revisados quedan registrados en la auditoría de accesos (rol{" "}
        {usuario.etiquetaRol} · {usuario.correo}).
      </p>
    </div>
  );
}
