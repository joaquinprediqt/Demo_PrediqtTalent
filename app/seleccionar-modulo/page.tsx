import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { IconArrowRight, IconCheck, IconLearning, IconTalent } from "@/components/ui/icons";
import { sesionActual } from "@/lib/auth/sesion";
import { accionCerrarSesion } from "@/lib/auth/acciones";
import { completitudDe, resumenLearning } from "@/lib/db/consultas";
import { ETIQUETA_ROL, INICIO_POR_ROL } from "@/lib/data/usuarios";

/** Pantalla 5.1b — Elegir módulo tras iniciar sesión. */
export default async function SeleccionarModuloPage() {
  const usuario = await sesionActual();
  if (!usuario) redirect("/login");

  const { valor: completitud, faltantes } = completitudDe(usuario.id);
  const learning = resumenLearning(usuario.id);

  const destinoTalent =
    usuario.rol === "empleado" && !usuario.consentimiento
      ? "/consentimiento"
      : INICIO_POR_ROL[usuario.rol];

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="shrink-0 border-b border-line bg-surface">
        <div className="mx-auto flex min-h-[68px] max-w-screenframe flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10 lg:py-0">
          <Logo variante="publico" href="/seleccionar-modulo" />
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle variante="sobre-claro" />
            <span className="hidden text-[13px] text-muted md:block">{usuario.correo}</span>
            <Avatar iniciales={usuario.iniciales} />
            <form action={accionCerrarSesion}>
              <button
                type="submit"
                className="text-[13.5px] font-semibold text-muted transition-colors hover:text-ink"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-screenframe flex-1 flex-col items-center justify-center gap-10 px-4 py-12 sm:px-6 lg:px-20">
        <div className="max-w-[780px] text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-[7px] text-[12.5px] font-semibold text-accent-strong">
            <IconCheck size={14} />
            Sesión iniciada como {usuario.correo}
          </span>
          <h1 className="mt-4 text-[1.875rem] font-bold tracking-[-1px] text-ink sm:text-[2.125rem] lg:text-display-lg">
            Hola, {usuario.nombreCorto}
          </h1>
          <p className="mt-2 text-body-xl text-muted">
            ¿A dónde quieres entrar? Puedes cambiar de módulo en cualquier momento desde el menú
            superior.
          </p>
        </div>

        <div className="grid w-full max-w-[1040px] grid-cols-1 gap-6 md:grid-cols-2 lg:gap-[26px]">
          <Link
            href="/learning"
            className="flex flex-col rounded-card-xl border border-line bg-surface px-6 pb-7 pt-8 transition-shadow hover:border-accent hover:shadow-card-hover sm:px-8"
          >
            <span className="grid h-[52px] w-[52px] place-items-center rounded-[13px] bg-accent-soft text-accent">
              <IconLearning size={26} />
            </span>
            <h2 className="mt-[18px] text-[24px] font-bold text-ink sm:text-[27px]">
              Prediqt Learning
            </h2>
            <p className="mt-2 text-[15.5px] leading-[1.55] text-muted">
              Cursos de Prediqt Academy, tu avance y los certificados que se reflejan en tu perfil.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-medium text-muted">
                  {learning.enProgreso}{" "}
                  {learning.enProgreso === 1 ? "curso en progreso" : "cursos en progreso"}
                </span>
                <span className="text-[14px] font-bold text-accent">{learning.promedio}%</span>
              </div>
              <ProgressBar valor={learning.promedio} tono="accent" />
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
              <span className="text-[13px] text-faint">
                {learning.completados} completados de {learning.inscritos}
              </span>
              <span className="inline-flex items-center gap-2 rounded-[8px] bg-accent px-[18px] py-2.5 text-[14px] font-semibold text-white">
                Entrar a Learning
                <IconArrowRight size={15} />
              </span>
            </div>
          </Link>

          <Link
            href={destinoTalent}
            className="flex flex-col rounded-card-xl border border-line bg-surface px-6 pb-7 pt-8 transition-shadow hover:border-steel hover:shadow-card-hover-steel sm:px-8"
          >
            <span className="grid h-[52px] w-[52px] place-items-center rounded-[13px] bg-steel-soft text-steel">
              <IconTalent size={26} />
            </span>
            <h2 className="mt-[18px] text-[24px] font-bold text-ink sm:text-[27px]">
              Prediqt Talent
            </h2>
            <p className="mt-2 text-[15.5px] leading-[1.55] text-muted">
              Tu perfil profesional, tus documentos y el banco de talento interno de Prediqt.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-medium text-muted">Perfil completo</span>
                <span className="text-[14px] font-bold text-steel">{completitud}%</span>
              </div>
              <ProgressBar valor={completitud} tono="steel" />
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
              <span className="text-[13px] text-faint">
                {faltantes.length === 0
                  ? "Perfil al día"
                  : `${faltantes.length} ${faltantes.length === 1 ? "campo" : "campos"} por completar`}
              </span>
              <span className="inline-flex items-center gap-2 rounded-[8px] bg-navy px-[18px] py-2.5 text-[14px] font-semibold text-white">
                Entrar a Talent
                <IconArrowRight size={15} />
              </span>
            </div>
          </Link>
        </div>

        <p className="text-center text-[13px] text-faint">
          Rol asignado: {ETIQUETA_ROL[usuario.rol]} · para cambiar de rol contacta al Administrador
          de la plataforma.
        </p>
      </main>
    </div>
  );
}
