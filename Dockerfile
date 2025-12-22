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

# Run both servers
CMD sh -c "cd /app/frontend && npm run dev & cd /app/ws && npm run dev"
