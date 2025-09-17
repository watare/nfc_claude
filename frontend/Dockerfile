# Frontend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user (nginx group already exists)
RUN adduser -S frontend -u 1001 -G nginx

# Set ownership
RUN chown -R frontend:nginx /usr/share/nginx/html
RUN chown -R frontend:nginx /var/cache/nginx
RUN chown -R frontend:nginx /var/log/nginx
RUN chown -R frontend:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R frontend:nginx /var/run/nginx.pid

USER frontend

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]