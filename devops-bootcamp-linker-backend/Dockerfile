# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install only what is needed for build
RUN apk add --no-cache python3 build-base openssl

# Copy dependency files first (better caching)
COPY package*.json ./

# Install ALL deps for build (including dev)
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build app
RUN npm run build


# ---------- Production Stage ----------
FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app

# Only runtime dependency needed for Prisma
RUN apk add --no-cache openssl

# Copy only package files
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy only REQUIRED runtime files (not full project)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy entrypoint
COPY entrypoint-script.sh ./entrypoint-script.sh
RUN chmod +x entrypoint-script.sh

# Use non-root user
USER node

EXPOSE 5000

CMD ["./entrypoint-script.sh"]