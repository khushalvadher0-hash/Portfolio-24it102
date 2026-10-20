# Use lightweight Node 18 Alpine image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package descriptors first to leverage Docker layer caching
COPY package*.json ./

# Install backend production dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose backend REST API port
EXPOSE 5000

# Start Express server
CMD ["node", "server.js"]
