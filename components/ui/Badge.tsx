import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Badge de estado en tablas (5.6). */
export function Badge({
  children,
  tono = "activo",
}: {
  children: ReactNode;
  tono?: "activo" | "neutro" | "pendiente";
}) {
  const tonos = {
    activo: "bg-accent-soft text-accent-strong",
    neutro: "bg-[color:var(--surface-raised)] text-faint",
    pendiente: "bg-warn-soft text-warn",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-[5px] px-2 py-[3px] text-[12px] font-semibold",
        tonos[tono],
      )}
    >
      {children}
    </span>
  );
}
