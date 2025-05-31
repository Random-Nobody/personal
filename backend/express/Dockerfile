FROM node:22-alpine
WORKDIR /app

# Install all dependencies (including dev dependencies)
COPY package*.json ./
RUN npm install

# Copy TypeScript config
COPY tsconfig.json ./

# Use dev command by default (can be overridden in docker-compose)
CMD ["npm", "run", "dev"]