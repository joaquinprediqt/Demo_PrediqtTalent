interface MicrosoftMarkProps {
  size?: number;
}

/** Cuadrados de Microsoft 365 tal como aparecen en el canvas (5.1 y 5.1a). */
export function MicrosoftMark({ size = 15 }: MicrosoftMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" fill="#F25022" />
      <rect x="13" y="3" width="8" height="8" fill="#7FBA00" />
      <rect x="3" y="13" width="8" height="8" fill="#00A4EF" />
      <rect x="13" y="13" width="8" height="8" fill="#FFB900" />
    </svg>
  );
}
