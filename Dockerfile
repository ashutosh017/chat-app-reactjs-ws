FROM node:20

# Set working directory to /app
WORKDIR /app

# Copy the entire project into /app
COPY . .

# Install dependencies for frontend
WORKDIR /app/frontend
RUN npm install

# Install dependencies for ws
WORKDIR /app/ws
RUN npm install

# Expose both ports
EXPOSE 5173 8080

# Install concurrently to run both servers
RUN npm install -g concurrently

# Run both servers using concurrently with JSON CMD
CMD ["concurrently", "npm:dev --prefix /app/frontend", "npm:dev --prefix /app/ws"]
