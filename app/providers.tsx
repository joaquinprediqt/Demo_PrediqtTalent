"use client";

import type { ReactNode } from "react";
import { SesionProvider } from "@/lib/session/SesionProvider";
import { TemaProvider } from "@/lib/session/TemaProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TemaProvider>
      <SesionProvider>{children}</SesionProvider>
    </TemaProvider>
  );
}
