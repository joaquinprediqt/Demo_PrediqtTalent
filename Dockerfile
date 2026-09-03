# syntax=docker/dockerfile:1

# Node 24 y no 20: el acceso a datos usa node:sqlite (DatabaseSync), un modulo
# incorporado que no existe en Node 20 y que en Node 22 exige la bandera
# --experimental-sqlite. Desde Node 23.4 esta disponible sin bandera.
ARG NODE_VERSION=24-alpine

# ---------------------------------------------------------------------------
# Etapa 1 - deps: solo instala dependencias. Se reconstruye unicamente cuando
# cambian package.json o package-lock.json, no cuando cambia el codigo.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# Etapa 2 - builder: compila la aplicacion.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next lee NODE_ENV durante el build para desactivar el modo desarrollo.
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---------------------------------------------------------------------------
# Etapa 3 - runner: solo lo necesario para servir. Sin codigo fuente, sin
# dependencias de desarrollo y sin el node_modules completo.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Sin esto el servidor escucha solo en localhost y el mapeo de puertos no sirve.
ENV HOSTNAME=0.0.0.0

# Usuario sin privilegios: si alguien logra ejecutar codigo, no lo hace como root.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

# output: "standalone" deja en .next/standalone el servidor con solo las
# dependencias que el rastreador encontro realmente en uso.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# El rastreador de Next solo sigue imports de JavaScript, asi que este .sql
# no entra solo en la salida standalone. El cliente lo lee en tiempo de
# ejecucion desde process.cwd()/lib/db/esquema.sql y sin el la app no arranca.
COPY --from=builder --chown=nextjs:nodejs /app/lib/db/esquema.sql ./lib/db/esquema.sql

# La base SQLite de la demo se crea aqui al primer arranque. docker-compose
# monta un volumen sobre este directorio para que sobreviva a los reinicios.
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
