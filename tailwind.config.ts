import type { Config } from "tailwindcss";

/**
 * Tokens tomados literalmente de "Prediqt Talent Mockups (offline).html".
 * Los colores se resuelven contra variables CSS definidas en app/globals.css,
 * de modo que el selector claro/oscuro del header no duplica clases.
 */
const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        line: "var(--border)",
        "line-soft": "var(--border-soft)",
        "line-input": "var(--border-input)",
        "line-strong": "var(--border-strong)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        accent: "var(--accent)",
        "accent-strong": "var(--accent-strong)",
        "accent-soft": "var(--accent-soft)",
        "accent-light": "var(--accent-light)",
        steel: "var(--steel)",
        "steel-soft": "var(--steel-soft)",
        track: "var(--track)",
        chip: "var(--chip)",
        warn: "var(--warn)",
        "warn-soft": "var(--warn-soft)",
        navy: "#0B1F3A",
      },
      fontFamily: {
        sans: ["var(--font-barlow)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Escala literal del canvas (px -> rem sobre base 16)
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.2em", fontWeight: "600" }],
        label: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
        "body-xs": ["0.75rem", { lineHeight: "1.5" }],
        "body-sm": ["0.78125rem", { lineHeight: "1.5" }],
        "body-md": ["0.84375rem", { lineHeight: "1.5" }],
        body: ["0.90625rem", { lineHeight: "1.55" }],
        "body-lg": ["0.96875rem", { lineHeight: "1.62" }],
        "body-xl": ["1.0625rem", { lineHeight: "1.6" }],
        "title-sm": ["0.9375rem", { lineHeight: "1.3", fontWeight: "700" }],
        "title-md": ["1.0625rem", { lineHeight: "1.3", fontWeight: "700" }],
        "title-lg": ["1.3125rem", { lineHeight: "1.2", fontWeight: "700" }],
        "display-sm": ["1.75rem", { lineHeight: "1.1", letterSpacing: "-0.6px", fontWeight: "700" }],
        "display-md": ["2rem", { lineHeight: "1.08", letterSpacing: "-0.8px", fontWeight: "700" }],
        "display-lg": ["2.875rem", { lineHeight: "1.06", letterSpacing: "-1.3px", fontWeight: "700" }],
        "display-xl": ["3.25rem", { lineHeight: "1.03", letterSpacing: "-1.6px", fontWeight: "700" }],
      },
      borderRadius: {
        chip: "6px",
        control: "9px",
        card: "12px",
        "card-lg": "14px",
        "card-xl": "16px",
      },
      boxShadow: {
        card: "0 10px 30px rgba(11,31,58,.07)",
        "card-hover": "0 14px 34px rgba(31,138,122,.16)",
        "card-hover-steel": "0 14px 34px rgba(74,127,167,.18)",
        frame: "0 18px 46px rgba(11,31,58,.14)",
        focus: "0 0 0 3px rgba(31,138,122,.12)",
      },
      backgroundImage: {
        "grad-header": "linear-gradient(90deg,#0B1F3A 0%,#123049 55%,#12564F 100%)",
        "grad-header-dark": "linear-gradient(90deg,#07121F 0%,#0C2033 55%,#0B3B36 100%)",
        "grad-hero": "linear-gradient(155deg,#0B1F3A 0%,#123049 52%,#12564F 100%)",
        "grad-logo": "linear-gradient(135deg,#0B1F3A,#1F8A7A)",
        grid: [
          "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px)",
          "linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
        ].join(","),
      },
      backgroundSize: {
        gridcell: "48px 48px",
      },
      maxWidth: {
        screenframe: "1440px",
      },
      /**
       * Movimiento discreto: entradas cortas y sin rebotes. Todo esto queda
       * anulado por el bloque prefers-reduced-motion de app/globals.css.
       */
      keyframes: {
        aparecer: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        desplegar: {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        globo: {
          from: { opacity: "0", transform: "translateY(3px) scale(.96)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        // Las barras crecen desde su base, no desde el centro.
        crecer: {
          from: { transform: "scaleY(0)" },
          to: { transform: "scaleY(1)" },
        },
        // Igual, en horizontal, para las barras de proveedores.
        estirar: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        latido: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".55", transform: "scale(.82)" },
        },
      },
      animation: {
        aparecer: "aparecer .28s ease-out both",
        desplegar: "desplegar .18s ease-out both",
        globo: "globo .13s ease-out both",
        crecer: "crecer .5s cubic-bezier(.22,1,.36,1) both",
        estirar: "estirar .5s cubic-bezier(.22,1,.36,1) both",
        latido: "latido 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
