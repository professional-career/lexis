# GEMINI.md - Lexis Monorepo Context

This file provides the foundational context and development mandates for the **Lexis** monorepo, following a flat **PNPM Workspace** standard with a **Contract-First** architecture and **Prisma 7 Standard**.

## 🚀 Project Overview

**Lexis** is an agnostic fullstack TypeScript monorepo where all applications and libraries are treated as packages within the `packages/` directory, while global agreements live in `contracts/`.

### Core Technology Stack
- **Workspaces**: PNPM (Flat architecture in `packages/*`)
- **Database**: Prisma 7 (@lexis/database) using **Driver Adapters** (@prisma/adapter-pg).
- **Contracts**: Design-First approach using `@lexis/contracts` for shared interfaces and enums.
- **Infrastructure**: Docker Compose (PostgreSQL, PgAdmin)

---

## 🏗️ Architecture & Conventions

### 1. Prisma 7 Standard (Critical)
- **Schema**: `schema.prisma` contains NO database URL. It is structural only.
- **Config**: Connection URL is managed in `packages/database/prisma.config.ts`.
- **Adapters**: All clients MUST use Driver Adapters. For PostgreSQL, use `pg` + `@prisma/adapter-pg`.
- **Boilerplate**:
  ```typescript
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  super({ adapter });
  ```

### 2. Environment Management (SSOT)
- Root `.env` is the **Single Source of Truth**.
- Frontend projects manage their own environments via local `scripts/set-env.js`.

---

## 🛠️ Key Commands (Root)

### Project Generation (Forging)
- `pnpm create:angular <name>`: Create a new Angular project with local env scripts.
- `pnpm create:nest <name>`: Create a new NestJS service.

### Database & Prisma
- `pnpm db:enable <pkg>`: **Magic Command**. Links Prisma 7 and generates Adapter-based boilerplate.
- `pnpm db:migrate / db:generate`: Prisma operations.

---

## ⚠️ Important Context for Gemini
- **Source-First**: Prefer direct imports from `@lexis/database` and `@lexis/contracts`.
- **Prisma 7 Compatibility**: Always specify `moduleFormat = "cjs"` in schema and use explicit adapters in constructors to avoid engine conflicts.
