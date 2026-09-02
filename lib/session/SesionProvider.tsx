"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Rol, Usuario } from "@/types";
import { USUARIOS } from "@/lib/data/usuarios";

const CLAVE_ROL = "prediqt.rol";
const CLAVE_CONSENTIMIENTO = "prediqt.consentimiento";

interface Sesion {
  readonly usuario: Usuario | null;
  readonly cargando: boolean;
  readonly consentimientoDado: boolean;
  readonly iniciarSesion: (rol: Rol) => void;
  readonly cerrarSesion: () => void;
  readonly aceptarConsentimiento: () => void;
}

const SesionContexto = createContext<Sesion | null>(null);

function esRol(valor: string | null): valor is Rol {
  return valor === "empleado" || valor === "reclutador" || valor === "administrador";
}

/**
 * Sesion simulada en el navegador. Sustituye a Microsoft Entra ID mientras
 * no exista backend: el rol se elige en la pantalla 5.1a y se guarda local.
 */
export function SesionProvider({ children }: { children: ReactNode }) {
  const [rol, setRol] = useState<Rol | null>(null);
  const [consentimientoDado, setConsentimiento] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE_ROL);
      if (esRol(guardado)) setRol(guardado);
      setConsentimiento(window.localStorage.getItem(CLAVE_CONSENTIMIENTO) === "si");
    } catch {
      // Navegador sin almacenamiento disponible: se arranca sin sesion.
    }
    setCargando(false);
  }, []);

  const iniciarSesion = useCallback((nuevoRol: Rol) => {
    setRol(nuevoRol);
    try {
      window.localStorage.setItem(CLAVE_ROL, nuevoRol);
    } catch {
      /* sin persistencia */
    }
  }, []);

  const cerrarSesion = useCallback(() => {
    setRol(null);
    setConsentimiento(false);
    try {
      window.localStorage.removeItem(CLAVE_ROL);
      window.localStorage.removeItem(CLAVE_CONSENTIMIENTO);
    } catch {
      /* sin persistencia */
    }
  }, []);

  const aceptarConsentimiento = useCallback(() => {
    setConsentimiento(true);
    try {
      window.localStorage.setItem(CLAVE_CONSENTIMIENTO, "si");
    } catch {
      /* sin persistencia */
    }
  }, []);

  const valor = useMemo<Sesion>(
    () => ({
      usuario: rol ? USUARIOS[rol] : null,
      cargando,
      consentimientoDado,
      iniciarSesion,
      cerrarSesion,
      aceptarConsentimiento,
    }),
    [rol, cargando, consentimientoDado, iniciarSesion, cerrarSesion, aceptarConsentimiento],
  );

  return <SesionContexto.Provider value={valor}>{children}</SesionContexto.Provider>;
}

export function useSesion(): Sesion {
  const contexto = useContext(SesionContexto);
  if (!contexto) throw new Error("useSesion debe usarse dentro de SesionProvider");
  return contexto;
}
