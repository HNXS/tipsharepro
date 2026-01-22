# TipSharePro Backend - Docker Build
# Multi-stage build for Express + Prisma application

# ============================================================================
# Stage 1: Builder
# ============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package.json package-lock.json* ./

# Copy Prisma schema (needed for prisma generate during npm ci)
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# ============================================================================
# Stage 2: Runner (Production)
# ============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install OpenSSL for Prisma runtime
RUN apk add --no-cache openssl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy built application and dependencies
COPY --from=builder --chown=expressjs:nodejs /app/dist ./dist
COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=expressjs:nodejs /app/package.json ./

# Switch to non-root user
USER expressjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3001/api/v1/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
