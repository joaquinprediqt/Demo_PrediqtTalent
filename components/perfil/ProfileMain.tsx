import { Card, CardHeader } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { IconPlus } from "@/components/ui/icons";
import { CERTIFICACIONES, EDUCACION, EXPERIENCIA } from "@/lib/data/perfil";
import { cn } from "@/lib/utils/cn";

function AccionAgregarEntrada() {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center gap-[5px] text-[12.5px] font-semibold text-accent transition-opacity hover:opacity-80"
    >
      <IconPlus size={13} />
      Agregar entrada
    </button>
  );
}

/** Columna derecha de la pantalla 5.3: educación, experiencia y certificaciones. */
export function ProfileMain() {
  return (
    <div className="flex flex-col gap-4">
      <Card padding="lg">
        <CardHeader titulo="Educación" accion={<AccionAgregarEntrada />} />
        <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          {EDUCACION.map((entrada) => (
            <article
              key={entrada.institucion}
              className="rounded-[10px] border border-line-soft px-[18px] py-4"
            >
              <h3 className="text-[15.5px] font-semibold text-ink">{entrada.institucion}</h3>
              <p className="mt-0.5 text-[13.5px] font-medium text-steel">{entrada.programa}</p>
              <p className="mt-2 text-[13.5px] leading-[1.5] text-muted">{entrada.detalle}</p>
              <p className="mt-2.5 text-[12.5px] text-faint">{entrada.periodo}</p>
            </article>
          ))}
        </div>
      </Card>

      <Card padding="lg">
        <CardHeader titulo="Experiencia y proyectos" accion={<AccionAgregarEntrada />} />
        <div className="mt-3.5">
          {EXPERIENCIA.map((entrada, indice) => {
            const ultima = indice === EXPERIENCIA.length - 1;
            return (
              <div
                key={entrada.titulo}
                className={cn(
                  "grid grid-cols-[14px_1fr] gap-4",
                  ultima ? "pt-4" : "border-b border-line-soft pb-4",
                )}
              >
                <div className="flex flex-col items-center pt-1.5">
                  <span
                    className={cn(
                      "h-[9px] w-[9px] rounded-full",
                      entrada.actual ? "bg-accent" : "bg-line-strong",
                    )}
                  />
                  {!ultima && <span className="mt-1.5 w-px flex-1 bg-line" />}
                </div>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-[15.5px] font-semibold text-ink">{entrada.titulo}</h3>
                    <span className="text-[12.5px] font-medium text-faint">{entrada.periodo}</span>
                  </div>
                  <p className="mt-1.5 text-[13.5px] leading-[1.55] text-muted">{entrada.detalle}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {entrada.etiquetas.map((etiqueta) => (
                      <Chip key={etiqueta} tono="accent" className="text-[12px]">
                        {etiqueta}
                      </Chip>
                    ))}
                    {entrada.pendiente && (
                      <Chip tono="outline" className="text-[12px]">
                        {entrada.pendiente}
                      </Chip>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card padding="lg" className="flex-1">
        <CardHeader
          titulo="Certificaciones y formación complementaria"
          accion={<AccionAgregarEntrada />}
        />
        <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          {CERTIFICACIONES.map((certificacion) => (
            <article
              key={certificacion.titulo}
              className="rounded-[10px] border border-line-soft px-[18px] py-4"
            >
              <div className="flex items-start justify-between gap-2.5">
                <h3 className="text-[15px] font-semibold leading-[1.3] text-ink">
                  {certificacion.titulo}
                </h3>
                {certificacion.insignia === "verificada" ? (
                  <span className="shrink-0 rounded-[5px] bg-accent-soft px-[7px] py-[3px] text-[11.5px] font-semibold text-accent-strong">
                    Verificada
                  </span>
                ) : (
                  <span className="shrink-0 rounded-[5px] border border-line-input px-[7px] py-[3px] text-[11.5px] font-semibold text-steel">
                    Learning
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13.5px] font-medium text-steel">{certificacion.emisor}</p>
              <p className="mt-2 text-[13.5px] leading-[1.5] text-muted">{certificacion.detalle}</p>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
