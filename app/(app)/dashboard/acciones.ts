"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sesionActual } from "@/lib/auth/sesion";
import { tocarSincronizacion } from "@/lib/db/consultas";

/** Vuelve a leer los datos del tablero y actualiza la marca de tiempo. */
export async function accionSincronizar(): Promise<void> {
  const sesion = await sesionActual();
  if (!sesion) redirect("/login");
  if (sesion.rol === "empleado") redirect("/perfil");

  tocarSincronizacion();
  revalidatePath("/dashboard");
}
