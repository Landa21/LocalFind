# Use Node.js LTS version as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
