# GEMINI.md - Lexis Monorepo Context

This file provides the foundational context and development mandates for the **Lexis** monorepo, following a flat **PNPM Workspace** standard with a **Contract-First** architecture.

## 🚀 Project Overview

**Lexis** (named after the genius inventor from Lufia II) is an agnostic fullstack TypeScript monorepo where all applications and libraries are treated as packages within the `packages/` directory, while global agreements live in `contracts/`.

### Core Technology Stack
- **Workspaces**: PNPM (Flat architecture in `packages/*`)
- **Database**: Prisma (@lexis/database) with **self-healing** capabilities.
- **Contracts**: Design-First approach using `@lexis/contracts` for shared interfaces and enums.
- **Infrastructure**: Docker Compose (PostgreSQL, PgAdmin)

---

## 🏗️ Architecture & Conventions

### 1. Project Structure
- `contracts/`: **Global agreements**. Interfaces, Enums, and DTOs that all services must implement. Alias: `@lexis/contracts`.
- `packages/database/`: Independent Prisma client. Alias: `@lexis/database`.
- `packages/*`: Framework-agnostic applications (Angular, NestJS, Astro, etc.).
- `tools/`: Orchestration and generation scripts.

### 2. Environment Management (SSOT)
- Root `.env` is the **Single Source of Truth**.
- **Decentralized Config**: Frontend projects (like Angular) manage their own environments via local `scripts/set-env.js`.
- **Global Orchestration**: `pnpm generate:env` from root triggers local generation only where present (`--if-present`).

### 3. Development Mandates
- **Contract-First**: Define entities in `contracts/` before implementing them in services.
- **Self-Healing**: If `@lexis/database` is missing, `pnpm db:enable <pkg>` will automatically reconstruct it.
- **Workspace Protocol**: Always use `workspace:*` for internal dependencies.

---

## 🛠️ Key Commands (Root)

### Project Generation (Forging)
- `pnpm create:angular <name>`: Create a new Angular project with local env scripts.
- `pnpm create:nest <name>`: Create a new NestJS service.
- `pnpm create:astro / create:next / create:vite <name>`: Scaffolding for other web frameworks.

### Database & Prisma
- `pnpm db:enable <pkg>`: **Magic Command**. Links Prisma and generates boilerplate (like `PrismaService` for NestJS).
- `pnpm db:up / db:down`: Manage PostgreSQL container.
- `pnpm db:migrate / db:generate`: Prisma operations.

### Development
- `pnpm dev`: Parallel start of DB, Prisma watch, and core services.
- `pnpm generate:env`: Update environments across all supporting packages.

---

## ⚠️ Important Context for Gemini
- **Source-First**: Prefer direct imports from `@lexis/database` and `@lexis/contracts`.
- **Automation**: Use `tools/create-pkg.js` for new projects to ensure they follow Lexis directory standards.
- **Resilience**: The workspace is designed to be self-healing; don't be afraid to reconstruct missing core packages using the provided tools.
