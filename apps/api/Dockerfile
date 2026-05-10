# ============================================================================
# Stage 1: Dependencies
# Install all dependencies needed for building
# ============================================================================
FROM node:20-slim AS deps

# Install pnpm globally
RUN npm install -g pnpm@10.17.1

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy package.json files for all workspace packages
COPY apps/api/package.json ./apps/api/
COPY packages/api-types/package.json ./packages/api-types/

# Copy Prisma schema (needed for postinstall script)
COPY apps/api/prisma ./apps/api/prisma

# Install dependencies with frozen lockfile for reproducibility
RUN pnpm install --frozen-lockfile

# ============================================================================
# Stage 2: Build
# Generate Prisma client and compile TypeScript
# ============================================================================
FROM node:20-slim AS builder

# Install pnpm globally
RUN npm install -g pnpm@10.17.1

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/api-types/node_modules ./packages/api-types/node_modules

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/api-types/package.json ./packages/api-types/

# Copy Prisma schema
COPY apps/api/prisma ./apps/api/prisma

# Copy root TypeScript config
COPY tsconfig.json ./

# Copy API source code
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig.json ./apps/api/

# Copy api-types source if needed
COPY packages/api-types ./packages/api-types

# Set Prisma binary targets for Linux (debian/glibc)
ENV PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x

# Generate Prisma client with linux binary target
WORKDIR /app/apps/api
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build TypeScript (using tsconfig.json since tsconfig.build.json doesn't exist)
RUN pnpm exec tsc -p tsconfig.json

# ============================================================================
# Stage 3: Production
# Create minimal production image
# ============================================================================
FROM node:20-slim AS production

# Install OpenSSL for Prisma and curl for health checks
RUN apt-get update -y && \
    apt-get install -y openssl curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm@10.17.1

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/api-types/package.json ./packages/api-types/

# Copy Prisma schema and migrations for runtime
COPY apps/api/prisma ./apps/api/prisma

# Install production dependencies only (skip scripts since we copy generated client from builder)
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Copy generated Prisma client from builder (pnpm structure)
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Copy api-types if needed at runtime
COPY --from=builder /app/packages/api-types ./packages/api-types

# Copy tsconfig files for tsconfig-paths to resolve aliases
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/apps/api/tsconfig.json ./apps/api/tsconfig.json

# Set working directory to API
WORKDIR /app/apps/api

# Expose port
EXPOSE 4000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Create runtime tsconfig that points to dist instead of src
RUN echo '{\n\
  "extends": "./tsconfig.json",\n\
  "compilerOptions": {\n\
    "baseUrl": ".",\n\
    "paths": {\n\
      "@graphql/*": ["./dist/graphql/*"],\n\
      "@lib/*": ["./dist/lib/*"]\n\
    }\n\
  }\n\
}' > /app/apps/api/tsconfig.runtime.json

# Copy the startup script from the repo (URL-encodes credentials, runs
# migrations, execs node). Tracked in git with +x so the bit survives the
# COPY; we belt-and-braces re-chmod here too.
COPY apps/api/scripts/start.sh /app/apps/api/start.sh
RUN chmod +x /app/apps/api/start.sh

# Start the application
CMD ["/app/apps/api/start.sh"]