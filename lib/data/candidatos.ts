import type { Sede } from "@/types";

/** Perfiles de las pantallas 5.4 (busqueda) y 5.5 (asistente). */

export interface Candidato {
  readonly id: string;
  readonly nombre: string;
  readonly iniciales: string;
  readonly cargo: string;
  readonly sede: Sede;
  readonly area: string;
  readonly resumen: string;
  readonly habilidades: readonly string[];
  /** Etiquetas de carencia que el canvas pinta con borde en vez de relleno. */
  readonly carencias: readonly string[];
  readonly completitud: number;
}

export const CANDIDATOS: readonly Candidato[] = [
  {
    id: "amendoza",
    nombre: "Álvaro Mendoza León",
    iniciales: "AM",
    cargo: "Ingeniero de Datos Senior",
    sede: "Lima",
    area: "Data Engineering",
    resumen:
      "Modelado analítico sobre BigQuery y orquestación con dbt. Disponibilidad inmediata.",
    habilidades: ["BigQuery", "SQL", "dbt", "Python"],
    carencias: [],
    completitud: 96,
  },
  {
    id: "vquispe",
    nombre: "Valeria Quispe Rojas",
    iniciales: "VQ",
    cargo: "Ingeniera de Datos",
    sede: "Lima",
    area: "Data Engineering",
    resumen: "Pipelines ETL y orquestación con Airflow; stack cloud enfocado en Azure.",
    habilidades: ["Data Engineering", "Python", "Airflow"],
    carencias: ["falta: BigQuery"],
    completitud: 88,
  },
  {
    id: "asalazar",
    nombre: "Andrea Salazar Ríos",
    iniciales: "AS",
    cargo: "Científica de Datos",
    sede: "Lima",
    area: "Data Science",
    resumen: "Experiencia directa en GCP orientada a machine learning y Vertex AI.",
    habilidades: ["GCP", "Python", "Vertex AI"],
    carencias: ["falta: dbt"],
    completitud: 74,
  },
  {
    id: "mcastillo",
    nombre: "María Fernanda Castillo Ríos",
    iniciales: "MC",
    cargo: "Analista de Datos Senior",
    sede: "Lima",
    area: "Data & Analytics",
    resumen: "Tableros y modelos de datos para banca; certificación PL-300 verificada.",
    habilidades: ["Power BI", "SQL", "DAX"],
    carencias: ["falta: BigQuery"],
    completitud: 82,
  },
  {
    id: "dparedes",
    nombre: "Diego Paredes Coronel",
    iniciales: "DP",
    cargo: "Arquitecto de Datos",
    sede: "Quito",
    area: "Data Engineering",
    resumen: "Diseño de plataformas de datos multi-cloud; liderazgo técnico de squads.",
    habilidades: ["BigQuery", "Terraform", "SQL"],
    carencias: ["otra sede"],
    completitud: 91,
  },
];

/** Resultado del asistente para el requerimiento de ejemplo (5.5). */
export interface Coincidencia {
  readonly id: string;
  readonly nombre: string;
  readonly afinidad: number;
  readonly tono: "accent" | "steel";
  readonly justificacion: string;
  readonly habilidades: readonly string[];
  readonly carencias: readonly string[];
  readonly destacado: boolean;
}

export const REQUERIMIENTO_EJEMPLO =
  "Necesito un ingeniero de datos con GCP y BigQuery para un proyecto de 3 meses";

export const SUGERENCIAS: readonly string[] = [
  "Necesito un ingeniero de datos con GCP y BigQuery para un proyecto de 3 meses",
  "Busco alguien senior en Python y machine learning para un piloto",
  "¿Quién puede liderar una migración a la nube en Quito?",
];

export const SINTESIS_ASISTENTE =
  "Se identificaron 3 candidatos con perfiles afines para el requerimiento de Data Engineer con GCP y BigQuery. El candidato más adecuado y con disponibilidad inmediata es Álvaro Mendoza León, gracias a su sólida experiencia en modelado sobre BigQuery y pertenencia al área de Data Engineering. Como alternativas complementarias se encuentran Valeria Quispe Rojas (con amplia experiencia en ingeniería de datos pero en stack Azure) y Andrea Salazar Ríos (con experiencia directa en GCP pero orientada a ML).";

export const COINCIDENCIAS: readonly Coincidencia[] = [
  {
    id: "amendoza",
    nombre: "Álvaro Mendoza León",
    afinidad: 88,
    tono: "accent",
    justificacion:
      "Perfil senior del área de Data Engineering con dominio directo de BigQuery (4/5), modelado analítico avanzado y disponibilidad inmediata para iniciar el proyecto de 3 meses.",
    habilidades: ["BigQuery", "SQL", "dbt", "Python"],
    carencias: ["falta: GCP fuera de data warehousing"],
    destacado: true,
  },
  {
    id: "vquispe",
    nombre: "Valeria Quispe Rojas",
    afinidad: 68,
    tono: "steel",
    justificacion:
      "Ingeniera de datos senior con disponibilidad inmediata y amplia experiencia en pipelines ETL y orquestación, aunque su background cloud está enfocado en Azure.",
    habilidades: ["Data Engineering", "Python", "Airflow", "Apache Spark"],
    carencias: ["falta: GCP", "falta: BigQuery"],
    destacado: false,
  },
  {
    id: "asalazar",
    nombre: "Andrea Salazar Ríos",
    afinidad: 61,
    tono: "steel",
    justificacion:
      "Experiencia directa en GCP, pero orientada a machine learning y Vertex AI más que a modelado analítico y data warehousing.",
    habilidades: ["GCP", "Python", "Vertex AI"],
    carencias: ["falta: BigQuery avanzado", "falta: dbt"],
    destacado: false,
  },
];
