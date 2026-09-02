/** Roles definidos en los mockups (pantallas 5.3, 5.4 y 5.6). */
export type Rol = "empleado" | "reclutador" | "administrador";

export type Modulo = "learning" | "talent";

export type Sede = "Lima" | "Quito" | "Guayaquil" | "Lausana";

export type Tema = "claro" | "oscuro";

export interface Usuario {
  readonly rol: Rol;
  readonly nombre: string;
  readonly nombreCorto: string;
  readonly cargo: string;
  readonly cuenta: string;
  readonly iniciales: string;
  readonly sede: Sede;
  readonly area: string;
}

export interface EnlaceNav {
  readonly etiqueta: string;
  readonly href: string;
  /** Sin ruta propia todavia: se pinta pero no navega. */
  readonly inactivo?: boolean;
}
