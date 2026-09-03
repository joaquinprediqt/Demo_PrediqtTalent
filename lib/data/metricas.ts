/** Datos del tablero embebido (5.7). */

export interface Kpi {
  readonly etiqueta: string;
  readonly valor: string;
  readonly nota: string;
  readonly tono: "accent" | "neutro";
}

export const KPIS: readonly Kpi[] = [
  {
    etiqueta: "Perfiles completos",
    valor: "78%",
    nota: "+6 pts vs. julio",
    tono: "accent",
  },
  {
    etiqueta: "Colaboradores con perfil",
    valor: "112",
    nota: "de 128 sincronizados",
    tono: "neutro",
  },
  {
    etiqueta: "Certificaciones verificadas",
    valor: "64",
    nota: "18 pendientes de verificar",
    tono: "neutro",
  },
  {
    etiqueta: "Consultas al Asistente",
    valor: "[dato pendiente]",
    nota: "requiere medición en producción",
    tono: "neutro",
  },
];

export interface BarraHabilidad {
  readonly nombre: string;
  readonly personas: number;
  readonly color: string;
}

/** Alturas relativas y colores literales del canvas. */
export const HABILIDADES_COMUNES: readonly BarraHabilidad[] = [
  { nombre: "SQL", personas: 64, color: "#1F8A7A" },
  { nombre: "Power BI", personas: 51, color: "#2E9C8B" },
  { nombre: "Qlik Sense", personas: 37, color: "#4A7FA7" },
  { nombre: "Python", personas: 33, color: "#5C8FB5" },
  { nombre: "Excel av.", personas: 25, color: "#7FA8C4" },
  { nombre: "Azure", personas: 14, color: "#9FC0D6" },
  { nombre: "BigQuery", personas: 9, color: "#BBD2E3" },
];

export interface PorcionSede {
  readonly sede: string;
  readonly personas: number;
  readonly porcentaje: number;
  readonly color: string;
  /** dasharray y dashoffset tomados del SVG del canvas. */
  readonly dash: string;
  readonly offset: number;
}

export const DISTRIBUCION_SEDES: readonly PorcionSede[] = [
  { sede: "Lima", personas: 65, porcentaje: 58, color: "#1F8A7A", dash: "58 42", offset: 25 },
  { sede: "Quito", personas: 24, porcentaje: 21, color: "#4A7FA7", dash: "21 79", offset: -33 },
  {
    sede: "Guayaquil",
    personas: 15,
    porcentaje: 14,
    color: "#7FA8C4",
    dash: "14 86",
    offset: -54,
  },
  { sede: "Lausana", personas: 8, porcentaje: 7, color: "#BBD2E3", dash: "7 93", offset: -68 },
];

export const MESES_AVANCE = ["mar", "abr", "may", "jun", "jul", "ago"] as const;

/** Trazado literal del area chart del canvas, en caja 400x120. */
export const RUTA_AVANCE = "M10 96 L88 84 L166 70 L244 52 L322 40 L390 26";
export const RUTA_AVANCE_RELLENO =
  "M10 96 L88 84 L166 70 L244 52 L322 40 L390 26 L390 120 L10 120 Z";

export interface BarraProveedor {
  readonly proveedor: string;
  readonly total: number;
  readonly ancho: number;
  readonly color: string;
}

export const CERTIFICACIONES_PROVEEDOR: readonly BarraProveedor[] = [
  { proveedor: "Microsoft", total: 31, ancho: 72, color: "#1F8A7A" },
  { proveedor: "Qlik", total: 19, ancho: 44, color: "#2E9C8B" },
  { proveedor: "Google Cloud", total: 9, ancho: 21, color: "#4A7FA7" },
  { proveedor: "Prediqt Academy", total: 5, ancho: 12, color: "#7FA8C4" },
];

