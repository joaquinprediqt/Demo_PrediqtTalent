import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SCRIPT_TEMA } from "@/lib/session/TemaProvider";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prediqt Learning & Prediqt Talent",
  description:
    "Plataforma interna de personas de Prediqt: formación de Prediqt Academy y banco de talento interno, con acceso único de Microsoft 365.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={barlow.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
