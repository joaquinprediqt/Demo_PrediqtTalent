/** Estado compartido por los formularios de administración. */
export interface EstadoAdmin {
  readonly error: string | null;
  readonly ok: string | null;
}

export const SIN_ESTADO_ADMIN: EstadoAdmin = { error: null, ok: null };
