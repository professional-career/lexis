
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
# We need to copy everything because pnpm workspaces rely on the file structure
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
# (Add other apps/libs here if needed in the future)

# 3. Install dependencies (frozen-lockfile for consistency)
RUN pnpm install --frozen-lockfile

# 4. Build the shared library (if needed by your setup, though source-first might not strictly require it, 
#    NestJS build often likes to see the dist folder if referenced in tsconfig paths)
#    In our case, we just build the API, which will pull in the shared code.
#    However, if shared needs a build step, do it here:
RUN pnpm --filter @shared run build

# 5. Build the API project
RUN pnpm --filter api run build

# 6. Prune dependencies to only include what's needed for production
#    (This reduces image size significantly)
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
