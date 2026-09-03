import { Card, CardHeader } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IconFile, IconUpload } from "@/components/ui/icons";
import {
  EditorDocumentos,
  EditorFoto,
  EditorHabilidades,
  EditorResumen,
} from "@/components/perfil/EditoresPerfil";
import type {
  CatalogoFila,
  DocumentoFila,
  HabilidadFila,
  UsuarioFila,
} from "@/lib/db/consultas";

interface Props {
  usuario: UsuarioFila;
  habilidades: readonly HabilidadFila[];
  documentos: readonly DocumentoFila[];
  catalogo: readonly CatalogoFila[];
  completitud: number;
  faltantes: readonly string[];
  /** Solo el dueño del perfil puede modificarlo. */
  editable: boolean;
}

/** Columna izquierda de la pantalla 5.3. */
export function ProfileSidebar({
  usuario,
  habilidades,
  documentos,
  catalogo,
  completitud,
  faltantes,
  editable,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col items-center px-[22px] py-6 text-center">
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

        <h1 className="mt-3.5 text-[21px] font-bold text-ink">{usuario.nombre}</h1>
        <p className="text-[14px] font-medium text-accent">{usuario.cargo}</p>
        <p className="mt-0.5 text-[13px] text-faint">
          Sede {usuario.sede} · {usuario.area}
          {usuario.ingreso ? ` · ${usuario.ingreso}` : ""}
        </p>

        {editable && <EditorFoto fotoUrl={usuario.foto_url} />}

        {usuario.resumen && (
          <p className="mt-3 text-[13px] leading-[1.5] text-muted">{usuario.resumen}</p>
        )}
        {editable && <EditorResumen resumen={usuario.resumen} />}

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
        {editable ? (
          <EditorHabilidades propias={habilidades} catalogo={catalogo} />
        ) : habilidades.length === 0 ? (
          <p className="mt-3 text-[13px] text-faint">Sin habilidades declaradas.</p>
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
          {editable ? (
            <EditorDocumentos documentos={documentos} />
          ) : (
            <>
              {documentos.map((documento) => (
                <div
                  key={documento.id}
                  className="flex items-center gap-2.5 rounded-[9px] border border-line-soft px-3 py-[11px]"
                >
                  <IconFile size={17} className="shrink-0 text-steel" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-ink">
                      {documento.nombre}
                    </p>
                    <p className="text-[11.5px] text-faint">{documento.detalle}</p>
                  </div>
                  <span className="rounded-[5px] bg-accent-soft px-[7px] py-[3px] text-[11.5px] font-semibold text-accent-strong">
                    {documento.insignia}
                  </span>
                </div>
              ))}
              {documentos.length === 0 && (
                <span className="flex items-center justify-center gap-2 rounded-[9px] border border-dashed border-line-strong px-3 py-3.5 text-[13px] text-faint">
                  <IconUpload size={15} />
                  Sin documentos cargados
                </span>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
