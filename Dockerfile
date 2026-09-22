FROM node:22-alpine AS base

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

# --- dev: no type-check/build, tsx transpiles on the fly ---
FROM base AS dev

CMD ["npm", "run", "dev"]

# --- production: full build ---
FROM base AS production

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
