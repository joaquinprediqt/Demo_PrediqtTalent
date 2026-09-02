# Prediqt Talent & Learning

Esqueleto en Next.js (App Router, TypeScript estricto, Tailwind) de las once pantallas
del canvas `Prediqt Talent Mockups (offline).html`.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:3000
```

## Importante: no compiles mientras el servidor está corriendo

`next dev` y `next build` escriben en la misma carpeta `.next`. Si lanzas `npm run build`
con `npm run dev` activo, la compilación de producción sobrescribe los recursos del modo
desarrollo y **las páginas se quedan sin CSS** (la hoja de estilos pasa a devolver 404).

Si ocurre:

```bash
# detén el servidor, luego
rm -rf .next
npm run dev
```

Para compilar, para primero el servidor de desarrollo.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción (con el dev detenido) |
| `npm run start` | Sirve la compilación de producción |
| `npm run typecheck` | `tsc --noEmit` |

## Pantallas

| Canvas | Ruta | Rol |
|---|---|---|
| 5.1 Landing | `/` | público |
| 5.1a Inicio de sesión | `/login` | público |
| 5.1b Elegir módulo | `/seleccionar-modulo` | los tres |
| 5.2 Consentimiento | `/consentimiento` | Empleado |
| 5.3 Perfil del empleado | `/perfil` | los tres |
| 5.4 Búsqueda de talento | `/buscar-talento` | Reclutador, Administrador |
| 5.5 Asistente de selección | `/asistente` | Reclutador, Administrador |
| 5.6 Consola de administración | `/administracion` | Administrador |
| 5.7 Dashboard de métricas | `/dashboard` | Reclutador, Administrador |

## Sesión simulada

Todavía no hay Azure Entra ID. En `/login` se elige uno de los tres roles y la sesión se
guarda en `localStorage` (`lib/session/SesionProvider.tsx`). El botón de Microsoft 365
aparece deshabilitado a propósito.

## Tokens de diseño

Los colores del canvas viven como variables CSS en `app/globals.css`, en dos bloques:
claro por defecto y oscuro bajo `[data-theme="dark"]`. `tailwind.config.ts` los consume,
de modo que el selector claro/oscuro del header no duplica clases. La tipografía es
Barlow, auto-hospedada con `next/font`.

## Pendiente

- Pantallas de Prediqt Learning (catálogo de cursos y avance): no existen en el canvas.
- Datos marcados como `[dato pendiente]` en la landing y el dashboard.
- Conexión real a Azure Entra ID, base de datos y tablero de Qlik Sense.
