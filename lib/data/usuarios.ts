import type { EnlaceNav, Rol } from "@/types";

export const ETIQUETA_ROL: Readonly<Record<Rol, string>> = {
  empleado: "Empleado",
  reclutador: "Reclutador",
  administrador: "Administrador",
};

/** Navegacion del header segun el rol (5.3, 5.4, 5.5, 5.6 y 5.7). */
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

/** Ruta de aterrizaje tras elegir el modulo Talent. */
export const INICIO_POR_ROL: Readonly<Record<Rol, string>> = {
  empleado: "/perfil",
  reclutador: "/buscar-talento",
  administrador: "/administracion",
};
