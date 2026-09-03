"use client";

import type { ReactNode } from "react";
import { TemaProvider } from "@/lib/session/TemaProvider";

/** Solo el tema es global; la sesión la inyecta cada zona autenticada. */
export function Providers({ children }: { children: ReactNode }) {
  return <TemaProvider>{children}</TemaProvider>;
}
