/**
 * Presentación del tablero (5.7). Las cifras ya no viven aquí: salen de
 * lib/db/consultas.ts. Esto es solo la paleta y el trazado del canvas.
 */

export const PALETA_BARRAS = [
  "#1F8A7A",
  "#2E9C8B",
  "#4A7FA7",
  "#5C8FB5",
  "#7FA8C4",
  "#9FC0D6",
  "#BBD2E3",
] as const;

export const PALETA_SEDES = ["#1F8A7A", "#4A7FA7", "#7FA8C4", "#BBD2E3"] as const;

export function colorPorIndice(paleta: readonly string[], indice: number): string {
  return paleta[indice % paleta.length] ?? "#4A7FA7";
}

export const MESES_AVANCE = ["mar", "abr", "may", "jun", "jul", "ago"] as const;

/** Trazado literal del area chart del canvas, en caja 400x120. */
export const RUTA_AVANCE = "M10 96 L88 84 L166 70 L244 52 L322 40 L390 26";
export const RUTA_AVANCE_RELLENO =
  "M10 96 L88 84 L166 70 L244 52 L322 40 L390 26 L390 120 L10 120 Z";
