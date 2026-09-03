import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconCheckCircle, IconUpload } from "@/components/ui/icons";
import { FormAsignarRol, FormNuevaHabilidad } from "@/components/admin/FormulariosAdmin";
import { ULTIMA_CARGA } from "@/lib/data/administracion";
import { ETIQUETA_ROL } from "@/lib/data/usuarios";
import type { AuditoriaFila, CatalogoFila, UsuarioFila } from "@/lib/db/consultas";

const columnasUsuarios = "1.5fr 1.4fr 1fr 0.9fr 0.7fr";

function BotonExportar({ recurso, etiqueta }: { recurso: string; etiqueta: string }) {
  return (
    <a
      href={`/api/exportar/${recurso}`}
      className="rounded-[8px] border border-line-input px-[13px] py-2 text-[13px] font-semibold text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {etiqueta}
    </a>
  );
}

export function PanelUsuarios({
  usuarios,
  sincronizados,
}: {
  usuarios: readonly UsuarioFila[];
  sincronizados: number;
}) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
        <CardHeader
          titulo="Gestión de usuarios y roles"
          descripcion={`Cuentas sincronizadas desde Microsoft Entra ID · ${sincronizados} usuarios`}
        />
        <div className="flex flex-wrap items-start gap-2">
          <BotonExportar recurso="usuarios" etiqueta="Exportar" />
          <FormAsignarRol
            usuarios={usuarios.map((u) => ({ id: u.id, nombre: u.nombre, rol: u.rol }))}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div
            className="grid border-y border-line-soft bg-surface-raised px-5 py-[11px] text-label text-muted"
            style={{ gridTemplateColumns: columnasUsuarios }}
          >
            <span>NOMBRE</span>
            <span>CUENTA</span>
            <span>ROL</span>
            <span>SEDE</span>
            <span>ESTADO</span>
          </div>
          {usuarios.map((fila) => (
            <div
              key={fila.id}
              className="grid items-center border-b border-line-soft px-5 py-[13px] text-[14px] text-ink-2 last:border-b-0"
              style={{ gridTemplateColumns: columnasUsuarios }}
            >
              <span className="font-semibold text-ink">{fila.nombre}</span>
              <span>{fila.correo}</span>
              <span>{ETIQUETA_ROL[fila.rol]}</span>
              <span>{fila.sede}</span>
              <Badge tono={fila.activo === 1 ? "activo" : "neutro"}>
                {fila.activo === 1 ? "Activo" : "Sin perfil"}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export function PanelAuditoria({ filas }: { filas: readonly AuditoriaFila[] }) {
  const columnas = "1.1fr 1.2fr 1fr 0.8fr";

  return (
    <Card padding="sm" className="flex-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <CardHeader
          titulo="Auditoría de accesos"
          descripcion="Qué perfil consultó cada Reclutador o Administrador, y cuándo"
        />
        <BotonExportar recurso="auditoria" etiqueta="Exportar CSV" />
      </div>

      <div className="mt-3 overflow-x-auto">
        <div className="min-w-[700px]">
          <div
            className="grid border-b border-line-soft py-2.5 text-label text-muted"
            style={{ gridTemplateColumns: columnas }}
          >
            <span>QUIÉN CONSULTÓ</span>
            <span>PERFIL CONSULTADO</span>
            <span>ACCIÓN</span>
            <span>FECHA Y HORA</span>
          </div>
          {filas.map((fila) => (
            <div
              key={fila.id}
              className="grid border-b border-line-soft py-[11px] text-[13.5px] text-ink-2 last:border-b-0"
              style={{ gridTemplateColumns: columnas }}
            >
              <span>{fila.actor}</span>
              <span>{fila.perfil}</span>
              <span>{fila.accion}</span>
              <span>{fila.creado_en}</span>
            </div>
          ))}
          {filas.length === 0 && (
            <p className="py-4 text-[13.5px] text-faint">Sin consultas registradas todavía.</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export function PanelCatalogo({ catalogo }: { catalogo: readonly CatalogoFila[] }) {
  return (
    <Card padding="sm" className="flex-1">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-[17px] font-bold text-ink">Catálogo de habilidades</h2>
        <div className="flex flex-wrap items-start gap-3">
          <BotonExportar recurso="catalogo" etiqueta="Exportar" />
          <FormNuevaHabilidad />
        </div>
      </div>
      <p className="mt-1 text-[13px] leading-[1.5] text-faint">
        Lista controlada: el Empleado elige de aquí, no escribe texto libre.
      </p>

      <div className="mt-3.5 overflow-hidden rounded-[9px] border border-line-soft">
        {catalogo.map((habilidad) => (
          <div
            key={habilidad.id}
            className="flex items-center justify-between gap-3 border-b border-line-soft px-3 py-2.5 last:border-b-0"
          >
            <span className="min-w-0">
              <span className="text-[14px] font-semibold text-ink">{habilidad.nombre}</span>
              <span className="ml-2 text-[12.5px] text-faint">{habilidad.categoria}</span>
            </span>
            {habilidad.estado === "pendiente" ? (
              <Badge tono="pendiente">pendiente de aprobar</Badge>
            ) : (
              <span className="shrink-0 text-[12.5px] font-medium text-steel">
                {habilidad.personas} personas
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function PanelCargaMasiva() {
  return (
    <Card padding="sm">
      <h2 className="text-[17px] font-bold text-ink">Carga masiva de datos base</h2>
      <p className="mt-1 text-[13px] leading-[1.5] text-faint">
        Excel o CSV con: nombre, cargo, área, fecha de ingreso.
      </p>

      <div className="mt-3.5 flex flex-col items-center gap-[7px] rounded-[10px] border border-dashed border-line-strong px-4 py-5 text-center">
        <IconUpload size={22} className="text-steel" />
        <span className="text-[14px] font-semibold text-ink">
          Arrastra el archivo o selecciónalo
        </span>
        <span className="text-[12.5px] text-faint">
          .xlsx o .csv · máx. 5 MB · plantilla descargable
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2.5 rounded-[9px] bg-surface-raised px-3 py-[11px]">
        <IconCheckCircle size={16} className="shrink-0 text-accent" />
        <span className="text-[13px] text-ink-2">
          Última carga: <span className="font-semibold text-ink">{ULTIMA_CARGA.archivo}</span> ·{" "}
          {ULTIMA_CARGA.detalle}
        </span>
      </div>

      <p className="mt-2 text-[12px] text-faint">
        Pendiente por decisión tuya: esta sección queda tal cual hasta definir el formato.
      </p>
    </Card>
  );
}
