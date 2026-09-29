FROM oven/bun:1.3.14-alpine AS base

WORKDIR /app

FROM base AS dependencies

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM dependencies AS build

COPY . .
RUN bun run build

FROM base AS production-dependencies

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM base AS runtime

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/.output ./.output

USER bun

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
