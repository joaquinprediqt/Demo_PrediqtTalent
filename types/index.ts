/** Roles definidos en los mockups (pantallas 5.3, 5.4 y 5.6). */
export type Rol = "empleado" | "reclutador" | "administrador";

export type Modulo = "learning" | "talent";

export type Tema = "claro" | "oscuro";

/** Forma serializable del usuario que viaja del servidor al cliente. */
export interface Usuario {
  readonly id: number;
  readonly nombre: string;
  readonly nombreCorto: string;
  readonly cargo: string;
  readonly correo: string;
  readonly iniciales: string;
  readonly sede: string;
  readonly area: string;
  readonly rol: Rol;
  readonly consentimiento: boolean;
}

export interface EnlaceNav {
  readonly etiqueta: string;
  readonly href: string;
  /** Sin ruta propia todavia: se pinta pero no navega. */
  readonly inactivo?: boolean;
}
