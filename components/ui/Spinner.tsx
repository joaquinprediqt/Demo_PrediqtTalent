/**
 * Indicador de espera para los botones de envio. Hereda el color del texto,
 * asi que sirve igual sobre fondo verde, navy o transparente.
 *
 * Es decorativo: el boton ya cambia su texto a "Guardando…", que es lo que
 * anuncian los lectores de pantalla, por eso lleva aria-hidden.
 */
export function Spinner({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 animate-spin"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.28" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
