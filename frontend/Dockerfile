# Development Dockerfile for Frontend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package* ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies (will work with or without lockfile)
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
