# Use a small Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package files first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy only source code (avoid other files like .git, node_modules)
COPY ./ ./

# Expose port
EXPOSE 8000

# Run the app
CMD ["npm", "start"]
