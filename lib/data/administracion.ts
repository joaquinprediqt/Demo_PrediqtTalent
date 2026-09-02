import type { Rol, Sede } from "@/types";

/** Datos de la consola de administración (5.6). */

export interface FilaUsuario {
  readonly nombre: string;
  readonly cuenta: string;
  readonly rol: Rol;
  readonly sede: Sede;
  readonly estado: "activo" | "sin-perfil";
}

export const USUARIOS_TABLA: readonly FilaUsuario[] = [
  {
    nombre: "María Fernanda Castillo Ríos",
    cuenta: "mcastillo@prediqtdata.com",
    rol: "empleado",
    sede: "Lima",
    estado: "activo",
  },
  {
    nombre: "Joaquín Cerna Rojas",
    cuenta: "jcerna@prediqtdata.com",
    rol: "reclutador",
    sede: "Lima",
    estado: "activo",
  },
  {
    nombre: "Álvaro Mendoza León",
    cuenta: "amendoza@prediqtdata.com",
    rol: "empleado",
    sede: "Lima",
    estado: "activo",
  },
  {
    nombre: "Diego Paredes Coronel",
    cuenta: "dparedes@prediqtdata.com",
    rol: "reclutador",
    sede: "Quito",
    estado: "activo",
  },
  {
    nombre: "Camila Ferreira Duarte",
    cuenta: "cferreira@prediqtdata.com",
    rol: "empleado",
    sede: "Lausana",
    estado: "sin-perfil",
  },
];

export const TOTAL_USUARIOS = 128;

export interface HabilidadCatalogo {
  readonly nombre: string;
  readonly categoria: string;
  readonly personas: number;
  readonly pendiente?: boolean;
}

export const CATALOGO_HABILIDADES: readonly HabilidadCatalogo[] = [
  { nombre: "SQL", categoria: "Bases de datos", personas: 64 },
  { nombre: "Power BI", categoria: "Visualización", personas: 51 },
  { nombre: "Qlik Sense", categoria: "Visualización", personas: 37 },
  { nombre: "Python", categoria: "Programación", personas: 33 },
  { nombre: "BigQuery", categoria: "Nube · GCP", personas: 9 },
  { nombre: "dbt", categoria: "Transformación", personas: 0, pendiente: true },
];

export interface FilaAuditoria {
  readonly quien: string;
  readonly perfil: string;
  readonly accion: string;
  readonly cuando: string;
}

export const AUDITORIA: readonly FilaAuditoria[] = [
  {
    quien: "jcerna (Reclutador)",
    perfil: "Álvaro Mendoza León",
    accion: "Vio perfil completo",
    cuando: "24 ago 2026 · 16:42",
  },
  {
    quien: "jcerna (Reclutador)",
    perfil: "Valeria Quispe Rojas",
    accion: "Descargó CV",
    cuando: "24 ago 2026 · 16:40",
  },
  {
    quien: "jcerna (Reclutador)",
    perfil: "Consulta al Asistente",
    accion: "“ingeniero de datos con GCP…”",
    cuando: "24 ago 2026 · 16:38",
  },
  {
    quien: "radmin (Administrador)",
    perfil: "María Fernanda Castillo Ríos",
    accion: "Verificó certificado PL-300",
    cuando: "22 ago 2026 · 09:15",
  },
];

export const ULTIMA_CARGA = {
  archivo: "personal_agosto2026.xlsx",
  detalle: "128 filas, 0 errores",
} as const;

export const PESTANAS_ADMIN = [
  "Usuarios y roles",
  "Catálogo de habilidades",
  "Carga masiva",
  "Auditoría de accesos",
] as const;
