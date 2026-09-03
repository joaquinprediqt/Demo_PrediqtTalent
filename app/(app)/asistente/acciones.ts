"use server";

import { redirect } from "next/navigation";
import { etiquetaActor, sesionActual } from "@/lib/auth/sesion";
import { buscarCandidatos, type ResultadoAsistente } from "@/lib/asistente/motor";
import { ETIQUETA_ROL } from "@/lib/data/usuarios";
import {
  areasDisponibles,
  catalogoHabilidades,
  listarCandidatos,
  registrarAuditoria,
} from "@/lib/db/consultas";

export async function accionConsultarAsistente(
  consulta: string,
): Promise<ResultadoAsistente> {
  const sesion = await sesionActual();
  if (!sesion) redirect("/login");

  const resultado = buscarCandidatos(
    consulta,
    listarCandidatos(),
    catalogoHabilidades().map((h) => h.nombre),
    areasDisponibles(),
  );

  if (resultado.consulta.length > 0) {
    const recorte =
      resultado.consulta.length > 40
        ? `${resultado.consulta.slice(0, 40)}…`
        : resultado.consulta;
    registrarAuditoria(
      sesion.id,
      etiquetaActor(sesion, ETIQUETA_ROL[sesion.rol]),
      "Consulta al Asistente",
      `“${recorte}”`,
    );
  }

  return resultado;
}
