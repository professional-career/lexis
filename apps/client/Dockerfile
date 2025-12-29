
# ------------------------------------------------------------------------------
# Stage 1: Build
# ------------------------------------------------------------------------------
FROM node:20-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# 1. Copy root configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 2. Copy source code
COPY apps/client ./apps/client
COPY packages/shared ./packages/shared

# 3. Install dependencies
RUN pnpm install --frozen-lockfile

# 4. Build shared library (optional, depending on whether Angular consumes TS or JS)
RUN pnpm --filter @shared run build

# 5. Build the Angular app for production
RUN pnpm --filter client run build

# ------------------------------------------------------------------------------
# Stage 2: Serve with Nginx
# ------------------------------------------------------------------------------
FROM nginx:alpine

# 1. Copy the build output
#    Note: Angular 17+ / 18+ output path might be dist/client/browser
COPY --from=builder /app/apps/client/dist/client/browser /usr/share/nginx/html

# 2. Copy custom Nginx configuration
COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf

# 3. Expose port 80
EXPOSE 80

# 4. Start Nginx
CMD ["nginx", "-g", "daemon off;"]
