# Use the official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port your app runs on (default is 3000)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
