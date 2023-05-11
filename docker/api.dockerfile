FROM node:18-slim AS base
WORKDIR /app
COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn/ ./.yarn/

FROM base AS dependencies
WORKDIR /app
RUN yarn --immutable

FROM dependencies AS builder
ENV NODE_ENV=production
ARG GOOGLE_CLOUD_PROJECT
WORKDIR /app
COPY . .
RUN npx nx run api:build:production --verbose

FROM node:18-slim AS build
WORKDIR /app
COPY --from=builder /app/dist/ ./dist/

FROM node:18-slim AS runner
ENV NODE_ENV=production
ARG GOOGLE_CLOUD_PROJECT
WORKDIR /app
COPY --from=dependencies /app/ ./
COPY --from=build /app/ ./
COPY . .

CMD ["node", "./dist/apps/api/main.js"]
