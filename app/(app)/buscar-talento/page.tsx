"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CandidateCard } from "@/components/talento/CandidateCard";
import { ButtonLink, Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { IconChevronDown, IconSearch, IconSparkle } from "@/components/ui/icons";
import { CANDIDATOS } from "@/lib/data/candidatos";

const SEDES = ["todas", "Lima", "Quito", "Guayaquil", "Lausana"] as const;
const AREAS = ["todas", "Data Engineering", "Data Science", "Data & Analytics"] as const;

type Sede = (typeof SEDES)[number];
type Area = (typeof AREAS)[number];

/** Pantalla 5.4 — Búsqueda de talento interno. */
export default function BuscarTalentoPage() {
  const [texto, setTexto] = useState("BigQuery");
  const [sede, setSede] = useState<Sede>("Lima");
  const [area, setArea] = useState<Area>("Data Engineering");

  const resultados = useMemo(() => {
    const consulta = texto.trim().toLowerCase();
    return CANDIDATOS.filter((candidato) => {
      const coincideTexto =
        consulta.length === 0 ||
        candidato.nombre.toLowerCase().includes(consulta) ||
        candidato.cargo.toLowerCase().includes(consulta) ||
        candidato.resumen.toLowerCase().includes(consulta) ||
        candidato.habilidades.some((h) => h.toLowerCase().includes(consulta)) ||
        candidato.carencias.some((c) => c.toLowerCase().includes(consulta));
      const coincideSede = sede === "todas" || candidato.sede === sede;
      const coincideArea = area === "todas" || candidato.area === area;
      return coincideTexto && coincideSede && coincideArea;
    });
  }, [texto, sede, area]);

  const filtrosActivos = [
    texto.trim() && { clave: "texto", etiqueta: texto.trim(), limpiar: () => setTexto("") },
    sede !== "todas" && { clave: "sede", etiqueta: sede, limpiar: () => setSede("todas") },
    area !== "todas" && { clave: "area", etiqueta: area, limpiar: () => setArea("todas") },
  ].filter(Boolean) as { clave: string; etiqueta: string; limpiar: () => void }[];

  return (
    <div className="mx-auto flex w-full max-w-screenframe flex-col gap-5 px-5 py-7 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-ink">Buscar talento interno</h1>
          <p className="mt-0.5 text-[15px] text-muted">
            Perfiles de colaboradores de Prediqt, filtrados por habilidad, sede o área.
          </p>
        </div>
        <ButtonLink href="/asistente" variante="navy" tamano="md" className="py-[11px]">
          <IconSparkle size={15} />
          Abrir Asistente de selección
        </ButtonLink>
      </div>

      <section className="rounded-card border border-line bg-surface px-5 py-[18px]">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="flex flex-1 items-center gap-2.5 rounded-control border border-line-input px-[14px] py-[11px]">
            <IconSearch size={17} className="shrink-0 text-faint" />
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Habilidad, nombre o cargo"
              aria-label="Buscar por habilidad, nombre o cargo"
              className="w-full bg-transparent text-[14.5px] text-ink outline-none placeholder:text-faint"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex w-full items-center sm:w-[200px]">
              <span className="sr-only">Sede</span>
              <select
                value={sede}
                onChange={(e) => setSede(e.target.value as Sede)}
                className="w-full appearance-none rounded-control border border-line-input bg-surface px-[14px] py-[11px] text-[14px] font-medium text-ink outline-none"
              >
                {SEDES.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    Sede: {opcion}
                  </option>
                ))}
              </select>
              <IconChevronDown
                size={14}
                className="pointer-events-none absolute right-3.5 text-faint"
              />
            </label>

            <label className="relative flex w-full items-center sm:w-[230px]">
              <span className="sr-only">Área</span>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value as Area)}
                className="w-full appearance-none rounded-control border border-line-input bg-surface px-[14px] py-[11px] text-[14px] font-medium text-ink outline-none"
              >
                {AREAS.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    Área: {opcion}
                  </option>
                ))}
              </select>
              <IconChevronDown
                size={14}
                className="pointer-events-none absolute right-3.5 text-faint"
              />
            </label>

            <Button variante="accent" tamano="lg" className="rounded-control px-6">
              Buscar
            </Button>
          </div>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="mr-0.5 text-[12.5px] text-faint">Filtros activos</span>
          {filtrosActivos.length === 0 && (
            <span className="text-[12.5px] text-faint">ninguno</span>
          )}
          {filtrosActivos.map((filtro) => (
            <button key={filtro.clave} type="button" onClick={filtro.limpiar}>
              <Chip tono="accent">{filtro.etiqueta} ×</Chip>
            </button>
          ))}
          <Chip tono="outline">+ Disponibilidad</Chip>
          <Chip tono="outline">+ Certificación verificada</Chip>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <span className="text-[14px] font-semibold text-muted">
          {resultados.length} {resultados.length === 1 ? "perfil encontrado" : "perfiles encontrados"}
        </span>
        <span className="text-[13.5px] font-medium text-steel">
          Ordenar por: perfil más completo
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resultados.map((candidato) => (
          <CandidateCard key={candidato.id} candidato={candidato} />
        ))}

        <Link
          href="/asistente"
          className="flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line-strong bg-surface px-5 py-[18px] text-center transition-colors hover:border-accent"
        >
          <span className="text-[15px] font-semibold text-ink">¿No encuentras el perfil?</span>
          <span className="max-w-[230px] text-[13.5px] leading-[1.5] text-muted">
            Describe el requerimiento en lenguaje natural y deja que el Asistente revise CVs y
            capacidades.
          </span>
          <span className="mt-0.5 text-[13.5px] font-semibold text-accent">Ir al Asistente →</span>
        </Link>
      </div>
    </div>
  );
}
