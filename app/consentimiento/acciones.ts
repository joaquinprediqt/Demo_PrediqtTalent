"use server";

import { redirect } from "next/navigation";
import { sesionActual } from "@/lib/auth/sesion";
import { marcarConsentimiento } from "@/lib/db/consultas";

export async function accionAceptarConsentimiento(): Promise<void> {
  const usuario = await sesionActual();
  if (!usuario) redirect("/login");

  marcarConsentimiento(usuario.id);
  redirect("/perfil");
}
