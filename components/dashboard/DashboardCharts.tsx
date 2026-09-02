import {
  CERTIFICACIONES_PROVEEDOR,
  DISTRIBUCION_SEDES,
  HABILIDADES_COMUNES,
  MESES_AVANCE,
  RUTA_AVANCE,
  RUTA_AVANCE_RELLENO,
  type Kpi,
} from "@/lib/data/metricas";

const marco = "rounded-[10px] border border-line bg-surface p-4";

export function KpiTile({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-[10px] border border-line bg-surface px-4 py-3.5">
      <p className="text-[12px] font-medium text-muted">{kpi.etiqueta}</p>
      <p className="mt-1 text-[32px] font-bold leading-[1.1] text-ink">{kpi.valor}</p>
      <p
        className={`mt-0.5 text-[12px] font-medium ${
          kpi.tono === "accent" ? "text-accent" : "text-faint"
        }`}
      >
        {kpi.nota}
      </p>
    </div>
  );
}

/** Barras verticales; la altura es relativa a la habilidad mas frecuente. */
export function SkillsBarChart() {
  const maximo = Math.max(...HABILIDADES_COMUNES.map((h) => h.personas));

  return (
    <div className={`${marco} flex min-h-0 flex-col`}>
      <h3 className="text-[14px] font-semibold text-ink">Habilidades más comunes</h3>
      <p className="text-[11.5px] text-faint">personas por habilidad del catálogo</p>

      {/* La columna tiene altura definida para que el % de cada barra resuelva. */}
      <div className="mt-3 flex h-[170px] items-end gap-4">
        {HABILIDADES_COMUNES.map((habilidad) => (
          <div
            key={habilidad.nombre}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span className="text-[12px] font-semibold text-ink">{habilidad.personas}</span>
            <div
              className="w-full rounded-t-[4px]"
              style={{
                backgroundColor: habilidad.color,
                height: `${(habilidad.personas / maximo) * 100}%`,
              }}
            />
            <span className="text-center text-[11.5px] leading-tight text-muted">
              {habilidad.nombre}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Dona con los mismos dasharray del canvas. */
export function SiteDonut() {
  return (
    <div className={`${marco} flex min-h-0 flex-col`}>
      <h3 className="text-[14px] font-semibold text-ink">Distribución de talento por sede</h3>
      <p className="text-[11.5px] text-faint">colaboradores con perfil activo</p>

      <div className="mt-2.5 flex flex-1 flex-wrap items-center gap-6">
        <svg viewBox="0 0 42 42" className="h-[150px] w-[150px] shrink-0" role="img">
          <title>Distribución por sede</title>
          {DISTRIBUCION_SEDES.map((porcion) => (
            <circle
              key={porcion.sede}
              cx="21"
              cy="21"
              r="15.9"
              fill="none"
              stroke={porcion.color}
              strokeWidth="9"
              strokeDasharray={porcion.dash}
              strokeDashoffset={porcion.offset}
            />
          ))}
        </svg>

        <ul className="flex min-w-[200px] flex-1 flex-col gap-2.5">
          {DISTRIBUCION_SEDES.map((porcion) => (
            <li key={porcion.sede} className="flex items-center gap-2.5">
              <span
                className="h-[9px] w-[9px] rounded-[2px]"
                style={{ backgroundColor: porcion.color }}
              />
              <span className="flex-1 text-[13.5px] font-medium text-ink-2">{porcion.sede}</span>
              <span className="text-[13.5px] font-semibold text-ink">{porcion.personas}</span>
              <span className="w-[38px] text-right text-[12.5px] text-faint">
                {porcion.porcentaje}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ProgressAreaChart() {
  return (
    <div className={`${marco} flex min-h-0 flex-col`}>
      <h3 className="text-[14px] font-semibold text-ink">Avance de perfiles completos</h3>
      <p className="text-[11.5px] text-faint">% promedio de completitud, últimos 6 meses</p>

      <div className="mt-2.5 min-h-[120px] flex-1">
        <svg
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
          className="h-full w-full"
          role="img"
        >
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
          <circle cx="390" cy="26" r="4" fill="#1F8A7A" />
        </svg>
      </div>

      <div className="mt-1.5 flex justify-between text-[11.5px] text-faint">
        {MESES_AVANCE.map((mes) => (
          <span key={mes}>{mes}</span>
        ))}
      </div>
    </div>
  );
}

export function ProviderBars() {
  return (
    <div className={`${marco} flex min-h-0 flex-col`}>
      <h3 className="text-[14px] font-semibold text-ink">
        Certificaciones verificadas por proveedor
      </h3>
      <p className="text-[11.5px] text-faint">documentos revisados por un Administrador</p>

      <ul className="mt-2 flex flex-1 flex-col justify-center gap-[11px]">
        {CERTIFICACIONES_PROVEEDOR.map((barra) => (
          <li key={barra.proveedor} className="flex items-center gap-3">
            <span className="w-[88px] shrink-0 text-[13px] font-medium text-ink-2">
              {barra.proveedor}
            </span>
            <span className="h-3 flex-1 overflow-hidden rounded-[3px] bg-track">
              <span
                className="block h-full"
                style={{ width: `${barra.ancho}%`, backgroundColor: barra.color }}
              />
            </span>
            <span className="w-6 text-right text-[13px] font-semibold text-ink">
              {barra.total}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
