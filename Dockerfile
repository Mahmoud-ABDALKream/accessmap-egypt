# ─── Stage 1: Dependencies ─────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS deps

WORKDIR /app

# Copy package manifests for dependency installation
COPY package.json bun.lock ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for build step)
RUN bun install --frozen-lockfile

# ─── Stage 2: Builder ─────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/bun.lock ./

# Copy all source code
COPY . .

# Switch Prisma provider from sqlite to postgresql for production
RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# Regenerate Prisma client with the postgresql provider
RUN bunx prisma generate

# Build the Next.js application (standalone output)
RUN bun run build

# ─── Stage 3: Runner ──────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone server output
COPY --from=builder /app/.next/standalone ./
# Copy static assets that standalone doesn't include
COPY --from=builder /app/.next/static ./.next/static
# Copy public directory
COPY --from=builder /app/public ./public
# Copy Prisma schema for runtime migrations
COPY --from=builder /app/prisma ./prisma

# Set correct ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]
