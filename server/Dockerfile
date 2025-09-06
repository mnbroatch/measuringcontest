# Use a small Node.js base image
FROM node:20-alpine

# Create app directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy app source code
COPY . .

# Expose port 8000
EXPOSE 8000

# Run the app
CMD ["npm", "start"]
