/**
 * SQLite guarda las fechas como "YYYY-MM-DD HH:MM:SS" en UTC.
 * Hay que marcarlas como tal o el navegador las interpreta en local.
 */
export function desdeSqlite(valor: string): Date {
  return new Date(`${valor.replace(" ", "T")}Z`);
}

/** "hace 12 min", "hace 1 hora", "hace 2 horas", "hace 3 días". */
export function hace(fecha: Date, ahora: Date = new Date()): string {
  const segundos = Math.max(0, Math.round((ahora.getTime() - fecha.getTime()) / 1000));

  if (segundos < 60) return "hace unos segundos";

  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) return `hace ${minutos} ${minutos === 1 ? "minuto" : "minutos"}`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} ${horas === 1 ? "hora" : "horas"}`;

  const dias = Math.floor(horas / 24);
  if (dias < 30) return `hace ${dias} ${dias === 1 ? "día" : "días"}`;

  const meses = Math.floor(dias / 30);
  return `hace ${meses} ${meses === 1 ? "mes" : "meses"}`;
}
