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

## Base de datos

SQLite a través de `node:sqlite`, el módulo integrado en Node 22 y posteriores. No hay
dependencias que compilar ni servidor que levantar. El archivo vive en `data/prediqt.db`,
está fuera del control de versiones y **se crea y siembra solo** la primera vez que se
consulta.

- Esquema: `lib/db/esquema.sql`
- Datos iniciales del canvas: `lib/db/semilla.ts`
- Consultas tipadas: `lib/db/consultas.ts`

Para empezar de cero, borra `data/` y recarga.

Las cifras de la organización (128 personas, 64 con SQL, 65 en Lima) no caben en ocho
usuarios de demostración. Se modelan como `personas_base` en `habilidades` y `base` en
`sedes`: el total mostrado es esa base más las filas reales, de modo que los gráficos
coinciden con el canvas y a la vez reaccionan a lo que se cree en la demo.

## Acceso

Todavía no hay Azure Entra ID, así que el botón de Microsoft 365 está deshabilitado a
propósito. El acceso es con correo y contraseña contra la base: la contraseña se guarda
derivada con `scrypt` y sal por usuario (`lib/auth/password.ts`), y la sesión es una fila
en `sesiones` referenciada por una cookie `httpOnly` (`lib/auth/sesion.ts`).

| Correo | Contraseña | Rol |
|---|---|---|
| `mcastillo@prediqtdata.com` | `Empleado2026` | Empleado |
| `jcerna@prediqtdata.com` | `Reclutador2026` | Reclutador |
| `radmin@prediqtdata.com` | `Admin2026` | Administrador |

Hay cinco cuentas más de empleados para poblar la búsqueda de talento; todas usan
`Empleado2026`. `cferreira@prediqtdata.com` está sincronizada pero sin perfil activo, para
poder ver ese estado en la consola de administración.

## Tokens de diseño

Los colores del canvas viven como variables CSS en `app/globals.css`, en dos bloques:
claro por defecto y oscuro bajo `[data-theme="dark"]`. `tailwind.config.ts` los consume,
de modo que el selector claro/oscuro del header no duplica clases. La tipografía es
Barlow, auto-hospedada con `next/font`.

## Pendiente

- Pantallas de Prediqt Learning (catálogo de cursos y avance): no existen en el canvas.
- Datos marcados como `[dato pendiente]` en la landing y el dashboard.
- Conexión real a Azure Entra ID, base de datos y tablero de Qlik Sense.
