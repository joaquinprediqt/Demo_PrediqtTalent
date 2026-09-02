"use client";

import { useState } from "react";
import {
  PanelAuditoria,
  PanelCargaMasiva,
  PanelCatalogo,
  PanelUsuarios,
} from "@/components/admin/AdminPanels";
import { PESTANAS_ADMIN } from "@/lib/data/administracion";
import { useSesion } from "@/lib/session/SesionProvider";
import { cn } from "@/lib/utils/cn";

type Pestana = (typeof PESTANAS_ADMIN)[number];

/** Pantalla 5.6 — Consola de administración. */
export default function AdministracionPage() {
  const { usuario } = useSesion();
  const [pestana, setPestana] = useState<Pestana>("Usuarios y roles");

  if (!usuario) return null;

  if (usuario.rol !== "administrador") {
    return (
      <div className="mx-auto w-full max-w-screenframe px-5 py-8 lg:px-8">
        <div className="rounded-card border border-line bg-surface px-6 py-8">
          <h1 className="text-title-lg text-ink">Acceso restringido</h1>
          <p className="mt-2 text-body text-muted">
            La consola de administración solo está disponible para el rol Administrador. Tu sesión
            actual es {usuario.rol}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-screenframe flex-col gap-[18px] px-5 py-6 lg:px-7">
      <nav className="flex gap-6 overflow-x-auto border-b border-line pb-px" aria-label="Secciones">
        {PESTANAS_ADMIN.map((opcion) => {
          const activa = opcion === pestana;
          return (
            <button
              key={opcion}
              type="button"
              onClick={() => setPestana(opcion)}
              aria-current={activa ? "page" : undefined}
              className={cn(
                "whitespace-nowrap border-b-2 pb-2.5 text-[15px] transition-colors",
                activa
                  ? "border-accent font-semibold text-ink"
                  : "border-transparent font-medium text-muted hover:text-ink",
              )}
            >
              {opcion}
            </button>
          );
        })}
      </nav>

      {pestana === "Usuarios y roles" && (
        <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[1fr_396px]">
          <div className="flex flex-col gap-[18px]">
            <PanelUsuarios />
            <PanelAuditoria />
          </div>
          <div className="flex flex-col gap-[18px]">
            <PanelCatalogo />
            <PanelCargaMasiva />
          </div>
        </div>
      )}

      {pestana === "Catálogo de habilidades" && (
        <div className="max-w-[720px]">
          <PanelCatalogo />
        </div>
      )}

      {pestana === "Carga masiva" && (
        <div className="max-w-[720px]">
          <PanelCargaMasiva />
        </div>
      )}

      {pestana === "Auditoría de accesos" && <PanelAuditoria />}
    </div>
  );
}
