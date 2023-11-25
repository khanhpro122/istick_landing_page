# Build BASE
FROM node:18-alpine as BASE
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile \
    && yarn cache clean

# Build Image
FROM node:18-alpine AS BUILD
WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Build production
FROM node:18-alpine AS PRODUCTION
WORKDIR /app
COPY --from=BUILD /app/public ./public
COPY --from=BUILD /app/next.config.js ./
COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static
COPY --from=BUILD /app/.next/server ./.next/server

EXPOSE 3000

CMD ["node", "server.js"]
