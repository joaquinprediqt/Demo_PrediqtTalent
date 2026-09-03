/**
 * Copy de la pantalla 5.5. Los candidatos ya no viven aquí: se calculan
 * contra la base en cada consulta al Asistente.
 */

export interface Coincidencia {
  readonly id: number;
  readonly nombre: string;
  readonly afinidad: number;
  readonly tono: "accent" | "steel";
  readonly justificacion: string;
  readonly habilidades: readonly string[];
  readonly carencias: readonly string[];
  readonly destacado: boolean;
}

export const REQUERIMIENTO_EJEMPLO =
  "Necesito un ingeniero de datos con GCP y BigQuery para un proyecto de 3 meses";

export const SUGERENCIAS: readonly string[] = [
  "Necesito un ingeniero de datos con GCP y BigQuery para un proyecto de 3 meses",
  "Busco alguien senior en Python y machine learning para un piloto",
  "¿Quién puede liderar una migración a la nube en Quito?",
];
