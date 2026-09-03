import { redirect } from "next/navigation";
import { BuscarTalento } from "@/components/talento/BuscarTalento";
import { sesionActual } from "@/lib/auth/sesion";
import {
  areasDisponibles,
  catalogoHabilidades,
  listarCandidatos,
  sedesDisponibles,
} from "@/lib/db/consultas";

/** Pantalla 5.4 — Búsqueda de talento interno. */
export default async function BuscarTalentoPage() {
  const sesion = await sesionActual();
  if (!sesion) redirect("/login");

  if (sesion.rol === "empleado") {
    return (
      <div className="mx-auto w-full max-w-screenframe px-4 py-8 sm:px-5 lg:px-8">
        <div className="rounded-card border border-line bg-surface px-6 py-8">
          <h1 className="text-title-lg text-ink">Acceso restringido</h1>
          <p className="mt-2 text-body text-muted">
            La búsqueda de talento está disponible para los roles Reclutador y Administrador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BuscarTalento
      candidatos={listarCandidatos()}
      sedes={sedesDisponibles()}
      areas={areasDisponibles()}
      habilidades={catalogoHabilidades().map((h) => h.nombre)}
    />
  );
}
