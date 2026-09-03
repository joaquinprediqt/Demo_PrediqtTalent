import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Oculta el boton flotante de Next.js Dev Tools para que la demo se vea
  // igual en desarrollo que en produccion.
  devIndicators: false,
};

export default nextConfig;
