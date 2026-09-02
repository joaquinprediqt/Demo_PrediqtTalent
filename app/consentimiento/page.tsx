"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IconCheck, IconShield } from "@/components/ui/icons";
import { useSesion } from "@/lib/session/SesionProvider";
import { cn } from "@/lib/utils/cn";

const FILAS = [
  {
    concepto: "Datos de perfil",
    detalle:
      "Educación, experiencia, proyectos y habilidades técnicas, para la búsqueda interna de talento.",
  },
  {
    concepto: "CV en PDF",
    detalle:
      "Para que Reclutadores de Prediqt puedan revisar tu trayectoria al armar un equipo.",
  },
  {
    concepto: "Certificados",
    detalle: "Para verificar tus certificaciones y reflejarlas en el catálogo de habilidades.",
  },
  {
    concepto: "Quién puede verlo",
    detalle:
      "Solo personal de Prediqt con rol Reclutador o Administrador. Cada consulta queda auditada.",
  },
] as const;

export default function ConsentimientoPage() {
  const { usuario, cargando, aceptarConsentimiento } = useSesion();
  const [autorizado, setAutorizado] = useState(true);
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

  function continuar() {
    aceptarConsentimiento();
    router.push("/perfil");
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="h-[60px] shrink-0 bg-grad-header">
        <div className="mx-auto flex h-full max-w-screenframe items-center px-6 lg:px-10">
          <span className="flex items-center gap-[10px]">
            <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-accent text-[13px] font-bold text-white">
              P
            </span>
            <span className="text-[16px] font-bold text-white">Prediqt Talent</span>
          </span>
        </div>
      </header>

      <main className="grid flex-1 place-items-center px-6 py-10">
        <div className="w-full max-w-[720px] rounded-card-lg border border-line bg-surface px-6 py-8 shadow-card sm:px-[44px] sm:py-10">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent">
              <IconShield size={20} />
            </span>
            <div>
              <h1 className="text-[24px] font-bold tracking-[-0.4px] text-ink">
                Antes de continuar, {usuario.nombreCorto}
              </h1>
              <p className="text-[14px] text-muted">Sesión iniciada como {usuario.cuenta}</p>
            </div>
          </div>

          <p className="mt-6 text-body-lg text-ink-2">
            Prediqt Talent guarda información de tu perfil profesional para que puedas ser
            considerada en proyectos internos. Necesitamos tu consentimiento explícito antes de
            crear tu perfil.
          </p>

          <div className="mt-6 overflow-hidden rounded-[10px] border border-line">
            <p className="bg-surface-raised px-[18px] py-3 text-label text-muted">
              QUÉ SE GUARDA Y PARA QUÉ
            </p>
            {FILAS.map((fila) => (
              <div
                key={fila.concepto}
                className="grid grid-cols-1 gap-2 border-t border-line px-[18px] py-4 sm:grid-cols-[180px_1fr] sm:gap-4"
              >
                <span className="text-[14.5px] font-semibold text-ink">{fila.concepto}</span>
                <span className="text-[14.5px] leading-[1.5] text-muted">{fila.detalle}</span>
              </div>
            ))}
          </div>

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
            <div className="flex gap-2.5">
              <Button
                variante="sutil"
                tamano="md"
                className="px-[18px] py-[11px] text-[14.5px]"
                onClick={() => router.push("/seleccionar-modulo")}
              >
                Prefiero no ahora
              </Button>
              <Button
                variante="navy"
                tamano="md"
                className="px-[26px] py-[11px] text-[14.5px]"
                disabled={!autorizado}
                onClick={continuar}
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
