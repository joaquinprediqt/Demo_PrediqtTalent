"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { useSesion } from "@/lib/session/SesionProvider";

/** Zona autenticada: sin rol elegido en 5.1a se vuelve al inicio de sesion. */
export default function AppLayout({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useSesion();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && !usuario) router.replace("/login");
  }, [cargando, usuario, router]);

  if (cargando || !usuario) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg">
        <p className="text-body text-muted">Cargando sesión…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
