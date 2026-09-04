"use client";

import { useEffect, useState, useTransition } from "react";
import { desdeSqlite, hace } from "@/lib/utils/tiempo";
import { accionSincronizar } from "@/app/(app)/dashboard/acciones";
import { Spinner } from "@/components/ui/Spinner";

interface Props {
  /** Marca de tiempo tal como la guarda SQLite, en UTC. */
  hechaEn: string;
  origen: string;
}

/** Estado del tablero embebido, con el "hace X" recalculado cada 30 s. */
export function EstadoSincronizacion({ hechaEn, origen }: Props) {
  const [etiqueta, setEtiqueta] = useState(() => hace(desdeSqlite(hechaEn)));
  const [pendiente, iniciar] = useTransition();

  useEffect(() => {
    setEtiqueta(hace(desdeSqlite(hechaEn)));
    const temporizador = setInterval(() => {
      setEtiqueta(hace(desdeSqlite(hechaEn)));
    }, 30_000);
    return () => clearInterval(temporizador);
  }, [hechaEn]);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-control border border-line bg-surface px-3.5 py-2.5 text-[13.5px] font-medium text-ink-2">
      <span className="h-2 w-2 shrink-0 animate-latido rounded-full bg-accent" aria-hidden="true" />
      <span>
        Tablero interno · {origen} · sincronizado {etiqueta}
      </span>
      <button
        type="button"
        disabled={pendiente}
        onClick={() => iniciar(async () => { await accionSincronizar(); })}
        className="inline-flex items-center gap-1.5 rounded-[6px] border border-line-input px-2 py-1 text-[12px] font-semibold text-steel transition-[color,border-color,transform] duration-150 hover:border-accent hover:text-accent active:scale-[.98] disabled:opacity-60"
      >
        {pendiente ? (<><Spinner size={11} /> Sincronizando…</>) : "Sincronizar ahora"}
      </button>
    </div>
  );
}
