# Stage 1: Build the React + Vite application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY . .

# Build production bundle (generates dist/)
RUN npm run build

# Stage 2: Serve the built application using lightweight runtime
FROM node:18-alpine

WORKDIR /app

# Copy package files and install only production dependencies needed for preview
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled production assets from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/vite.config.js ./vite.config.js

# Expose Vite preview port
EXPOSE 5173

# Serve using Vite preview bound to all interfaces
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
