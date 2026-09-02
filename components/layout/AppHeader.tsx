"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import { usePathname, useRouter } from "next/navigation";
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

/** Header de 60px con degradado navy a verde (5.3 en adelante). */
export function AppHeader() {
  const { usuario, cerrarSesion } = useSesion();
  const pathname = usePathname();
  const router = useRouter();

  if (!usuario) return null;

  const enlaces = NAV_POR_ROL[usuario.rol];

  return (
    <header className="h-[60px] shrink-0 bg-grad-header dark:border-b dark:border-[#1E3550] dark:bg-grad-header-dark">
      <div className="mx-auto flex h-full max-w-screenframe items-center justify-between gap-4 px-5 lg:px-7">
        <div className="flex items-center gap-6 lg:gap-[30px]">
          <Logo variante="app" href={enlaces[0]?.href ?? "/"} />

          <nav className="hidden items-center gap-0.5 md:flex">
            {enlaces.map((enlace) => {
              const Icono = ICONOS[enlace.etiqueta] ?? IconGrid;
              const activo = pathname === enlace.href && !enlace.inactivo;
              return (
                <Link
                  key={enlace.etiqueta}
                  href={enlace.href}
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-[7px] rounded-[7px] px-3 py-[7px] text-[14px] transition-colors",
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

        <div className="flex items-center gap-3 lg:gap-[14px]">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <span className="hidden rounded-[5px] border border-accent-light/40 px-2 py-1 text-[11.5px] font-semibold tracking-[0.1em] text-accent-light xl:block">
            ROL: {ETIQUETA_ROL[usuario.rol].toUpperCase()}
          </span>

          <span className="hidden text-[13px] text-white/70 lg:block">{usuario.cuenta}</span>

          <Avatar iniciales={usuario.iniciales} />

          <button
            type="button"
            onClick={() => {
              cerrarSesion();
              router.push("/");
            }}
            className="text-[13.5px] font-semibold text-white/70 transition-colors hover:text-white"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
