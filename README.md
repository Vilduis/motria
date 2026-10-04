# Motria — Gestión de talleres mecánicos

Motria es una aplicación web para llevar el día a día de un taller mecánico desde un solo lugar: clientes, vehículos, técnicos y órdenes de servicio, con un panel que muestra cómo va el trabajo.

## ¿Para quién es?

Para **talleres mecánicos pequeños y medianos** que hoy se organizan con cuadernos, hojas de cálculo o mensajes, y quieren dejar de perder órdenes y saber en todo momento qué vehículo está en qué estado.

Dentro de cada taller hay dos tipos de usuario:

| Rol | Qué hace |
|---|---|
| **Administrador** | Registra clientes, vehículos y técnicos, crea órdenes de servicio y las asigna. Ve el resumen de todo el taller y gestiona el plan de su cuenta. |
| **Técnico** | Ve las órdenes que tiene asignadas y actualiza su estado a medida que avanza el trabajo. |

## ¿Cómo funciona?

1. El taller se registra y el administrador da de alta a sus técnicos.
2. Cuando llega un vehículo, se registra con su dueño (o se busca si ya existe) y se crea una orden de servicio con el diagnóstico.
3. El técnico asignado avanza la orden: `Pendiente → En proceso → Terminado`.
4. El panel de inicio muestra órdenes del día, trabajo pendiente y la actividad reciente.

## Funciones

- **Landing pública** que presenta el producto, con una demostración interactiva de órdenes.
- **Registro e inicio de sesión**, recuperación y cambio de contraseña.
- **Panel** con resumen del taller para el administrador y carga de trabajo para el técnico.
- **Clientes, vehículos, técnicos, usuarios y órdenes**, con búsqueda y paginación.
- **Órdenes rápidas de crear**: se elige el vehículo (buscando por placa, marca o dueño) y el cliente se completa solo.
- **Planes** Free y Pro (por ahora solo visual).
- **Tema claro y oscuro**, y diseño adaptado a móvil.

Los datos se obtienen de una **API REST** propia de Motria.

## Stack

| Categoría | Tecnología |
|---|---|
| Framework UI | React 19 + TypeScript |
| Build tool | Vite 7 |
| Enrutamiento | React Router v7 |
| Estilos | Tailwind CSS v4 |
| Componentes | shadcn/ui + Radix UI |
| HTTP client | Axios |
| Fechas | date-fns |
| Notificaciones | Sonner |
| Animaciones | Motion |
| Temas | ThemeProvider propio (claro / oscuro, sigue al sistema) |
| Iconos | Lucide React |
| Fuentes | Manrope Variable + Barlow Condensed (self-hosted) |
| Linting | ESLint + typescript-eslint |
| Formateo | Prettier + prettier-plugin-tailwindcss |

## Estructura del proyecto

```
src/
├── pages/            # Una vista por ruta
│   ├── landing.tsx   # Página pública
│   ├── login.tsx, signup.tsx, …   # Acceso y contraseñas
│   └── dashboard/    # Panel: inicio, órdenes, clientes, vehículos, técnicos, usuarios, cuenta y planes
├── components/
│   ├── ui/           # Componentes base de shadcn/ui
│   ├── landing/      # Secciones de la landing
│   ├── auth/         # Formularios de acceso
│   ├── layout/       # Estructura de páginas del panel y del acceso
│   ├── data/         # Tablas: búsqueda, paginación, selectores con búsqueda
│   └── stats/        # Tarjetas de métricas
├── services/         # Llamadas a la API (una por recurso) y configuración de Axios
├── hooks/            # Hooks propios (paginación, tema, plan del taller)
├── lib/              # Utilidades y validaciones
├── styles/           # Tokens de diseño, tipografía y estilos de landing y acceso
└── types/            # Tipos de los datos de la API
public/images/        # Fotografías de la landing (fuentes en ASSETS.md)
```
