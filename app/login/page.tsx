"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { MicrosoftMark } from "@/components/ui/MicrosoftMark";
import { IconCheck, IconInfo } from "@/components/ui/icons";
import { useSesion } from "@/lib/session/SesionProvider";
import { DESCRIPCION_ROL, ETIQUETA_ROL, USUARIOS } from "@/lib/data/usuarios";
import type { Rol } from "@/types";
import { cn } from "@/lib/utils/cn";

const ROLES: readonly Rol[] = ["empleado", "reclutador", "administrador"];

const VENTAJAS = [
  "Cursos de Prediqt Academy y tu avance por curso",
  "Tu perfil profesional dentro del banco de talento",
  "Cada acceso queda registrado en la auditoría",
] as const;

export default function LoginPage() {
  const [rol, setRol] = useState<Rol>("empleado");
  const { iniciarSesion } = useSesion();
  const router = useRouter();

  function entrar() {
    iniciarSesion(rol);
    router.push("/seleccionar-modulo");
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="h-[68px] shrink-0 border-b border-line bg-surface">
        <div className="mx-auto flex h-full max-w-screenframe items-center justify-between px-6 lg:px-10">
          <Logo variante="publico" />
          <div className="flex items-center gap-5">
            <span className="hidden text-[13.5px] text-faint sm:block">
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

        <section className="flex items-center justify-center bg-bg px-6 py-10 lg:px-[46px]">
          <div className="w-full rounded-card-lg border border-line bg-surface px-[34px] py-8 shadow-card">
            <h2 className="text-[26px] font-bold tracking-[-0.5px] text-ink">Iniciar sesión</h2>
            <p className="mt-0.5 text-[14.5px] text-muted">Prediqt Learning · Prediqt Talent</p>

            <button
              type="button"
              disabled
              title="Azure Entra ID todavía no está conectado en esta demo"
              className="mt-5 flex w-full items-center justify-center gap-[11px] rounded-control bg-navy py-3.5 text-[15px] font-semibold text-white opacity-60"
            >
              <MicrosoftMark size={17} />
              Continuar con Microsoft 365
            </button>
            <p className="mt-2 text-center text-[12.5px] text-faint">
              Pendiente de conectar · acceso único con tu cuenta @prediqtdata.com
            </p>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-[11.5px] font-medium tracking-[0.1em] text-faint">
                O ELIGE UN ROL DE DEMOSTRACIÓN
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <fieldset className="flex flex-col gap-2.5">
              <legend className="sr-only">Rol con el que quieres entrar</legend>
              {ROLES.map((opcion) => {
                const seleccionado = rol === opcion;
                const usuario = USUARIOS[opcion];
                return (
                  <label
                    key={opcion}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-control border px-[14px] py-3 transition-colors",
                      seleccionado
                        ? "border-accent shadow-focus"
                        : "border-line-input hover:border-line-strong",
                    )}
                  >
                    <input
                      type="radio"
                      name="rol"
                      value={opcion}
                      checked={seleccionado}
                      onChange={() => setRol(opcion)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        "mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border",
                        seleccionado ? "border-accent bg-accent text-white" : "border-line-strong",
                      )}
                      aria-hidden="true"
                    >
                      {seleccionado && <IconCheck size={11} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold text-ink">
                        {ETIQUETA_ROL[opcion]}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] leading-[1.45] text-muted">
                        {DESCRIPCION_ROL[opcion]}
                      </span>
                      <span className="mt-1 block text-[12px] text-faint">{usuario.cuenta}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>

            <Button variante="accent" className="mt-4 w-full py-3.5 text-[15px]" onClick={entrar}>
              Ingresar como {ETIQUETA_ROL[rol]}
            </Button>

            <div className="my-5 h-px bg-line" />
            <div className="flex items-start gap-2.5">
              <IconInfo size={15} className="mt-0.5 shrink-0 text-faint" />
              <p className="text-[12.5px] leading-[1.5] text-faint">
                Esta es una sesión simulada en tu navegador para revisar las pantallas. No hay
                credenciales ni servidor de autenticación todavía.
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                href="/"
                className="rounded-[7px] border border-line-input px-3 py-[7px] text-[12.5px] font-medium text-muted"
              >
                Volver al inicio
              </Link>
              <span className="rounded-[7px] border border-line-input px-3 py-[7px] text-[12.5px] font-medium text-muted">
                Aviso de cookies
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
