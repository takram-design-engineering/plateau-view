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
RUN npx nx run app:build:production --verbose

FROM node:18-slim AS runner
ENV NODE_ENV=production
ARG GOOGLE_CLOUD_PROJECT
WORKDIR /app
# https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
COPY --from=builder /app/dist/apps/app/.next/standalone/ ./
COPY --from=builder /app/dist/apps/app/.next/static/ ./dist/apps/app/.next/static/
COPY --from=builder /app/dist/apps/app/public/ ./apps/app/public/

CMD ["node", "./apps/app/server.js"]
