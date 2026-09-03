"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck } from "@/components/ui/icons";
import { accionAceptarConsentimiento } from "./acciones";
import { cn } from "@/lib/utils/cn";

export function ConsentForm() {
  const [autorizado, setAutorizado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();

  return (
    <>
      <label className="mt-[22px] flex cursor-pointer items-start gap-3 rounded-[10px] border border-line bg-bg px-[18px] py-4">
        <input
          type="checkbox"
          checked={autorizado}
          onChange={(e) => setAutorizado(e.target.checked)}
          className="sr-only"
        />
        <span
          className={cn(
            "mt-0.5 grid h-[19px] w-[19px] shrink-0 place-items-center rounded-[5px] border",
            autorizado ? "border-accent bg-accent text-white" : "border-line-strong bg-surface",
          )}
          aria-hidden="true"
        >
          {autorizado && <IconCheck size={13} />}
        </span>
        <span className="text-[14.5px] leading-[1.5] text-ink-2">
          Autorizo a Prediqt a tratar mis datos personales y documentos para fines de gestión
          interna de talento y formación, conforme a la{" "}
          <span className="font-semibold text-accent">
            Ley de Protección de Datos Personales del Perú (Ley N.° 29733)
          </span>
          . Puedo revocar esta autorización desde Preferencias.
        </span>
      </label>

      <div className="mt-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-[13.5px] text-faint">
          Sin este consentimiento no se crea tu perfil de talento.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => router.push("/seleccionar-modulo")}
            className="rounded-[8px] border border-line-input px-[18px] py-[11px] text-[14.5px] font-semibold text-muted transition-colors hover:text-ink"
          >
            Prefiero no ahora
          </button>
          <form
            action={accionAceptarConsentimiento}
            onSubmit={() => setEnviando(true)}
          >
            <button
              type="submit"
              disabled={!autorizado || enviando}
              className="rounded-[8px] bg-navy px-[26px] py-[11px] text-[14.5px] font-semibold text-white transition-colors hover:bg-[#12564F] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {enviando ? "Guardando…" : "Continuar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
