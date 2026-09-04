"use client";

import { useActionState, useRef } from "react";
import { IconPlus } from "@/components/ui/icons";
import { SIN_ESTADO, type EstadoPerfil } from "@/app/(app)/perfil/estado";
import { Spinner } from "@/components/ui/Spinner";

export interface Campo {
  readonly nombre: string;
  readonly etiqueta: string;
  readonly tipo?: "texto" | "area" | "checkbox" | "select";
  readonly requerido?: boolean;
  readonly ayuda?: string;
  readonly opciones?: readonly { valor: string; etiqueta: string }[];
}

interface Props {
  etiqueta: string;
  titulo: string;
  campos: readonly Campo[];
  accion: (previo: EstadoPerfil, datos: FormData) => Promise<EstadoPerfil>;
}

const claseCampo =
  "w-full rounded-[8px] border border-line-input bg-transparent px-3 py-2 text-[13.5px] text-ink outline-none placeholder:text-faint focus:border-accent";

/**
 * Formulario plegable reutilizado por educación, experiencia y
 * certificaciones (pantalla 5.3).
 */
export function AgregarEntrada({ etiqueta, titulo, campos, accion }: Props) {
  const [estado, enviar, pendiente] = useActionState(accion, SIN_ESTADO);
  const detalles = useRef<HTMLDetailsElement>(null);

  return (
    <details ref={detalles} className="group">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-[5px] rounded-[6px] text-[12.5px] font-semibold text-accent transition-opacity hover:opacity-80">
        {/* El + gira hasta convertirse en una × cuando el panel esta abierto. */}
        <IconPlus
          size={13}
          className="transition-transform duration-200 group-open:rotate-45"
        />
        {etiqueta}
      </summary>

      <form
        action={(datos) => {
          enviar(datos);
          detalles.current?.querySelectorAll("input, textarea").forEach((c) => {
            const campo = c as HTMLInputElement;
            if (campo.type === "checkbox") campo.checked = false;
            else campo.value = "";
          });
        }}
        className="mt-3 animate-desplegar rounded-[10px] border border-line-soft bg-surface-raised p-3.5"
      >
        <p className="text-[12px] font-semibold tracking-[0.06em] text-muted">
          {titulo.toUpperCase()}
        </p>

        <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {campos.map((campo) => (
            <div
              key={campo.nombre}
              className={campo.tipo === "area" ? "sm:col-span-2" : undefined}
            >
              <label
                htmlFor={campo.nombre}
                className="text-[12px] font-medium text-muted"
              >
                {campo.etiqueta}
                {campo.requerido && <span className="text-accent"> *</span>}
              </label>

              {campo.tipo === "area" ? (
                <textarea
                  id={campo.nombre}
                  name={campo.nombre}
                  rows={2}
                  required={campo.requerido}
                  placeholder={campo.ayuda}
                  className={`mt-1 resize-y ${claseCampo}`}
                />
              ) : campo.tipo === "checkbox" ? (
                <div className="mt-1 flex h-[38px] items-center">
                  <input
                    id={campo.nombre}
                    name={campo.nombre}
                    type="checkbox"
                    className="h-[17px] w-[17px] accent-[#1F8A7A]"
                  />
                </div>
              ) : campo.tipo === "select" ? (
                <select id={campo.nombre} name={campo.nombre} className={`mt-1 ${claseCampo}`}>
                  {campo.opciones?.map((o) => (
                    <option key={o.valor} value={o.valor}>
                      {o.etiqueta}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={campo.nombre}
                  name={campo.nombre}
                  type="text"
                  required={campo.requerido}
                  placeholder={campo.ayuda}
                  className={`mt-1 ${claseCampo}`}
                />
              )}
            </div>
          ))}
        </div>

        {estado.error && (
          <p role="alert" className="mt-2.5 text-[12.5px] text-[#8A3B2F]">
            {estado.error}
          </p>
        )}
        {estado.ok && (
          <p role="status" className="mt-2.5 text-[12.5px] text-accent-strong">
            {estado.ok}
          </p>
        )}

        <button
          type="submit"
          disabled={pendiente}
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-navy px-4 py-2 text-[13px] font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#12564F] active:scale-[.98] disabled:opacity-60"
        >
          {pendiente ? (<><Spinner /> Guardando…</>) : "Guardar"}
        </button>
      </form>
    </details>
  );
}
