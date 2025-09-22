# Backend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies for build
RUN npm install

# Copy source code
COPY src/ ./src/
COPY prisma/ ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Note: dumb-init removed due to network issues
# Alternative: use node --init for signal handling

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Copy package files for production install
COPY --from=builder --chown=backend:nodejs /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built application
COPY --from=builder --chown=backend:nodejs /app/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/prisma ./prisma

# Create logs directory
RUN mkdir -p /app/logs && chown backend:nodejs /app/logs

USER backend

EXPOSE 5000

# Use node --init for signal handling (alternative to dumb-init)
# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node --init dist/app.js"]