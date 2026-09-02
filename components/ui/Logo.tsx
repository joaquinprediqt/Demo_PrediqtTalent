import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  /**
   * "publico" = marca completa sobre fondo claro (pantallas 5.1 / 5.1a / 5.1b).
   * "app"     = marca compacta sobre el header con degradado (5.2 en adelante).
   */
  variante?: "publico" | "app";
  href?: string;
  className?: string;
}

export function Logo({ variante = "publico", href = "/", className }: LogoProps) {
  const contenido =
    variante === "publico" ? (
      <span className="flex items-center gap-[11px]">
        <span className="grid h-[30px] w-[30px] place-items-center rounded-[8px] bg-grad-logo text-[15px] font-bold text-white">
          P
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-[18px] font-bold tracking-[-0.3px] text-ink">PREDIQT</span>
          <span className="mt-[3px] text-[9px] font-medium tracking-[0.22em] text-steel">
            DATA TO AI
          </span>
        </span>
      </span>
    ) : (
      <span className="flex items-center gap-[10px]">
        <span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-accent text-[13px] font-bold text-white">
          P
        </span>
        <span className="text-[16px] font-bold text-white">
          Prediqt <span className="font-normal text-[#9FC3D6]">Talent</span>
        </span>
      </span>
    );

  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      {contenido}
    </Link>
  );
}
