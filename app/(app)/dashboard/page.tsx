import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  KpiTile,
  ProgressAreaChart,
  ProviderBars,
  SiteDonut,
  SkillsBarChart,
} from "@/components/dashboard/DashboardCharts";
import { EstadoSincronizacion } from "@/components/dashboard/EstadoSincronizacion";
import { FiltrosTablero } from "@/components/dashboard/FiltrosTablero";
import { sesionActual } from "@/lib/auth/sesion";
import {
  areasDisponibles,
  configuracion,
  metricasTablero,
  sedesDisponibles,
  ultimaSincronizacion,
} from "@/lib/db/consultas";

/** Pantalla 5.7 — Dashboard de métricas con el tablero interno embebido. */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ sede?: string; area?: string }>;
}) {
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

  const { sede, area } = await searchParams;
  const metricas = metricasTablero({ sede, area });
  const sincronizacion = ultimaSincronizacion();
  const origen = configuracion("origen_tablero", "Prediqt HR — Talento");

  const variacion =
    metricas.variacionPct === 0
      ? "sin variación vs. el corte anterior"
      : `${metricas.variacionPct > 0 ? "+" : ""}${metricas.variacionPct} pts vs. el corte anterior`;

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
          <Suspense fallback={null}>
            <FiltrosTablero sedes={sedesDisponibles()} areas={areasDisponibles()} />
          </Suspense>
        </div>

        {metricas.filtrado && (
          <p className="border-b border-line-soft bg-surface-raised px-[18px] py-2.5 text-[12.5px] text-muted">
            Con filtro activo se cuentan solo los perfiles modelados en la demo, sin la base de la
            organización. Por eso las cifras bajan respecto a la vista sin filtrar.
          </p>
        )}

        <div className="grid grid-cols-1 gap-3.5 bg-[#FBFCFE] p-[18px] dark:bg-[#0D1F33] sm:grid-cols-2 xl:grid-cols-4">
          <KpiTile
            etiqueta="Perfiles completos"
            valor={`${metricas.perfilesCompletosPct}%`}
            nota={variacion}
            tono={metricas.variacionPct > 0 ? "accent" : "neutro"}
          />
          <KpiTile
            etiqueta="Colaboradores con perfil"
            valor={String(
              metricas.filtrado
                ? metricas.colaboradores
                : metricas.sedes.reduce((a, s) => a + s.personas, 0),
            )}
            nota={`de ${metricas.sincronizados} sincronizados`}
          />
          <KpiTile
            etiqueta="Certificaciones verificadas"
            valor={String(metricas.certificacionesVerificadas)}
            nota={`${metricas.certificacionesPendientes} pendientes de verificar`}
          />
          <KpiTile
            etiqueta="Consultas al Asistente"
            valor={String(metricas.consultasAsistente)}
            nota="registradas en la auditoría"
          />

          <div className="sm:col-span-2">
            <SkillsBarChart habilidades={metricas.habilidades} />
          </div>
          <div className="sm:col-span-2">
            <SiteDonut sedes={metricas.sedes} />
          </div>
          <div className="sm:col-span-2">
            <ProgressAreaChart />
          </div>
          <div className="sm:col-span-2">
            <ProviderBars proveedores={metricas.proveedores} />
          </div>
        </div>
      </section>
    </div>
  );
}
