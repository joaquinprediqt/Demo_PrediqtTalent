import { redirect } from "next/navigation";
import {
  PanelAuditoria,
  PanelCargaMasiva,
  PanelCatalogo,
  PanelUsuarios,
} from "@/components/admin/AdminPanels";
import { AdminTabs } from "@/components/admin/FormulariosAdmin";
import { sesionActual } from "@/lib/auth/sesion";
import {
  catalogoHabilidades,
  configuracion,
  listarAuditoria,
  listarUsuarios,
} from "@/lib/db/consultas";

/** Pantalla 5.6 — Consola de administración. */
export default async function AdministracionPage() {
  const sesion = await sesionActual();
  if (!sesion) redirect("/login");

  if (sesion.rol !== "administrador") {
    return (
      <div className="mx-auto w-full max-w-screenframe px-4 py-8 sm:px-5 lg:px-8">
        <div className="rounded-card border border-line bg-surface px-6 py-8">
          <h1 className="text-title-lg text-ink">Acceso restringido</h1>
          <p className="mt-2 text-body text-muted">
            La consola de administración solo está disponible para el rol Administrador. Tu sesión
            actual es {sesion.rol}.
          </p>
        </div>
      </div>
    );
  }

  const usuarios = listarUsuarios();
  const catalogo = catalogoHabilidades();
  const auditoria = listarAuditoria(50);
  const sincronizados = Number(configuracion("usuarios_sincronizados", "0"));

  return (
    <div className="mx-auto flex w-full max-w-screenframe flex-col gap-[18px] px-4 py-6 sm:px-5 lg:px-7">
      <AdminTabs
        pestanas={[
          {
            clave: "Usuarios y roles",
            contenido: (
              <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[1fr_396px]">
                <div className="flex flex-col gap-[18px]">
                  <PanelUsuarios usuarios={usuarios} sincronizados={sincronizados} />
                  <PanelAuditoria filas={auditoria} />
                </div>
                <div className="flex flex-col gap-[18px]">
                  <PanelCatalogo catalogo={catalogo} />
                  <PanelCargaMasiva />
                </div>
              </div>
            ),
          },
          {
            clave: "Catálogo de habilidades",
            contenido: (
              <div className="max-w-[720px]">
                <PanelCatalogo catalogo={catalogo} />
              </div>
            ),
          },
          {
            clave: "Carga masiva",
            contenido: (
              <div className="max-w-[720px]">
                <PanelCargaMasiva />
              </div>
            ),
          },
          {
            clave: "Auditoría de accesos",
            contenido: <PanelAuditoria filas={auditoria} />,
          },
        ]}
      />
    </div>
  );
}
