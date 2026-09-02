/** Pie de 52px de la landing (5.1). */
export function PublicFooter() {
  return (
    <footer className="shrink-0 border-t border-line bg-surface">
      <div className="mx-auto flex min-h-[52px] max-w-screenframe flex-col items-start justify-between gap-2 px-6 py-3 text-body-xs text-muted sm:flex-row sm:items-center sm:py-0 lg:px-10">
        <span>© 2026 Prediqt · Data to AI</span>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span>Tratamiento de datos personales (Ley N.° 29733)</span>
          <span>Soporte TI</span>
        </div>
      </div>
    </footer>
  );
}
