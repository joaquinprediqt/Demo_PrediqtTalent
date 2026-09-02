import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { MicrosoftMark } from "@/components/ui/MicrosoftMark";

const enlaces = [
  { etiqueta: "Learning", href: "/login" },
  { etiqueta: "Talent", href: "/login" },
] as const;

/** Header de 68px de las pantallas publicas (5.1). */
export function PublicHeader() {
  return (
    <header className="h-[68px] shrink-0 border-b border-line bg-surface">
      <div className="mx-auto flex h-full max-w-screenframe items-center justify-between px-6 lg:px-10">
        <Logo variante="publico" />

        <nav className="flex items-center gap-5 lg:gap-7">
          {enlaces.map((enlace) => (
            <Link
              key={enlace.etiqueta}
              href={enlace.href}
              className="hidden text-[14px] font-medium text-muted transition-colors hover:text-accent sm:block"
            >
              {enlace.etiqueta}
            </Link>
          ))}
          <span className="hidden text-[14px] font-medium text-muted sm:block">Soporte</span>

          <ButtonLink href="/login" variante="navy" tamano="md">
            <MicrosoftMark />
            <span className="hidden sm:inline">Iniciar sesión con Microsoft 365</span>
            <span className="sm:hidden">Iniciar sesión</span>
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
