interface Candidato {
  readonly nombre: string;
  readonly afinidad: number;
  readonly tono: "accent" | "steel";
}

const candidatos: readonly Candidato[] = [
  { nombre: "Álvaro Mendoza León", afinidad: 88, tono: "accent" },
  { nombre: "Valeria Quispe Rojas", afinidad: 68, tono: "steel" },
];

/** Panel navy con la vista previa del Asistente (columna derecha de 5.1). */
export function AssistantPreview() {
  return (
    <div className="relative flex h-full flex-col justify-center gap-[22px] overflow-hidden bg-grad-hero px-6 py-14 lg:px-10 lg:py-14">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-gridcell" aria-hidden="true" />

      <div className="relative rounded-card-lg border border-white/[0.16] bg-white/[0.06] px-7 py-[26px] backdrop-blur-[2px]">
        <p className="text-[10.5px] font-semibold tracking-[0.2em] text-accent-light">
          ASISTENTE DE SELECCIÓN · VISTA PREVIA
        </p>
        <p className="mt-3 text-[20px] font-semibold leading-[1.35] text-white">
          &ldquo;Necesito un ingeniero de datos con GCP y BigQuery para un proyecto de 3
          meses&rdquo;
        </p>

        <ul className="mt-5 flex flex-col gap-[10px]">
          {candidatos.map((candidato) => (
            <li
              key={candidato.nombre}
              className={`rounded-[10px] bg-white px-4 py-[14px] ${
                candidato.tono === "steel" ? "opacity-[0.82]" : ""
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] font-semibold text-navy">{candidato.nombre}</span>
                <span
                  className={`text-[15px] font-bold ${
                    candidato.tono === "accent" ? "text-accent" : "text-steel"
                  }`}
                >
                  {candidato.afinidad}%
                </span>
              </div>
              <div className="mt-[9px] h-[5px] overflow-hidden rounded-[3px] bg-[#EAEFF5]">
                <div
                  className={`h-full ${
                    candidato.tono === "accent" ? "bg-accent" : "bg-steel"
                  }`}
                  style={{ width: `${candidato.afinidad}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative max-w-[460px] text-[13.5px] leading-[1.6] text-white/[0.72]">
        El asistente solo consulta perfiles internos de Prediqt. Cada consulta queda registrada
        en la auditoría de accesos.
      </p>
    </div>
  );
}
