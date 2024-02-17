FROM node:20-alpine3.18 as base

RUN apk --no-cache add curl
RUN corepack enable

# All deps stage
FROM base as deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm i

# Production only deps stage
FROM base as production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --omit="dev"

# Build stage
FROM base as build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
RUN mkdir /app/tmp
EXPOSE 3333

CMD node ace migration:run --force && node ace db:seed && node ./bin/server.js
