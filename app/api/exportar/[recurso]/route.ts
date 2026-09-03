import { NextResponse } from "next/server";
import { etiquetaActor, sesionActual } from "@/lib/auth/sesion";
import { ETIQUETA_ROL } from "@/lib/data/usuarios";
import {
  catalogoHabilidades,
  listarAuditoria,
  listarUsuarios,
  registrarAuditoria,
} from "@/lib/db/consultas";

/** Escapa un valor para CSV: comillas dobles y separador punto y coma. */
function celda(valor: unknown): string {
  const texto = String(valor ?? "");
  return `"${texto.replace(/"/g, '""')}"`;
}

function aCsv(cabeceras: readonly string[], filas: readonly unknown[][]): string {
  const lineas = [cabeceras.map(celda).join(";")];
  for (const fila of filas) lineas.push(fila.map(celda).join(";"));
  // BOM para que Excel en Windows reconozca el UTF-8 y no rompa las tildes.
  return `﻿${lineas.join("\r\n")}\r\n`;
}

const RECURSOS = ["usuarios", "auditoria", "catalogo"] as const;
type Recurso = (typeof RECURSOS)[number];

function esRecurso(valor: string): valor is Recurso {
  return (RECURSOS as readonly string[]).includes(valor);
}

export async function GET(
  _peticion: Request,
  { params }: { params: Promise<{ recurso: string }> },
) {
  const sesion = await sesionActual();
  if (!sesion) {
    return NextResponse.json({ error: "Sin sesión" }, { status: 401 });
  }
  if (sesion.rol === "empleado") {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  const { recurso } = await params;
  if (!esRecurso(recurso)) {
    return NextResponse.json({ error: "Recurso desconocido" }, { status: 404 });
  }

  let csv: string;
  let nombre: string;

  if (recurso === "usuarios") {
    if (sesion.rol !== "administrador") {
      return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
    }
    csv = aCsv(
      ["Nombre", "Cuenta", "Rol", "Sede", "Área", "Estado"],
      listarUsuarios().map((u) => [
        u.nombre,
        u.correo,
        ETIQUETA_ROL[u.rol],
        u.sede,
        u.area,
        u.activo === 1 ? "Activo" : "Sin perfil",
      ]),
    );
    nombre = "usuarios";
  } else if (recurso === "auditoria") {
    csv = aCsv(
      ["Quién consultó", "Perfil consultado", "Acción", "Fecha y hora"],
      listarAuditoria(500).map((a) => [a.actor, a.perfil, a.accion, a.creado_en]),
    );
    nombre = "auditoria";
  } else {
    csv = aCsv(
      ["Habilidad", "Categoría", "Estado", "Personas"],
      catalogoHabilidades().map((h) => [h.nombre, h.categoria, h.estado, h.personas]),
    );
    nombre = "catalogo-habilidades";
  }

  registrarAuditoria(
    sesion.id,
    etiquetaActor(sesion, ETIQUETA_ROL[sesion.rol]),
    `Exportación de ${nombre}`,
    "Descargó CSV",
  );

  const fecha = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="prediqt-${nombre}-${fecha}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
