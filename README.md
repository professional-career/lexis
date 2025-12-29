# Batey
## **_The NAP Stack Monorepo for Solo Developers_**

Batey es un sistema de monorepo ligero basado en la arquitectura NAP (NestJS, Angular, PNPM) diseñado para la velocidad y la centralización.

A diferencia de soluciones pesadas como Nx, este repositorio utiliza herramientas nativas y scripts orquestados para mantener la simplicidad, velocidad y control total sobre el flujo de desarrollo.

## 🛠️ Tech Stack

- **Backend**: NestJS (TypeORM)
- **Frontend**: Angular 18+ (PrimeNG, Signals) + Nginx (Producción)
- **Gestor de paquetes**: PNPM (Workspaces)
- **Base de datos**: PostgreSQL (Dockerizada)
- **Librería compartida**: TypeScript puro (Interfaces & DTOs)

## 🚀 Quick Start (One Command)

El proyecto está diseñado para "Zero Config". Al clonar el repositorio, la configuración de entorno se genera automáticamente.

1. **Prerrequisitos**
    - Node.JS (LTS)
    - Docker & Docker Compose (Debe estar corriendo)
    - PNPM (npm i -g pnpm)

2. **Instalación**

```bash
# Instala dependencias y genera automáticamente el archivo .env raíz
pnpm install
```

3. **Desarrollo**

Este comando levanta la base de datos, compila la librería en modo watch, y arranca tanto el Backend como el Frontend en paralelo.

```bash
pnpm dev
```

## 📂 Arquitectura del proyecto

```text
/
├── apps/
│   ├── client/       # Angular App (Puerto 4200)
│   └── api/          # NestJS API (Puerto 3000)
├── packages/
│   └── shared/       # Librería compartida (DTOs, Interfaces, Enums)
├── tools/            # Scripts de orquestación y entorno
├── .env              # Single Source of Truth (Generado desde .env.example)
├── .env.example
├── docker-compose.yml
└── pnpm-workspace.yaml
```

### Gestión de configuración (SSOT)
Utilizamos una estrategia de Single Source of Truth:
* El archivo ```.env``` en la raíz es la única verdad.
* **NestJS**: Lee este archivo directamente.
* **Angular**: Al ejecutar cualquier comando, el script ```tools/set-env.js``` inyecta las variables públicas en environment.ts. No edites ```environment.ts``` manualmente.

## 🤖 Guía de comandos (DX)
Todos los comandos se ejecutan desde la raíz del proyecto.

### 🧬 Generadores de código (Scaffolding)

| Comando  | Descripción  |  Ejemplo  |
|----------|--------------|-----------|
|```pnpm api:res <nombre>``` | **NestJS**: Crea un recurso CRUD completo (Controller, Service, DTO, Entity). | ```pnpm api:res products``` |
|```pnpm api:g <tipo> <nombre>``` | **NestJS**: Generador genérico. | ```pnpm api:g controller auth``` |
|```pnpm web:c <path>``` | **Angular**: Crea un Componente (Standalone por defecto). | ```pnpm web:c shared/ui/button``` |
|```pnpm web:s <path>``` | **Angular**: Crea un Servicio. | ```pnpm web:s core/auth``` |
|```pnpm web:g <tipo> <path>``` | **Angular**: Generador genérico (Guards, Pipes, etc). | ```pnpm web:g guard auth``` |

## 🗄️ Base de datos (Docker)
Control total sobre el contenedor de PostgreSQL sin memorizar comandos de Docker.

| Comando | Acción |
|---------|--------|
| ```pnpm db:up``` | Levanta el contenedor de Postgres en segundo plano (detach). |
| ```pnpm db:down``` | Detiene y elimina el contenedor (mantiene los datos). |
| ```pnpm db:logs``` | Muestra los logs de la base de datos en tiempo real. |
| ```pnpm db:nuke``` | ⚠️ **DANGER**: Detiene el contenedor y **borra el volumen de datos**. Útil para resetear la DB a cero. |

## 🚢 Despliegue a Producción (Docker)

El sistema incluye una configuración de **Multi-Stage Build** optimizada para producción.

1.  **Construye las imágenes**: Utiliza el contexto raíz para incluir librerías compartidas.
2.  **Orquesta los servicios**: Levanta la Base de datos, API y Cliente (Nginx) en una sola red.

```bash
# Construye y levanta todo el entorno de producción localmente
pnpm prod
```

-   **Frontend**: http://localhost (Puerto 80, servido por Nginx)
-   **Backend**: http://localhost:3000
-   **Database**: Puerto 5432

## 🛠️ Utilidades y Build
| Comando | Descripción |
|---------|-------------|
|```pnpm build:all``` | Compila ```shared```, ```api``` y ```client``` para producción. |
|```pnpm shared:watch``` | Compila la librería compartida y espera cambios (usando internamente por ```pnpm dev```).|
|```pnpm api:format```| Ejecuta Prettier/Linter en el Backend.|
|```pnpm generate:env``` | Fuerza la regeneración del ```environment.ts``` en Angular basado en el .env raíz.|

## 🐛 Troubleshooting

**Error: "Port 5432 is already allocated"** Tiene otra instancia de Postgres corriendo en tu máquina. Ejecuta ```pnpm db:down``` o detén tu servicio local de Postgres.

**Error: Angular no encuentra** ```@shared```
Asegúrate de que las rutas en `tsconfig.base.json` apunten correctamente a `packages/shared/src/index.ts`. Al usar "Source-First", no necesitas compilar la librería para desarrollo, los cambios se reflejan al instante.

**Cambio en variables de entorno** Si editas el ```.env``` raíz, debes reiniciar el comando ```pnpm run dev``` para que Angular regenere su configuración y NestJS recargue el contexto.