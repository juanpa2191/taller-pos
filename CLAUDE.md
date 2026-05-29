# CLAUDE.md — MotoSaaS / Inventario Talleres

> Este archivo carga contexto automáticamente en cada sesión de Claude Code. Mantenerlo conciso pero completo: identidad del producto, estado real del repo, arquitectura objetivo, convenciones y roadmap.

---

## 1. Identidad del producto

**Nombre interno**: MotoSaaS — Premium Workspace
**Propósito**: Plataforma SaaS multi-tenant para talleres de motocicletas que unifica (a) gestión de inventario de repuestos, (b) órdenes de trabajo y reparaciones, y (c) un buscador público de repuestos en talleres cercanos para clientes finales.

**Diferenciadores objetivo**:
- Doble cara: ERP interno del taller + escaparate público con disponibilidad en tiempo real.
- Compatibilidad estructurada por marca / modelo / cilindraje / rango de años (no texto libre).
- Multi-taller con datos aislados por tenant pero búsqueda federada para clientes finales.
- Mobile-first y operable desde el celular del mecánico en el box.

---

## 2. Estado actual del repositorio

> Importante: hoy esto es un **prototipo front-end puro**, no un producto en producción. Toda la lógica vive en React + estado en memoria.

- **Stack**: React 19, TypeScript, Vite 6, Tailwind CSS 4 (`@tailwindcss/vite`), `lucide-react`, `motion`.
- **Dependencias declaradas no usadas aún**: `@google/genai`, `express`, `dotenv` (no hay backend ni endpoints implementados).
- **No es un repo git** (`.git` ausente). Sin CI, sin tests, sin pipeline.
- **Estructura**:
  - `src/App.tsx` — store global con `useState`, router manual por rol/vista (~690 líneas).
  - `src/data.ts` — semillas (talleres, partes, motos, órdenes, catálogos de marcas/modelos).
  - `src/types.ts` — modelos de dominio.
  - `src/components/` — 7 vistas grandes (`LandingPage`, `Marketplace`, `WorkshopProfile`, `Dashboard`, `Inventory`, `BikeRegistry`, `RepairOrderSheet`).
- **Navegación**: dos roles conmutables en el header, sin React Router:
  - `public` → `landing | marketplace | profile`
  - `erp` → `dashboard | inventory | bike_registry | repairs`
- **Persistencia**: cero. Refrescar la página pierde todo el estado.
- **Auth**: no existe. El "rol" se cambia con un botón sin validación.
- **Tema visual**: dark matte, acento rojo para público, acento azul para ERP. Tokens custom (`bg-matte-950`, `moto-red`, `moto-blue`) — viven en config Tailwind.

### Scripts (`package.json`)
- `npm run dev` → Vite en puerto 3000, host 0.0.0.0.
- `npm run build` → build de producción.
- `npm run lint` → `tsc --noEmit` (no hay ESLint configurado).
- `npm run clean` → usa `rm -rf` (no funciona en PowerShell nativo — Windows).

### Deudas conocidas del prototipo
- `index.html` aún tiene el title "My Google AI Studio App".
- `README.md` es el boilerplate de AI Studio, no documenta el dominio.
- `package.json` aún se llama `react-example`.
- No hay separación `domain / infrastructure / ui` — todo el estado y los handlers están dentro de `App.tsx`.
- Componentes muy grandes (Marketplace 33 KB, Inventory 31 KB) — candidatos a split.

---

## 3. Visión del producto (target)

Convertir el prototipo en un SaaS multi-tenant real. Las decisiones de arquitectura abajo son la **dirección objetivo**, no el estado actual del código. Cuando el usuario pida implementar algo, alinearse con esta visión salvo que él indique lo contrario.

### Roles del sistema

| Rol | Auth | Capacidades |
|---|---|---|
| **Administrador del Taller** | Sí | Crea empleados, gestiona inventario, registra motos, asocia repuestos/labor a OT, ve historial, reportes, estadísticas, configura el taller. |
| **Empleado del Taller** | Sí | Consulta inventario, registra reparaciones, asocia repuestos usados, actualiza estados. Sin acceso a configuración del tenant ni a reportes financieros. |
| **Cliente Final** | **No** | Buscar repuestos por marca/modelo/cilindraje/año/categoría, ver talleres cercanos con disponibilidad y datos de contacto, abrir WhatsApp. |

### Módulos

1. **Inventario**: CRUD de partes, categorías, compatibilidad estructurada, stock, stock mínimo, alertas, SKU, código de barras, historial de movimientos, proveedores, costo y precio.
2. **Taller (OT)**: registro de moto + cliente, estado de la reparación con timeline, evidencias/fotos, diagnóstico, ítems de mano de obra y repuestos, cotización, listo para facturación.
3. **Búsqueda pública**: geolocalización, ranking por distancia + relevancia + disponibilidad, responsive mobile-first, SEO friendly.

---

## 4. Arquitectura objetivo

### 4.1 Diagrama lógico (alto nivel)

```
┌──────────────┐    ┌──────────────┐    ┌────────────────┐
│ Web público  │    │ Web ERP      │    │ App móvil      │
│ (Next.js)    │    │ (Next.js)    │    │ (futura, RN)   │
└──────┬───────┘    └──────┬───────┘    └────────┬───────┘
       │ HTTPS             │ HTTPS              │
       └────────┬──────────┴────────┬───────────┘
                │                   │
         ┌──────▼───────────────────▼──────┐
         │      API Gateway (NestJS)       │
         │  REST + (GraphQL futuro)        │
         │  Auth, rate-limit, multi-tenant │
         └──────┬───────────┬──────────────┘
                │           │
       ┌────────▼───┐   ┌───▼────────┐   ┌──────────────┐
       │ PostgreSQL │   │ Redis       │   │ Search       │
       │  +PostGIS  │   │ cache/queue │   │ (Meili o PG  │
       │  RLS       │   │             │   │  full-text)  │
       └────────────┘   └─────────────┘   └──────────────┘
                │
       ┌────────▼─────────┐   ┌────────────┐
       │ Object storage   │   │ Workers    │
       │ (S3/R2) fotos    │   │ (BullMQ)   │
       └──────────────────┘   └────────────┘
```

### 4.2 Backend

- **Runtime**: Node.js LTS.
- **Framework**: **NestJS** (modular, DI, decorators, soporta REST y GraphQL, valida con `class-validator`).
- **ORM**: **Prisma** (tipado fuerte end-to-end con el frontend cuando se compartan tipos vía `@motosaas/types`).
- **Estilo arquitectónico**: Clean / Hexagonal por módulo (`domain` + `application` + `infrastructure` + `interface`).
- **Módulos sugeridos** (uno por bounded context):
  `auth`, `tenants`, `users`, `workshops`, `inventory`, `motorcycles`, `repair-orders`, `catalog` (marcas/modelos/categorías), `search` (público), `notifications`, `billing` (futuro), `audit`.
- **Capa de eventos**: cada mutación relevante emite un evento de dominio (`PartStockChanged`, `RepairOrderStatusChanged`, `LowStockReached`) consumido por workers para notificaciones, métricas, e índice de búsqueda.

### 4.3 Frontend

- **Framework**: migrar a **Next.js 15 (App Router)** para conseguir SSR/SEO en el buscador público y manteniendo CSR en el ERP.
- **Conservar**: React 19, TypeScript, Tailwind 4, `lucide-react`, `motion`.
- **Estado**: Zustand o TanStack Query (server state) + React Context para UI.
- **Estructura objetivo `apps/web/`**:
  ```
  apps/web/
    app/
      (public)/
        page.tsx               # landing
        buscador/page.tsx      # marketplace público (SSR)
        taller/[slug]/page.tsx # perfil público (SSR + ISR)
      (erp)/
        dashboard/...
        inventario/...
        admisiones/...
        ordenes/[id]/...
        configuracion/...
      api/                     # BFF si hace falta
    components/                # presentational
    features/                  # feature-sliced (inventory, repairs, ...)
    lib/                       # http client, auth helpers, format
  ```
- **Diseño**: mantener tokens actuales (`matte-*`, `moto-red`, `moto-blue`) y promoverlos a un design system (`packages/ui`).

### 4.4 Base de datos

- **Motor**: **PostgreSQL 16** + extensión **PostGIS** (búsqueda por radio) + `pg_trgm` (búsqueda fuzzy).
- **Multi-tenancy**: **schema único + columna `workshop_id`** en todas las tablas tenantizadas + **Row-Level Security (RLS)** activado. Cada request de un usuario logueado fija `SET app.current_workshop = <id>` y las policies filtran. Para clientes finales, las queries son explícitamente cross-tenant pero solo sobre vistas / columnas públicas.
- **¿Por qué no schema-per-tenant?** Costo operativo de migraciones × N talleres. Pasaremos a esa opción solo si llega un cliente enterprise con requisito de aislamiento físico.

#### Esquema base (resumen)

```sql
-- Tenants
workshops (
  id UUID PK,
  slug TEXT UNIQUE,           -- URL pública
  name TEXT,
  plan TEXT,                  -- 'free' | 'pro' | 'enterprise'
  status TEXT,                -- 'active' | 'suspended'
  address TEXT, city TEXT,
  location GEOGRAPHY(POINT),  -- PostGIS
  phone TEXT, whatsapp TEXT,
  hours JSONB,
  avatar_url TEXT, banner_url TEXT,
  description TEXT,
  created_at, updated_at
)

users (
  id UUID PK,
  email TEXT UNIQUE,
  password_hash TEXT,
  full_name TEXT,
  created_at
)

workshop_members (             -- N:M usuario ↔ taller con rol
  workshop_id FK,
  user_id FK,
  role TEXT,                   -- 'owner' | 'admin' | 'employee'
  invited_at, joined_at,
  PK (workshop_id, user_id)
)

-- Catálogo global (compartido entre tenants)
brands (id, name)
bike_models (id, brand_id, name, cc, year_start, year_end)
part_categories (id, name, parent_id)

-- Inventario por tenant
parts (
  id UUID PK,
  workshop_id FK,              -- RLS aquí
  sku TEXT,
  barcode TEXT,
  name TEXT,
  brand TEXT,
  category_id FK,
  cost NUMERIC,                -- costo
  price NUMERIC,               -- precio venta
  stock INT,
  min_stock INT,
  shelf_location TEXT,
  image_url TEXT,
  supplier_id FK NULL,
  created_at, updated_at,
  UNIQUE (workshop_id, sku)
)
part_compatibility (
  part_id FK,
  brand_id FK,
  model_id FK,
  year_start INT, year_end INT,
  cc INT NULL
)
part_movements (              -- kardex
  id, part_id FK, workshop_id FK,
  type TEXT,                  -- 'in' | 'out' | 'adjust' | 'consumed'
  quantity INT,
  unit_cost NUMERIC,
  reference_type TEXT,        -- 'purchase' | 'repair_order' | 'manual'
  reference_id UUID,
  performed_by FK users,
  created_at
)
suppliers (id, workshop_id, name, phone, email, notes)

-- Taller / OT
motorcycles (
  id UUID PK,
  workshop_id FK,
  plate TEXT,
  brand_id FK, model_id FK,
  year INT, cc INT, mileage INT,
  owner_name, owner_phone, owner_email,
  image_url, created_at
)
repair_orders (
  id UUID PK,
  workshop_id FK,
  order_number TEXT,           -- "RO-2026-00X"
  motorcycle_id FK,
  client_name, client_phone,
  status TEXT,                 -- ENUM ingress→delivered
  diagnostics TEXT,
  notes TEXT,
  started_at, estimated_delivery,
  closed_at NULL,
  total_amount NUMERIC,
  created_by FK users
)
repair_items (
  id, repair_order_id FK,
  type TEXT,                   -- 'part' | 'labor'
  part_id FK NULL,
  name TEXT, quantity INT, unit_price NUMERIC
)
repair_timeline (
  id, repair_order_id FK,
  status TEXT, title, description,
  updated_by FK users, created_at
)
repair_evidence (
  id, repair_order_id FK, url, kind   -- 'photo' | 'pdf'
)

-- Público
reviews (id, workshop_id FK, author, rating, comment, bike_model, created_at)
notifications (id, workshop_id FK, user_id FK NULL, type, title, description, read, created_at)
audit_log (id, workshop_id, actor_id, action, target_type, target_id, payload JSONB, created_at)
```

Índices clave: `parts(workshop_id, sku)`, `parts(workshop_id, category_id, stock)`, `part_compatibility(model_id, year_start, year_end)`, GIST en `workshops.location`, `repair_orders(workshop_id, status, started_at DESC)`.

### 4.5 Autenticación y autorización

- **Estrategia**: JWT de acceso (15 min) + refresh token rotativo (HttpOnly cookie) — implementado con NestJS Passport + `@nestjs/jwt`.
- **OAuth opcional**: Google (administradores), futuro Apple.
- **RBAC** por `workshop_members.role`: `owner > admin > employee`. Decorador `@Roles('admin')` + guard que cruza con `workshop_id` del token.
- **Cliente final**: no requiere auth; endpoints `/public/*` con rate-limit más agresivo.

### 4.6 APIs

- **REST primero** (`/api/v1`). GraphQL queda como evolución cuando el cliente necesite agregaciones complejas.
- **Versionado** por path (`/v1`, `/v2`).
- **Contrato**: OpenAPI 3 generado por NestJS Swagger.

#### Endpoints principales (esbozo)

```
# Auth
POST   /v1/auth/register            # crea tenant + owner
POST   /v1/auth/login
POST   /v1/auth/refresh
POST   /v1/auth/logout

# Tenant / usuarios
GET    /v1/me
GET    /v1/workshops/current
PATCH  /v1/workshops/current
POST   /v1/workshops/current/members         # invitar empleado
DELETE /v1/workshops/current/members/:id

# Inventario
GET    /v1/parts?search&category&lowStock&page
POST   /v1/parts
GET    /v1/parts/:id
PATCH  /v1/parts/:id
DELETE /v1/parts/:id
POST   /v1/parts/:id/movements       # entrada/salida/ajuste
GET    /v1/parts/:id/movements
GET    /v1/suppliers ; POST/PATCH/DELETE ...

# Catálogo
GET    /v1/catalog/brands
GET    /v1/catalog/brands/:id/models
GET    /v1/catalog/categories

# Motos + OT
POST   /v1/motorcycles
GET    /v1/motorcycles?plate
POST   /v1/repair-orders            # crea OT (auto desde admisión)
GET    /v1/repair-orders?status&page
GET    /v1/repair-orders/:id
PATCH  /v1/repair-orders/:id/status
POST   /v1/repair-orders/:id/items
DELETE /v1/repair-orders/:id/items/:itemId
POST   /v1/repair-orders/:id/timeline
POST   /v1/repair-orders/:id/evidence   # multipart → S3

# Reportes
GET    /v1/reports/sales?from&to
GET    /v1/reports/inventory-valuation
GET    /v1/reports/repairs?status&from&to

# Notificaciones
GET    /v1/notifications?unread
PATCH  /v1/notifications/:id/read

# PÚBLICO (sin auth)
GET    /v1/public/parts/search?brand&model&year&cc&category&lat&lng&radiusKm
GET    /v1/public/workshops?lat&lng&radiusKm
GET    /v1/public/workshops/:slug
GET    /v1/public/workshops/:slug/parts?search
```

### 4.7 Seguridad

- HTTPS forzado, HSTS.
- Hashing con `argon2id`.
- Rate-limit por IP y por user (Redis token bucket).
- Validación con `class-validator` + sanitización.
- RLS en Postgres como segunda barrera de tenancy (defensa en profundidad).
- Audit log inmutable para acciones sensibles (cambio de stock manual, borrado de OT, invitación de usuarios).
- Secret management: Doppler / AWS Secrets Manager. **Nunca** en `.env` committeado.
- OWASP Top 10 cubierto: CSRF (cookies SameSite=strict), XSS (escapado de Tailwind/React, CSP), inyección (Prisma parametrizado), SSRF (no fetch a URLs de usuario sin allowlist).

---

## 5. Stack tecnológico recomendado

| Capa | Elección | Por qué |
|---|---|---|
| Frontend web | Next.js 15 + React 19 + TS + Tailwind 4 | SSR para SEO público, ya familiar al equipo. |
| Estado servidor | TanStack Query | Cache, invalidación, optimistic UI. |
| Estado UI | Zustand | Mínimo boilerplate. |
| Backend | NestJS + TypeScript | Modular, DI, OpenAPI nativo. |
| ORM | Prisma | Tipado, migraciones, buen DX. |
| DB | PostgreSQL 16 + PostGIS + pg_trgm | Geo + fuzzy en el mismo motor. |
| Cache / colas | Redis + BullMQ | Notificaciones diferidas, índice de búsqueda. |
| Buscador | Postgres `tsvector` para MVP → Meilisearch si escala | Empezar simple. |
| Tiempo real | WebSockets vía `@nestjs/websockets` (Socket.IO) | Dashboard de OT en vivo. |
| Geo | Browser Geolocation API + PostGIS `ST_DWithin` | Estándar. |
| Notificaciones | Web Push (VAPID) + WhatsApp Cloud API + Email (Resend) | Multi-canal. |
| Storage | Cloudflare R2 o AWS S3 + CloudFront/CDN | Barato, compatible S3. |
| Auth | JWT + refresh rotativo + Google OAuth | Sin proveedor externo en MVP. |
| Infra | Docker + Fly.io / Railway en MVP → AWS ECS o Kubernetes a escala | Iteración rápida. |
| Observabilidad | OpenTelemetry → Grafana Cloud (logs + traces + metrics) | Un solo proveedor. |
| Errores | Sentry | Frontend y backend. |
| CI/CD | GitHub Actions → contenedor → deploy automático | Estándar. |

---

## 6. Multi-tenancy: detalles operativos

1. **Identificación del tenant**:
   - ERP: `workshop_id` viaja en el JWT.
   - Público: el tenant se infiere del slug en la URL (`/taller/honda-pro`) o se ignora (búsqueda cross-tenant).
2. **Aislamiento**:
   - RLS policies por tabla: `USING (workshop_id = current_setting('app.current_workshop')::uuid)`.
   - Prisma middleware fija `app.current_workshop` al inicio de cada request autenticada.
3. **Catálogos compartidos** (`brands`, `bike_models`, `part_categories`) son globales y read-only para tenants.
4. **Backups**: snapshots diarios + WAL streaming. Restore por tenant via export filtrado.
5. **Onboarding**: registro de owner crea `workshops` + `users` + `workshop_members(role=owner)` en una sola transacción.

---

## 7. Casos de uso / historias de usuario (MVP)

### Administrador
- **HU-A1** Como admin quiero registrar mi taller para empezar a usar el sistema.
- **HU-A2** Como admin quiero invitar empleados con su email para que registren reparaciones.
- **HU-A3** Como admin quiero cargar mi inventario (CRUD + import CSV en fase 2) con compatibilidad estructurada.
- **HU-A4** Como admin quiero ver el ranking de repuestos más vendidos y el valor total del inventario.
- **HU-A5** Como admin quiero recibir alertas cuando un repuesto cruza su stock mínimo.

### Empleado
- **HU-E1** Como empleado quiero registrar una moto que llega al taller con foto y diagnóstico inicial.
- **HU-E2** Como empleado quiero buscar un repuesto por SKU o escanear código de barras y vincularlo a la OT — esto debe descontar stock automáticamente.
- **HU-E3** Como empleado quiero actualizar el estado de una OT y adjuntar fotos del avance.
- **HU-E4** Como empleado quiero ver la línea de tiempo de eventos de cada OT.

### Cliente final
- **HU-C1** Como motociclista quiero encontrar pastillas de freno para mi Yamaha MT-07 2022 en talleres cerca de mí.
- **HU-C2** Como motociclista quiero ver qué talleres tienen stock real, su distancia, calificación y horario.
- **HU-C3** Como motociclista quiero contactar al taller por WhatsApp con un click.

---

## 8. Flujos UX/UI principales

### Flujo público (mobile-first)
1. Landing → buscador prominente (marca/modelo/año + categoría + "usar mi ubicación").
2. Resultados ordenados por (`available_stock > 0` DESC, `distance` ASC, `match_score` DESC).
3. Tarjeta por taller: stock real, distancia, rating, horario, botón WhatsApp + ver perfil.
4. Perfil del taller (SSR + ISR para SEO): info, mapa, catálogo filtrable, reviews.

### Flujo ERP (desktop + tablet)
1. **Dashboard**: KPIs (OT abiertas por estado, stock crítico, ingresos del mes), feed de notificaciones, accesos rápidos.
2. **Inventario**: tabla con filtros (categoría, stock bajo, marca), modal de alta/edición, vista de kardex por SKU.
3. **Admisión**: wizard de 3 pasos (datos moto → datos cliente → diagnóstico + foto), crea OT automáticamente.
4. **Órdenes**: lista + detalle. Detalle muestra timeline, items (partes + labor) con buscador rápido de inventario, evidencias, total estimado, acciones de cambio de estado.

### Principios visuales
- Conservar dark matte actual con acentos rojo (público) / azul (ERP) — ya es identidad reconocible.
- Mobile-first **siempre**; los flujos del mecánico (`Inventario`, `Admisión`, `OT detalle`) deben funcionar bien con una sola mano en pantalla de 5".
- Skeleton loaders en cada vista con datos del servidor.
- Empty states con CTA explícito (no pantallas en blanco).

---

## 9. Roadmap por fases

### Fase 0 — Fundaciones (semana 1-2)
- Convertir repo en monorepo (`apps/web`, `apps/api`, `packages/ui`, `packages/types`) con pnpm + Turborepo.
- Inicializar git, configurar ESLint + Prettier + Husky + lint-staged.
- Dockerfiles y `docker-compose` para Postgres + Redis local.
- Esqueleto NestJS + Prisma + migración inicial.

### Fase 1 — MVP ERP (semana 3-8)
- Auth completo (registro de tenant, login, invitación de empleados).
- Módulos `inventory`, `motorcycles`, `repair-orders` end-to-end.
- Migrar `App.tsx` del prototipo a vistas Next.js conectadas a la API.
- Notificaciones in-app por WebSocket.
- Subida de fotos a R2/S3.

### Fase 2 — Buscador público (semana 9-12)
- Endpoints `/public/*` con PostGIS + filtros estructurados.
- Páginas SSR de landing, búsqueda, perfil del taller (SEO + Open Graph).
- Integración WhatsApp deeplink.
- Reviews básicos.

### Fase 3 — Operación (semana 13-16)
- Reportes y exportes (CSV / PDF).
- Stock mínimo con alertas multicanal (email + web push).
- Auditoría visible para admin.
- Importador CSV de inventario inicial.

### Fase 4 — Crecimiento
- App móvil (React Native + Expo) con escaneo de código de barras.
- Facturación electrónica (integración por país).
- Pagos online (Stripe / Mercado Pago).
- Marketplace de repuestos entre talleres.
- IA: recomendación de repuestos por modelo + reconocimiento de partes por imagen (Vision API).
- Sistema de citas con calendario público.

---

## 10. Modelo de monetización

| Plan | Precio referencial | Incluye |
|---|---|---|
| **Free** | 0 | 1 usuario, hasta 50 SKUs, 10 OT/mes, sin perfil público destacado. |
| **Pro** | $29-39 USD/mes | Hasta 5 usuarios, SKUs ilimitados, perfil público con badge "Verificado", reportes, alertas multicanal. |
| **Business** | $79-99 USD/mes | Usuarios ilimitados, multi-sucursal, API access, prioridad en ranking de búsqueda público, soporte SLA. |
| **Enterprise** | Custom | Aislamiento de datos (schema por tenant), SSO, integraciones a medida. |

**Vías adicionales**: comisión sobre transacciones del marketplace P2P, leads cualificados a talleres premium desde el buscador público (CPC), pago por anuncio destacado.

---

## 11. Riesgos técnicos

| Riesgo | Mitigación |
|---|---|
| Compatibilidad de partes mal modelada → resultados de búsqueda pobres. | Modelo estructurado (marca/modelo/rango de años/cc) desde el día 1. Validar con 3 talleres reales antes de lanzar. |
| Multi-tenancy filtrado por columna → fuga de datos por bug. | RLS en DB como segunda barrera, tests de integración que asertan aislamiento. |
| Inventario desincronizado entre OT y stock → sobreventa. | Mutaciones de stock siempre dentro de transacción que también escribe `part_movements`. |
| Búsqueda geo lenta a escala. | Índice GIST + cache de resultados por (geohash, filtros) en Redis. |
| Mecánico no usa el sistema por fricción móvil. | Mobile-first obligatorio; medir con session replays. |
| Migración prototipo → producción interrumpe demo a inversores. | Mantener prototipo desplegable hasta que MVP esté en paridad. |
| Dependencia de WhatsApp Cloud API (cambios de política). | Encapsular detrás de adapter; fallback a `wa.me` deeplink. |

---

## 12. Estrategia de escalabilidad

- **DB primero**: read replicas de Postgres para reportes y búsqueda pública. Connection pooling con PgBouncer.
- **Cache**: respuestas públicas con TTL corto en Redis + CDN (Cloudflare) frente al frontend SSR.
- **Aislar trabajo pesado**: imports CSV, generación de PDF, indexación de búsqueda → workers BullMQ.
- **Sharding lógico** por país/región solo si llegamos a millones de OT.
- **Edge**: el buscador público se beneficia de SSR en edge (Vercel/Cloudflare) — el ERP se queda en region única para minimizar latencia DB.

---

## 13. Convenciones del proyecto

### Código
- TypeScript estricto (`"strict": true`). Sin `any` salvo zonas de adaptador documentadas.
- Componentes en PascalCase, hooks en `useCamelCase`, archivos coinciden con el export por defecto.
- Funciones puras siempre que sea posible. Handlers de mutación llaman a un caso de uso (`application/`), no directo al ORM.
- No introducir comentarios que repitan lo que el código dice; solo el "por qué" no obvio.

### Commits y branches
- Convencional: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
- `main` siempre desplegable. Trabajo en `feat/<area>/<slug>`.

### Tests
- Backend: Jest + supertest. Cobertura mínima de casos de uso de inventario y OT.
- Frontend: Vitest + React Testing Library + Playwright para flujos críticos (admisión, vincular pieza a OT).

### Comandos útiles (mientras el repo siga siendo el prototipo)
```bash
npm install
npm run dev       # localhost:3000
npm run build
npm run lint      # tsc --noEmit
```

Cuando migremos a monorepo, esta sección se actualizará con `pnpm dev`, `pnpm db:migrate`, etc.

---

## 14. Decisiones abiertas (pendientes de definir con el usuario)

- País / región inicial (afecta facturación electrónica e integraciones de pago).
- ¿Cliente final debe poder reservar la pieza o solo ver disponibilidad?
- ¿Permitimos venta directa al público o solo lead generation hacia el taller?
- Modelo de comisión / pricing definitivo.
- ¿Migrar primero a Next.js o primero levantar API y mantener Vite en frontend hasta Fase 2?

Estas preguntas se deben resolver antes de Fase 1.
