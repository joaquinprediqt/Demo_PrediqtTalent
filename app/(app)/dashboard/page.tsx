import { redirect } from "next/navigation";
import {
  KpiTile,
  ProgressAreaChart,
  ProviderBars,
  SiteDonut,
  SkillsBarChart,
} from "@/components/dashboard/DashboardCharts";
import { EstadoSincronizacion } from "@/components/dashboard/EstadoSincronizacion";
import { KPIS } from "@/lib/data/metricas";
import { sesionActual } from "@/lib/auth/sesion";
import { configuracion, ultimaSincronizacion } from "@/lib/db/consultas";

/** Pantalla 5.7 — Dashboard de métricas con el tablero interno embebido. */
export default async function DashboardPage() {
  const sesion = await sesionActual();
  if (!sesion) redirect("/login");

  if (sesion.rol === "empleado") {
    return (
      <div className="mx-auto w-full max-w-screenframe px-4 py-8 sm:px-5 lg:px-8">
        <div className="rounded-card border border-line bg-surface px-6 py-8">
          <h1 className="text-title-lg text-ink">Acceso restringido</h1>
          <p className="mt-2 text-body text-muted">
            El tablero de métricas está disponible para los roles Reclutador y Administrador.
          </p>
        </div>
      </div>
    );
  }

  const sincronizacion = ultimaSincronizacion();
  const origen = configuracion("origen_tablero", "Prediqt HR — Talento");

  return (
    <div className="mx-auto flex w-full max-w-screenframe flex-col gap-4 px-4 py-6 sm:px-5 lg:px-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[1.5rem] font-bold tracking-[-0.6px] text-ink sm:text-display-sm">
            Métricas de talento
          </h1>
          <p className="mt-0.5 text-[14.5px] text-muted">Tablero corporativo embebido</p>
        </div>
        {sincronizacion && (
          <EstadoSincronizacion hechaEn={sincronizacion.hecha_en} origen={origen} />
        )}
      </div>

      <section className="overflow-hidden rounded-card border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-navy px-[18px] py-[11px]">
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="text-[13px] font-semibold text-white">{origen}</span>
            <span className="text-[12.5px] text-white/60">Hoja 1 de 3 · Panorama general</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-chip bg-white/[0.14] px-2.5 py-[5px] text-[12px] font-medium text-white">
              Sede: todas
            </span>
            <span className="rounded-chip bg-white/[0.14] px-2.5 py-[5px] text-[12px] font-medium text-white">
              Área: todas
            </span>
            <span className="rounded-chip bg-accent-light px-2.5 py-[5px] text-[12px] font-medium text-navy">
              Selecciones: 0
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 bg-[#FBFCFE] p-[18px] dark:bg-[#0D1F33] sm:grid-cols-2 xl:grid-cols-4">
          {KPIS.map((kpi) => (
            <KpiTile key={kpi.etiqueta} kpi={kpi} />
          ))}

          <div className="sm:col-span-2">
            <SkillsBarChart />
          </div>
          <div className="sm:col-span-2">
            <SiteDonut />
          </div>
          <div className="sm:col-span-2">
            <ProgressAreaChart />
          </div>
          <div className="sm:col-span-2">
            <ProviderBars />
          </div>
        </div>
      </section>
    </div>
  );
}
