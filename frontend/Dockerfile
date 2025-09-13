# Dockerfile.dev
FROM node:23-slim

# Set the working directory
WORKDIR /app

# Set environment variable
ENV NODE_ENV=development

# Enable Corepack for package management
RUN corepack enable

# Copy package file
COPY package.json ./

# Copy pnpm lock file
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy application code
COPY . .

# Expose development ports
EXPOSE 3000

# Start application in development mode
CMD ["pnpm", "run", "dev"]
