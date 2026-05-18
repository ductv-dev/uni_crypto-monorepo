# Uni Crypto Monorepo

Monorepo gồm:

- `apps/api`: NestJS backend
- `apps/outbox-worker`: worker publish outbox event lên RabbitMQ
- `apps/matching-engine`: matching engine theo từng market
- `apps/ws-gateway`: Socket.IO gateway subscribe Redis để push realtime cho client
- `apps/admin`: Next.js admin app
- `apps/client`: Next.js client app
- `packages/database`: Prisma schema + Prisma service dùng chung

## Prerequisites

- Node.js `>=20`
- pnpm `9.x`
- Docker + Docker Compose

## 1) Cài dependencies

```bash
pnpm install
```

## 2) Chạy hạ tầng bằng Docker

`docker-compose.yml` hiện tại chạy:

- Postgres
- Redis
- RabbitMQ
- 3 matching engine container:
  - `matching-btc-usdt`
  - `matching-eth-usdt`
  - `matching-bnb-usdt`
- `ws-gateway` (Socket.IO server)

Chạy:

```bash
docker compose up -d --build postgres redis rabbitmq ws-gateway matching-btc-usdt matching-eth-usdt matching-bnb-usdt
```

Kiểm tra:

```bash
docker compose ps
docker compose logs -f ws-gateway matching-btc-usdt matching-eth-usdt matching-bnb-usdt
```

RabbitMQ management UI:

- http://localhost:15672
- user/pass: `admin/admin`

## 3) Chạy API + Outbox Worker local

Mở 2 terminal:

```bash
pnpm --filter api dev
```

```bash
pnpm --filter outbox-worker dev
```

API mặc định chạy:

- http://localhost:8080

## 4) Chạy Frontend local

Mở 2 terminal:

```bash
pnpm --filter admin dev
```

```bash
pnpm --filter client dev
```

URL:

- Admin: http://localhost:3000
- Client: http://localhost:3001

## 5) Biến môi trường cần biết

### Admin/Client

- `API_URL` (optional khi dev)
- mặc định fallback `http://localhost:8080`
- `NEXT_PUBLIC_WS_URL` (optional, default `http://localhost:3002`)

### API

- `DATABASE_URL` (bắt buộc để kết nối Postgres)

### Outbox Worker

- `DATABASE_URL`
- `RABBITMQ_URL` (mặc định local)
- `RABBITMQ_EXCHANGE` (mặc định `orders.exchange`)

### Matching Engine (đã set trong docker-compose)

- `DATABASE_URL`
- `RABBITMQ_URL`
- `RABBITMQ_EXCHANGE`
- `REDIS_URL`
- `MATCHING_MARKET`
- `MATCHING_QUEUE`

### WS Gateway (đã set trong docker-compose)

- `REDIS_URL`

## 6) Flow đặt lệnh / khớp lệnh / thông báo realtime

1. Client/Admin gọi API tạo order (`order_book`).
2. API tạo `outbox_event` (`order_created`).
3. Outbox worker publish message RabbitMQ theo routing key:
   - `order.created.${market}`
4. Matching engine tương ứng market consume queue riêng.
5. Nếu khớp:
   - tạo `trade`
   - update `order_book` (`partial_filled`/`filled`)
   - update ví + wallet transaction cho maker/taker
   - publish `market.trade.created` lên Redis
6. Nếu chưa khớp:
   - order vẫn `open` trong DB (message vẫn được ack, không giữ lại queue).
7. API publish `user.notification` lên Redis khi đặt lệnh / nạp / rút thành công hoặc thất bại.
8. `ws-gateway` subscribe Redis và emit Socket.IO event `user.notification` tới room `user:{userId}`.

## 7) Troubleshooting nhanh

### `no such service: outbox-worker`

`docker-compose.yml` hiện chưa khai báo service `outbox-worker`.
Chạy worker local bằng:

```bash
pnpm --filter outbox-worker dev
```

### Matching log `Market mismatch expected=ETH-USDT actual=ETH/USDT`

- Đảm bảo đã rebuild image matching mới:

```bash
docker compose build --no-cache matching-btc-usdt matching-eth-usdt matching-bnb-usdt
docker compose up -d matching-btc-usdt matching-eth-usdt matching-bnb-usdt
```

- Replay outbox event đã gửi trước khi fix:

```bash
docker compose exec -T postgres psql -U root -d uni_db -c "
update \"OutboxEvent\" oe
set status='pending', sent_at=null, retry_count=0
from \"OrderBook\" ob
join \"Market\" m on m.id = ob.market_id
where oe.order_id = ob.id
  and oe.event_type = 'order_created'
  and oe.status = 'sent'
  and m.symbol in ('ETH/USDT','ETH-USDT');
"
```

### Cảnh báo `docker-compose.yml: version is obsolete`

Không làm fail runtime, chỉ là warning của Compose mới.

## 8) Lệnh hữu ích

```bash
# Build typecheck nhanh các app chính
pnpm --filter api build
pnpm --filter outbox-worker build
pnpm --filter matching-engine build
pnpm --filter admin typecheck
pnpm --filter client typecheck
```
