/**
 * Prediqt Academy corre sobre Moodle en academy.prediqt.ec.
 * Estos son los cursos publicados y sus identificadores reales, tomados
 * del catálogo público del sitio.
 *
 * El avance por persona todavía no se puede leer: haría falta habilitar
 * los Web Services de Moodle y un token de servicio. Mientras tanto las
 * inscripciones viven en la tabla "inscripciones" de esta demo.
 */

export const ACADEMY_BASE = "https://academy.prediqt.ec";

export function urlCurso(moodleId: number): string {
  return `${ACADEMY_BASE}/course/view.php?id=${moodleId}`;
}

/** moodle_id, titulo, descripcion, etiquetas separadas por coma. */
export const CURSOS_ACADEMY: readonly [number, string, string, string][] = [
  [
    13,
    "BigQuery para Analistas de Datos",
    "Consulta, transformación, ingesta y visualización de datos; incluye automatización con SQL y asistencia de IA.",
    "BigQuery,SQL",
  ],
  [
    4,
    "Curso introductorio sobre Gobierno de Datos",
    "Fundamentos de gobierno y calidad de datos, basado en el canal Fundamentos de los Datos.",
    "Gobierno de datos",
  ],
  [
    12,
    "Planificación y Gestión de Proyectos: PMBOK y Agile Scrum",
    "Marco de gestión de proyectos combinando PMBOK y Agile Scrum.",
    "Gestión de proyectos",
  ],
  [
    9,
    "Principio de la Pirámide de Minto: Comunicación Estratégica",
    "Estructurar ideas con claridad e impacto, el marco que usa McKinsey.",
    "Comunicación",
  ],
  [
    10,
    "The Craft of Building Stories with Data",
    "Narrativas memorables combinando storytelling e investigación con datos.",
    "Comunicación,Datos",
  ],
  [
    8,
    "Generative AI for Everyone",
    "Qué es la IA generativa, cómo funciona y sus aplicaciones prácticas.",
    "IA",
  ],
  [
    11,
    "Introduction to Claude Cowork",
    "Curso interno: configuración, uso diario, personalización y buenas prácticas de seguridad.",
    "IA,Interno",
  ],
  [
    5,
    "Claude Code 101",
    "Herramienta de programación agéntica para terminal, trabajando directamente sobre los archivos de código.",
    "IA,Programación",
  ],
];

/** Inscripciones de muestra: correo, moodle_id, avance. */
export const INSCRIPCIONES: readonly [string, number, number][] = [
  ["mcastillo@prediqtdata.com", 4, 100],
  ["mcastillo@prediqtdata.com", 13, 64],
  ["mcastillo@prediqtdata.com", 8, 30],
  ["amendoza@prediqtdata.com", 13, 100],
  ["amendoza@prediqtdata.com", 5, 45],
  ["vquispe@prediqtdata.com", 4, 80],
  ["asalazar@prediqtdata.com", 8, 55],
  ["jcerna@prediqtdata.com", 9, 100],
  ["jcerna@prediqtdata.com", 10, 20],
  ["radmin@prediqtdata.com", 12, 100],
  ["dparedes@prediqtdata.com", 13, 70],
];
