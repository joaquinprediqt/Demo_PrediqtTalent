import { cn } from "@/lib/utils/cn";

/** Barra de avance o afinidad (5.1b, 5.3, 5.5). */
export function ProgressBar({
  valor,
  tono = "accent",
  alto = 6,
  className,
}: {
  valor: number;
  tono?: "accent" | "steel";
  alto?: number;
  className?: string;
}) {
  const acotado = Math.max(0, Math.min(100, valor));
  return (
    <div
      className={cn("w-full overflow-hidden rounded-[4px] bg-track", className)}
      style={{ height: alto }}
      role="progressbar"
      aria-valuenow={acotado}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-[4px]", tono === "accent" ? "bg-accent" : "bg-steel")}
        style={{ width: `${acotado}%` }}
      />
    </div>
  );
}
