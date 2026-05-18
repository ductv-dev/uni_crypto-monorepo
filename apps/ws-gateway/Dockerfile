FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./
COPY apps/ws-gateway ./apps/ws-gateway

RUN pnpm install --frozen-lockfile --filter ws-gateway...
RUN pnpm -C apps/ws-gateway build

CMD ["pnpm", "-C", "apps/ws-gateway", "start:prod"]
