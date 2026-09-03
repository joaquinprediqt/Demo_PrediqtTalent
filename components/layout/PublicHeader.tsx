"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { MicrosoftMark } from "@/components/ui/MicrosoftMark";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const enlaces = [
  { etiqueta: "Learning", href: "/learning" },
  { etiqueta: "Talent", href: "/login" },
] as const;

/** Header de las pantallas públicas (5.1). */
export function PublicHeader() {
  return (
    <header className="shrink-0 border-b border-line bg-surface">
      <div className="mx-auto flex min-h-[68px] max-w-screenframe flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10 lg:py-0">
        <Logo variante="publico" />

        <nav className="flex flex-wrap items-center gap-3 sm:gap-5 lg:gap-7">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.etiqueta}
              href={enlace.href}
              className="text-[14px] font-medium text-muted transition-colors hover:text-accent"
            >
              {enlace.etiqueta}
            </Link>
          ))}
          <span className="hidden text-[14px] font-medium text-muted md:block">Soporte</span>

          <ThemeToggle variante="sobre-claro" />

          <ButtonLink href="/login" variante="navy" tamano="md">
            <MicrosoftMark />
            <span className="hidden lg:inline">Iniciar sesión con Microsoft 365</span>
            <span className="lg:hidden">Iniciar sesión</span>
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
