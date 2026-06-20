FROM node:22-slim

WORKDIR /app


COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 4000

CMD ["npx", "tsx", "src/server.ts"]