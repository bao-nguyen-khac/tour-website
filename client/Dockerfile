# Stage 1: Build app
FROM --platform=linux/amd64 node:20 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_URL=https://travel-api-zm9i.onrender.com
RUN npm run build

# Stage 2: Serve app with nginx
FROM --platform=linux/amd64 nginx:alpine

# Copy built app from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
