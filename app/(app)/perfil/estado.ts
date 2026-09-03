/**
 * Tipos y constantes del perfil. Van fuera de acciones.ts porque un archivo
 * "use server" solo puede exportar funciones asíncronas.
 */
export interface EstadoPerfil {
  readonly error: string | null;
  readonly ok: string | null;
}

export const SIN_ESTADO: EstadoPerfil = { error: null, ok: null };
