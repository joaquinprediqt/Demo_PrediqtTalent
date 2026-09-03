import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import {
  borrarSesion,
  crearSesion,
  limpiarSesionesVencidas,
  usuarioDeSesion,
  type UsuarioFila,
} from "@/lib/db/consultas";
import type { Usuario } from "@/types";

const COOKIE = "prediqt_sesion";
const DIAS = 7;

/** SQLite compara con datetime('now'), que es UTC: se guarda en el mismo formato. */
function fechaUtc(desplazamientoMs: number): string {
  return new Date(Date.now() + desplazamientoMs)
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);
}

export function aUsuario(fila: UsuarioFila): Usuario {
  return {
    id: fila.id,
    nombre: fila.nombre,
    nombreCorto: fila.nombre_corto,
    cargo: fila.cargo,
    correo: fila.correo,
    iniciales: fila.iniciales,
    sede: fila.sede,
    area: fila.area,
    rol: fila.rol,
    consentimiento: fila.consentimiento_en !== null,
  };
}

export async function abrirSesion(usuarioId: number): Promise<void> {
  limpiarSesionesVencidas();

  const id = randomBytes(32).toString("hex");
  crearSesion(id, usuarioId, fechaUtc(DIAS * 86_400_000));

  const almacen = await cookies();
  almacen.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: DIAS * 86_400,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function sesionActual(): Promise<Usuario | null> {
  const almacen = await cookies();
  const id = almacen.get(COOKIE)?.value;
  if (!id) return null;

  const fila = usuarioDeSesion(id);
  return fila ? aUsuario(fila) : null;
}

export async function cerrarSesionActual(): Promise<void> {
  const almacen = await cookies();
  const id = almacen.get(COOKIE)?.value;
  if (id) borrarSesion(id);
  almacen.delete(COOKIE);
}

/** Etiqueta que se guarda en la auditoría: "jcerna (Reclutador)". */
export function etiquetaActor(usuario: Usuario, etiquetaRol: string): string {
  const alias = usuario.correo.split("@")[0] ?? usuario.correo;
  return `${alias} (${etiquetaRol})`;
}
