"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  IconGrid,
  IconLearning,
  IconSearch,
  IconShield,
  IconSparkle,
  IconUser,
} from "@/components/ui/icons";
import { useSesion } from "@/lib/session/SesionProvider";
import { accionCerrarSesion } from "@/lib/auth/acciones";
import { ETIQUETA_ROL, NAV_POR_ROL } from "@/lib/data/usuarios";
import { cn } from "@/lib/utils/cn";

const ICONOS: Record<string, (p: { size?: number }) => ReactElement> = {
  Inicio: IconGrid,
  "Mi perfil": IconUser,
  Learning: IconLearning,
  Dashboard: IconGrid,
  "Buscar talento": IconSearch,
  Asistente: IconSparkle,
  Certificados: IconShield,
  Administración: IconShield,
};

/** Header con degradado navy a verde (5.3 en adelante). */
export function AppHeader() {
  const usuario = useSesion();
  const pathname = usePathname();
  const enlaces = NAV_POR_ROL[usuario.rol];

  return (
    <header className="shrink-0 bg-grad-header dark:border-b dark:border-[#1E3550] dark:bg-grad-header-dark">
      <div className="mx-auto flex min-h-[60px] max-w-screenframe flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-5 lg:px-7 lg:py-0">
        <div className="flex w-full min-w-0 items-center gap-4 lg:w-auto lg:flex-none lg:gap-[30px]">
          <Logo variante="app" href={enlaces[0]?.href ?? "/"} />

          {/* En móvil la navegación se desliza en vez de apilarse y estirar el header. */}
          <nav className="-mx-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-none lg:overflow-visible">
            {enlaces.map((enlace) => {
              const Icono = ICONOS[enlace.etiqueta] ?? IconGrid;
              const activo = pathname === enlace.href && !enlace.inactivo;
              return (
                <Link
                  key={enlace.etiqueta}
                  href={enlace.href}
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-[7px] whitespace-nowrap rounded-[7px] px-2.5 py-[7px] text-[13.5px] transition-colors sm:px-3 sm:text-[14px]",
                    activo
                      ? "bg-white/[0.13] font-semibold text-white"
                      : "font-medium text-white/[0.68] hover:text-white",
                  )}
                >
                  <Icono size={15} />
                  {enlace.etiqueta}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex w-full items-center justify-end gap-3 lg:w-auto lg:gap-[14px]">
          <ThemeToggle />

          <span className="hidden rounded-[5px] border border-accent-light/40 px-2 py-1 text-[11.5px] font-semibold tracking-[0.1em] text-accent-light xl:block">
            ROL: {ETIQUETA_ROL[usuario.rol].toUpperCase()}
          </span>

          <span className="hidden text-[13px] text-white/70 lg:block">{usuario.correo}</span>

          <Avatar iniciales={usuario.iniciales} />

          <form action={accionCerrarSesion}>
            <button
              type="submit"
              className="text-[13.5px] font-semibold text-white/70 transition-colors hover:text-white"
            >
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
