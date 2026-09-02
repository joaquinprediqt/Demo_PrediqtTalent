"use client";

import { useTema } from "@/lib/session/TemaProvider";
import { IconMoon, IconSun } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

const activo = "rounded-[6px] px-[10px] py-[5px] text-[12.5px] font-semibold";
const inactivo = "px-[10px] py-[5px] text-[12.5px] font-medium text-white/[0.66]";

/** Selector claro/oscuro del header (visible en 5.3). */
export function ThemeToggle() {
  const { tema, cambiarTema } = useTema();

  return (
    <div className="flex items-center rounded-[8px] bg-white/[0.1] p-[3px]">
      <button
        type="button"
        onClick={() => cambiarTema("claro")}
        aria-pressed={tema === "claro"}
        className={cn(
          "flex items-center gap-1.5 transition-colors",
          tema === "claro" ? cn(activo, "bg-white text-navy") : inactivo,
        )}
      >
        <IconSun size={13} />
        Claro
      </button>
      <button
        type="button"
        onClick={() => cambiarTema("oscuro")}
        aria-pressed={tema === "oscuro"}
        className={cn(
          "flex items-center gap-1.5 transition-colors",
          tema === "oscuro" ? cn(activo, "bg-accent text-white") : inactivo,
        )}
      >
        <IconMoon size={13} />
        Oscuro
      </button>
    </div>
  );
}
