import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { ModuleCard } from "@/components/landing/ModuleCard";
import { AssistantPreview } from "@/components/landing/AssistantPreview";
import { ButtonLink } from "@/components/ui/Button";
import { IconLearning, IconTalent } from "@/components/ui/icons";

const cifras = [
  { valor: "[dato pendiente]", detalle: "colaboradores con perfil activo" },
  { valor: "4", detalle: "sedes: Lima · Quito · Guayaquil · Lausana" },
  { valor: "20+", detalle: "años de trayectoria en LatAm" },
] as const;

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <PublicHeader />

      <main className="flex-1">
        <div className="mx-auto grid max-w-screenframe grid-cols-1 lg:grid-cols-2">
          <section className="px-6 pb-12 pt-10 lg:pl-10 lg:pr-14">
            <p className="text-eyebrow text-accent">PLATAFORMA INTERNA DE PERSONAS</p>

            <h1 className="mt-4 text-[2.25rem] font-bold leading-[1.03] tracking-[-1.2px] text-ink lg:text-display-xl">
              Todo el conocimiento y todo el talento de Prediqt, en un mismo lugar.
            </h1>

            <p className="mt-5 max-w-[520px] text-body-xl text-muted">
              Una sola entrada con tu cuenta de Office 365. Sin registros nuevos, sin contraseñas
              adicionales.
            </p>

            <div className="mt-6 flex flex-wrap gap-[10px]">
              <ButtonLink href="/login" variante="accent" tamano="lg">
                Entrar a Learning
              </ButtonLink>
              <ButtonLink href="/login" variante="outline" tamano="lg">
                Entrar a Talent
              </ButtonLink>
            </div>

            <div className="mt-6 flex max-w-[520px] flex-col gap-[14px]">
              <ModuleCard
                tono="accent"
                icono={<IconLearning />}
                titulo="Prediqt Learning"
                descripcion="La formación interna de Prediqt Academy, ahora con tu avance y tus certificados dentro de tu perfil."
              />
              <ModuleCard
                tono="steel"
                icono={<IconTalent />}
                titulo="Prediqt Talent"
                descripcion="El banco de talento interno: perfiles profesionales, búsqueda por habilidad y asistente de selección con IA."
              />
            </div>

            <dl className="mt-6 flex max-w-[520px] flex-wrap items-center gap-x-[26px] gap-y-4 border-t border-line pt-4">
              {cifras.map((cifra, indice) => (
                <div key={cifra.detalle} className="flex items-center gap-[26px]">
                  {indice > 0 && (
                    <span className="hidden h-[38px] w-px bg-line sm:block" aria-hidden="true" />
                  )}
                  <div>
                    <dt className="sr-only">{cifra.detalle}</dt>
                    <dd className="text-[26px] font-bold leading-tight text-ink">{cifra.valor}</dd>
                    <p className="text-[12.5px] text-muted">{cifra.detalle}</p>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <AssistantPreview />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
