# syntax=docker/dockerfile:1

FROM node:24.16.0-bookworm AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json vitest.config.ts ./
COPY src ./src
COPY tests ./tests

RUN npm run build && npm prune --omit=dev

FROM node:24.16.0-bookworm AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssh-client \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY src/features ./src/features

EXPOSE 3000

CMD ["npm", "start"]
