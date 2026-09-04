import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({
  children,
  className,
  padding = "md",
  animada = true,
}: {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  /** Entrada progresiva al montar. Se desactiva en listas muy largas. */
  animada?: boolean;
}) {
  const paddings = {
    none: "",
    sm: "px-5 py-4",
    md: "px-[22px] py-5",
    lg: "px-6 py-[22px]",
  } as const;

  return (
    <section
      className={cn(
        "rounded-card border border-line bg-surface",
        animada && "animate-aparecer",
        paddings[padding],
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Cabecera de tarjeta con titulo y accion opcional a la derecha (5.3, 5.6). */
export function CardHeader({
  titulo,
  descripcion,
  accion,
  tamano = "md",
}: {
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
  tamano?: "sm" | "md";
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className={cn("font-bold text-ink", tamano === "md" ? "text-[17px]" : "text-[15px]")}>
          {titulo}
        </h2>
        {descripcion && <p className="mt-px text-[13px] text-faint">{descripcion}</p>}
      </div>
      {accion}
    </div>
  );
}
