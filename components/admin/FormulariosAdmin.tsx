"use client";

import { useActionState, useState } from "react";
import type { ReactNode } from "react";
import { IconPlus } from "@/components/ui/icons";
import {
  accionAsignarRol,
  accionCrearHabilidad,
} from "@/app/(app)/administracion/acciones";
import { SIN_ESTADO_ADMIN } from "@/app/(app)/administracion/estado";
import { ETIQUETA_ROL } from "@/lib/data/usuarios";
import type { Rol } from "@/types";

const ROLES: readonly Rol[] = ["empleado", "reclutador", "administrador"];

const campo =
  "rounded-[8px] border border-line-input bg-transparent px-3 py-2 text-[13px] text-ink outline-none focus:border-accent";

/** Asignación de rol desde la tabla de usuarios (5.6). */
export function FormAsignarRol({
  usuarios,
}: {
  usuarios: readonly { id: number; nombre: string; rol: Rol }[];
}) {
  const [estado, enviar, pendiente] = useActionState(accionAsignarRol, SIN_ESTADO_ADMIN);

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center rounded-[8px] bg-navy px-[13px] py-2 text-[13px] font-semibold text-white">
        Asignar rol
      </summary>

      <form
        action={enviar}
        className="mt-2 flex flex-wrap items-end gap-2 rounded-[10px] border border-line-soft bg-surface-raised p-3"
      >
        <label className="flex min-w-[150px] flex-1 flex-col gap-1">
          <span className="text-[12px] font-medium text-muted">Cuenta</span>
          <select name="usuarioId" className={campo}>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre} · {ETIQUETA_ROL[u.rol]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[120px] flex-1 flex-col gap-1">
          <span className="text-[12px] font-medium text-muted">Nuevo rol</span>
          <select name="rol" className={campo}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ETIQUETA_ROL[r]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={pendiente}
          className="rounded-[8px] bg-accent px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
        >
          {pendiente ? "Guardando…" : "Aplicar"}
        </button>

        {estado.error && (
          <p className="w-full text-[12.5px] text-[#8A3B2F]">{estado.error}</p>
        )}
        {estado.ok && <p className="w-full text-[12.5px] text-accent-strong">{estado.ok}</p>}
      </form>
    </details>
  );
}

/** Alta de habilidades en el catálogo controlado (5.6). */
export function FormNuevaHabilidad() {
  const [estado, enviar, pendiente] = useActionState(accionCrearHabilidad, SIN_ESTADO_ADMIN);

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-1 text-[12.5px] font-semibold text-accent">
        <IconPlus size={13} />
        Nueva habilidad
      </summary>

      <form
        action={enviar}
        className="mt-2.5 rounded-[10px] border border-line-soft bg-surface-raised p-3"
      >
        <div className="flex flex-wrap gap-2">
          <label className="flex min-w-[120px] flex-1 flex-col gap-1">
            <span className="text-[12px] font-medium text-muted">Nombre</span>
            <input name="nombre" type="text" required placeholder="dbt" className={campo} />
          </label>
          <label className="flex min-w-[120px] flex-1 flex-col gap-1">
            <span className="text-[12px] font-medium text-muted">Categoría</span>
            <input
              name="categoria"
              type="text"
              placeholder="Transformación"
              className={campo}
            />
          </label>
        </div>

        <label className="mt-2.5 flex items-center gap-2 text-[12.5px] text-muted">
          <input type="checkbox" name="aprobada" className="h-4 w-4 accent-[#1F8A7A]" />
          Aprobada de inmediato (si no, queda pendiente de aprobar)
        </label>

        <button
          type="submit"
          disabled={pendiente}
          className="mt-2.5 rounded-[8px] bg-navy px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
        >
          {pendiente ? "Guardando…" : "Agregar al catálogo"}
        </button>

        {estado.error && <p className="mt-2 text-[12.5px] text-[#8A3B2F]">{estado.error}</p>}
        {estado.ok && <p className="mt-2 text-[12.5px] text-accent-strong">{estado.ok}</p>}
      </form>
    </details>
  );
}

/** Pestañas de la consola; recibe los paneles ya renderizados en servidor. */
export function AdminTabs({
  pestanas,
}: {
  pestanas: readonly { clave: string; contenido: ReactNode }[];
}) {
  const [activa, setActiva] = useState(pestanas[0]?.clave ?? "");

  return (
    <>
      <nav
        className="flex gap-4 overflow-x-auto border-b border-line pb-px sm:gap-6"
        aria-label="Secciones"
      >
        {pestanas.map((p) => {
          const esActiva = p.clave === activa;
          return (
            <button
              key={p.clave}
              type="button"
              onClick={() => setActiva(p.clave)}
              aria-current={esActiva ? "page" : undefined}
              className={`whitespace-nowrap border-b-2 pb-2.5 text-[14px] transition-colors sm:text-[15px] ${
                esActiva
                  ? "border-accent font-semibold text-ink"
                  : "border-transparent font-medium text-muted hover:text-ink"
              }`}
            >
              {p.clave}
            </button>
          );
        })}
      </nav>

      {pestanas.find((p) => p.clave === activa)?.contenido}
    </>
  );
}

