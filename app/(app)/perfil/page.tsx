import { redirect } from "next/navigation";
import { ProfileSidebar } from "@/components/perfil/ProfileSidebar";
import { ProfileMain } from "@/components/perfil/ProfileMain";
import { etiquetaActor, sesionActual } from "@/lib/auth/sesion";
import { ETIQUETA_ROL } from "@/lib/data/usuarios";
import {
  certificacionesDe,
  completitudDe,
  documentosDe,
  educacionDe,
  experienciaDe,
  habilidadesDe,
  catalogoHabilidades,
  registrarAuditoria,
  usuarioPorCorreo,
  usuarioPorId,
} from "@/lib/db/consultas";

/**
 * Pantalla 5.3 — Perfil del empleado.
 * Un Reclutador o Administrador puede abrir el perfil de otra persona con
 * ?id=, y esa consulta queda registrada en la auditoría de accesos.
 */
export default async function PerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const sesion = await sesionActual();
  if (!sesion) redirect("/login");
  if (sesion.rol === "empleado" && !sesion.consentimiento) redirect("/consentimiento");

  const { id } = await searchParams;
  const solicitado = id ? Number(id) : sesion.id;
  const puedeVerOtros = sesion.rol !== "empleado";
  const objetivoId = puedeVerOtros ? solicitado : sesion.id;

  const perfil = usuarioPorId(objetivoId) ?? usuarioPorCorreo(sesion.correo);
  if (!perfil) redirect("/login");

  const esPropio = perfil.id === sesion.id;

  if (!esPropio) {
    registrarAuditoria(
      sesion.id,
      etiquetaActor(sesion, ETIQUETA_ROL[sesion.rol]),
      perfil.nombre,
      "Vio perfil completo",
    );
  }

  const [habilidades, documentos, educacion, experiencia, certificaciones] = [
    habilidadesDe(perfil.id),
    documentosDe(perfil.id),
    educacionDe(perfil.id),
    experienciaDe(perfil.id),
    certificacionesDe(perfil.id),
  ];
  const { valor: completitud, faltantes } = completitudDe(perfil.id);

  return (
    <div className="mx-auto w-full max-w-screenframe px-4 py-6 sm:px-5 lg:px-7">
      {!esPropio && (
        <p className="mb-4 rounded-card border border-line bg-surface px-4 py-3 text-[13.5px] text-muted">
          Estás viendo el perfil de {perfil.nombre} como {ETIQUETA_ROL[sesion.rol]}. Esta consulta
          quedó registrada en la auditoría de accesos.
        </p>
      )}

      <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-[352px_1fr]">
        <ProfileSidebar
          usuario={perfil}
          habilidades={habilidades}
          documentos={documentos}
          completitud={completitud}
          faltantes={faltantes}
          catalogo={catalogoHabilidades()}
          editable={esPropio}
        />
        <ProfileMain
          educacion={educacion}
          experiencia={experiencia}
          certificaciones={certificaciones}
          editable={esPropio}
        />
      </div>
    </div>
  );
}
