"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const TODAS = "todas";

interface Props {
  sedes: readonly string[];
  areas: readonly string[];
}

/**
 * Los filtros viven en la URL, así que el servidor recalcula las métricas
 * y el enlace se puede compartir con el filtro puesto.
 */
export function FiltrosTablero({ sedes, areas }: Props) {
  const router = useRouter();
  const parametros = useSearchParams();
  const [pendiente, iniciar] = useTransition();

  const sede = parametros.get("sede") ?? TODAS;
  const area = parametros.get("area") ?? TODAS;
  const activos = (sede !== TODAS ? 1 : 0) + (area !== TODAS ? 1 : 0);

  function cambiar(clave: "sede" | "area", valor: string) {
    const siguientes = new URLSearchParams(parametros.toString());
    if (valor === TODAS) siguientes.delete(clave);
    else siguientes.set(clave, valor);

    const consulta = siguientes.toString();
    iniciar(() => router.push(consulta ? `/dashboard?${consulta}` : "/dashboard"));
  }

  const claseSelect =
    "cursor-pointer rounded-chip bg-white/[0.14] px-2.5 py-[5px] text-[12px] font-medium text-white outline-none [&>option]:text-ink";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label>
        <span className="sr-only">Filtrar por sede</span>
        <select
          value={sede}
          onChange={(e) => cambiar("sede", e.target.value)}
          className={claseSelect}
        >
          <option value={TODAS}>Sede: todas</option>
          {sedes.map((s) => (
            <option key={s} value={s}>
              Sede: {s}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">Filtrar por área</span>
        <select
          value={area}
          onChange={(e) => cambiar("area", e.target.value)}
          className={claseSelect}
        >
          <option value={TODAS}>Área: todas</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              Área: {a}
            </option>
          ))}
        </select>
      </label>

      <span className="rounded-chip bg-accent-light px-2.5 py-[5px] text-[12px] font-medium text-navy">
        {pendiente ? "Aplicando…" : `Selecciones: ${activos}`}
      </span>

      {activos > 0 && (
        <button
          type="button"
          onClick={() => iniciar(() => router.push("/dashboard"))}
          className="rounded-chip border border-white/30 px-2.5 py-[5px] text-[12px] font-medium text-white/80 transition-colors hover:text-white"
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
