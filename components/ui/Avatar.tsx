import { cn } from "@/lib/utils/cn";

/** Circulo con iniciales, fondo azul acero del canvas. */
export function Avatar({
  iniciales,
  size = 30,
  className,
}: {
  iniciales: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-[#4A7FA7] font-semibold text-white",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      {iniciales}
    </span>
  );
}
