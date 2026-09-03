import type { DatabaseSync } from "node:sqlite";
import { hashearContrasena } from "@/lib/auth/password";
import { CURSOS_ACADEMY, INSCRIPCIONES } from "@/lib/learning/academy";

/**
 * Contenido inicial, tomado del canvas de mockups y completado con perfiles
 * verosímiles para el resto de cuentas, de modo que el tablero y la búsqueda
 * tengan algo real que agregar.
 *
 * Solo se ejecuta si la tabla de usuarios está vacía, así que es seguro
 * llamarla en cada arranque.
 */

/** Contraseñas de demostración. Se documentan en el README. */
const CLAVES: Readonly<Record<string, string>> = {
  "mcastillo@prediqtdata.com": "Empleado2026",
  "jcerna@prediqtdata.com": "Reclutador2026",
  "radmin@prediqtdata.com": "Admin2026",
  "amendoza@prediqtdata.com": "Empleado2026",
  "vquispe@prediqtdata.com": "Empleado2026",
  "asalazar@prediqtdata.com": "Empleado2026",
  "dparedes@prediqtdata.com": "Reclutador2026",
  "cferreira@prediqtdata.com": "Empleado2026",
};

type Educacion = [institucion: string, programa: string, detalle: string, periodo: string];
type Experiencia = [
  titulo: string,
  periodo: string,
  detalle: string,
  etiquetas: string,
  actual: 0 | 1,
];
type Certificacion = [
  titulo: string,
  emisor: string,
  detalle: string,
  insignia: "verificada" | "learning",
];
type Documento = [nombre: string, detalle: string, insignia: string];

interface SemillaUsuario {
  nombre: string;
  nombreCorto: string;
  cargo: string;
  correo: string;
  iniciales: string;
  sede: string;
  area: string;
  rol: "empleado" | "reclutador" | "administrador";
  resumen: string;
  disponibilidad: string;
  ingreso: string;
  activo: number;
  habilidades: string[];
  educacion: Educacion[];
  experiencia: Experiencia[];
  certificaciones: Certificacion[];
  documentos: Documento[];
}

const USUARIOS: SemillaUsuario[] = [
  {
    nombre: "María Fernanda Castillo Ríos",
    nombreCorto: "María Fernanda",
    cargo: "Analista de Datos Senior",
    correo: "mcastillo@prediqtdata.com",
    iniciales: "MC",
    sede: "Lima",
    area: "Data & Analytics",
    rol: "empleado",
    resumen: "Tableros y modelos de datos para banca; certificación PL-300 verificada.",
    disponibilidad: "asignada a proyecto",
    ingreso: "desde ene 2021",
    activo: 1,
    habilidades: [
      "SQL",
      "Power BI",
      "Python",
      "Qlik Sense",
      "DAX",
      "Azure",
      "Excel avanzado",
      "Inglés B2",
    ],
    educacion: [
      [
        "Universidad de Lima",
        "Ingeniería de Sistemas",
        "Enfoque en bases de datos y analítica.",
        "marzo 2016 – diciembre 2020",
      ],
      [
        "Pontificia Universidad Católica del Perú",
        "Diplomado en Analítica de Datos",
        "Modelado dimensional y visualización para negocio.",
        "marzo 2021 – julio 2022",
      ],
    ],
    experiencia: [
      [
        "Analista BI — Prediqt",
        "enero 2021 – actualidad",
        "Desarrollo de tableros y modelos de datos para clientes del sector bancario.",
        "Power BI,SQL,DAX",
        1,
      ],
      [
        "Proyecto: Gobierno de datos — Banca Retail",
        "mayo 2023 – febrero 2024",
        "Diccionario de datos y catálogo de indicadores para el área de riesgos; capacitación a usuarios de negocio.",
        "Qlik Sense",
        0,
      ],
    ],
    certificaciones: [
      [
        "Microsoft Certified: Power BI Data Analyst Associate",
        "Microsoft · 2023",
        "Certificación oficial en modelado y visualización de datos.",
        "verificada",
      ],
      [
        "Curso introductorio sobre Gobierno de Datos",
        "Prediqt Academy · 2025",
        "Fundamentos de gobierno y calidad de datos; completado con 100% de avance.",
        "learning",
      ],
    ],
    documentos: [
      ["CV_MFCastillo_2026.pdf", "Actualizado 12 ago 2026 · 480 KB", "CV"],
      ["PL-300_Certificado.pdf", "Subido 04 mar 2023 · verificado", "Certificado"],
    ],
  },
  {
    nombre: "Joaquín Cerna Rojas",
    nombreCorto: "Joaquín",
    cargo: "Reclutador de Talento",
    correo: "jcerna@prediqtdata.com",
    iniciales: "JC",
    sede: "Lima",
    area: "Gestión de Personas",
    rol: "reclutador",
    resumen: "Selección interna y acompañamiento de squads de datos.",
    disponibilidad: "asignado a proyecto",
    ingreso: "desde mar 2022",
    activo: 1,
    habilidades: [
      "Reclutamiento",
      "Entrevistas por competencias",
      "Gestión de personas",
      "Excel avanzado",
      "Inglés B2",
    ],
    educacion: [
      [
        "Universidad Peruana de Ciencias Aplicadas",
        "Psicología Organizacional",
        "Especialización en selección por competencias.",
        "marzo 2014 – diciembre 2018",
      ],
    ],
    experiencia: [
      [
        "Reclutador de Talento — Prediqt",
        "marzo 2022 – actualidad",
        "Selección interna para proyectos de datos y analítica en cuatro sedes.",
        "Reclutamiento,Entrevistas por competencias",
        1,
      ],
    ],
    certificaciones: [
      [
        "Principio de la Pirámide de Minto",
        "Prediqt Academy · 2026",
        "Comunicación estructurada para presentar candidaturas a negocio.",
        "learning",
      ],
    ],
    // Sin CV cargado a propósito: deja ver un perfil incompleto en la demo.
    documentos: [],
  },
  {
    nombre: "Renata Alarcón Vega",
    nombreCorto: "Renata",
    cargo: "Administradora de la plataforma",
    correo: "radmin@prediqtdata.com",
    iniciales: "RA",
    sede: "Lima",
    area: "Gestión de Personas",
    rol: "administrador",
    resumen: "Gobierno de la plataforma interna de personas y del catálogo de habilidades.",
    disponibilidad: "asignada a proyecto",
    ingreso: "desde ago 2020",
    activo: 1,
    habilidades: [
      "Gestión de personas",
      "Reclutamiento",
      "Excel avanzado",
      "SQL",
      "Inglés B2",
    ],
    educacion: [
      [
        "Universidad del Pacífico",
        "Administración de Empresas",
        "Mención en gestión del talento.",
        "marzo 2012 – diciembre 2016",
      ],
    ],
    experiencia: [
      [
        "Administradora de plataforma — Prediqt",
        "agosto 2020 – actualidad",
        "Gobierno de accesos, roles y catálogo de habilidades de la plataforma interna.",
        "Gestión de personas,SQL",
        1,
      ],
    ],
    certificaciones: [
      [
        "Planificación y Gestión de Proyectos: PMBOK y Agile Scrum",
        "Prediqt Academy · 2026",
        "Gestión de iniciativas internas de RRHH.",
        "learning",
      ],
    ],
    documentos: [["CV_RAlarcon_2026.pdf", "Actualizado 03 jul 2026 · 410 KB", "CV"]],
  },
  {
    nombre: "Álvaro Mendoza León",
    nombreCorto: "Álvaro",
    cargo: "Ingeniero de Datos Senior",
    correo: "amendoza@prediqtdata.com",
    iniciales: "AM",
    sede: "Lima",
    area: "Data Engineering",
    rol: "empleado",
    resumen:
      "Modelado analítico sobre BigQuery y orquestación con dbt. Disponibilidad inmediata.",
    disponibilidad: "inmediata",
    ingreso: "desde feb 2020",
    activo: 1,
    habilidades: ["BigQuery", "SQL", "dbt", "Python", "Data Engineering"],
    educacion: [
      [
        "Universidad Nacional de Ingeniería",
        "Ingeniería Informática",
        "Especialización en sistemas distribuidos.",
        "marzo 2013 – diciembre 2018",
      ],
    ],
    experiencia: [
      [
        "Ingeniero de Datos Senior — Prediqt",
        "febrero 2020 – actualidad",
        "Modelos analíticos sobre BigQuery y orquestación de transformaciones con dbt.",
        "BigQuery,dbt,SQL",
        1,
      ],
      [
        "Proyecto: Migración de data warehouse — Retail",
        "enero 2024 – octubre 2024",
        "Traslado del almacén analítico a BigQuery con reescritura de las cargas.",
        "BigQuery,Python",
        0,
      ],
    ],
    certificaciones: [
      [
        "BigQuery para Analistas de Datos",
        "Prediqt Academy · 2026",
        "Consulta, transformación e ingesta sobre BigQuery.",
        "learning",
      ],
    ],
    documentos: [["CV_AMendoza_2026.pdf", "Actualizado 20 ago 2026 · 520 KB", "CV"]],
  },
  {
    nombre: "Valeria Quispe Rojas",
    nombreCorto: "Valeria",
    cargo: "Ingeniera de Datos",
    correo: "vquispe@prediqtdata.com",
    iniciales: "VQ",
    sede: "Lima",
    area: "Data Engineering",
    rol: "empleado",
    resumen: "Pipelines ETL y orquestación con Airflow; stack cloud enfocado en Azure.",
    disponibilidad: "inmediata",
    ingreso: "desde jun 2021",
    activo: 1,
    habilidades: ["Data Engineering", "Python", "Airflow", "Apache Spark", "SQL"],
    educacion: [
      [
        "Universidad Nacional de San Agustín",
        "Ingeniería de Sistemas",
        "Enfoque en procesamiento distribuido.",
        "marzo 2015 – diciembre 2020",
      ],
    ],
    experiencia: [
      [
        "Ingeniera de Datos — Prediqt",
        "junio 2021 – actualidad",
        "Pipelines ETL y orquestación con Airflow sobre infraestructura Azure.",
        "Airflow,Python,Apache Spark",
        1,
      ],
    ],
    certificaciones: [
      [
        "Microsoft Certified: Azure Data Engineer Associate",
        "Microsoft · 2024",
        "Diseño e implementación de soluciones de datos en Azure.",
        "verificada",
      ],
    ],
    documentos: [["CV_VQuispe_2026.pdf", "Actualizado 18 ago 2026 · 465 KB", "CV"]],
  },
  {
    nombre: "Andrea Salazar Ríos",
    nombreCorto: "Andrea",
    cargo: "Científica de Datos",
    correo: "asalazar@prediqtdata.com",
    iniciales: "AS",
    sede: "Lima",
    area: "Data Science",
    rol: "empleado",
    resumen: "Experiencia directa en GCP orientada a machine learning y Vertex AI.",
    disponibilidad: "parcial",
    ingreso: "desde sep 2022",
    activo: 1,
    habilidades: ["GCP", "Python", "Vertex AI", "SQL", "Inglés B2"],
    educacion: [
      [
        "Pontificia Universidad Católica del Perú",
        "Ingeniería Estadística",
        "Modelos predictivos y aprendizaje automático.",
        "marzo 2016 – diciembre 2021",
      ],
    ],
    experiencia: [
      [
        "Científica de Datos — Prediqt",
        "septiembre 2022 – actualidad",
        "Modelos de propensión y despliegue en Vertex AI para clientes de retail.",
        "Vertex AI,Python,GCP",
        1,
      ],
    ],
    // Sin certificación cargada a propósito.
    certificaciones: [],
    documentos: [["CV_ASalazar_2026.pdf", "Actualizado 05 ago 2026 · 390 KB", "CV"]],
  },
  {
    nombre: "Diego Paredes Coronel",
    nombreCorto: "Diego",
    cargo: "Arquitecto de Datos",
    correo: "dparedes@prediqtdata.com",
    iniciales: "DP",
    sede: "Quito",
    area: "Data Engineering",
    rol: "reclutador",
    resumen: "Diseño de plataformas de datos multi-cloud; liderazgo técnico de squads.",
    disponibilidad: "parcial",
    ingreso: "desde ene 2019",
    activo: 1,
    habilidades: ["BigQuery", "Terraform", "SQL", "GCP", "Python"],
    educacion: [
      [
        "Escuela Politécnica Nacional",
        "Ingeniería en Sistemas",
        "Arquitectura de software y datos.",
        "marzo 2011 – diciembre 2016",
      ],
    ],
    experiencia: [
      [
        "Arquitecto de Datos — Prediqt",
        "enero 2019 – actualidad",
        "Diseño de plataformas multi-cloud y liderazgo técnico de squads en Quito.",
        "Terraform,BigQuery,GCP",
        1,
      ],
    ],
    certificaciones: [
      [
        "Google Cloud Professional Data Engineer",
        "Google Cloud · 2023",
        "Diseño de sistemas de datos en Google Cloud.",
        "verificada",
      ],
    ],
    documentos: [["CV_DParedes_2026.pdf", "Actualizado 11 ago 2026 · 505 KB", "CV"]],
  },
  {
    nombre: "Camila Ferreira Duarte",
    nombreCorto: "Camila",
    cargo: "Analista de Datos",
    correo: "cferreira@prediqtdata.com",
    iniciales: "CF",
    sede: "Lausana",
    area: "Data & Analytics",
    rol: "empleado",
    resumen: "",
    disponibilidad: "por confirmar",
    ingreso: "desde may 2026",
    activo: 0,
    habilidades: [],
    educacion: [],
    experiencia: [],
    certificaciones: [],
    documentos: [],
  },
];

/** nombre, categoria, estado, personas_base (resto de la organizacion). */
const HABILIDADES: [string, string, "aprobada" | "pendiente", number][] = [
  ["SQL", "Bases de datos", "aprobada", 58],
  ["Power BI", "Visualización", "aprobada", 50],
  ["Qlik Sense", "Visualización", "aprobada", 36],
  ["Python", "Programación", "aprobada", 27],
  ["Excel avanzado", "Ofimática", "aprobada", 22],
  ["Azure", "Nube · Microsoft", "aprobada", 13],
  ["BigQuery", "Nube · GCP", "aprobada", 7],
  ["dbt", "Transformación", "pendiente", 0],
  ["DAX", "Visualización", "aprobada", 0],
  ["Inglés B2", "Idiomas", "aprobada", 0],
  ["Data Engineering", "Ingeniería de datos", "aprobada", 0],
  ["Airflow", "Orquestación", "aprobada", 0],
  ["Apache Spark", "Procesamiento", "aprobada", 0],
  ["GCP", "Nube · GCP", "aprobada", 0],
  ["Vertex AI", "Machine learning", "aprobada", 0],
  ["Terraform", "Infraestructura", "aprobada", 0],
  ["Reclutamiento", "Gestión de personas", "aprobada", 0],
  ["Entrevistas por competencias", "Gestión de personas", "aprobada", 0],
  ["Gestión de personas", "Gestión de personas", "aprobada", 0],
];

const SEDES: [string, number, number][] = [
  ["Lima", 59, 1],
  ["Quito", 23, 2],
  ["Guayaquil", 15, 3],
  ["Lausana", 8, 4],
];

const CONFIGURACION: [string, string][] = [
  ["usuarios_sincronizados", "128"],
  ["certificaciones_verificadas_base", "61"],
  ["certificaciones_pendientes", "18"],
  ["perfiles_completos_pct_previo", "72"],
  ["origen_tablero", "Prediqt HR — Talento"],
];

export function sembrar(bd: DatabaseSync): void {
  const fila = bd.prepare("SELECT COUNT(*) AS total FROM usuarios").get() as {
    total: number;
  };
  if (fila.total > 0) return;

  const insUsuario = bd.prepare(`
    INSERT INTO usuarios
      (nombre, nombre_corto, cargo, correo, hash, sal, iniciales, sede, area, rol,
       resumen, disponibilidad, ingreso, activo, consentimiento_en)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insHabilidad = bd.prepare(
    "INSERT INTO habilidades (nombre, categoria, estado, personas_base) VALUES (?, ?, ?, ?)",
  );
  const insAsignacion = bd.prepare(
    "INSERT INTO usuario_habilidades (usuario_id, habilidad_id) VALUES (?, ?)",
  );
  const idHabilidad = bd.prepare("SELECT id FROM habilidades WHERE nombre = ?");
  const insEdu = bd.prepare(
    "INSERT INTO educacion (usuario_id, institucion, programa, detalle, periodo) VALUES (?, ?, ?, ?, ?)",
  );
  const insExp = bd.prepare(
    "INSERT INTO experiencia (usuario_id, titulo, periodo, detalle, etiquetas, actual) VALUES (?, ?, ?, ?, ?, ?)",
  );
  const insCert = bd.prepare(
    "INSERT INTO certificaciones (usuario_id, titulo, emisor, detalle, insignia) VALUES (?, ?, ?, ?, ?)",
  );
  const insDoc = bd.prepare(
    "INSERT INTO documentos (usuario_id, nombre, detalle, insignia) VALUES (?, ?, ?, ?)",
  );

  for (const [nombre, categoria, estado, base] of HABILIDADES) {
    insHabilidad.run(nombre, categoria, estado, base);
  }
  for (const [nombre, base, orden] of SEDES) {
    bd.prepare("INSERT INTO sedes (nombre, base, orden) VALUES (?, ?, ?)").run(
      nombre,
      base,
      orden,
    );
  }
  for (const [clave, valor] of CONFIGURACION) {
    bd.prepare("INSERT INTO configuracion (clave, valor) VALUES (?, ?)").run(clave, valor);
  }

  const ids: Record<string, number> = {};

  for (const u of USUARIOS) {
    const clave = CLAVES[u.correo] ?? "Prediqt2026";
    const { sal, hash } = hashearContrasena(clave);
    const consentimiento = u.activo === 1 ? "2026-08-12 09:00:00" : null;

    const res = insUsuario.run(
      u.nombre,
      u.nombreCorto,
      u.cargo,
      u.correo,
      hash,
      sal,
      u.iniciales,
      u.sede,
      u.area,
      u.rol,
      u.resumen,
      u.disponibilidad,
      u.ingreso,
      u.activo,
      consentimiento,
    );
    const id = Number(res.lastInsertRowid);
    ids[u.correo] = id;

    for (const nombreHabilidad of u.habilidades) {
      const h = idHabilidad.get(nombreHabilidad) as { id: number } | undefined;
      if (h) insAsignacion.run(id, h.id);
    }
    for (const e of u.educacion) insEdu.run(id, ...e);
    for (const e of u.experiencia) insExp.run(id, ...e);
    for (const c of u.certificaciones) insCert.run(id, ...c);
    for (const d of u.documentos) insDoc.run(id, ...d);
  }

  const jc = ids["jcerna@prediqtdata.com"] ?? null;
  const ra = ids["radmin@prediqtdata.com"] ?? null;
  const insAud = bd.prepare(
    "INSERT INTO auditoria (actor_id, actor, perfil, accion, creado_en) VALUES (?, ?, ?, ?, ?)",
  );
  insAud.run(
    jc,
    "jcerna (Reclutador)",
    "Álvaro Mendoza León",
    "Vio perfil completo",
    "2026-08-24 16:42:00",
  );
  insAud.run(
    jc,
    "jcerna (Reclutador)",
    "Valeria Quispe Rojas",
    "Descargó CV",
    "2026-08-24 16:40:00",
  );
  insAud.run(
    jc,
    "jcerna (Reclutador)",
    "Consulta al Asistente",
    "“ingeniero de datos con GCP…”",
    "2026-08-24 16:38:00",
  );
  insAud.run(
    ra,
    "radmin (Administrador)",
    "María Fernanda Castillo Ríos",
    "Verificó certificado PL-300",
    "2026-08-22 09:15:00",
  );

  const insCurso = bd.prepare(
    "INSERT INTO cursos (moodle_id, titulo, descripcion, etiquetas) VALUES (?, ?, ?, ?)",
  );
  for (const curso of CURSOS_ACADEMY) insCurso.run(...curso);

  const idCurso = bd.prepare("SELECT id FROM cursos WHERE moodle_id = ?");
  const insInscripcion = bd.prepare(
    "INSERT INTO inscripciones (usuario_id, curso_id, avance) VALUES (?, ?, ?)",
  );
  for (const [correo, moodleId, avance] of INSCRIPCIONES) {
    const usuarioId = ids[correo];
    const curso = idCurso.get(moodleId) as { id: number } | undefined;
    if (usuarioId && curso) insInscripcion.run(usuarioId, curso.id, avance);
  }

  bd.prepare(
    "INSERT INTO sincronizaciones (id, origen, hecha_en) VALUES (1, ?, datetime('now'))",
  ).run("Prediqt HR — Talento");
}
