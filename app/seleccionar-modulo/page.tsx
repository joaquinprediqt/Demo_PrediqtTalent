"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IconArrowRight, IconCheck, IconLearning, IconTalent } from "@/components/ui/icons";
import { useSesion } from "@/lib/session/SesionProvider";
import { ETIQUETA_ROL, INICIO_POR_ROL } from "@/lib/data/usuarios";

export default function SeleccionarModuloPage() {
  const { usuario, cargando, consentimientoDado, cerrarSesion } = useSesion();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && !usuario) router.replace("/login");
  }, [cargando, usuario, router]);

  if (cargando || !usuario) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg">
        <p className="text-body text-muted">Cargando sesión…</p>
      </div>
    );
  }

  const destinoTalent =
    usuario.rol === "empleado"
      ? consentimientoDado
        ? "/perfil"
        : "/consentimiento"
      : INICIO_POR_ROL[usuario.rol];

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="h-[68px] shrink-0 border-b border-line bg-surface">
        <div className="mx-auto flex h-full max-w-screenframe items-center justify-between px-6 lg:px-10">
          <Logo variante="publico" />
          <div className="flex items-center gap-4">
            <span className="hidden text-[13px] text-muted sm:block">{usuario.cuenta}</span>
            <Avatar iniciales={usuario.iniciales} />
            <button
              type="button"
              onClick={() => {
                cerrarSesion();
                router.push("/");
              }}
              className="text-[13.5px] font-semibold text-muted transition-colors hover:text-ink"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-screenframe flex-1 flex-col items-center justify-center gap-10 px-6 py-12 lg:px-20">
        <div className="max-w-[780px] text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-[7px] text-[12.5px] font-semibold text-accent-strong">
            <IconCheck size={14} />
            Sesión iniciada con Microsoft 365
          </span>
          <h1 className="mt-4 text-[2.125rem] font-bold tracking-[-1px] text-ink lg:text-display-lg">
            Hola, {usuario.nombreCorto}
          </h1>
          <p className="mt-2 text-body-xl text-muted">
            ¿A dónde quieres entrar? Puedes cambiar de módulo en cualquier momento desde el menú
            superior.
          </p>
        </div>

        <div className="grid w-full max-w-[1040px] grid-cols-1 gap-[26px] md:grid-cols-2">
          <article className="flex flex-col rounded-card-xl border border-line bg-surface px-8 pb-7 pt-8 transition-shadow hover:border-accent hover:shadow-card-hover">
            <span className="grid h-[52px] w-[52px] place-items-center rounded-[13px] bg-accent-soft text-accent">
              <IconLearning size={26} />
            </span>
            <h2 className="mt-[18px] text-[27px] font-bold text-ink">Prediqt Learning</h2>
            <p className="mt-2 text-[15.5px] leading-[1.55] text-muted">
              Cursos de Prediqt Academy, tu avance y los certificados que se reflejan en tu perfil.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-medium text-muted">2 cursos en progreso</span>
                <span className="text-[14px] font-bold text-accent">64%</span>
              </div>
              <ProgressBar valor={64} tono="accent" />
            </div>

            <div className="mt-auto flex items-center justify-between pt-6">
              <span className="text-[13px] text-faint">Último acceso: 22 ago 2026</span>
              <span
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-[8px] bg-accent px-[18px] py-2.5 text-[14px] font-semibold text-white opacity-70"
                title="Las pantallas de Prediqt Learning aún no están construidas"
              >
                Entrar a Learning
                <IconArrowRight size={15} />
              </span>
            </div>
          </article>

          <article
            role="link"
            tabIndex={0}
            onClick={() => router.push(destinoTalent)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") router.push(destinoTalent);
            }}
            className="flex cursor-pointer flex-col rounded-card-xl border border-line bg-surface px-8 pb-7 pt-8 transition-shadow hover:border-steel hover:shadow-card-hover-steel"
          >
            <span className="grid h-[52px] w-[52px] place-items-center rounded-[13px] bg-steel-soft text-steel">
              <IconTalent size={26} />
            </span>
            <h2 className="mt-[18px] text-[27px] font-bold text-ink">Prediqt Talent</h2>
            <p className="mt-2 text-[15.5px] leading-[1.55] text-muted">
              Tu perfil profesional, tus documentos y el banco de talento interno de Prediqt.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-medium text-muted">Perfil completo</span>
                <span className="text-[14px] font-bold text-steel">82%</span>
              </div>
              <ProgressBar valor={82} tono="steel" />
            </div>

            <div className="mt-auto flex items-center justify-between pt-6">
              <span className="text-[13px] text-faint">2 campos por completar</span>
              <span className="inline-flex items-center gap-2 rounded-[8px] bg-navy px-[18px] py-2.5 text-[14px] font-semibold text-white">
                Entrar a Talent
                <IconArrowRight size={15} />
              </span>
            </div>
          </article>
        </div>

        <p className="text-[13px] text-faint">
          Rol asignado: {ETIQUETA_ROL[usuario.rol]} · para cambiar de rol contacta al Administrador
          de la plataforma.
        </p>
      </main>
    </div>
  );
}
