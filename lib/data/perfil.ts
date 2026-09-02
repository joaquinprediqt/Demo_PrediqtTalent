/** Perfil de la pantalla 5.3, con los textos literales del canvas. */

export interface Habilidad {
  readonly nombre: string;
  /** Del catalogo controlado por el Administrador. */
  readonly delCatalogo: boolean;
}

export interface EntradaEducacion {
  readonly institucion: string;
  readonly programa: string;
  readonly detalle: string;
  readonly periodo: string;
}

export interface EntradaExperiencia {
  readonly titulo: string;
  readonly periodo: string;
  readonly detalle: string;
  readonly etiquetas: readonly string[];
  readonly pendiente?: string;
  readonly actual: boolean;
}

export interface Certificacion {
  readonly titulo: string;
  readonly emisor: string;
  readonly detalle: string;
  readonly insignia: "verificada" | "learning";
}

export interface Documento {
  readonly nombre: string;
  readonly detalle: string;
  readonly insignia: string;
}

export const PERFIL_COMPLETO = 82;

export const FALTA_PERFIL =
  "Falta: certificado de Azure en PDF y descripción de un proyecto.";

export const HABILIDADES: readonly Habilidad[] = [
  { nombre: "SQL", delCatalogo: true },
  { nombre: "Power BI", delCatalogo: true },
  { nombre: "Python", delCatalogo: true },
  { nombre: "Qlik Sense", delCatalogo: true },
  { nombre: "DAX", delCatalogo: true },
  { nombre: "Azure", delCatalogo: true },
  { nombre: "Excel avanzado", delCatalogo: false },
  { nombre: "Inglés B2", delCatalogo: false },
];

export const DOCUMENTOS: readonly Documento[] = [
  {
    nombre: "CV_MFCastillo_2026.pdf",
    detalle: "Actualizado 12 ago 2026 · 480 KB",
    insignia: "CV",
  },
  {
    nombre: "PL-300_Certificado.pdf",
    detalle: "Subido 04 mar 2023 · verificado",
    insignia: "✓",
  },
];

export const EDUCACION: readonly EntradaEducacion[] = [
  {
    institucion: "Universidad de Lima",
    programa: "Ingeniería de Sistemas",
    detalle: "Enfoque en bases de datos y analítica.",
    periodo: "marzo 2016 – diciembre 2020",
  },
  {
    institucion: "Pontificia Universidad Católica del Perú",
    programa: "Diplomado en Analítica de Datos",
    detalle: "Modelado dimensional y visualización para negocio.",
    periodo: "marzo 2021 – julio 2022",
  },
];

export const EXPERIENCIA: readonly EntradaExperiencia[] = [
  {
    titulo: "Analista BI — Prediqt",
    periodo: "enero 2021 – actualidad",
    detalle:
      "Desarrollo de tableros y modelos de datos para clientes del sector bancario.",
    etiquetas: ["Power BI", "SQL", "DAX"],
    actual: true,
  },
  {
    titulo: "Proyecto: Gobierno de datos — Banca Retail",
    periodo: "mayo 2023 – febrero 2024",
    detalle:
      "Diccionario de datos y catálogo de indicadores para el área de riesgos; capacitación a usuarios de negocio.",
    etiquetas: ["Qlik Sense"],
    pendiente: "Descripción por completar",
    actual: false,
  },
];

export const CERTIFICACIONES: readonly Certificacion[] = [
  {
    titulo: "Microsoft Certified: Power BI Data Analyst Associate",
    emisor: "Microsoft · 2023",
    detalle: "Certificación oficial en modelado y visualización de datos.",
    insignia: "verificada",
  },
  {
    titulo: "Curso introductorio sobre Gobierno de Datos",
    emisor: "Prediqt Academy · 2025",
    detalle: "Fundamentos de gobierno y calidad de datos; completado con 100% de avance.",
    insignia: "learning",
  },
];
