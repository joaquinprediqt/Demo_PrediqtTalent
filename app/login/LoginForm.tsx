"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { MicrosoftMark } from "@/components/ui/MicrosoftMark";
import { IconEye, IconInfo } from "@/components/ui/icons";
import { accionIniciarSesion, type EstadoLogin } from "@/lib/auth/acciones";

const INICIAL: EstadoLogin = { error: null };

/** Cuentas sembradas en la base; se muestran solo para poder probar la demo. */
const DEMO = [
  { correo: "mcastillo@prediqtdata.com", clave: "Empleado2026", quien: "Empleada" },
  { correo: "jcerna@prediqtdata.com", clave: "Reclutador2026", quien: "Reclutador" },
  { correo: "radmin@prediqtdata.com", clave: "Admin2026", quien: "Administradora" },
] as const;

export function LoginForm() {
  const [estado, enviar, pendiente] = useActionState(accionIniciarSesion, INICIAL);
  const [verClave, setVerClave] = useState(false);

  return (
    <div className="w-full rounded-card-lg border border-line bg-surface px-6 py-8 shadow-card sm:px-[34px]">
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
          O CON TUS CREDENCIALES
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form action={enviar} className="flex flex-col gap-[13px]">
        <div>
          <label
            htmlFor="correo"
            className="text-[12px] font-semibold tracking-[0.06em] text-muted"
          >
            USUARIO
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            autoComplete="username"
            required
            placeholder="nombre@prediqtdata.com"
            className="mt-1.5 w-full rounded-control border border-line-input bg-transparent px-[14px] py-3 text-[15px] text-ink outline-none placeholder:text-faint focus:border-accent focus:shadow-focus"
          />
        </div>

        <div>
          <label
            htmlFor="contrasena"
            className="text-[12px] font-semibold tracking-[0.06em] text-muted"
          >
            CONTRASEÑA
          </label>
          <div className="mt-1.5 flex items-center rounded-control border border-line-input focus-within:border-accent focus-within:shadow-focus">
            <input
              id="contrasena"
              name="contrasena"
              type={verClave ? "text" : "password"}
              autoComplete="current-password"
              required
              className="w-full bg-transparent px-[14px] py-3 text-[15px] text-ink outline-none"
            />
            <button
              type="button"
              onClick={() => setVerClave((v) => !v)}
              aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="px-3.5 text-faint transition-colors hover:text-ink"
            >
              <IconEye size={17} />
            </button>
          </div>
        </div>

        {estado.error && (
          <p
            role="alert"
            className="rounded-control border border-[#E4B4A9] bg-[#FBEDEA] px-3.5 py-2.5 text-[13.5px] text-[#8A3B2F]"
          >
            {estado.error}
          </p>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[13.5px] text-muted">
            <input
              type="checkbox"
              name="recordar"
              className="h-[17px] w-[17px] rounded-[4px] border border-line-strong accent-[#1F8A7A]"
            />
            Mantener la sesión abierta
          </label>
          <span className="text-[13.5px] font-semibold text-accent">
            ¿Olvidaste tu contraseña?
          </span>
        </div>

        <button
          type="submit"
          disabled={pendiente}
          className="mt-1 w-full rounded-control bg-accent py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
        >
          {pendiente ? "Comprobando…" : "Ingresar"}
        </button>
      </form>

      <div className="my-5 h-px bg-line" />

      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2.5 text-[12.5px] text-faint">
          <IconInfo size={15} className="shrink-0" />
          <span className="font-semibold text-steel group-open:text-ink">
            Cuentas de demostración
          </span>
        </summary>
        <div className="mt-2.5 overflow-hidden rounded-[9px] border border-line-soft">
          {DEMO.map((cuenta) => (
            <div
              key={cuenta.correo}
              className="flex flex-wrap items-center justify-between gap-1 border-b border-line-soft px-3 py-2 text-[12.5px] last:border-b-0"
            >
              <span className="font-medium text-ink">{cuenta.correo}</span>
              <span className="text-faint">
                {cuenta.clave} · {cuenta.quien}
              </span>
            </div>
          ))}
        </div>
      </details>

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
  );
}
