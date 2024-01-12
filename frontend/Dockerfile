# Use the official Node.js image as the base image for the build stage
FROM node:latest as build-stage

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application for production
RUN npm run build

# Use the official Nginx image for the serve stage
FROM nginx:stable-alpine as serve-stage

# Copy the build output from the build stage to Nginx's serve directory
COPY --from=build-stage /app/build /usr/share/nginx/html

# Nginx will serve the static files on port 80 by default
# No need to EXPOSE 80 as it's the default for Nginx and is already exposed by the base image

# Start Nginx in the foreground (default CMD for Nginx image)
# No need to specify CMD as it's inherited from the base image
