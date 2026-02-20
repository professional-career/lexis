
# ------------------------------------------------------------------------------
# Stage 1: Build
# ------------------------------------------------------------------------------
FROM node:20-slim AS builder

# Enable pnpm via corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# 1. Copy root workspace definitions
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 2. Copy the actual packages and apps source code
COPY packages/api ./packages/api
COPY packages/database ./packages/database

# 3. Install dependencies
RUN pnpm install --frozen-lockfile

# 4. Generate Prisma Client
RUN pnpm --filter @lexis/database run db:generate

# 5. Build the database package
RUN pnpm --filter @lexis/database run build

# 6. Build the API project
RUN pnpm --filter api run build

# 7. Prune dependencies
RUN pnpm --filter api deploy --prod /prod/api

# ------------------------------------------------------------------------------
# Stage 2: Runtime
# ------------------------------------------------------------------------------
FROM node:20-slim

WORKDIR /app

# 1. Copy the deployed production folder from the builder stage
COPY --from=builder /prod/api ./

# 2. Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# 3. Expose the port
EXPOSE 3000

# 4. Start the application
CMD ["node", "dist/main"]
