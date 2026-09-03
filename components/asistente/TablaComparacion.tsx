"use client";

import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Coincidencia } from "@/lib/data/candidatos";

interface Props {
  seleccionados: readonly Coincidencia[];
  /** Habilidades reconocidas en el requerimiento, para marcar quién las cubre. */
  pedidas: readonly string[];
  onLimpiar: () => void;
}

/** Comparación lado a lado de los candidatos marcados (5.5). */
export function TablaComparacion({ seleccionados, pedidas, onLimpiar }: Props) {
  if (seleccionados.length === 0) return null;

  return (
    <section className="rounded-card border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-5 py-3.5">
        <div>
          <h2 className="text-[15px] font-bold text-ink">
            Comparación de {seleccionados.length}{" "}
            {seleccionados.length === 1 ? "candidato" : "candidatos"}
          </h2>
          <p className="text-[12.5px] text-faint">
            Marca o desmarca con el botón Comparar de cada tarjeta.
          </p>
        </div>
        <button
          type="button"
          onClick={onLimpiar}
          className="rounded-[8px] border border-line-input px-3 py-1.5 text-[12.5px] font-semibold text-muted transition-colors hover:text-ink"
        >
          Limpiar comparación
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr>
              <th className="w-[180px] px-5 py-3 text-label text-muted">CRITERIO</th>
              {seleccionados.map((c) => (
                <th key={c.id} className="px-5 py-3 text-[14px] font-semibold text-ink">
                  {c.nombre}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line-soft">
              <th className="px-5 py-3 text-[13px] font-medium text-muted">Afinidad</th>
              {seleccionados.map((c) => (
                <td key={c.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <ProgressBar valor={c.afinidad} tono={c.tono} className="max-w-[120px]" />
                    <span className="text-[13px] font-bold text-ink">{c.afinidad}%</span>
                  </div>
                </td>
              ))}
            </tr>

            {pedidas.map((habilidad) => (
              <tr key={habilidad} className="border-t border-line-soft">
                <th className="px-5 py-3 text-[13px] font-medium text-muted">{habilidad}</th>
                {seleccionados.map((c) => (
                  <td key={c.id} className="px-5 py-3">
                    {c.habilidades.includes(habilidad) ? (
                      <Chip tono="accent">Sí</Chip>
                    ) : (
                      <Chip tono="outline">No declarada</Chip>
                    )}
                  </td>
                ))}
              </tr>
            ))}

            <tr className="border-t border-line-soft">
              <th className="px-5 py-3 align-top text-[13px] font-medium text-muted">
                Resto de habilidades
              </th>
              {seleccionados.map((c) => (
                <td key={c.id} className="px-5 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {c.habilidades
                      .filter((h) => !pedidas.includes(h))
                      .map((h) => (
                        <Chip key={h} tono="outline">
                          {h}
                        </Chip>
                      ))}
                  </div>
                </td>
              ))}
            </tr>

            <tr className="border-t border-line-soft">
              <th className="px-5 py-3 text-[13px] font-medium text-muted">Perfil</th>
              {seleccionados.map((c) => (
                <td key={c.id} className="px-5 py-3">
                  <Link
                    href={`/perfil?id=${c.id}`}
                    className="text-[13px] font-semibold text-accent hover:opacity-80"
                  >
                    Ver perfil completo
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
