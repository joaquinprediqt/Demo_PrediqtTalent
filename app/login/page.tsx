import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { IconCheck } from "@/components/ui/icons";
import { LoginForm } from "./LoginForm";
import { sesionActual } from "@/lib/auth/sesion";

const VENTAJAS = [
  "Cursos de Prediqt Academy y tu avance por curso",
  "Tu perfil profesional dentro del banco de talento",
  "Cada acceso queda registrado en la auditoría",
] as const;

/** Pantalla 5.1a — Inicio de sesión con correo y contraseña. */
export default async function LoginPage() {
  if (await sesionActual()) redirect("/seleccionar-modulo");

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="shrink-0 border-b border-line bg-surface">
        <div className="mx-auto flex min-h-[68px] max-w-screenframe flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10 lg:py-0">
          <Logo variante="publico" />
          <div className="flex items-center gap-4">
            <ThemeToggle variante="sobre-claro" />
            <span className="hidden text-[13.5px] text-faint md:block">
              ¿Problemas para entrar?
            </span>
            <span className="text-[13.5px] font-semibold text-accent">Soporte TI</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-screenframe flex-1 grid-cols-1 lg:grid-cols-[1fr_600px]">
        <section className="relative flex flex-col justify-center gap-6 overflow-hidden bg-grad-hero px-6 py-14 lg:px-14">
          <div
            className="pointer-events-none absolute inset-0 bg-grid bg-gridcell"
            aria-hidden="true"
          />

          <p className="relative text-eyebrow text-accent-light">
            ACCESO A LA PLATAFORMA INTERNA DE PERSONAS
          </p>
          <h1 className="relative max-w-[470px] text-[2.125rem] font-bold leading-[1.06] tracking-[-1px] text-white lg:text-display-lg">
            Una sola credencial para Learning y Talent.
          </h1>
          <p className="relative max-w-[450px] text-[16px] leading-[1.6] text-white/[0.72]">
            Usa tu cuenta corporativa de Prediqt. Si ya trabajas con Office 365, no necesitas crear
            nada nuevo.
          </p>

          <ul className="relative mt-1.5 flex flex-col gap-3">
            {VENTAJAS.map((ventaja) => (
              <li
                key={ventaja}
                className="flex items-center gap-[11px] text-[15px] text-white/[0.86]"
              >
                <span className="grid h-[21px] w-[21px] shrink-0 place-items-center rounded-full bg-accent-light/[0.18] text-accent-light">
                  <IconCheck size={12} />
                </span>
                {ventaja}
              </li>
            ))}
          </ul>

          <p className="relative mt-3.5 max-w-[430px] text-[13px] leading-[1.55] text-white/50">
            Tratamiento de datos conforme a la Ley N.° 29733 de Protección de Datos Personales del
            Perú.
          </p>
        </section>

        <section className="flex items-center justify-center bg-bg px-4 py-10 sm:px-6 lg:px-[46px]">
          <LoginForm />
        </section>
      </div>
    </div>
  );
}
