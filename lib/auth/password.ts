import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const LONGITUD = 64;

/** Deriva una clave con scrypt; devuelve la sal y el hash en hexadecimal. */
export function hashearContrasena(contrasena: string): { sal: string; hash: string } {
  const sal = randomBytes(16).toString("hex");
  const hash = scryptSync(contrasena, sal, LONGITUD).toString("hex");
  return { sal, hash };
}

/** Comparacion en tiempo constante para no filtrar informacion por el tiempo. */
export function verificarContrasena(
  contrasena: string,
  sal: string,
  hash: string,
): boolean {
  const esperado = Buffer.from(hash, "hex");
  if (esperado.length !== LONGITUD) return false;
  const calculado = scryptSync(contrasena, sal, LONGITUD);
  return timingSafeEqual(calculado, esperado);
}
