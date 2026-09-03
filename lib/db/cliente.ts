import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { sembrar } from "./semilla";

/**
 * Conexion unica a SQLite. Se abre de forma perezosa la primera vez que
 * alguien pide datos, aplica el esquema y siembra el contenido del canvas
 * si la base todavia esta vacia.
 *
 * En desarrollo Next.js recarga los modulos, asi que la instancia se guarda
 * en globalThis para no abrir un descriptor nuevo en cada recarga.
 */

const RUTA_DATOS = path.join(process.cwd(), "data");
const RUTA_BD = path.join(RUTA_DATOS, "prediqt.db");
const RUTA_ESQUEMA = path.join(process.cwd(), "lib", "db", "esquema.sql");

declare global {
  // eslint-disable-next-line no-var
  var __prediqtBd: DatabaseSync | undefined;
}

function abrir(): DatabaseSync {
  mkdirSync(RUTA_DATOS, { recursive: true });
  const bd = new DatabaseSync(RUTA_BD);
  bd.exec(readFileSync(RUTA_ESQUEMA, "utf8"));
  sembrar(bd);
  return bd;
}

export function db(): DatabaseSync {
  if (!globalThis.__prediqtBd) {
    globalThis.__prediqtBd = abrir();
  }
  return globalThis.__prediqtBd;
}

/** Ejecuta una consulta de lectura y devuelve las filas ya tipadas. */
export function consultar<T>(sql: string, ...parametros: unknown[]): T[] {
  const sentencia = db().prepare(sql);
  return sentencia.all(...(parametros as never[])) as T[];
}

/** Ejecuta una consulta de lectura que devuelve como mucho una fila. */
export function consultarUno<T>(sql: string, ...parametros: unknown[]): T | null {
  const fila = db().prepare(sql).get(...(parametros as never[]));
  return (fila as T | undefined) ?? null;
}

/** Ejecuta una escritura y devuelve el identificador insertado. */
export function ejecutar(sql: string, ...parametros: unknown[]): number {
  const resultado = db()
    .prepare(sql)
    .run(...(parametros as never[]));
  return Number(resultado.lastInsertRowid);
}
