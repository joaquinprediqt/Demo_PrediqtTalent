import { redirect } from "next/navigation";
import { Asistente } from "./Asistente";
import { sesionActual } from "@/lib/auth/sesion";
import { buscarCandidatos } from "@/lib/asistente/motor";
import { REQUERIMIENTO_EJEMPLO } from "@/lib/data/candidatos";
import { ETIQUETA_ROL } from "@/lib/data/usuarios";
import {
  areasDisponibles,
  catalogoHabilidades,
  listarCandidatos,
} from "@/lib/db/consultas";

/** Pantalla 5.5 — Asistente de selección. */
export default async function AsistentePage() {
  const sesion = await sesionActual();
  if (!sesion) redirect("/login");

  if (sesion.rol === "empleado") {
    return (
      <div className="mx-auto w-full max-w-screenframe px-4 py-8 sm:px-5 lg:px-8">
        <div className="rounded-card border border-line bg-surface px-6 py-8">
          <h1 className="text-title-lg text-ink">Acceso restringido</h1>
          <p className="mt-2 text-body text-muted">
            El asistente de selección está disponible para los roles Reclutador y Administrador.
          </p>
        </div>
      </div>
    );
  }

  // Primera carga sin registrar auditoría: el rastro se guarda al consultar.
  const inicial = buscarCandidatos(
    REQUERIMIENTO_EJEMPLO,
    listarCandidatos(),
    catalogoHabilidades().map((h) => h.nombre),
    areasDisponibles(),
  );

  return (
    <Asistente
      usuario={{
        rol: sesion.rol,
        correo: sesion.correo,
        etiquetaRol: ETIQUETA_ROL[sesion.rol],
      }}
      inicial={inicial}
    />
  );
}
