import { Card, CardHeader } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IconFile, IconPencil, IconPlus, IconUpload } from "@/components/ui/icons";
import {
  DOCUMENTOS,
  FALTA_PERFIL,
  HABILIDADES,
  PERFIL_COMPLETO,
} from "@/lib/data/perfil";
import type { Usuario } from "@/types";

function AccionAgregar({ etiqueta }: { etiqueta: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-[5px] text-[12.5px] font-semibold text-accent transition-opacity hover:opacity-80"
    >
      <IconPlus size={13} />
      {etiqueta}
    </button>
  );
}

/** Columna izquierda de la pantalla 5.3. */
export function ProfileSidebar({ usuario }: { usuario: Usuario }) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col items-center px-[22px] py-6 text-center">
        <div className="relative">
          <div className="grid h-24 w-24 place-items-center rounded-full border border-line bg-steel-soft text-[12px] font-semibold text-faint">
            FOTO
          </div>
          <button
            type="button"
            aria-label="Cambiar foto"
            className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-surface bg-navy text-white"
          >
            <IconPencil size={13} />
          </button>
        </div>

        <h1 className="mt-3.5 text-[21px] font-bold text-ink">{usuario.nombre}</h1>
        <p className="text-[14px] font-medium text-accent">{usuario.cargo}</p>
        <p className="mt-0.5 text-[13px] text-faint">
          Sede {usuario.sede} · {usuario.area} · desde ene 2021
        </p>

        <div className="mt-5 w-full border-t border-line-soft pt-[18px]">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-medium text-muted">Perfil completo</span>
            <span className="text-[15px] font-bold text-accent">{PERFIL_COMPLETO}%</span>
          </div>
          <ProgressBar valor={PERFIL_COMPLETO} alto={7} className="mt-2" />
          <p className="mt-2.5 text-left text-[12.5px] text-faint">{FALTA_PERFIL}</p>
        </div>
      </Card>

      <Card>
        <CardHeader
          tamano="sm"
          titulo="Habilidades técnicas"
          accion={<AccionAgregar etiqueta="Agregar" />}
        />
        <div className="mt-3.5 flex flex-wrap gap-[7px]">
          {HABILIDADES.map((habilidad) => (
            <Chip
              key={habilidad.nombre}
              tono={habilidad.delCatalogo ? "accent" : "outline"}
              className="text-[13px]"
            >
              {habilidad.nombre}
            </Chip>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-faint">
          Solo habilidades del catálogo controlado por el Administrador.
        </p>
      </Card>

      <Card className="flex-1">
        <CardHeader tamano="sm" titulo="Documentos" />
        <div className="mt-3.5 flex flex-col gap-2">
          {DOCUMENTOS.map((documento) => (
            <div
              key={documento.nombre}
              className="flex items-center gap-2.5 rounded-[9px] border border-line-soft px-3 py-[11px]"
            >
              <IconFile size={17} className="shrink-0 text-steel" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">{documento.nombre}</p>
                <p className="text-[11.5px] text-faint">{documento.detalle}</p>
              </div>
              <span className="rounded-[5px] bg-accent-soft px-[7px] py-[3px] text-[11.5px] font-semibold text-accent-strong">
                {documento.insignia}
              </span>
            </div>
          ))}
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-[9px] border border-dashed border-line-strong px-3 py-3.5 text-[13px] font-semibold text-steel transition-colors hover:border-accent hover:text-accent"
          >
            <IconUpload size={15} />
            Subir CV o certificados en PDF
          </button>
        </div>
      </Card>
    </div>
  );
}
