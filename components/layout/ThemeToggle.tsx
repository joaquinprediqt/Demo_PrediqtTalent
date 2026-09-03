"use client";

import { useTema } from "@/lib/session/TemaProvider";
import { IconMoon, IconSun } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

/**
 * "sobre-oscuro" va en el header con degradado (5.3 en adelante).
 * "sobre-claro"  va en los headers blancos de las pantallas públicas.
 */
type Variante = "sobre-oscuro" | "sobre-claro";

const opcionBase = "flex items-center gap-1.5 rounded-[6px] px-[10px] py-[5px] text-[12.5px]";

export function ThemeToggle({ variante = "sobre-oscuro" }: { variante?: Variante }) {
  const { tema, cambiarTema } = useTema();
  const sobreOscuro = variante === "sobre-oscuro";

  const contenedor = sobreOscuro
    ? "bg-white/[0.1]"
    : "border border-line bg-surface-raised";

  const inactivo = sobreOscuro ? "font-medium text-white/[0.66]" : "font-medium text-muted";

  const activoClaro = sobreOscuro ? "bg-white text-navy" : "bg-navy text-white";
  const activoOscuro = "bg-accent text-white";

  return (
    <div className={cn("flex items-center rounded-[8px] p-[3px]", contenedor)}>
      <button
        type="button"
        onClick={() => cambiarTema("claro")}
        aria-pressed={tema === "claro"}
        aria-label="Tema claro"
        className={cn(opcionBase, tema === "claro" ? cn("font-semibold", activoClaro) : inactivo)}
      >
        <IconSun size={13} />
        Claro
      </button>
      <button
        type="button"
        onClick={() => cambiarTema("oscuro")}
        aria-pressed={tema === "oscuro"}
        aria-label="Tema oscuro"
        className={cn(opcionBase, tema === "oscuro" ? cn("font-semibold", activoOscuro) : inactivo)}
      >
        <IconMoon size={13} />
        Oscuro
      </button>
    </div>
  );
}
