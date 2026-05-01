# TallerPro — Sistema de Gestión de Taller Mecánico

Aplicación web para la administración integral de talleres de reparación automotriz. Permite gestionar órdenes de servicio, técnicos, clientes y vehículos desde un panel centralizado con control de acceso por roles.

---

## Modelo de negocio

El sistema está orientado a talleres mecánicos pequeños y medianos que necesitan digitalizar su operación. Cubre el flujo completo de un servicio:

1. El **administrador** registra clientes, vehículos, técnicos y crea órdenes de servicio.
2. El **técnico** recibe sus órdenes asignadas y actualiza el estado conforme avanza el trabajo (`PENDIENTE → EN_PROCESO → TERMINADO`).
3. El **dashboard** muestra métricas en tiempo real: ocupación del taller, órdenes del día, nuevos clientes y vehículos de la semana.

**Roles del sistema:**

| Rol | Permisos |
|---|---|
| `ADMIN` | CRUD completo sobre usuarios, técnicos, clientes, vehículos y órdenes. Acceso a métricas globales. |
| `TECNICO` | Consulta de órdenes asignadas y actualización de estado. Dashboard de carga de trabajo personal. |

---

## Backend API

El frontend consume una API REST desarrollada en **Java Spring Boot**. La seguridad está gestionada con **Spring Security** y autenticación stateless mediante **JWT**: al iniciar sesión el servidor emite un token que el cliente almacena en `localStorage` y adjunta en cada petición a través de un interceptor de Axios (`Authorization: Bearer <token>`). Si el servidor devuelve un `401`, el interceptor limpia el storage y redirige automáticamente al login.

La URL base se configura mediante variable de entorno:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Stack

| Categoría | Tecnología |
|---|---|
| Framework UI | React 19 + TypeScript |
| Build tool | Vite 7 |
| Enrutamiento | React Router v7 |
| Estilos | Tailwind CSS v4 |
| Componentes | shadcn/ui + Radix UI |
| HTTP client | Axios |
| Tablas | TanStack Table v8 |
| Gráficas | Recharts |
| Drag & Drop | dnd-kit |
| Fechas | date-fns |
| Notificaciones | Sonner |
| Temas | next-themes (dark / light) |
| Validación | Zod |
| Iconos | Lucide React |
| Fuente | Geist Variable |
| Linting | ESLint + typescript-eslint |
| Formateo | Prettier + prettier-plugin-tailwindcss |

---

## Inicio rápido

```bash
npm install
npm run dev
```

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run preview` | Vista previa del build |
| `npm run typecheck` | Verificación de tipos sin emitir |
| `npm run lint` | Análisis estático de código |
| `npm run format` | Formateo automático con Prettier |

---

## Estructura principal

```
src/
├── components/   # Componentes compartidos y de UI
├── pages/        # Vistas por ruta (dashboard, login, etc.)
├── hooks/        # Custom hooks
├── lib/          # Utilidades y configuración de Axios
└── types/        # Tipos e interfaces TypeScript
```
