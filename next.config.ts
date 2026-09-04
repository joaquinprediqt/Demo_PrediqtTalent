import type { NextConfig } from "next";

/**
 * Origenes autorizados a invocar Server Actions.
 *
 * Next compara la cabecera `origin` del navegador con el host que reenvia el
 * proxy (`x-forwarded-host`) y aborta la accion si no coinciden. Es una defensa
 * contra CSRF, pero al publicar la demo por un tunel (dev tunnels de VS Code,
 * ngrok, Cloudflare) los dos valores dejan de coincidir y el formulario de
 * inicio de sesion falla con "Invalid Server Actions request".
 *
 * Los comodines cubren las URL de tunel, que cambian en cada sesion. Para otro
 * dominio, agregalo en la variable ORIGENES_PERMITIDOS separando por comas.
 */
const origenesPermitidos = [
  "localhost:3000",
  "127.0.0.1:3000",
  "*.devtunnels.ms",
  "*.ngrok-free.app",
  "*.trycloudflare.com",
  ...(process.env.ORIGENES_PERMITIDOS?.split(",")
    .map((origen) => origen.trim())
    .filter(Boolean) ?? []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Empaqueta el servidor y solo las dependencias que realmente se usan, para
  // que la imagen de Docker no cargue con los 459 MB de node_modules.
  output: "standalone",
  // Oculta el boton flotante de Next.js Dev Tools para que la demo se vea
  // igual en desarrollo que en produccion.
  devIndicators: false,
  experimental: {
    serverActions: {
      allowedOrigins: origenesPermitidos,
    },
  },
};

export default nextConfig;
