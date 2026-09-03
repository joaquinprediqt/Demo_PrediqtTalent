import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Empaqueta el servidor y solo las dependencias que realmente se usan, para
  // que la imagen de Docker no cargue con los 459 MB de node_modules.
  output: "standalone",
  // Oculta el boton flotante de Next.js Dev Tools para que la demo se vea
  // igual en desarrollo que en produccion.
  devIndicators: false,
};

export default nextConfig;
