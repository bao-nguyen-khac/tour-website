# Chọn image node
FROM --platform=linux/amd64 node:20.9.0-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy file package.json và cài đặt
COPY package*.json ./
RUN npm install

# Copy toàn bộ project vào container
COPY . .

# Lắng nghe cổng
EXPOSE 8000

# Lệnh chạy app
CMD [ "node", "index.js" ]
