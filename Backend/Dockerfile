FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (assuming Express runs on 5000, adjust if needed)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
