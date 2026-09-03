import { Card, CardHeader } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IconFile, IconPencil, IconUpload } from "@/components/ui/icons";
import type { DocumentoFila, HabilidadFila, UsuarioFila } from "@/lib/db/consultas";

interface Props {
  usuario: UsuarioFila;
  habilidades: readonly HabilidadFila[];
  documentos: readonly DocumentoFila[];
  completitud: number;
  faltantes: readonly string[];
}

/** Columna izquierda de la pantalla 5.3. */
export function ProfileSidebar({
  usuario,
  habilidades,
  documentos,
  completitud,
  faltantes,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col items-center px-[22px] py-6 text-center">
        <div className="relative">
          {usuario.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={usuario.foto_url}
              alt={usuario.nombre}
              className="h-24 w-24 rounded-full border border-line object-cover"
            />
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-full border border-line bg-steel-soft text-[12px] font-semibold text-faint">
              FOTO
            </div>
          )}
          <span
            className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-surface bg-navy text-white"
            aria-hidden="true"
          >
            <IconPencil size={13} />
          </span>
        </div>

        <h1 className="mt-3.5 text-[21px] font-bold text-ink">{usuario.nombre}</h1>
        <p className="text-[14px] font-medium text-accent">{usuario.cargo}</p>
        <p className="mt-0.5 text-[13px] text-faint">
          Sede {usuario.sede} · {usuario.area}
          {usuario.ingreso ? ` · ${usuario.ingreso}` : ""}
        </p>

        <div className="mt-5 w-full border-t border-line-soft pt-[18px]">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-medium text-muted">Perfil completo</span>
            <span className="text-[15px] font-bold text-accent">{completitud}%</span>
          </div>
          <ProgressBar valor={completitud} alto={7} className="mt-2" />
          {faltantes.length > 0 && (
            <p className="mt-2.5 text-left text-[12.5px] text-faint">
              Falta: {faltantes.join(", ")}.
            </p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader tamano="sm" titulo="Habilidades técnicas" />
        {habilidades.length === 0 ? (
          <p className="mt-3 text-[13px] text-faint">Todavía no has declarado habilidades.</p>
        ) : (
          <div className="mt-3.5 flex flex-wrap gap-[7px]">
            {habilidades.map((habilidad) => (
              <Chip
                key={habilidad.id}
                tono={habilidad.estado === "aprobada" ? "accent" : "outline"}
                className="text-[13px]"
              >
                {habilidad.nombre}
              </Chip>
            ))}
          </div>
        )}
        <p className="mt-3 text-[12px] text-faint">
          Solo habilidades del catálogo controlado por el Administrador.
        </p>
      </Card>

      <Card className="flex-1">
        <CardHeader tamano="sm" titulo="Documentos" />
        <div className="mt-3.5 flex flex-col gap-2">
          {documentos.map((documento) => (
            <div
              key={documento.id}
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
          <span className="flex items-center justify-center gap-2 rounded-[9px] border border-dashed border-line-strong px-3 py-3.5 text-[13px] font-semibold text-steel">
            <IconUpload size={15} />
            Subir CV o certificados en PDF
          </span>
        </div>
      </Card>
    </div>
  );
}
