"use client";

import { useState, useTransition } from "react";
import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PALETA_BARRAS,
  PALETA_SEDES,
  RUTA_AVANCE,
  RUTA_AVANCE_RELLENO,
  SERIE_AVANCE,
  colorPorIndice,
} from "@/lib/data/metricas";
import type { MetricasTablero } from "@/lib/db/consultas";

const marco = "rounded-[10px] border border-line bg-surface p-4";

/** Etiqueta flotante compartida por los graficos. */
function Globo({
  children,
  posicion = "arriba",
}: {
  children: ReactNode;
  posicion?: "arriba" | "derecha";
}) {
  return (
    <span
      role="tooltip"
      className={`pointer-events-none absolute z-10 whitespace-nowrap rounded-[6px] bg-navy px-2 py-1 text-[11.5px] font-medium text-white shadow-card ${
        posicion === "arriba"
          ? "bottom-full left-1/2 mb-1.5 -translate-x-1/2"
          : "left-full top-1/2 ml-2 -translate-y-1/2"
      }`}
    >
      {children}
    </span>
  );
}

export function KpiTile({
  etiqueta,
  valor,
  nota,
  tono = "neutro",
}: {
  etiqueta: string;
  valor: string;
  nota: string;
  tono?: "accent" | "neutro";
}) {
  return (
    <div className="rounded-[10px] border border-line bg-surface px-4 py-3.5 transition-colors hover:border-accent-light">
      <p className="text-[12px] font-medium text-muted">{etiqueta}</p>
      <p className="mt-1 text-[28px] font-bold leading-[1.1] text-ink sm:text-[32px]">{valor}</p>
      <p
        className={`mt-0.5 text-[12px] font-medium ${
          tono === "accent" ? "text-accent" : "text-faint"
        }`}
      >
        {nota}
      </p>
    </div>
  );
}

function SinDatos({ texto }: { texto: string }) {
  return <p className="mt-3 flex-1 text-[13px] text-faint">{texto}</p>;
}

/* ------------------------------------------------------------------ */
/* Habilidades                                                         */
/* ------------------------------------------------------------------ */

/**
 * Barras verticales; la altura es relativa a la habilidad mas frecuente.
 * Cada barra lleva a la busqueda de talento con esa habilidad ya puesta.
 */
export function SkillsBarChart({
  habilidades,
}: {
  habilidades: MetricasTablero["habilidades"];
}) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [activa, setActiva] = useState<string | null>(null);
  const maximo = Math.max(1, ...habilidades.map((h) => h.personas));

  return (
    <div className={`${marco} flex min-h-0 flex-col`}>
      <h3 className="text-[14px] font-semibold text-ink">Habilidades más comunes</h3>
      <p className="text-[11.5px] text-faint">
        personas por habilidad · clic para ver quién la tiene
      </p>

      {habilidades.length === 0 ? (
        <SinDatos texto="Ningún perfil declara habilidades con este filtro." />
      ) : (
        /* Con siete barras y móviles de 320 px, se desliza en vez de aplastarse. */
        <div className="mt-3 overflow-x-auto">
          <div className="flex h-[170px] min-w-[340px] items-end gap-2 sm:min-w-0 sm:gap-4">
            {habilidades.map((habilidad, indice) => {
              const resaltada = activa === habilidad.nombre;
              const atenuada = activa !== null && !resaltada;
              return (
                <button
                  key={habilidad.nombre}
                  type="button"
                  disabled={pendiente}
                  onMouseEnter={() => setActiva(habilidad.nombre)}
                  onMouseLeave={() => setActiva(null)}
                  onFocus={() => setActiva(habilidad.nombre)}
                  onBlur={() => setActiva(null)}
                  onClick={() =>
                    iniciar(() =>
                      router.push(`/buscar-talento?q=${encodeURIComponent(habilidad.nombre)}`),
                    )
                  }
                  title={`Ver perfiles con ${habilidad.nombre}`}
                  className="group relative flex h-full flex-1 cursor-pointer flex-col items-center justify-end gap-1.5 rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {resaltada && (
                    <Globo>
                      {habilidad.personas} {habilidad.personas === 1 ? "persona" : "personas"} · ver
                      perfiles
                    </Globo>
                  )}

                  <span className="text-[12px] font-semibold text-ink">{habilidad.personas}</span>
                  <span
                    className="w-full rounded-t-[4px] transition-[opacity,filter] duration-150"
                    style={{
                      backgroundColor: colorPorIndice(PALETA_BARRAS, indice),
                      height: `${(habilidad.personas / maximo) * 100}%`,
                      opacity: atenuada ? 0.45 : 1,
                      filter: resaltada ? "brightness(1.08)" : undefined,
                    }}
                  />
                  <span
                    className={`text-center text-[11px] leading-tight transition-colors sm:text-[11.5px] ${
                      resaltada ? "font-semibold text-ink" : "text-muted"
                    }`}
                  >
                    {habilidad.nombre}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sedes                                                               */
/* ------------------------------------------------------------------ */

/**
 * Dona con el mismo radio del canvas: la circunferencia mide ~100.
 * Al hacer clic en una porcion se filtra el tablero por esa sede; si ya
 * estaba filtrado por ella, el clic quita el filtro.
 */
export function SiteDonut({ sedes }: { sedes: MetricasTablero["sedes"] }) {
  const router = useRouter();
  const parametros = useSearchParams();
  const [pendiente, iniciar] = useTransition();
  const [activa, setActiva] = useState<string | null>(null);

  const seleccionada = parametros.get("sede");

  function alternar(sede: string) {
    const siguientes = new URLSearchParams(parametros.toString());
    if (siguientes.get("sede") === sede) siguientes.delete("sede");
    else siguientes.set("sede", sede);

    const consulta = siguientes.toString();
    iniciar(() => router.push(consulta ? `/dashboard?${consulta}` : "/dashboard"));
  }

  // La porcion que se muestra en el centro: la del cursor, o la filtrada.
  const destacada = sedes.find((s) => s.sede === (activa ?? seleccionada));
  let acumulado = 0;

  return (
    <div className={`${marco} flex min-h-0 flex-col`}>
      <h3 className="text-[14px] font-semibold text-ink">Distribución de talento por sede</h3>
      <p className="text-[11.5px] text-faint">
        colaboradores con perfil activo · clic para filtrar el tablero
      </p>

      {sedes.length === 0 ? (
        <SinDatos texto="Sin colaboradores con este filtro." />
      ) : (
        <div className="mt-2.5 flex flex-1 flex-wrap items-center gap-6">
          <div className="relative shrink-0">
            <svg viewBox="0 0 42 42" className="h-[140px] w-[140px]" role="img">
              <title>Distribución por sede</title>
              {sedes.map((porcion, indice) => {
                const desplazamiento = 25 - acumulado;
                acumulado += porcion.porcentaje;
                const resaltada = (activa ?? seleccionada) === porcion.sede;
                const atenuada = (activa ?? seleccionada) !== null && !resaltada;
                return (
                  <circle
                    key={porcion.sede}
                    cx="21"
                    cy="21"
                    r="15.9"
                    fill="none"
                    stroke={colorPorIndice(PALETA_SEDES, indice)}
                    strokeWidth={resaltada ? 11 : 9}
                    strokeDasharray={`${porcion.porcentaje} ${100 - porcion.porcentaje}`}
                    strokeDashoffset={desplazamiento}
                    opacity={atenuada ? 0.4 : 1}
                    className="cursor-pointer transition-[stroke-width,opacity] duration-150"
                    onMouseEnter={() => setActiva(porcion.sede)}
                    onMouseLeave={() => setActiva(null)}
                    onClick={() => alternar(porcion.sede)}
                  />
                );
              })}
            </svg>

            {/* El centro de la dona muestra la porción señalada o filtrada. */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              {destacada ? (
                <>
                  <span className="text-[19px] font-bold leading-none text-ink">
                    {destacada.porcentaje}%
                  </span>
                  <span className="mt-0.5 max-w-[86px] text-center text-[10.5px] leading-tight text-muted">
                    {destacada.sede}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[19px] font-bold leading-none text-ink">
                    {sedes.reduce((suma, s) => suma + s.personas, 0)}
                  </span>
                  <span className="mt-0.5 text-[10.5px] text-muted">personas</span>
                </>
              )}
            </div>
          </div>

          <ul className="flex min-w-[160px] flex-1 flex-col gap-1">
            {sedes.map((porcion, indice) => {
              const resaltada = (activa ?? seleccionada) === porcion.sede;
              const esFiltro = seleccionada === porcion.sede;
              return (
                <li key={porcion.sede}>
                  <button
                    type="button"
                    disabled={pendiente}
                    onMouseEnter={() => setActiva(porcion.sede)}
                    onMouseLeave={() => setActiva(null)}
                    onFocus={() => setActiva(porcion.sede)}
                    onBlur={() => setActiva(null)}
                    onClick={() => alternar(porcion.sede)}
                    aria-pressed={esFiltro}
                    title={
                      esFiltro
                        ? `Quitar el filtro de ${porcion.sede}`
                        : `Filtrar el tablero por ${porcion.sede}`
                    }
                    className={`flex w-full items-center gap-2.5 rounded-[6px] px-1.5 py-1 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${
                      resaltada ? "bg-accent-soft" : "hover:bg-surface-raised"
                    }`}
                  >
                    <span
                      className="h-[9px] w-[9px] shrink-0 rounded-[2px]"
                      style={{ backgroundColor: colorPorIndice(PALETA_SEDES, indice) }}
                    />
                    <span
                      className={`flex-1 truncate text-[13.5px] ${
                        esFiltro ? "font-bold text-accent-strong" : "font-medium text-ink-2"
                      }`}
                    >
                      {porcion.sede}
                    </span>
                    <span className="text-[13.5px] font-semibold text-ink">
                      {porcion.personas}
                    </span>
                    <span className="w-[38px] text-right text-[12.5px] text-faint">
                      {porcion.porcentaje}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Avance de perfiles                                                  */
/* ------------------------------------------------------------------ */

export function ProgressAreaChart() {
  const [activo, setActivo] = useState<number | null>(null);
  const punto = activo === null ? null : SERIE_AVANCE[activo];

  return (
    <div className={`${marco} flex min-h-0 flex-col`}>
      <h3 className="text-[14px] font-semibold text-ink">Avance de perfiles completos</h3>
      <p className="text-[11.5px] text-faint">% promedio de completitud, últimos 6 meses</p>

      <div className="relative mt-2.5 min-h-[120px] flex-1">
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="h-full w-full" role="img">
          <title>Avance de perfiles completos</title>
          <line x1="0" y1="30" x2="400" y2="30" stroke="var(--border-soft)" strokeWidth="1" />
          <line x1="0" y1="60" x2="400" y2="60" stroke="var(--border-soft)" strokeWidth="1" />
          <line x1="0" y1="90" x2="400" y2="90" stroke="var(--border-soft)" strokeWidth="1" />
          <path d={RUTA_AVANCE_RELLENO} fill="#1F8A7A" opacity="0.08" />
          <path
            d={RUTA_AVANCE}
            fill="none"
            stroke="#1F8A7A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Guia vertical del mes señalado. */}
          {punto && (
            <line
              x1={punto.x}
              y1="0"
              x2={punto.x}
              y2="120"
              stroke="#1F8A7A"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.5"
            />
          )}

          {SERIE_AVANCE.map((p, indice) => (
            <circle
              key={p.mes}
              cx={p.x}
              cy={p.y}
              r={activo === indice ? 5.5 : 4}
              fill="#1F8A7A"
              className="transition-[r] duration-150"
              opacity={activo === null || activo === indice ? 1 : 0.4}
            />
          ))}
        </svg>

        {/* Zonas de deteccion en HTML: el SVG se estira y deforma los hitboxes. */}
        <div className="absolute inset-0 flex">
          {SERIE_AVANCE.map((p, indice) => (
            <div
              key={p.mes}
              className="relative flex-1"
              onMouseEnter={() => setActivo(indice)}
              onMouseLeave={() => setActivo(null)}
            >
              {activo === indice && (
                <span className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-[6px] bg-navy px-2 py-1 text-[11.5px] font-medium text-white shadow-card">
                  {p.mes} · {p.valor}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-1.5 flex justify-between text-[11.5px]">
        {SERIE_AVANCE.map((p, indice) => (
          <span
            key={p.mes}
            className={activo === indice ? "font-semibold text-accent" : "text-faint"}
          >
            {p.mes}
          </span>
        ))}
      </div>

      <p className="mt-2 text-[11.5px] text-faint">
        Serie histórica de referencia: aún no se guardan cortes mensuales.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Certificaciones por proveedor                                       */
/* ------------------------------------------------------------------ */

export function ProviderBars({
  proveedores,
}: {
  proveedores: MetricasTablero["proveedores"];
}) {
  const [activo, setActivo] = useState<string | null>(null);
  const maximo = Math.max(1, ...proveedores.map((p) => p.total));
  const total = proveedores.reduce((suma, p) => suma + p.total, 0);

  return (
    <div className={`${marco} flex min-h-0 flex-col`}>
      <h3 className="text-[14px] font-semibold text-ink">
        Certificaciones verificadas por proveedor
      </h3>
      <p className="text-[11.5px] text-faint">documentos revisados por un Administrador</p>

      {proveedores.length === 0 ? (
        <SinDatos texto="Sin certificaciones con este filtro." />
      ) : (
        <ul className="mt-2 flex flex-1 flex-col justify-center gap-[7px]">
          {proveedores.map((barra, indice) => {
            const resaltada = activo === barra.proveedor;
            const atenuada = activo !== null && !resaltada;
            const cuota = total === 0 ? 0 : Math.round((barra.total / total) * 100);
            return (
              <li
                key={barra.proveedor}
                onMouseEnter={() => setActivo(barra.proveedor)}
                onMouseLeave={() => setActivo(null)}
                className={`flex items-center gap-3 rounded-[6px] px-1.5 py-1 transition-colors ${
                  resaltada ? "bg-surface-raised" : ""
                }`}
              >
                <span
                  className={`w-[88px] shrink-0 text-[13px] transition-colors ${
                    resaltada ? "font-semibold text-ink" : "font-medium text-ink-2"
                  }`}
                >
                  {barra.proveedor}
                </span>
                <span className="h-3 flex-1 overflow-hidden rounded-[3px] bg-track">
                  <span
                    className="block h-full transition-[opacity,filter] duration-150"
                    style={{
                      width: `${(barra.total / maximo) * 100}%`,
                      backgroundColor: colorPorIndice(PALETA_BARRAS, indice),
                      opacity: atenuada ? 0.45 : 1,
                      filter: resaltada ? "brightness(1.08)" : undefined,
                    }}
                  />
                </span>
                <span className="w-[52px] text-right text-[13px] font-semibold text-ink">
                  {resaltada ? `${cuota}%` : barra.total}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
