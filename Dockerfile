# 阶段1：构建前端
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 阶段2：生产镜像，运行Express后端+前端静态资源
FROM node:18-alpine
WORKDIR /app

# 拷贝后端代码和前端打包产物
COPY --from=builder /app/server.js .
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "server.js"]