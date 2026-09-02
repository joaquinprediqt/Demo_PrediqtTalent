"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Tema } from "@/types";

const CLAVE_TEMA = "prediqt.tema";

interface ContextoTema {
  readonly tema: Tema;
  readonly cambiarTema: (tema: Tema) => void;
}

const TemaContexto = createContext<ContextoTema | null>(null);

/** Script que aplica el tema antes del primer pintado para evitar parpadeo. */
export const SCRIPT_TEMA = `(function(){try{var t=localStorage.getItem("${CLAVE_TEMA}");if(t==="oscuro"){document.documentElement.setAttribute("data-theme","dark")}}catch(e){}})();`;

export function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>("claro");

  useEffect(() => {
    try {
      if (window.localStorage.getItem(CLAVE_TEMA) === "oscuro") setTema("oscuro");
    } catch {
      /* sin persistencia */
    }
  }, []);

  const cambiarTema = useCallback((nuevo: Tema) => {
    setTema(nuevo);
    const raiz = document.documentElement;
    if (nuevo === "oscuro") raiz.setAttribute("data-theme", "dark");
    else raiz.removeAttribute("data-theme");
    try {
      window.localStorage.setItem(CLAVE_TEMA, nuevo);
    } catch {
      /* sin persistencia */
    }
  }, []);

  const valor = useMemo<ContextoTema>(() => ({ tema, cambiarTema }), [tema, cambiarTema]);

  return <TemaContexto.Provider value={valor}>{children}</TemaContexto.Provider>;
}

export function useTema(): ContextoTema {
  const contexto = useContext(TemaContexto);
  if (!contexto) throw new Error("useTema debe usarse dentro de TemaProvider");
  return contexto;
}
