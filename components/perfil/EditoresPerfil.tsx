"use client";

import { useActionState, useRef, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { IconPencil, IconPlus, IconUpload } from "@/components/ui/icons";
import {

  accionAgregarDocumento,
  accionAgregarHabilidad,
  accionBorrarDocumento,
  accionGuardarFoto,
  accionGuardarResumen,
  accionQuitarHabilidad,
} from "@/app/(app)/perfil/acciones";
import { SIN_ESTADO } from "@/app/(app)/perfil/estado";
import type { DocumentoFila, HabilidadFila } from "@/lib/db/consultas";
import { Spinner } from "@/components/ui/Spinner";
import { BotonCancelar } from "@/components/ui/BotonCancelar";

const MAX_FOTO_BYTES = 220_000;

/* ---------------------------------------------------------------- */
/* Foto                                                              */
/* ---------------------------------------------------------------- */

export function EditorFoto({ fotoUrl }: { fotoUrl: string | null }) {
  const [estado, enviar, pendiente] = useActionState(accionGuardarFoto, SIN_ESTADO);
  const [previa, setPrevia] = useState<string>("");
  const formulario = useRef<HTMLFormElement>(null);
  const aviso = estado.error ?? estado.ok;

  function elegir(archivo: File | undefined) {
    if (!archivo) return;
    if (archivo.size > MAX_FOTO_BYTES) {
      setPrevia("");
      alert("La imagen supera los 220 KB. Elige una más ligera.");
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      setPrevia(String(lector.result));
      // Se envía en cuanto la imagen está leída.
      requestAnimationFrame(() => formulario.current?.requestSubmit());
    };
    lector.readAsDataURL(archivo);
  }

  return (
    <form ref={formulario} action={enviar} className="mt-3 w-full">
      <input type="hidden" name="foto" value={previa} />

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-line-input px-3 py-2 text-[12.5px] font-semibold text-steel transition-colors hover:border-accent hover:text-accent">
        <IconPencil size={13} />
        {fotoUrl ? "Cambiar foto" : "Agregar foto"}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => elegir(e.target.files?.[0])}
        />
      </label>

      {fotoUrl && (
        <button
          type="submit"
          onClick={() => setPrevia("")}
          className="mt-1.5 w-full text-[12px] text-faint transition-colors hover:text-ink"
        >
          Quitar foto
        </button>
      )}

      {pendiente && <p className="mt-1.5 text-[12px] text-faint">Guardando…</p>}
      {aviso && !pendiente && (
        <p
          className={`mt-1.5 text-[12px] ${estado.error ? "text-[#8A3B2F]" : "text-accent-strong"}`}
        >
          {aviso}
        </p>
      )}
    </form>
  );
}

/* ---------------------------------------------------------------- */
/* Resumen                                                           */
/* ---------------------------------------------------------------- */

export function EditorResumen({ resumen }: { resumen: string }) {
  const [estado, enviar, pendiente] = useActionState(accionGuardarResumen, SIN_ESTADO);

  return (
    <details className="group mt-3 w-full text-left">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-[5px] text-[12.5px] font-semibold text-accent">
        <IconPencil size={13} />
        {resumen ? "Editar resumen" : "Agregar resumen"}
      </summary>
      <form action={enviar} className="mt-2 animate-desplegar">
        <textarea
          name="resumen"
          rows={3}
          defaultValue={resumen}
          placeholder="Una o dos frases sobre tu especialidad."
          className="w-full resize-y rounded-[8px] border border-line-input bg-transparent px-3 py-2 text-[13px] text-ink outline-none focus:border-accent"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={pendiente}
            className="inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-navy px-4 py-2 text-[12.5px] font-semibold text-white transition-transform duration-150 active:scale-[.98] disabled:opacity-60"
          >
            {pendiente ? (
              <>
                <Spinner /> Guardando…
              </>
            ) : (
              "Guardar resumen"
            )}
          </button>
          <BotonCancelar />
        </div>
        {estado.ok && <p className="mt-1.5 text-[12px] text-accent-strong">{estado.ok}</p>}
      </form>
    </details>
  );
}

/* ---------------------------------------------------------------- */
/* Habilidades                                                       */
/* ---------------------------------------------------------------- */

export function EditorHabilidades({
  propias,
  catalogo,
}: {
  propias: readonly HabilidadFila[];
  catalogo: readonly { id: number; nombre: string; estado: string }[];
}) {
  const [estado, enviar, pendiente] = useActionState(accionAgregarHabilidad, SIN_ESTADO);
  const disponibles = catalogo.filter((c) => !propias.some((p) => p.id === c.id));

  return (
    <>
      <div className="mt-3.5 flex flex-wrap gap-[7px]">
        {propias.map((habilidad) => (
          <form key={habilidad.id} action={accionQuitarHabilidad}>
            <input type="hidden" name="habilidadId" value={habilidad.id} />
            <button type="submit" title={`Quitar ${habilidad.nombre}`}>
              <Chip
                tono={habilidad.estado === "aprobada" ? "accent" : "outline"}
                className="text-[13px]"
              >
                {habilidad.nombre} ×
              </Chip>
            </button>
          </form>
        ))}
        {propias.length === 0 && (
          <p className="text-[13px] text-faint">Todavía no has declarado habilidades.</p>
        )}
      </div>

      {disponibles.length > 0 && (
        <form action={enviar} className="mt-3 flex flex-wrap gap-2">
          <label className="sr-only" htmlFor="habilidad">
            Habilidad del catálogo
          </label>
          <select
            id="habilidad"
            name="habilidad"
            className="min-w-0 flex-1 rounded-[8px] border border-line-input bg-transparent px-3 py-2 text-[13px] text-ink outline-none focus:border-accent"
          >
            {disponibles.map((c) => (
              <option key={c.id} value={c.nombre}>
                {c.nombre}
                {c.estado === "pendiente" ? " (pendiente de aprobar)" : ""}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={pendiente}
            className="flex items-center gap-1.5 rounded-[8px] bg-navy px-3.5 py-2 text-[12.5px] font-semibold text-white disabled:opacity-60"
          >
            <IconPlus size={13} />
            Agregar
          </button>
        </form>
      )}

      {estado.error && <p className="mt-2 text-[12px] text-[#8A3B2F]">{estado.error}</p>}
      {estado.ok && <p className="mt-2 text-[12px] text-accent-strong">{estado.ok}</p>}
    </>
  );
}

/* ---------------------------------------------------------------- */
/* Documentos                                                        */
/* ---------------------------------------------------------------- */

export function EditorDocumentos({ documentos }: { documentos: readonly DocumentoFila[] }) {
  const [estado, enviar, pendiente] = useActionState(accionAgregarDocumento, SIN_ESTADO);
  const formulario = useRef<HTMLFormElement>(null);
  const [nombre, setNombre] = useState("");
  const [detalle, setDetalle] = useState("");

  function elegir(archivo: File | undefined) {
    if (!archivo) return;
    setNombre(archivo.name);
    const kb = Math.max(1, Math.round(archivo.size / 1024));
    const hoy = new Date().toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setDetalle(`Subido ${hoy} · ${kb} KB`);
    requestAnimationFrame(() => formulario.current?.requestSubmit());
  }

  return (
    <>
      {documentos.map((documento) => (
        <div
          key={documento.id}
          className="flex items-center gap-2.5 rounded-[9px] border border-line-soft px-3 py-[11px]"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold text-ink">{documento.nombre}</p>
            <p className="text-[11.5px] text-faint">{documento.detalle}</p>
          </div>
          <span className="rounded-[5px] bg-accent-soft px-[7px] py-[3px] text-[11.5px] font-semibold text-accent-strong">
            {documento.insignia}
          </span>
          <form action={accionBorrarDocumento}>
            <input type="hidden" name="documentoId" value={documento.id} />
            <button
              type="submit"
              className="text-[12px] text-faint transition-colors hover:text-[#8A3B2F]"
              title="Quitar documento"
            >
              ×
            </button>
          </form>
        </div>
      ))}

      <form ref={formulario} action={enviar}>
        <input type="hidden" name="nombre" value={nombre} />
        <input type="hidden" name="detalle" value={detalle} />
        <input type="hidden" name="insignia" value="Certificado" />

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[9px] border border-dashed border-line-strong px-3 py-3.5 text-[13px] font-semibold text-steel transition-colors hover:border-accent hover:text-accent">
          <IconUpload size={15} />
          {pendiente ? "Registrando…" : "Subir CV o certificados en PDF"}
          <input
            type="file"
            accept="application/pdf,image/*"
            className="sr-only"
            onChange={(e) => elegir(e.target.files?.[0])}
          />
        </label>
      </form>

      {estado.error && <p className="text-[12px] text-[#8A3B2F]">{estado.error}</p>}
      {estado.ok && <p className="text-[12px] text-accent-strong">{estado.ok}</p>}
    </>
  );
}
