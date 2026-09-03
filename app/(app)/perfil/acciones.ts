"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sesionActual } from "@/lib/auth/sesion";
import {
  actualizarFoto,
  actualizarResumen,
  agregarCertificacion,
  agregarDocumento,
  agregarEducacion,
  agregarExperiencia,
  asignarHabilidad,
  borrarDocumento,
  habilidadPorNombre,
  quitarHabilidad,
} from "@/lib/db/consultas";

import type { EstadoPerfil } from "./estado";


/** Tamaño máximo de la foto guardada como data URL dentro de la fila. */
const MAX_FOTO = 300_000;

async function usuarioActual() {
  const sesion = await sesionActual();
  if (!sesion) redirect("/login");
  return sesion;
}

function texto(datos: FormData, clave: string): string {
  return String(datos.get(clave) ?? "").trim();
}

export async function accionAgregarEducacion(
  _previo: EstadoPerfil,
  datos: FormData,
): Promise<EstadoPerfil> {
  const sesion = await usuarioActual();
  const institucion = texto(datos, "institucion");
  const programa = texto(datos, "programa");

  if (!institucion || !programa) {
    return { error: "La institución y el programa son obligatorios.", ok: null };
  }

  agregarEducacion(
    sesion.id,
    institucion,
    programa,
    texto(datos, "detalle"),
    texto(datos, "periodo"),
  );
  revalidatePath("/perfil");
  return { error: null, ok: "Entrada de educación agregada." };
}

export async function accionAgregarExperiencia(
  _previo: EstadoPerfil,
  datos: FormData,
): Promise<EstadoPerfil> {
  const sesion = await usuarioActual();
  const titulo = texto(datos, "titulo");

  if (!titulo) return { error: "El título del puesto o proyecto es obligatorio.", ok: null };

  agregarExperiencia(
    sesion.id,
    titulo,
    texto(datos, "periodo"),
    texto(datos, "detalle"),
    texto(datos, "etiquetas"),
    datos.get("actual") === "on",
  );
  revalidatePath("/perfil");
  return { error: null, ok: "Entrada de experiencia agregada." };
}

export async function accionAgregarCertificacion(
  _previo: EstadoPerfil,
  datos: FormData,
): Promise<EstadoPerfil> {
  const sesion = await usuarioActual();
  const titulo = texto(datos, "titulo");

  if (!titulo) return { error: "El título de la certificación es obligatorio.", ok: null };

  const insignia = datos.get("insignia") === "learning" ? "learning" : "verificada";
  agregarCertificacion(
    sesion.id,
    titulo,
    texto(datos, "emisor"),
    texto(datos, "detalle"),
    insignia,
  );
  revalidatePath("/perfil");
  return { error: null, ok: "Certificación agregada." };
}

export async function accionAgregarHabilidad(
  _previo: EstadoPerfil,
  datos: FormData,
): Promise<EstadoPerfil> {
  const sesion = await usuarioActual();
  const nombre = texto(datos, "habilidad");

  if (!nombre) return { error: "Elige una habilidad del catálogo.", ok: null };

  const habilidad = habilidadPorNombre(nombre);
  if (!habilidad) {
    return {
      error: "Esa habilidad no está en el catálogo. Pídesela al Administrador.",
      ok: null,
    };
  }

  asignarHabilidad(sesion.id, habilidad.id);
  revalidatePath("/perfil");
  return { error: null, ok: `${habilidad.nombre} agregada a tu perfil.` };
}

export async function accionQuitarHabilidad(datos: FormData): Promise<void> {
  const sesion = await usuarioActual();
  const id = Number(datos.get("habilidadId"));
  if (Number.isFinite(id)) quitarHabilidad(sesion.id, id);
  revalidatePath("/perfil");
}

export async function accionGuardarResumen(
  _previo: EstadoPerfil,
  datos: FormData,
): Promise<EstadoPerfil> {
  const sesion = await usuarioActual();
  actualizarResumen(sesion.id, texto(datos, "resumen"));
  revalidatePath("/perfil");
  return { error: null, ok: "Resumen actualizado." };
}

export async function accionGuardarFoto(
  _previo: EstadoPerfil,
  datos: FormData,
): Promise<EstadoPerfil> {
  const sesion = await usuarioActual();
  const dataUrl = texto(datos, "foto");

  if (!dataUrl) {
    actualizarFoto(sesion.id, null);
    revalidatePath("/perfil");
    return { error: null, ok: "Foto eliminada." };
  }

  if (!dataUrl.startsWith("data:image/")) {
    return { error: "El archivo debe ser una imagen.", ok: null };
  }
  if (dataUrl.length > MAX_FOTO) {
    return { error: "La imagen supera los 300 KB. Elige una más ligera.", ok: null };
  }

  actualizarFoto(sesion.id, dataUrl);
  revalidatePath("/perfil");
  return { error: null, ok: "Foto actualizada." };
}

export async function accionAgregarDocumento(
  _previo: EstadoPerfil,
  datos: FormData,
): Promise<EstadoPerfil> {
  const sesion = await usuarioActual();
  const nombre = texto(datos, "nombre");

  if (!nombre) return { error: "Selecciona un archivo PDF.", ok: null };

  agregarDocumento(
    sesion.id,
    nombre,
    texto(datos, "detalle"),
    datos.get("insignia") === "CV" ? "CV" : "Certificado",
  );
  revalidatePath("/perfil");
  return {
    error: null,
    ok: "Documento registrado. El archivo en sí se guardará cuando se conecte el almacenamiento.",
  };
}

export async function accionBorrarDocumento(datos: FormData): Promise<void> {
  const sesion = await usuarioActual();
  const id = Number(datos.get("documentoId"));
  if (Number.isFinite(id)) borrarDocumento(sesion.id, id);
  revalidatePath("/perfil");
}
