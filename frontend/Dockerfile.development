# Dockerfile.dev
FROM node:23-slim

# Set the working directory
WORKDIR /app

# Set environment variable
ENV NODE_ENV=development

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose development ports
EXPOSE 3000

# Start application in development mode
CMD ["npm", "run", "dev"]
