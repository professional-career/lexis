# GEMINI.md - Lexis Monorepo Context

This file provides the foundational context and development mandates for the **Lexis** monorepo, following a flat **PNPM Workspace** standard.

## 🚀 Project Overview

**Lexis** (named after the genius inventor from Lufia II) is a fullstack TypeScript monorepo where all applications and libraries are treated as packages within the `packages/` directory.

### Core Technology Stack
- **API (NestJS)**: `packages/api` (Port 3000)
- **Web (Angular)**: `packages/client` (Port 4200)
- **Database (Prisma)**: `packages/database` - Independent database client.
- **Package Manager**: PNPM (Workspaces)
- **Infrastructure**: Docker Compose (PostgreSQL, PgAdmin)

---

## 🏗️ Architecture & Conventions

### 1. Monorepo Structure
- `packages/api`: NestJS application.
- `packages/client`: Angular application.
- `packages/database`: Prisma schema and client. Exported as `@lexis/database`.
- `tools/`: Utility scripts for environment setup.

### 2. Environment Management (SSOT)
- The root `.env` file is the **Single Source of Truth**.
- Angular environments are auto-generated from root `.env` via `pnpm generate:env`.

### 3. Flat Workspace Standard
- Everything is a package in `packages/`.
- Use `--filter <package-name>` to run commands on specific packages from the root.
- Package names: `api`, `client`, `@lexis/database`.

---

## 🛠️ Key Commands

All commands should be run from the project root.

### Development & Build
- `pnpm dev`: Starts DB, Prisma watch, API, and Web in parallel.
- `pnpm build:all`: Compiles everything for production.
- `pnpm generate:env`: Force regeneration of Angular environment files.

### Database & Prisma
- `pnpm db:up / db:down`: Manage PostgreSQL container.
- `pnpm db:generate`: Generate Prisma Client.
- `pnpm db:migrate`: Run database migrations.
- `pnpm db:nuke`: Reset database and delete volumes.

### Scaffolding (DX)
- `pnpm api:res <name>`: Scaffolding for NestJS resources.
- `pnpm web:c <path>`: Create Angular component.
- `pnpm web:s <path>`: Create Angular service.

---

## ⚠️ Important Context for Gemini
- **Source-First Development**: Prefer direct imports from `@lexis/database` when implementing data logic.
- **Docker Context**: Production Dockerfiles are located inside each package but must be run from the root context.
