import { consultar, consultarUno, ejecutar } from "./cliente";
import type { Rol } from "@/types";

/* ------------------------------------------------------------------ */
/* Tipos de fila                                                       */
/* ------------------------------------------------------------------ */

export interface UsuarioFila {
  id: number;
  nombre: string;
  nombre_corto: string;
  cargo: string;
  correo: string;
  iniciales: string;
  sede: string;
  area: string;
  rol: Rol;
  resumen: string;
  disponibilidad: string;
  ingreso: string;
  foto_url: string | null;
  activo: number;
  consentimiento_en: string | null;
}

const CAMPOS_USUARIO = `
  id, nombre, nombre_corto, cargo, correo, iniciales, sede, area, rol,
  resumen, disponibilidad, ingreso, foto_url, activo, consentimiento_en
`;

/* ------------------------------------------------------------------ */
/* Usuarios y credenciales                                             */
/* ------------------------------------------------------------------ */

export function usuarioPorCorreo(correo: string): UsuarioFila | null {
  return consultarUno<UsuarioFila>(
    `SELECT ${CAMPOS_USUARIO} FROM usuarios WHERE lower(correo) = lower(?)`,
    correo.trim(),
  );
}

export function credencialesPorCorreo(
  correo: string,
): { id: number; sal: string; hash: string; activo: number } | null {
  return consultarUno(
    "SELECT id, sal, hash, activo FROM usuarios WHERE lower(correo) = lower(?)",
    correo.trim(),
  );
}

export function usuarioPorId(id: number): UsuarioFila | null {
  return consultarUno<UsuarioFila>(
    `SELECT ${CAMPOS_USUARIO} FROM usuarios WHERE id = ?`,
    id,
  );
}

export function marcarConsentimiento(usuarioId: number): void {
  ejecutar(
    "UPDATE usuarios SET consentimiento_en = datetime('now') WHERE id = ? AND consentimiento_en IS NULL",
    usuarioId,
  );
}

export function cambiarRol(usuarioId: number, rol: Rol): void {
  ejecutar("UPDATE usuarios SET rol = ? WHERE id = ?", rol, usuarioId);
}

export function listarUsuarios(): UsuarioFila[] {
  return consultar<UsuarioFila>(
    `SELECT ${CAMPOS_USUARIO} FROM usuarios ORDER BY id`,
  );
}

/* ------------------------------------------------------------------ */
/* Sesiones                                                            */
/* ------------------------------------------------------------------ */

export function crearSesion(id: string, usuarioId: number, expiraEn: string): void {
  ejecutar(
    "INSERT INTO sesiones (id, usuario_id, expira_en) VALUES (?, ?, ?)",
    id,
    usuarioId,
    expiraEn,
  );
}

export function usuarioDeSesion(id: string): UsuarioFila | null {
  return consultarUno<UsuarioFila>(
    `SELECT u.id, u.nombre, u.nombre_corto, u.cargo, u.correo, u.iniciales,
            u.sede, u.area, u.rol, u.resumen, u.disponibilidad, u.ingreso,
            u.foto_url, u.activo, u.consentimiento_en
     FROM sesiones s
     JOIN usuarios u ON u.id = s.usuario_id
     WHERE s.id = ? AND s.expira_en > datetime('now')`,
    id,
  );
}

export function borrarSesion(id: string): void {
  ejecutar("DELETE FROM sesiones WHERE id = ?", id);
}

export function limpiarSesionesVencidas(): void {
  ejecutar("DELETE FROM sesiones WHERE expira_en <= datetime('now')");
}

/* ------------------------------------------------------------------ */
/* Perfil                                                              */
/* ------------------------------------------------------------------ */

export interface HabilidadFila {
  id: number;
  nombre: string;
  categoria: string;
  estado: "aprobada" | "pendiente";
}

export interface EducacionFila {
  id: number;
  institucion: string;
  programa: string;
  detalle: string;
  periodo: string;
}

export interface ExperienciaFila {
  id: number;
  titulo: string;
  periodo: string;
  detalle: string;
  etiquetas: string;
  actual: number;
}

export interface CertificacionFila {
  id: number;
  titulo: string;
  emisor: string;
  detalle: string;
  insignia: "verificada" | "learning";
}

export interface DocumentoFila {
  id: number;
  nombre: string;
  detalle: string;
  insignia: string;
}

export function habilidadesDe(usuarioId: number): HabilidadFila[] {
  return consultar<HabilidadFila>(
    `SELECT h.id, h.nombre, h.categoria, h.estado
     FROM usuario_habilidades uh
     JOIN habilidades h ON h.id = uh.habilidad_id
     WHERE uh.usuario_id = ?
     ORDER BY h.id`,
    usuarioId,
  );
}

export function educacionDe(usuarioId: number): EducacionFila[] {
  return consultar<EducacionFila>(
    "SELECT id, institucion, programa, detalle, periodo FROM educacion WHERE usuario_id = ? ORDER BY id",
    usuarioId,
  );
}

export function experienciaDe(usuarioId: number): ExperienciaFila[] {
  return consultar<ExperienciaFila>(
    "SELECT id, titulo, periodo, detalle, etiquetas, actual FROM experiencia WHERE usuario_id = ? ORDER BY actual DESC, id",
    usuarioId,
  );
}

export function certificacionesDe(usuarioId: number): CertificacionFila[] {
  return consultar<CertificacionFila>(
    "SELECT id, titulo, emisor, detalle, insignia FROM certificaciones WHERE usuario_id = ? ORDER BY id",
    usuarioId,
  );
}

export function documentosDe(usuarioId: number): DocumentoFila[] {
  return consultar<DocumentoFila>(
    "SELECT id, nombre, detalle, insignia FROM documentos WHERE usuario_id = ? ORDER BY id",
    usuarioId,
  );
}

/* --- Escrituras del perfil (pantalla 5.3) --- */

export function agregarEducacion(
  usuarioId: number,
  institucion: string,
  programa: string,
  detalle: string,
  periodo: string,
): number {
  return ejecutar(
    "INSERT INTO educacion (usuario_id, institucion, programa, detalle, periodo) VALUES (?, ?, ?, ?, ?)",
    usuarioId,
    institucion,
    programa,
    detalle,
    periodo,
  );
}

export function agregarExperiencia(
  usuarioId: number,
  titulo: string,
  periodo: string,
  detalle: string,
  etiquetas: string,
  actual: boolean,
): number {
  return ejecutar(
    "INSERT INTO experiencia (usuario_id, titulo, periodo, detalle, etiquetas, actual) VALUES (?, ?, ?, ?, ?, ?)",
    usuarioId,
    titulo,
    periodo,
    detalle,
    etiquetas,
    actual ? 1 : 0,
  );
}

export function agregarCertificacion(
  usuarioId: number,
  titulo: string,
  emisor: string,
  detalle: string,
  insignia: "verificada" | "learning",
): number {
  return ejecutar(
    "INSERT INTO certificaciones (usuario_id, titulo, emisor, detalle, insignia) VALUES (?, ?, ?, ?, ?)",
    usuarioId,
    titulo,
    emisor,
    detalle,
    insignia,
  );
}

export function agregarDocumento(
  usuarioId: number,
  nombre: string,
  detalle: string,
  insignia: string,
): number {
  return ejecutar(
    "INSERT INTO documentos (usuario_id, nombre, detalle, insignia) VALUES (?, ?, ?, ?)",
    usuarioId,
    nombre,
    detalle,
    insignia,
  );
}

export function borrarDocumento(usuarioId: number, documentoId: number): void {
  ejecutar("DELETE FROM documentos WHERE id = ? AND usuario_id = ?", documentoId, usuarioId);
}

export function asignarHabilidad(usuarioId: number, habilidadId: number): void {
  ejecutar(
    "INSERT OR IGNORE INTO usuario_habilidades (usuario_id, habilidad_id) VALUES (?, ?)",
    usuarioId,
    habilidadId,
  );
}

export function quitarHabilidad(usuarioId: number, habilidadId: number): void {
  ejecutar(
    "DELETE FROM usuario_habilidades WHERE usuario_id = ? AND habilidad_id = ?",
    usuarioId,
    habilidadId,
  );
}

export function actualizarFoto(usuarioId: number, fotoUrl: string | null): void {
  ejecutar("UPDATE usuarios SET foto_url = ? WHERE id = ?", fotoUrl, usuarioId);
}

export function actualizarResumen(usuarioId: number, resumen: string): void {
  ejecutar("UPDATE usuarios SET resumen = ? WHERE id = ?", resumen.trim(), usuarioId);
}

/**
 * Completitud derivada de lo que hay en la base, no un numero fijo.
 * Los pesos suman 100.
 */
export function completitudDe(usuarioId: number): { valor: number; faltantes: string[] } {
  const usuario = usuarioPorId(usuarioId);
  if (!usuario) return { valor: 0, faltantes: [] };

  const criterios: { peso: number; cumple: boolean; falta: string }[] = [
    { peso: 18, cumple: Boolean(usuario.foto_url), falta: "foto de perfil" },
    { peso: 10, cumple: usuario.resumen.trim().length > 0, falta: "resumen profesional" },
    { peso: 15, cumple: educacionDe(usuarioId).length > 0, falta: "una entrada de educación" },
    { peso: 15, cumple: experienciaDe(usuarioId).length > 0, falta: "una entrada de experiencia" },
    {
      peso: 15,
      cumple: certificacionesDe(usuarioId).length > 0,
      falta: "una certificación",
    },
    { peso: 12, cumple: documentosDe(usuarioId).length > 0, falta: "el CV en PDF" },
    {
      peso: 15,
      cumple: habilidadesDe(usuarioId).length >= 5,
      falta: "al menos cinco habilidades",
    },
  ];

  const valor = criterios.reduce((suma, c) => suma + (c.cumple ? c.peso : 0), 0);
  const faltantes = criterios.filter((c) => !c.cumple).map((c) => c.falta);
  return { valor, faltantes };
}

/* ------------------------------------------------------------------ */
/* Banco de talento                                                    */
/* ------------------------------------------------------------------ */

export interface Candidato {
  id: number;
  nombre: string;
  iniciales: string;
  cargo: string;
  sede: string;
  area: string;
  resumen: string;
  disponibilidad: string;
  habilidades: string[];
  completitud: number;
}

/** Colaboradores con perfil activo, con sus habilidades ya resueltas. */
export function listarCandidatos(): Candidato[] {
  const filas = consultar<UsuarioFila>(
    `SELECT ${CAMPOS_USUARIO} FROM usuarios WHERE activo = 1 ORDER BY id`,
  );

  return filas.map((fila) => ({
    id: fila.id,
    nombre: fila.nombre,
    iniciales: fila.iniciales,
    cargo: fila.cargo,
    sede: fila.sede,
    area: fila.area,
    resumen: fila.resumen,
    disponibilidad: fila.disponibilidad,
    habilidades: habilidadesDe(fila.id).map((h) => h.nombre),
    completitud: completitudDe(fila.id).valor,
  }));
}

export function sedesDisponibles(): string[] {
  return consultar<{ nombre: string }>("SELECT nombre FROM sedes ORDER BY orden").map(
    (f) => f.nombre,
  );
}

export function areasDisponibles(): string[] {
  return consultar<{ area: string }>(
    "SELECT DISTINCT area FROM usuarios WHERE activo = 1 ORDER BY area",
  ).map((f) => f.area);
}

/* ------------------------------------------------------------------ */
/* Catalogo de habilidades                                             */
/* ------------------------------------------------------------------ */

export interface CatalogoFila {
  id: number;
  nombre: string;
  categoria: string;
  estado: "aprobada" | "pendiente";
  personas: number;
}

export function catalogoHabilidades(): CatalogoFila[] {
  return consultar<CatalogoFila>(`
    SELECT h.id, h.nombre, h.categoria, h.estado,
           h.personas_base + COUNT(uh.usuario_id) AS personas
    FROM habilidades h
    LEFT JOIN usuario_habilidades uh ON uh.habilidad_id = h.id
    GROUP BY h.id
    ORDER BY personas DESC, h.nombre
  `);
}

export function crearHabilidad(
  nombre: string,
  categoria: string,
  estado: "aprobada" | "pendiente",
): number {
  return ejecutar(
    "INSERT INTO habilidades (nombre, categoria, estado, personas_base) VALUES (?, ?, ?, 0)",
    nombre.trim(),
    categoria.trim(),
    estado,
  );
}

export function habilidadPorNombre(nombre: string): HabilidadFila | null {
  return consultarUno<HabilidadFila>(
    "SELECT id, nombre, categoria, estado FROM habilidades WHERE lower(nombre) = lower(?)",
    nombre.trim(),
  );
}

/* ------------------------------------------------------------------ */
/* Auditoria                                                           */
/* ------------------------------------------------------------------ */

export interface AuditoriaFila {
  id: number;
  actor: string;
  perfil: string;
  accion: string;
  creado_en: string;
}

export function registrarAuditoria(
  actorId: number | null,
  actor: string,
  perfil: string,
  accion: string,
): void {
  ejecutar(
    "INSERT INTO auditoria (actor_id, actor, perfil, accion) VALUES (?, ?, ?, ?)",
    actorId,
    actor,
    perfil,
    accion,
  );
}

export function listarAuditoria(limite = 50): AuditoriaFila[] {
  return consultar<AuditoriaFila>(
    "SELECT id, actor, perfil, accion, creado_en FROM auditoria ORDER BY creado_en DESC, id DESC LIMIT ?",
    limite,
  );
}

/* ------------------------------------------------------------------ */
/* Metricas del tablero (5.7)                                          */
/* ------------------------------------------------------------------ */

export interface FiltroTablero {
  readonly sede?: string;
  readonly area?: string;
}

export interface MetricasTablero {
  /** Con filtro activo se muestran solo las filas reales, sin la base. */
  readonly filtrado: boolean;
  readonly colaboradores: number;
  readonly sincronizados: number;
  readonly perfilesCompletosPct: number;
  readonly variacionPct: number;
  readonly certificacionesVerificadas: number;
  readonly certificacionesPendientes: number;
  readonly consultasAsistente: number;
  readonly habilidades: readonly { nombre: string; personas: number }[];
  readonly sedes: readonly { sede: string; personas: number; porcentaje: number }[];
  readonly proveedores: readonly { proveedor: string; total: number }[];
}

/** Baseline de la organizacion para las certificaciones por proveedor. */
const PROVEEDORES_BASE: readonly [string, number][] = [
  ["Microsoft", 30],
  ["Qlik", 19],
  ["Google Cloud", 9],
  ["Prediqt Academy", 4],
];

export function metricasTablero(filtro: FiltroTablero = {}): MetricasTablero {
  const sede = filtro.sede && filtro.sede !== "todas" ? filtro.sede : null;
  const area = filtro.area && filtro.area !== "todas" ? filtro.area : null;
  const filtrado = sede !== null || area !== null;

  const condiciones = ["u.activo = 1"];
  const parametros: unknown[] = [];
  if (sede) {
    condiciones.push("u.sede = ?");
    parametros.push(sede);
  }
  if (area) {
    condiciones.push("u.area = ?");
    parametros.push(area);
  }
  const donde = condiciones.join(" AND ");

  const usuarios = consultar<{ id: number; sede: string }>(
    `SELECT u.id, u.sede FROM usuarios u WHERE ${donde}`,
    ...parametros,
  );

  const completitudes = usuarios.map((u) => completitudDe(u.id).valor);
  const promedio =
    completitudes.length === 0
      ? 0
      : Math.round(completitudes.reduce((a, b) => a + b, 0) / completitudes.length);

  const previo = Number(configuracion("perfiles_completos_pct_previo", "0"));

  // Habilidades: recuento real y, sin filtro, mas la base de la organizacion.
  const catalogo = catalogoHabilidades();
  const reales = consultar<{ nombre: string; personas: number }>(
    `SELECT h.nombre, COUNT(*) AS personas
     FROM usuario_habilidades uh
     JOIN habilidades h ON h.id = uh.habilidad_id
     JOIN usuarios u ON u.id = uh.usuario_id
     WHERE ${donde}
     GROUP BY h.id`,
    ...parametros,
  );

  const habilidades = (filtrado
    ? reales.map((r) => ({ nombre: r.nombre, personas: r.personas }))
    : catalogo.map((h) => ({ nombre: h.nombre, personas: h.personas }))
  )
    .filter((h) => h.personas > 0)
    .sort((a, b) => b.personas - a.personas)
    .slice(0, 7);

  // Distribucion por sede.
  const sedes = consultar<{ nombre: string; base: number }>(
    "SELECT nombre, base FROM sedes ORDER BY orden",
  )
    .map((s) => {
      const activosAqui = usuarios.filter((u) => u.sede === s.nombre).length;
      return { sede: s.nombre, personas: filtrado ? activosAqui : s.base + activosAqui };
    })
    .filter((s) => s.personas > 0);
  const totalSedes = sedes.reduce((a, s) => a + s.personas, 0);
  const sedesConPorcentaje = sedes.map((s) => ({
    ...s,
    porcentaje: totalSedes === 0 ? 0 : Math.round((s.personas / totalSedes) * 100),
  }));

  // Certificaciones verificadas.
  const verificadasReales =
    consultarUno<{ total: number }>(
      `SELECT COUNT(*) AS total FROM certificaciones c
       JOIN usuarios u ON u.id = c.usuario_id
       WHERE c.insignia = 'verificada' AND ${donde}`,
      ...parametros,
    )?.total ?? 0;
  const verificadas =
    verificadasReales +
    (filtrado ? 0 : Number(configuracion("certificaciones_verificadas_base", "0")));

  // Proveedores: el emisor viene como "Microsoft · 2023".
  const emisores = consultar<{ emisor: string; total: number }>(
    `SELECT c.emisor, COUNT(*) AS total FROM certificaciones c
     JOIN usuarios u ON u.id = c.usuario_id
     WHERE ${donde}
     GROUP BY c.emisor`,
    ...parametros,
  );
  const conteoProveedor = new Map<string, number>();
  for (const fila of emisores) {
    const nombre = (fila.emisor.split("·")[0] ?? fila.emisor).trim() || "Sin emisor";
    conteoProveedor.set(nombre, (conteoProveedor.get(nombre) ?? 0) + fila.total);
  }
  if (!filtrado) {
    for (const [nombre, base] of PROVEEDORES_BASE) {
      conteoProveedor.set(nombre, (conteoProveedor.get(nombre) ?? 0) + base);
    }
  }
  const proveedores = [...conteoProveedor.entries()]
    .map(([proveedor, total]) => ({ proveedor, total }))
    .filter((p) => p.total > 0)
    .sort((a, b) => b.total - a.total);

  const consultasAsistente =
    consultarUno<{ total: number }>(
      "SELECT COUNT(*) AS total FROM auditoria WHERE perfil = 'Consulta al Asistente'",
    )?.total ?? 0;

  return {
    filtrado,
    colaboradores: usuarios.length,
    sincronizados: Number(configuracion("usuarios_sincronizados", "0")),
    perfilesCompletosPct: promedio,
    variacionPct: promedio - previo,
    certificacionesVerificadas: verificadas,
    certificacionesPendientes: Number(configuracion("certificaciones_pendientes", "0")),
    consultasAsistente,
    habilidades,
    sedes: sedesConPorcentaje,
    proveedores,
  };
}

/* ------------------------------------------------------------------ */
/* Configuracion y sincronizacion                                      */
/* ------------------------------------------------------------------ */

export function configuracion(clave: string, porDefecto = ""): string {
  const fila = consultarUno<{ valor: string }>(
    "SELECT valor FROM configuracion WHERE clave = ?",
    clave,
  );
  return fila?.valor ?? porDefecto;
}

export function ultimaSincronizacion(): { origen: string; hecha_en: string } | null {
  return consultarUno("SELECT origen, hecha_en FROM sincronizaciones WHERE id = 1");
}

export function tocarSincronizacion(): void {
  ejecutar("UPDATE sincronizaciones SET hecha_en = datetime('now') WHERE id = 1");
}
