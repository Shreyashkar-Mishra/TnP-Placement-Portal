# Stage 1: Build the React application
FROM node:20-alpine as build

WORKDIR /app

# Copy package dependencies and install
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (Nginx default is 80)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
