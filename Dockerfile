# ╔══════════════════════════════════════════════════════════╗
# ║  Employee Portal — Multi-stage Docker Build              ║
# ║  Stage 1: Build the Angular app                          ║
# ║  Stage 2: Serve with nginx (minimal image)               ║
# ╚══════════════════════════════════════════════════════════╝

# ── Stage 1: Build ────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (leverages Docker layer cache)
COPY package*.json ./
RUN npm ci --prefer-offline

# Copy source and build production bundle
COPY . .
RUN npm run build:prod

# ── Stage 2: Serve ────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Copy production build artefacts
COPY --from=builder /app/dist/employee-portal /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Non-root user for security
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /tmp/nginx.pid && \
    chown -R nginx:nginx /tmp/nginx.pid

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
