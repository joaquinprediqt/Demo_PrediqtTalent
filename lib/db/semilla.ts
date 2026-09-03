import type { DatabaseSync } from "node:sqlite";
import { hashearContrasena } from "@/lib/auth/password";

/**
 * Contenido inicial, tomado literalmente del canvas de mockups.
 * Solo se ejecuta si la tabla de usuarios esta vacia, asi que es seguro
 * llamarla en cada arranque.
 */

/** Contrasenas de demostracion. Se documentan en el README. */
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
    resumen: "Selección interna y acompañamiento de squads.",
    disponibilidad: "por confirmar",
    ingreso: "desde mar 2022",
    activo: 1,
    habilidades: [],
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
    resumen: "Gobierno de la plataforma interna de personas.",
    disponibilidad: "por confirmar",
    ingreso: "desde ago 2020",
    activo: 1,
    habilidades: [],
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
    habilidades: ["BigQuery", "SQL", "dbt", "Python"],
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
    habilidades: ["Data Engineering", "Python", "Airflow", "Apache Spark"],
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
    habilidades: ["GCP", "Python", "Vertex AI"],
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
    habilidades: ["BigQuery", "Terraform", "SQL"],
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
  },
];

/** nombre, categoria, estado, personas_base (resto de la organizacion). */
const HABILIDADES: [string, string, "aprobada" | "pendiente", number][] = [
  ["SQL", "Bases de datos", "aprobada", 61],
  ["Power BI", "Visualización", "aprobada", 50],
  ["Qlik Sense", "Visualización", "aprobada", 36],
  ["Python", "Programación", "aprobada", 29],
  ["Excel avanzado", "Ofimática", "aprobada", 24],
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
];

const SEDES: [string, number, number][] = [
  ["Lima", 59, 1],
  ["Quito", 23, 2],
  ["Guayaquil", 15, 3],
  ["Lausana", 8, 4],
];

const CONFIGURACION: [string, string][] = [
  ["usuarios_sincronizados", "128"],
  ["certificaciones_verificadas_base", "63"],
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
    const consentimiento = u.rol === "empleado" && u.activo === 1 ? "2026-08-12 09:00:00" : null;
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
  }

  const mc = ids["mcastillo@prediqtdata.com"];
  if (mc) {
    const insEdu = bd.prepare(
      "INSERT INTO educacion (usuario_id, institucion, programa, detalle, periodo) VALUES (?, ?, ?, ?, ?)",
    );
    insEdu.run(
      mc,
      "Universidad de Lima",
      "Ingeniería de Sistemas",
      "Enfoque en bases de datos y analítica.",
      "marzo 2016 – diciembre 2020",
    );
    insEdu.run(
      mc,
      "Pontificia Universidad Católica del Perú",
      "Diplomado en Analítica de Datos",
      "Modelado dimensional y visualización para negocio.",
      "marzo 2021 – julio 2022",
    );

    const insExp = bd.prepare(
      "INSERT INTO experiencia (usuario_id, titulo, periodo, detalle, etiquetas, actual) VALUES (?, ?, ?, ?, ?, ?)",
    );
    insExp.run(
      mc,
      "Analista BI — Prediqt",
      "enero 2021 – actualidad",
      "Desarrollo de tableros y modelos de datos para clientes del sector bancario.",
      "Power BI,SQL,DAX",
      1,
    );
    insExp.run(
      mc,
      "Proyecto: Gobierno de datos — Banca Retail",
      "mayo 2023 – febrero 2024",
      "Diccionario de datos y catálogo de indicadores para el área de riesgos; capacitación a usuarios de negocio.",
      "Qlik Sense",
      0,
    );

    const insCert = bd.prepare(
      "INSERT INTO certificaciones (usuario_id, titulo, emisor, detalle, insignia) VALUES (?, ?, ?, ?, ?)",
    );
    insCert.run(
      mc,
      "Microsoft Certified: Power BI Data Analyst Associate",
      "Microsoft · 2023",
      "Certificación oficial en modelado y visualización de datos.",
      "verificada",
    );
    insCert.run(
      mc,
      "Curso introductorio sobre Gobierno de Datos",
      "Prediqt Academy · 2025",
      "Fundamentos de gobierno y calidad de datos; completado con 100% de avance.",
      "learning",
    );

    const insDoc = bd.prepare(
      "INSERT INTO documentos (usuario_id, nombre, detalle, insignia) VALUES (?, ?, ?, ?)",
    );
    insDoc.run(mc, "CV_MFCastillo_2026.pdf", "Actualizado 12 ago 2026 · 480 KB", "CV");
    insDoc.run(mc, "PL-300_Certificado.pdf", "Subido 04 mar 2023 · verificado", "✓");
  }

  const jc = ids["jcerna@prediqtdata.com"];
  const ra = ids["radmin@prediqtdata.com"];
  const insAud = bd.prepare(
    "INSERT INTO auditoria (actor_id, actor, perfil, accion, creado_en) VALUES (?, ?, ?, ?, ?)",
  );
  insAud.run(jc ?? null, "jcerna (Reclutador)", "Álvaro Mendoza León", "Vio perfil completo", "2026-08-24 16:42:00");
  insAud.run(jc ?? null, "jcerna (Reclutador)", "Valeria Quispe Rojas", "Descargó CV", "2026-08-24 16:40:00");
  insAud.run(
    jc ?? null,
    "jcerna (Reclutador)",
    "Consulta al Asistente",
    "“ingeniero de datos con GCP…”",
    "2026-08-24 16:38:00",
  );
  insAud.run(
    ra ?? null,
    "radmin (Administrador)",
    "María Fernanda Castillo Ríos",
    "Verificó certificado PL-300",
    "2026-08-22 09:15:00",
  );

  bd.prepare(
    "INSERT INTO sincronizaciones (id, origen, hecha_en) VALUES (1, ?, datetime('now'))",
  ).run("Prediqt HR — Talento");
}
