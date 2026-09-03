"use server";

import { redirect } from "next/navigation";
import { verificarContrasena } from "@/lib/auth/password";
import { abrirSesion, cerrarSesionActual } from "@/lib/auth/sesion";
import { credencialesPorCorreo } from "@/lib/db/consultas";

export interface EstadoLogin {
  readonly error: string | null;
}

export async function accionIniciarSesion(
  _previo: EstadoLogin,
  datos: FormData,
): Promise<EstadoLogin> {
  const correo = String(datos.get("correo") ?? "").trim();
  const contrasena = String(datos.get("contrasena") ?? "");

  if (!correo || !contrasena) {
    return { error: "Escribe tu correo y tu contraseña." };
  }

  const credenciales = credencialesPorCorreo(correo);

  // Mismo mensaje para correo inexistente y contraseña incorrecta:
  // así no se puede averiguar qué cuentas existen.
  if (!credenciales || !verificarContrasena(contrasena, credenciales.sal, credenciales.hash)) {
    return { error: "Correo o contraseña incorrectos." };
  }

  if (credenciales.activo === 0) {
    return { error: "Esta cuenta está sincronizada pero todavía no tiene perfil activo." };
  }

  await abrirSesion(credenciales.id);
  redirect("/seleccionar-modulo");
}

export async function accionCerrarSesion(): Promise<void> {
  await cerrarSesionActual();
  redirect("/");
}
