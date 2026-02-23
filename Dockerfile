# ────────────────────────────────────────────────────────────────────────────
# Stage 1: Build
# Uses the official Node.js image to compile the Angular application.
# ────────────────────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

LABEL stage="builder"

WORKDIR /app

# Copy dependency manifests first (layer cache optimisation)
COPY package*.json ./

# Install all dependencies (including devDependencies for the build)
RUN npm ci --silent

# Copy the rest of the source code
COPY . .

# Compile the production build
RUN npm run build:prod

# ────────────────────────────────────────────────────────────────────────────
# Stage 2: Serve
# Copies only the compiled output into a minimal nginx image.
# Final image size is ~25 MB vs ~500 MB for a node image.
# ────────────────────────────────────────────────────────────────────────────
FROM nginx:1.25-alpine AS production

LABEL maintainer="your-team@example.com"
LABEL description="Employee Portal — Angular SPA"
LABEL version="1.0.0"

# Replace the default nginx config with our custom config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the compiled Angular app from the builder stage
COPY --from=builder /app/dist/employee-portal /usr/share/nginx/html

# Create a non-root user for the nginx worker processes
RUN addgroup -g 1001 -S appgroup && \
    adduser  -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
