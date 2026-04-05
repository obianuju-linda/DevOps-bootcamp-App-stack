#--- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    build-base \
    openssl

# Copy and install ALL dependencies (dev + prod)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .

# Generate Prisma client before building the app
RUN npx prisma generate

RUN npm run build


#--- Production Stage ---
FROM node:20-alpine AS runner

# Set environment
ENV NODE_ENV=production \
    PORT=3001

WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache openssl curl

# Create non-root user explicitly
# node user already exists in node:alpine
# but let's be explicit about ownership
RUN chown -R node:node /app

# Copy package files for runtime module resolution
COPY --from=builder --chown=node:node /app/package*.json ./

# Install ONLY production dependencies here
# instead of copying all node_modules from builder
RUN npm ci --only=production && \
    npm cache clean --force

COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Copy Prisma client and schema for runtime use
COPY --from=builder --chown=node:node /app/prisma ./prisma/

# Copy built application
COPY --from=builder --chown=node:node /app/dist ./dist
COPY entrypoint-script.sh ./entrypoint-script.sh 
RUN  chown node:node ./entrypoint-script.sh 
RUN chmod +x entrypoint-script.sh

# Switch to non-root user
USER node

# Document port
EXPOSE 3001

CMD ["./entrypoint-script.sh"]