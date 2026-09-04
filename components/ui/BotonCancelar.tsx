"use client";

/**
 * Cancela el formulario plegable que lo contiene: descarta lo escrito y
 * cierra el panel.
 *
 * Funciona por el DOM (closest) en vez de recibir referencias, porque los
 * cuatro paneles que lo usan comparten la misma estructura details > form y
 * asi ninguno necesita pasar props extra.
 *
 * Es type="button" a proposito: un type="reset" limpiaria los campos pero
 * dejaria el panel abierto, y un submit enviaria el formulario.
 */
export function BotonCancelar({ etiqueta = "Cancelar" }: { etiqueta?: string }) {
  return (
    <button
      type="button"
      onClick={(evento) => {
        const boton = evento.currentTarget;
        // reset() devuelve los campos a su valor inicial, no a vacio, asi que
        // al editar el resumen se recupera el texto que ya estaba guardado.
        boton.closest("form")?.reset();
        const panel = boton.closest("details");
        if (panel) panel.open = false;
      }}
      className="inline-flex items-center justify-center rounded-[8px] border border-line-input px-4 py-2 text-[13px] font-semibold text-muted transition-[color,border-color,transform] duration-150 hover:border-line-strong hover:text-ink active:scale-[.98]"
    >
      {etiqueta}
    </button>
  );
}
