FROM node:24-bookworm-slim AS dependencies

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

FROM dependencies AS build

COPY . .

# Vite reads VITE_* while compiling the browser bundle. They are public values,
# never secrets. CapRover runtime variables take precedence in the browser via
# the configuration injected by entry-server.tsx.
ARG VITE_API_URL=
ARG VITE_BLOG_URL=
ARG VITE_CAVE_URL=
ARG VITE_STRIPE_PUBLISHABLE_KEY=
ARG VITE_KITANA_URL=

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_BLOG_URL=${VITE_BLOG_URL}
ENV VITE_CAVE_URL=${VITE_CAVE_URL}
ENV VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}
ENV VITE_KITANA_URL=${VITE_KITANA_URL}

RUN yarn build

FROM node:24-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build --chown=node:node /app/.output ./.output
COPY --chown=node:node --chmod=755 docker-entrypoint.sh ./docker-entrypoint.sh

USER node

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", ".output/server/index.mjs"]
