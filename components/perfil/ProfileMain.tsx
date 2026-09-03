import { Card, CardHeader } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { AgregarEntrada, type Campo } from "@/components/perfil/AgregarEntrada";
import {
  accionAgregarCertificacion,
  accionAgregarEducacion,
  accionAgregarExperiencia,
} from "@/app/(app)/perfil/acciones";
import type {
  CertificacionFila,
  EducacionFila,
  ExperienciaFila,
} from "@/lib/db/consultas";
import { cn } from "@/lib/utils/cn";

interface Props {
  educacion: readonly EducacionFila[];
  experiencia: readonly ExperienciaFila[];
  certificaciones: readonly CertificacionFila[];
  /** Solo el dueño del perfil ve los formularios de alta. */
  editable: boolean;
}

const CAMPOS_EDUCACION: readonly Campo[] = [
  { nombre: "institucion", etiqueta: "Institución", requerido: true },
  { nombre: "programa", etiqueta: "Programa", requerido: true },
  { nombre: "periodo", etiqueta: "Periodo", ayuda: "marzo 2021 – julio 2022" },
  { nombre: "detalle", etiqueta: "Detalle", tipo: "area" },
];

const CAMPOS_EXPERIENCIA: readonly Campo[] = [
  { nombre: "titulo", etiqueta: "Puesto o proyecto", requerido: true },
  { nombre: "periodo", etiqueta: "Periodo", ayuda: "enero 2021 – actualidad" },
  { nombre: "etiquetas", etiqueta: "Tecnologías", ayuda: "Power BI, SQL, DAX" },
  { nombre: "actual", etiqueta: "Es mi puesto actual", tipo: "checkbox" },
  { nombre: "detalle", etiqueta: "Detalle", tipo: "area" },
];

const CAMPOS_CERTIFICACION: readonly Campo[] = [
  { nombre: "titulo", etiqueta: "Título", requerido: true },
  { nombre: "emisor", etiqueta: "Emisor", ayuda: "Microsoft · 2023" },
  {
    nombre: "insignia",
    etiqueta: "Origen",
    tipo: "select",
    opciones: [
      { valor: "verificada", etiqueta: "Verificada" },
      { valor: "learning", etiqueta: "Prediqt Learning" },
    ],
  },
  { nombre: "detalle", etiqueta: "Detalle", tipo: "area" },
];

function Vacio({ texto }: { texto: string }) {
  return <p className="mt-3 text-[13.5px] text-faint">{texto}</p>;
}

/** Columna derecha de la pantalla 5.3: educación, experiencia y certificaciones. */
export function ProfileMain({
  educacion,
  experiencia,
  certificaciones,
  editable,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Card padding="lg">
        <CardHeader
          titulo="Educación"
          accion={
            editable ? (
              <AgregarEntrada
                etiqueta="Agregar entrada"
                titulo="Nueva entrada de educación"
                accion={accionAgregarEducacion}
                campos={CAMPOS_EDUCACION}
              />
            ) : undefined
          }
        />
        {educacion.length === 0 ? (
          <Vacio texto="Sin entradas de educación todavía." />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            {educacion.map((entrada) => (
              <article
                key={entrada.id}
                className="rounded-[10px] border border-line-soft px-[18px] py-4"
              >
                <h3 className="text-[15.5px] font-semibold text-ink">{entrada.institucion}</h3>
                <p className="mt-0.5 text-[13.5px] font-medium text-steel">{entrada.programa}</p>
                {entrada.detalle && (
                  <p className="mt-2 text-[13.5px] leading-[1.5] text-muted">{entrada.detalle}</p>
                )}
                {entrada.periodo && (
                  <p className="mt-2.5 text-[12.5px] text-faint">{entrada.periodo}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </Card>

      <Card padding="lg">
        <CardHeader
          titulo="Experiencia y proyectos"
          accion={
            editable ? (
              <AgregarEntrada
                etiqueta="Agregar entrada"
                titulo="Nueva experiencia o proyecto"
                accion={accionAgregarExperiencia}
                campos={CAMPOS_EXPERIENCIA}
              />
            ) : undefined
          }
        />
        {experiencia.length === 0 ? (
          <Vacio texto="Sin experiencia registrada todavía." />
        ) : (
          <div className="mt-3.5">
            {experiencia.map((entrada, indice) => {
              const ultima = indice === experiencia.length - 1;
              const etiquetas = entrada.etiquetas
                .split(",")
                .map((e) => e.trim())
                .filter(Boolean);
              return (
                <div
                  key={entrada.id}
                  className={cn(
                    "grid grid-cols-[14px_1fr] gap-4",
                    ultima ? "pt-4" : "border-b border-line-soft pb-4",
                  )}
                >
                  <div className="flex flex-col items-center pt-1.5">
                    <span
                      className={cn(
                        "h-[9px] w-[9px] rounded-full",
                        entrada.actual === 1 ? "bg-accent" : "bg-line-strong",
                      )}
                    />
                    {!ultima && <span className="mt-1.5 w-px flex-1 bg-line" />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-[15.5px] font-semibold text-ink">{entrada.titulo}</h3>
                      <span className="text-[12.5px] font-medium text-faint">
                        {entrada.periodo}
                      </span>
                    </div>
                    {entrada.detalle && (
                      <p className="mt-1.5 text-[13.5px] leading-[1.55] text-muted">
                        {entrada.detalle}
                      </p>
                    )}
                    {etiquetas.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {etiquetas.map((etiqueta) => (
                          <Chip key={etiqueta} tono="accent" className="text-[12px]">
                            {etiqueta}
                          </Chip>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card padding="lg" className="flex-1">
        <CardHeader
          titulo="Certificaciones y formación complementaria"
          accion={
            editable ? (
              <AgregarEntrada
                etiqueta="Agregar entrada"
                titulo="Nueva certificación"
                accion={accionAgregarCertificacion}
                campos={CAMPOS_CERTIFICACION}
              />
            ) : undefined
          }
        />
        {certificaciones.length === 0 ? (
          <Vacio texto="Sin certificaciones registradas todavía." />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
            {certificaciones.map((certificacion) => (
              <article
                key={certificacion.id}
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
                {certificacion.emisor && (
                  <p className="mt-1 text-[13.5px] font-medium text-steel">
                    {certificacion.emisor}
                  </p>
                )}
                {certificacion.detalle && (
                  <p className="mt-2 text-[13.5px] leading-[1.5] text-muted">
                    {certificacion.detalle}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
