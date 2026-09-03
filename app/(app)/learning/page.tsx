import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IconArrowRight, IconInfo, IconLearning } from "@/components/ui/icons";
import { sesionActual } from "@/lib/auth/sesion";
import { ACADEMY_BASE, urlCurso } from "@/lib/learning/academy";
import { cursosDe, resumenLearning } from "@/lib/db/consultas";

/** Prediqt Learning: catálogo real de Prediqt Academy con el avance interno. */
export default async function LearningPage() {
  const sesion = await sesionActual();
  if (!sesion) redirect("/login");

  const cursos = cursosDe(sesion.id);
  const resumen = resumenLearning(sesion.id);
  const misCursos = cursos.filter((c) => c.avance !== null);
  const disponibles = cursos.filter((c) => c.avance === null);

  return (
    <div className="mx-auto flex w-full max-w-screenframe flex-col gap-5 px-4 py-6 sm:px-5 lg:px-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-bold tracking-[-0.6px] text-ink sm:text-display-sm">
            Prediqt Learning
          </h1>
          <p className="mt-0.5 text-[15px] text-muted">
            Cursos de Prediqt Academy y tu avance. Los certificados que obtengas se reflejan en tu
            perfil de talento.
          </p>
        </div>
        <a
          href={ACADEMY_BASE}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-[8px] bg-navy px-[18px] py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#12564F]"
        >
          Abrir Prediqt Academy
          <IconArrowRight size={15} />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {[
          { etiqueta: "Cursos inscritos", valor: resumen.inscritos },
          { etiqueta: "En progreso", valor: resumen.enProgreso },
          { etiqueta: "Completados", valor: resumen.completados },
          { etiqueta: "Avance promedio", valor: `${resumen.promedio}%` },
        ].map((dato) => (
          <div
            key={dato.etiqueta}
            className="rounded-card border border-line bg-surface px-4 py-3.5"
          >
            <p className="text-[12px] font-medium text-muted">{dato.etiqueta}</p>
            <p className="mt-1 text-[26px] font-bold leading-tight text-ink">{dato.valor}</p>
          </div>
        ))}
      </div>

      {misCursos.length > 0 && (
        <Card padding="lg">
          <h2 className="text-[17px] font-bold text-ink">Mis cursos</h2>
          <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            {misCursos.map((curso) => {
              const avance = curso.avance ?? 0;
              return (
                <article
                  key={curso.id}
                  className="flex flex-col rounded-[10px] border border-line-soft px-[18px] py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[15.5px] font-semibold leading-[1.3] text-ink">
                      {curso.titulo}
                    </h3>
                    {avance >= 100 && (
                      <span className="shrink-0 rounded-[5px] bg-accent-soft px-[7px] py-[3px] text-[11.5px] font-semibold text-accent-strong">
                        Completado
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[13.5px] leading-[1.5] text-muted">
                    {curso.descripcion}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <ProgressBar valor={avance} tono={avance >= 100 ? "accent" : "steel"} />
                    <span className="shrink-0 text-[13px] font-bold text-ink">{avance}%</span>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {curso.etiquetas
                        .split(",")
                        .filter(Boolean)
                        .map((e) => (
                          <Chip key={e} tono="outline" className="text-[12px]">
                            {e}
                          </Chip>
                        ))}
                    </div>
                    <a
                      href={urlCurso(curso.moodle_id)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[13px] font-semibold text-accent hover:opacity-80"
                    >
                      Ir al curso →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </Card>
      )}

      <Card padding="lg">
        <h2 className="text-[17px] font-bold text-ink">Catálogo de Prediqt Academy</h2>
        <p className="mt-1 text-[13px] text-faint">
          {disponibles.length} cursos disponibles en {ACADEMY_BASE.replace("https://", "")}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {disponibles.map((curso) => (
            <a
              key={curso.id}
              href={urlCurso(curso.moodle_id)}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col rounded-[10px] border border-line-soft px-[18px] py-4 transition-colors hover:border-accent"
            >
              <span className="grid h-9 w-9 place-items-center rounded-[9px] bg-accent-soft text-accent">
                <IconLearning size={18} />
              </span>
              <h3 className="mt-3 text-[15px] font-semibold leading-[1.3] text-ink">
                {curso.titulo}
              </h3>
              <p className="mt-2 text-[13.5px] leading-[1.5] text-muted">{curso.descripcion}</p>
              <span className="mt-auto pt-3 text-[13px] font-semibold text-accent">
                Inscribirme en Academy →
              </span>
            </a>
          ))}
        </div>
      </Card>

      <div className="flex items-start gap-2.5 rounded-card border border-line bg-surface px-4 py-3.5">
        <IconInfo size={16} className="mt-0.5 shrink-0 text-faint" />
        <p className="text-[13px] leading-[1.55] text-muted">
          El catálogo y los enlaces apuntan a los cursos reales de Prediqt Academy. El avance que
          ves aquí es el registrado en esta demo. Para leerlo directamente de Moodle hace falta
          habilitar sus Web Services y generar un token de servicio; con eso la sincronización sería
          automática y en ambos sentidos.
        </p>
      </div>
    </div>
  );
}
