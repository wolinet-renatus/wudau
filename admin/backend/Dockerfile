# Multi-stage production build for WUDAU Backend
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5050

# Install curl for container healthcheck
RUN apk add --no-cache curl

# Copy package descriptors
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci --only=production --legacy-peer-deps || npm install --only=production --legacy-peer-deps

# Copy application source code
COPY . .

# Ensure storage directory exists for uploaded videos and images
RUN mkdir -p storage

# Healthcheck to ensure API is responsive
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:${PORT}/client/setting/getSetting -H "key: 5TIvw5cpc0" || exit 1

EXPOSE 5050

CMD ["node", "index.js"]
