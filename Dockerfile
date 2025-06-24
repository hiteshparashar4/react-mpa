FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server/server.bundle.js ./server/server.bundle.js

EXPOSE 3000

CMD ["node", "server/server.bundle.js"]

