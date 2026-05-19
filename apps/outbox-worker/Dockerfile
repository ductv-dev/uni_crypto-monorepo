FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/outbox-worker ./apps/outbox-worker
COPY packages/database ./packages/database

RUN pnpm install --frozen-lockfile --filter outbox-worker... --filter @workspace/db...
RUN pnpm -C packages/database build
RUN pnpm -C apps/outbox-worker build

CMD ["pnpm", "-C", "apps/outbox-worker", "start:prod"]
