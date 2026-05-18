FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json nest-cli.json ./
COPY apps/matching-engine ./apps/matching-engine
COPY packages/database ./packages/database

RUN pnpm install --frozen-lockfile --filter matching-engine... --filter @workspace/db...
RUN pnpm -C packages/database build
RUN pnpm -C apps/matching-engine build

CMD ["pnpm", "-C", "apps/matching-engine", "start:prod"]
