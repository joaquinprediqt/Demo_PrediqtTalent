"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { etiquetaActor, sesionActual } from "@/lib/auth/sesion";
import { ETIQUETA_ROL } from "@/lib/data/usuarios";
import {
  cambiarRol,
  crearHabilidad,
  habilidadPorNombre,
  registrarAuditoria,
  usuarioPorId,
} from "@/lib/db/consultas";
import type { Rol } from "@/types";
import type { EstadoAdmin } from "./estado";

async function administrador() {
  const sesion = await sesionActual();
  if (!sesion) redirect("/login");
  if (sesion.rol !== "administrador") redirect("/dashboard");
  return sesion;
}

function esRol(valor: string): valor is Rol {
  return valor === "empleado" || valor === "reclutador" || valor === "administrador";
}

export async function accionAsignarRol(
  _previo: EstadoAdmin,
  datos: FormData,
): Promise<EstadoAdmin> {
  const sesion = await administrador();
  const usuarioId = Number(datos.get("usuarioId"));
  const rol = String(datos.get("rol") ?? "");

  if (!Number.isFinite(usuarioId) || !esRol(rol)) {
    return { error: "Elige una cuenta y un rol válidos.", ok: null };
  }
  if (usuarioId === sesion.id) {
    return { error: "No puedes cambiar tu propio rol.", ok: null };
  }

  const objetivo = usuarioPorId(usuarioId);
  if (!objetivo) return { error: "Esa cuenta ya no existe.", ok: null };

  cambiarRol(usuarioId, rol);
  registrarAuditoria(
    sesion.id,
    etiquetaActor(sesion, ETIQUETA_ROL[sesion.rol]),
    objetivo.nombre,
    `Cambió el rol de ${ETIQUETA_ROL[objetivo.rol]} a ${ETIQUETA_ROL[rol]}`,
  );
  revalidatePath("/administracion");

  return { error: null, ok: `${objetivo.nombre} ahora es ${ETIQUETA_ROL[rol]}.` };
}

export async function accionCrearHabilidad(
  _previo: EstadoAdmin,
  datos: FormData,
): Promise<EstadoAdmin> {
  const sesion = await administrador();
  const nombre = String(datos.get("nombre") ?? "").trim();
  const categoria = String(datos.get("categoria") ?? "").trim() || "Sin categoría";
  const estado = datos.get("aprobada") === "on" ? "aprobada" : "pendiente";

  if (!nombre) return { error: "Escribe el nombre de la habilidad.", ok: null };
  if (habilidadPorNombre(nombre)) {
    return { error: `"${nombre}" ya está en el catálogo.`, ok: null };
  }

  crearHabilidad(nombre, categoria, estado);
  registrarAuditoria(
    sesion.id,
    etiquetaActor(sesion, ETIQUETA_ROL[sesion.rol]),
    "Catálogo de habilidades",
    `Agregó "${nombre}" (${estado})`,
  );
  revalidatePath("/administracion");
  revalidatePath("/perfil");

  return { error: null, ok: `"${nombre}" agregada al catálogo como ${estado}.` };
}
