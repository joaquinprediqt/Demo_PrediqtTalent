"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "@/types";

/**
 * La sesión ya no vive en el navegador: la resuelve el servidor leyendo la
 * cookie y la inyecta aquí para que los componentes de cliente la consulten.
 */
const SesionContexto = createContext<Usuario | null>(null);

export function SesionProvider({
  usuario,
  children,
}: {
  usuario: Usuario;
  children: ReactNode;
}) {
  return <SesionContexto.Provider value={usuario}>{children}</SesionContexto.Provider>;
}

/** Dentro de una zona autenticada siempre hay usuario. */
export function useSesion(): Usuario {
  const usuario = useContext(SesionContexto);
  if (!usuario) throw new Error("useSesion debe usarse dentro de SesionProvider");
  return usuario;
}
