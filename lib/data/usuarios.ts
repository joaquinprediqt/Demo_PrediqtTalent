import type { EnlaceNav, Rol, Usuario } from "@/types";

/** Cuentas de muestra que aparecen literalmente en los mockups. */
export const USUARIOS: Readonly<Record<Rol, Usuario>> = {
  empleado: {
    rol: "empleado",
    nombre: "María Fernanda Castillo Ríos",
    nombreCorto: "María Fernanda",
    cargo: "Analista de Datos Senior",
    cuenta: "mcastillo@prediqtdata.com",
    iniciales: "MC",
    sede: "Lima",
    area: "Data & Analytics",
  },
  reclutador: {
    rol: "reclutador",
    nombre: "Joaquín Cerna Rojas",
    nombreCorto: "Joaquín",
    cargo: "Reclutador de Talento",
    cuenta: "jcerna@prediqtdata.com",
    iniciales: "JC",
    sede: "Lima",
    area: "Gestión de Personas",
  },
  administrador: {
    rol: "administrador",
    nombre: "Renata Alarcón Vega",
    nombreCorto: "Renata",
    cargo: "Administradora de la plataforma",
    cuenta: "radmin@prediqtdata.com",
    iniciales: "RA",
    sede: "Lima",
    area: "Gestión de Personas",
  },
};

export const ETIQUETA_ROL: Readonly<Record<Rol, string>> = {
  empleado: "Empleado",
  reclutador: "Reclutador",
  administrador: "Administrador",
};

export const DESCRIPCION_ROL: Readonly<Record<Rol, string>> = {
  empleado: "Tu perfil profesional, tus documentos y los cursos de Prediqt Academy.",
  reclutador: "Búsqueda de talento interno, asistente de selección y métricas.",
  administrador: "Usuarios y roles, catálogo de habilidades, carga masiva y auditoría.",
};

/** Navegacion del header segun el rol, tal como aparece en 5.3, 5.4, 5.5, 5.6 y 5.7. */
export const NAV_POR_ROL: Readonly<Record<Rol, readonly EnlaceNav[]>> = {
  empleado: [
    { etiqueta: "Inicio", href: "/seleccionar-modulo" },
    { etiqueta: "Mi perfil", href: "/perfil" },
    { etiqueta: "Learning", href: "/perfil", inactivo: true },
  ],
  reclutador: [
    { etiqueta: "Dashboard", href: "/dashboard" },
    { etiqueta: "Buscar talento", href: "/buscar-talento" },
    { etiqueta: "Asistente", href: "/asistente" },
    { etiqueta: "Certificados", href: "/buscar-talento", inactivo: true },
  ],
  administrador: [
    { etiqueta: "Dashboard", href: "/dashboard" },
    { etiqueta: "Buscar talento", href: "/buscar-talento" },
    { etiqueta: "Asistente", href: "/asistente" },
    { etiqueta: "Administración", href: "/administracion" },
  ],
};

/** Ruta de aterrizaje tras iniciar sesion con cada rol. */
export const INICIO_POR_ROL: Readonly<Record<Rol, string>> = {
  empleado: "/seleccionar-modulo",
  reclutador: "/buscar-talento",
  administrador: "/administracion",
};
