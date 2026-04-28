FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/client/package.json apps/client/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm turbo run build --filter=client...

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=builder /app/apps/client/public ./apps/client/public

EXPOSE 3001

CMD ["node", "apps/client/server.js"]