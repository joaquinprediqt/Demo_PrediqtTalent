-- Esquema de la demo de Prediqt Talent.
-- Motor: SQLite a traves del modulo node:sqlite integrado en Node 22+.

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre            TEXT    NOT NULL,
  nombre_corto      TEXT    NOT NULL,
  cargo             TEXT    NOT NULL,
  correo            TEXT    NOT NULL UNIQUE,
  hash              TEXT    NOT NULL,
  sal               TEXT    NOT NULL,
  iniciales         TEXT    NOT NULL,
  sede              TEXT    NOT NULL,
  area              TEXT    NOT NULL,
  rol               TEXT    NOT NULL CHECK (rol IN ('empleado', 'reclutador', 'administrador')),
  resumen           TEXT    NOT NULL DEFAULT '',
  disponibilidad    TEXT    NOT NULL DEFAULT 'por confirmar',
  ingreso           TEXT    NOT NULL DEFAULT '',
  foto_url          TEXT,
  activo            INTEGER NOT NULL DEFAULT 1,
  consentimiento_en TEXT,
  creado_en         TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sesiones (
  id         TEXT    PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  creada_en  TEXT    NOT NULL DEFAULT (datetime('now')),
  expira_en  TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sesiones_usuario ON sesiones(usuario_id);

-- Catalogo controlado: el empleado elige de aqui, no escribe texto libre.
-- personas_base = colaboradores de la organizacion que no estan modelados en
-- la demo. El total mostrado es personas_base + las asignaciones reales.
CREATE TABLE IF NOT EXISTS habilidades (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre        TEXT    NOT NULL UNIQUE,
  categoria     TEXT    NOT NULL,
  estado        TEXT    NOT NULL DEFAULT 'aprobada' CHECK (estado IN ('aprobada', 'pendiente')),
  personas_base INTEGER NOT NULL DEFAULT 0,
  creada_en     TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Mismo criterio que personas_base, aplicado a la distribucion por sede.
CREATE TABLE IF NOT EXISTS sedes (
  nombre TEXT    PRIMARY KEY,
  base   INTEGER NOT NULL DEFAULT 0,
  orden  INTEGER NOT NULL DEFAULT 0
);

-- Cifras de la organizacion que no se derivan de las filas de la demo.
CREATE TABLE IF NOT EXISTS configuracion (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario_habilidades (
  usuario_id   INTEGER NOT NULL REFERENCES usuarios(id)    ON DELETE CASCADE,
  habilidad_id INTEGER NOT NULL REFERENCES habilidades(id) ON DELETE CASCADE,
  nivel        INTEGER NOT NULL DEFAULT 3 CHECK (nivel BETWEEN 1 AND 5),
  PRIMARY KEY (usuario_id, habilidad_id)
);

CREATE TABLE IF NOT EXISTS educacion (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  institucion TEXT    NOT NULL,
  programa    TEXT    NOT NULL,
  detalle     TEXT    NOT NULL DEFAULT '',
  periodo     TEXT    NOT NULL DEFAULT '',
  creado_en   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS experiencia (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo     TEXT    NOT NULL,
  periodo    TEXT    NOT NULL DEFAULT '',
  detalle    TEXT    NOT NULL DEFAULT '',
  etiquetas  TEXT    NOT NULL DEFAULT '',
  actual     INTEGER NOT NULL DEFAULT 0,
  creado_en  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS certificaciones (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo     TEXT    NOT NULL,
  emisor     TEXT    NOT NULL DEFAULT '',
  detalle    TEXT    NOT NULL DEFAULT '',
  insignia   TEXT    NOT NULL DEFAULT 'verificada' CHECK (insignia IN ('verificada', 'learning')),
  creado_en  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS documentos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre     TEXT    NOT NULL,
  detalle    TEXT    NOT NULL DEFAULT '',
  insignia   TEXT    NOT NULL DEFAULT 'CV',
  creado_en  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Cada consulta de un Reclutador o Administrador deja rastro aqui.
CREATE TABLE IF NOT EXISTS auditoria (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_id   INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  actor      TEXT    NOT NULL,
  perfil     TEXT    NOT NULL,
  accion     TEXT    NOT NULL,
  creado_en  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria(creado_en DESC);

-- Marca de la ultima sincronizacion del tablero, para el "sincronizado hace X".
CREATE TABLE IF NOT EXISTS sincronizaciones (
  id        INTEGER PRIMARY KEY CHECK (id = 1),
  origen    TEXT NOT NULL,
  hecha_en  TEXT NOT NULL
);
