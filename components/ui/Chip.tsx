import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tono = "accent" | "outline" | "warn" | "neutro";

const tonos: Record<Tono, string> = {
  accent: "bg-accent-soft text-accent-strong",
  outline: "border border-line-input text-muted",
  warn: "bg-warn-soft text-warn",
  neutro: "bg-[color:var(--surface-raised)] text-faint",
};

/** Pastilla de habilidad o estado (5.3, 5.4, 5.5, 5.6). */
export function Chip({
  children,
  tono = "accent",
  className,
}: {
  children: ReactNode;
  tono?: Tono;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-chip px-[9px] py-1 text-[12.5px] font-medium",
        tonos[tono],
        className,
      )}
    >
      {children}
    </span>
  );
}
