import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { SesionProvider } from "@/lib/session/SesionProvider";
import { sesionActual } from "@/lib/auth/sesion";

/** Zona autenticada: sin cookie válida se vuelve al inicio de sesión. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const usuario = await sesionActual();
  if (!usuario) redirect("/login");

  return (
    <SesionProvider usuario={usuario}>
      <div className="flex min-h-screen flex-col bg-bg">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </div>
    </SesionProvider>
  );
}
