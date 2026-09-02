"use client";

import { ProfileSidebar } from "@/components/perfil/ProfileSidebar";
import { ProfileMain } from "@/components/perfil/ProfileMain";
import { useSesion } from "@/lib/session/SesionProvider";
import { USUARIOS } from "@/lib/data/usuarios";

/**
 * Pantalla 5.3 — Perfil del empleado, vista propia y editable.
 * Reclutador y Administrador ven el mismo perfil de muestra en modo consulta.
 */
export default function PerfilPage() {
  const { usuario } = useSesion();
  if (!usuario) return null;

  const perfil = usuario.rol === "empleado" ? usuario : USUARIOS.empleado;
  const esPropio = usuario.rol === "empleado";

  return (
    <div className="mx-auto w-full max-w-screenframe px-5 py-6 lg:px-7">
      {!esPropio && (
        <p className="mb-4 rounded-card border border-line bg-surface px-4 py-3 text-[13.5px] text-muted">
          Estás viendo el perfil de {perfil.nombre} como {usuario.rol}. Esta consulta queda
          registrada en la auditoría de accesos.
        </p>
      )}

      <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-[352px_1fr]">
        <ProfileSidebar usuario={perfil} />
        <ProfileMain />
      </div>
    </div>
  );
}
