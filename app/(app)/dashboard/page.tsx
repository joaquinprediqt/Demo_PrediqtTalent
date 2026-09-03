"use client";

import {
  KpiTile,
  ProgressAreaChart,
  ProviderBars,
  SiteDonut,
  SkillsBarChart,
} from "@/components/dashboard/DashboardCharts";
import { ESTADO_SINCRONIZACION, KPIS } from "@/lib/data/metricas";
import { useSesion } from "@/lib/session/SesionProvider";

/** Pantalla 5.7 — Dashboard de métricas con el tablero de Qlik Sense embebido. */
export default function DashboardPage() {
  const usuario = useSesion();

  if (usuario.rol === "empleado") {
    return (
      <div className="mx-auto w-full max-w-screenframe px-5 py-8 lg:px-8">
        <div className="rounded-card border border-line bg-surface px-6 py-8">
          <h1 className="text-title-lg text-ink">Acceso restringido</h1>
          <p className="mt-2 text-body text-muted">
            El tablero de métricas está disponible para los roles Reclutador y Administrador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-screenframe flex-col gap-4 px-5 py-6 lg:px-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-ink">Métricas de talento</h1>
          <p className="mt-0.5 text-[14.5px] text-muted">
            Tablero corporativo embebido · datos al 25 ago 2026
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-control border border-line bg-surface px-3.5 py-2.5 text-[13.5px] font-medium text-ink-2">
          <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          {ESTADO_SINCRONIZACION}
        </div>
      </div>

      <section className="overflow-hidden rounded-card border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-navy px-[18px] py-[11px]">
          <div className="flex flex-wrap items-center gap-3.5">
            <span className="text-[13px] font-semibold text-white">Prediqt HR — Talento</span>
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

          <div className="sm:col-span-2 xl:col-span-2">
            <SkillsBarChart />
          </div>
          <div className="sm:col-span-2 xl:col-span-2">
            <SiteDonut />
          </div>
          <div className="sm:col-span-2 xl:col-span-2">
            <ProgressAreaChart />
          </div>
          <div className="sm:col-span-2 xl:col-span-2">
            <ProviderBars />
          </div>
        </div>
      </section>
    </div>
  );
}
