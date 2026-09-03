# Prediqt Talent & Learning

Esqueleto en Next.js (App Router, TypeScript estricto, Tailwind) de las once pantallas
del canvas `Prediqt Talent Mockups (offline).html`.

## Arrancar

Requiere **Node 23.4 o superior** (se probó con v24.19). El acceso a datos usa
`node:sqlite`, un módulo incorporado que no existe en Node 20 y que en Node 22 exige la
bandera `--experimental-sqlite`.

```bash
npm install
npm run dev      # http://localhost:3000
```

## Docker

Para levantar la demo con Docker Desktop, sin depender de la instalación de Node.

### La primera vez

```bash
cp .env.example .env
```

En PowerShell:

```powershell
Copy-Item .env.example .env
```

Ninguna de esas variables es secreta: la demo todavía no se conecta a ningún servicio
externo. Aun así `.env` está en `.gitignore`.

### Levantar

```bash
docker compose up -d --build     # http://localhost:3000
```

La primera construcción tarda alrededor de un minuto; las siguientes reutilizan la caché
de capas y solo repiten la compilación si cambió el código.

### Ver estado y registros

```bash
docker compose ps                # debe decir "Up (healthy)"
docker compose logs -f web       # Ctrl+C para dejar de seguirlos
```

El healthcheck consulta la ruta principal cada 30 s, con 40 s de margen para el primer
arranque.

### Bajar

```bash
docker compose down              # detiene y elimina el contenedor
docker compose down -v           # además borra el volumen: la base vuelve a cero
```

### Reconstruir tras cambiar el código

```bash
docker compose up -d --build
```

### Detalles de la imagen

- Multi-etapa (`deps` → `builder` → `runner`) sobre `node:24-alpine`. La imagen final pesa
  unos 320 MB y no lleva código fuente ni dependencias de desarrollo.
- `next.config.ts` usa `output: "standalone"`, así que solo viaja el servidor con las
  dependencias que Next detectó en uso real, no los 459 MB de `node_modules`.
- El contenedor corre como el usuario `nextjs` (uid 1001), no como root.
- `lib/db/esquema.sql` se copia explícitamente: el rastreador de Next solo sigue imports de
  JavaScript, así que ese archivo —que el cliente lee en tiempo de ejecución— no entraría
  solo en la salida standalone y la app no arrancaría.
- La base SQLite vive en el volumen `datos`, montado en `/app/data`, así que lo que cargues
  durante una demostración sobrevive a `docker compose restart`. Se siembra sola en el
  primer acceso que la consulta, no al arrancar el contenedor.

### El puerto 3000

`docker compose` y `npm run dev` usan el mismo puerto: solo puede haber uno corriendo a la
vez. Si `npm run dev` falla con el puerto ocupado, baja el contenedor primero.

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
| `docker compose up -d --build` | Construye y levanta el contenedor |
| `docker compose down` | Baja el contenedor |

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
