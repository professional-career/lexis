# Lexis
## **_The Agnostic Monorepo Orchestrator for Solo Developers_**

Lexis (nombrado en honor al genio inventor de Lufia II) es un sistema de monorepo ligero y agnóstico basado en **PNPM Workspaces**. Está diseñado para centralizar el desarrollo de múltiples aplicaciones y servicios sin imponer un stack tecnológico específico, priorizando la velocidad y el control total.

A diferencia de soluciones pesadas, Lexis utiliza una **arquitectura plana** donde cada componente (Frontend, Backend, Database, Scripts) vive como un paquete independiente dentro de la carpeta `packages/`.

## ✨ Características Principales

- **Tecnología Agnóstica**: Usa React, Angular, NestJS, Astro, Go o Rust. Si puede vivir en un paquete de Node, puede vivir en Lexis.
- **Arquitectura Plana**: Todo reside en `packages/`, eliminando la distinción artificial entre "apps" y "libs".
- **Contract-First**: Los acuerdos de datos viven en `contracts/`, forzando a todos los paquetes a hablar el mismo idioma.
- **Single Source of Truth (SSOT)**: Configuración centralizada mediante un único archivo `.env` en la raíz.
- **DX de Primera Clase**: Comandos orquestados para levantar todo el entorno de desarrollo con una sola instrucción.
- **Docker-Ready**: Configuración para despliegue productivo mediante Multi-Stage builds.

## 📂 Estructura del Proyecto

```text
/
├── contracts/        # ACUERDOS: Interfaces, Enums y DTOs globales
├── packages/
│   ├── api/          # Implementación Backend
│   ├── client/       # Implementación Frontend
│   ├── database/     # Capa de datos independiente (Prisma)
│   └── ...           # Cualquier nuevo servicio o librería
├── tools/            # Scripts de utilidad y configuración
├── .env              # La "Única Fuente de Verdad"
├── .env.example
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## 🚀 Inicio Rápido

El proyecto está diseñado para "Zero Config". La configuración de entorno se genera automáticamente al instalar.

1. **Instalación**
```bash
pnpm install
```

2. **Desarrollo**
Este comando levanta la base de datos, activa el modo watch de Prisma y arranca los servicios principales en paralelo.
```bash
pnpm dev
```

## 🤖 Guía de Comandos (DX)

Todos los comandos se ejecutan desde la raíz. Lexis utiliza `--filter` de PNPM internamente.

### Desarrollo y Construcción
| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Levanta DB, Prisma Watch y Aplicaciones (API + Web). |
| `pnpm build:all` | Compila todos los paquetes para producción. |
| `pnpm generate:env` | Inyecta variables del `.env` raíz en los entornos del frontend. |

### Base de Datos (Docker + Prisma)
| Comando | Acción |
|---------|--------|
| `pnpm db:up` | Levanta el contenedor de PostgreSQL. |
| `pnpm db:down` | Detiene el contenedor. |
| `pnpm db:migrate` | Ejecuta migraciones pendientes. |
| `pnpm db:enable <pkg>` | **Mágico**: Habilita Prisma y genera boilerplate en el paquete. |
| `pnpm db:nuke` | ⚠️ **Borra la base de datos y sus volúmenes**. |

### Generadores (Scaffolding)
| Comando | Descripción |
|---------|-------------|
| `pnpm api:res <nombre>` | Genera un recurso CRUD en el API. |
| `pnpm web:c <nombre>` | Genera un componente en el Frontend. |

## 🧪 Creando Nuevos Inventos (Añadir Paquetes)

Para añadir una nueva tecnología al ecosistema Lexis, utiliza los comandos de generación rápida:

```bash
# Para aplicaciones web (Angular, Astro, Next.js, React/Vite)
pnpm create:angular <nombre>
pnpm create:astro <nombre>
pnpm create:next <nombre>
pnpm create:vite <nombre>

# Para servicios backend (NestJS)
pnpm create:nest <nombre>
```

Estos comandos se encargan de:
1.  **Ubicación**: Colocar el proyecto automáticamente en `packages/`.
2.  **Configuración**: Aplicar los estándares de Lexis para TypeScript y PNPM.
3.  **Vincular**: Recuerda ejecutar `pnpm install` en la raíz para conectar el nuevo paquete al workspace.

### ¿Cómo conectarlo a la Base de Datos?
Si tu nuevo invento necesita datos:
```bash
pnpm add @lexis/database --filter <nombre-del-paquete>
```

## 🚢 Despliegue

Lexis incluye una configuración de producción optimizada:

```bash
# Construye y levanta el entorno de producción localmente
pnpm prod
```

## ⚙️ Gestión de Configuración (SSOT)

Lexis utiliza una estrategia de **Single Source of Truth**:
1. El archivo `.env` en la raíz contiene todas las credenciales y URLs.
2. Los servicios de **Backend** leen este archivo directamente.
3. Los servicios de **Frontend** reciben las variables públicas mediante su propio script `scripts/set-env.js` (ejecutado automáticamente al iniciar o mediante `pnpm generate:env`). No edites los archivos `environment.ts` manualmente.

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| **Error: Port 5432 is already allocated** | Tienes otra instancia de Postgres corriendo. Ejecuta `pnpm db:down` o detén tu servicio local de Postgres. |
| **Error: "@lexis/database" not found** | Ejecuta `pnpm install` en la raíz para que el workspace vincule el paquete local correctamente. |
| **Cambios en .env no se reflejan en Web** | Ejecuta `pnpm generate:env` para forzar la actualización de los archivos `environment.ts`. |
| **Prisma no reconoce un nuevo modelo** | Ejecuta `pnpm db:generate` desde la raíz para actualizar el cliente global. |
| **Error de scripts en Windows** | Si tienes problemas con los permisos de ejecución, asegúrate de usar un terminal con privilegios suficientes (PowerShell/CMD). |

## 💡 Consideraciones para Inventores

- **Protocolo Workspace**: Al añadir dependencias entre paquetes locales, usa siempre el protocolo `workspace:*` (ej. `pnpm add @lexis/contracts@workspace:* --filter api`).
- **Autosanación**: Si borras accidentalmente `packages/database`, el comando `pnpm db:enable <pkg>` lo reconstruirá automáticamente con la configuración base.
- **Contratos Inmutables**: Antes de definir una entidad en tu API, piensa si debería vivir en `contracts/`. Esto garantiza que todos los servicios hablen el mismo idioma.
- **Scripts Descentralizados**: En proyectos Angular, el generador inyecta un script en `scripts/set-env.js`. Si tu aplicación requiere variables de entorno adicionales, ese es el lugar donde debes añadirlas.

---
*Lexis - Menos fricción, más código e inventos geniales.*
