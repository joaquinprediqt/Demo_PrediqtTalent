import { redirect } from "next/navigation";
import { IconShield } from "@/components/ui/icons";
import { ConsentForm } from "./ConsentForm";
import { sesionActual } from "@/lib/auth/sesion";

const FILAS = [
  {
    concepto: "Datos de perfil",
    detalle:
      "Educación, experiencia, proyectos y habilidades técnicas, para la búsqueda interna de talento.",
  },
  {
    concepto: "CV en PDF",
    detalle: "Para que Reclutadores de Prediqt puedan revisar tu trayectoria al armar un equipo.",
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

/** Pantalla 5.2 — Consentimiento de datos en el primer inicio de sesión. */
export default async function ConsentimientoPage() {
  const usuario = await sesionActual();
  if (!usuario) redirect("/login");
  if (usuario.consentimiento) redirect("/perfil");

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="h-[60px] shrink-0 bg-grad-header">
        <div className="mx-auto flex h-full max-w-screenframe items-center px-4 sm:px-6 lg:px-10">
          <span className="flex items-center gap-[10px]">
            <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-accent text-[13px] font-bold text-white">
              P
            </span>
            <span className="text-[16px] font-bold text-white">Prediqt Talent</span>
          </span>
        </div>
      </header>

      <main className="grid flex-1 place-items-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[720px] rounded-card-lg border border-line bg-surface px-5 py-8 shadow-card sm:px-[44px] sm:py-10">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] bg-accent-soft text-accent">
              <IconShield size={20} />
            </span>
            <div>
              <h1 className="text-[21px] font-bold tracking-[-0.4px] text-ink sm:text-[24px]">
                Antes de continuar, {usuario.nombreCorto}
              </h1>
              <p className="text-[14px] text-muted">Sesión iniciada como {usuario.correo}</p>
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

          <ConsentForm />
        </div>
      </main>
    </div>
  );
}
