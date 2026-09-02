import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variante = "accent" | "navy" | "outline" | "sutil";
type Tamano = "sm" | "md" | "lg";

const variantes: Record<Variante, string> = {
  accent: "bg-accent text-white hover:bg-accent-strong",
  navy: "bg-navy text-white hover:bg-[#12564F]",
  outline:
    "border border-line-strong text-ink hover:border-accent hover:text-accent-strong",
  sutil: "border border-line-input text-muted hover:text-ink hover:border-line-strong",
};

const tamanos: Record<Tamano, string> = {
  sm: "rounded-[8px] px-[13px] py-[8px] text-[13px]",
  md: "rounded-[8px] px-[18px] py-[10px] text-[14px]",
  lg: "rounded-control px-[22px] py-[12px] text-[15px]",
};

interface BaseProps {
  variante?: Variante;
  tamano?: Tamano;
  className?: string;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-[9px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60";

export function Button({
  variante = "accent",
  tamano = "md",
  className,
  children,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(base, variantes[variante], tamanos[tamano], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variante = "accent",
  tamano = "md",
  className,
  children,
  href,
  ...rest
}: BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href">) {
  return (
    <Link
      href={href}
      className={cn(base, variantes[variante], tamanos[tamano], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
