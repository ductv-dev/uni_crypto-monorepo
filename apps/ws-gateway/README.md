# WS Gateway Realtime Flow

Tai lieu nay mo ta duong di cua du lieu realtime tu luc user dat lenh den luc client nhan gia moi qua Socket.IO.

## Tong quan

`ws-gateway` khong xu ly nghiep vu khop lenh. Service nay chi lam consumer realtime:

1. Subscribe Redis Pub/Sub.
2. Nhan event realtime tu matching-engine.
3. Emit event do ve cac Socket.IO room ma client da join.

Luồng chinh:

```text
Client/API dat order
-> apps/api tao OrderBook + OutboxEvent
-> apps/outbox-worker publish RabbitMQ event order.created
-> apps/matching-engine consume RabbitMQ va khop lenh
-> matching-engine luu Trade, cap nhat OrderBook, cap nhat Market.last_price
-> matching-engine publish Redis channel market.trade.created
-> apps/ws-gateway subscribe Redis channel
-> ws-gateway emit Socket.IO event market.trade.created
-> client dang join market room nhan gia realtime
```

## Cac service lien quan

`apps/api`

- File chinh: `apps/api/src/buy-sell/buy-sell.service.ts`
- Endpoint that: `POST /buy-sell`
- Viec lam: validate market, validate balance, khoa tien/coin, tao `OrderBook`, tao `OutboxEvent`.

`apps/outbox-worker`

- File chinh: `apps/outbox-worker/src/outbox.service.ts`
- Viec lam: doc `OutboxEvent` status `pending`, publish sang RabbitMQ.
- `event_type: order_created` duoc doi thanh routing key `order.created`.

`apps/matching-engine`

- File khop lenh: `apps/matching-engine/src/matching-engine.service.ts`
- File publish Redis: `apps/matching-engine/src/redis-publisher.service.ts`
- Viec lam: consume RabbitMQ `order.created`, nap order vao in-memory order book, tao `Trade` neu khop, roi publish Redis.

`apps/ws-gateway`

- File Socket.IO gateway: `apps/ws-gateway/src/ws-gateway.ts`
- File Redis subscriber: `apps/ws-gateway/src/redis-subscriber.service.ts`
- Viec lam: subscribe Redis va emit Socket.IO ve client.

`apps/client`

- Man hinh test realtime: `apps/client/app/socket-monitor/page.tsx`
- URL local: `http://localhost:3001/socket-monitor`
- Viec lam: connect Socket.IO, emit `market.join`, hien event `market.trade.created`.

## Event contract

### Redis channel

Matching engine publish vao Redis channel:

```text
market.trade.created
```

Payload dang chuan:

```json
{
  "symbol": "BTC/USDT",
  "marketId": "market-id",
  "lastPrice": 100500,
  "totalQuantity": 0.01,
  "takerOrderId": "order-id",
  "trades": [
    {
      "id": "trade-id",
      "makerOrderId": "maker-order-id",
      "takerOrderId": "taker-order-id",
      "marketId": "market-id",
      "price": 100500,
      "quantity": 0.01,
      "total": 1005,
      "side": "buy",
      "createdAt": "2026-05-16T00:00:00.000Z"
    }
  ]
}
```

### Socket.IO events

Client join room:

```ts
socket.emit('market.join', { symbol: 'BTCUSDT' });
```

Client listen trade realtime:

```ts
socket.on('market.trade.created', (payload) => {
  console.log(payload.lastPrice);
});
```

## Room va symbol normalization

Database seed hien tai luu market symbol dang:

```text
BTC/USDT
ETH/USDT
BNB/USDT
```

Client thuong nhap:

```text
BTCUSDT
```

De tranh lech room, `ws-gateway` normalize symbol o ca luc join va luc emit:

```text
BTC/USDT -> BTCUSDT
BTC-USDT -> BTCUSDT
BTCUSDT  -> BTCUSDT
```

Socket.IO room realtime co dang:

```text
market:BTCUSDT
```

Neu them format symbol moi, cap nhat `normalizeMarketSymbol` trong:

- `apps/ws-gateway/src/ws-gateway.ts`
- `apps/client/app/socket-monitor/page.tsx`

## Chay local de test

Can co PostgreSQL, Redis, RabbitMQ dang chay.

Chay cac service:

```bash
pnpm --filter api dev
pnpm --filter outbox-worker dev
pnpm --filter matching-engine dev
pnpm --filter ws-gateway dev
pnpm --filter client dev
```

Mo monitor:

```text
http://localhost:3001/socket-monitor
```

Nhap market:

```text
BTCUSDT
```

Sau do tao 2 lenh doi ung cung `market_id`:

1. Lenh `sell` vao book truoc.
2. Lenh `buy` co gia >= gia sell de khop.

Vi du payload API:

```json
{
  "market_id": "market-id-cua-BTC/USDT",
  "type": "limit",
  "side": "sell",
  "price": 100500,
  "quantity": 0.01
}
```

```json
{
  "market_id": "market-id-cua-BTC/USDT",
  "type": "limit",
  "side": "buy",
  "price": 100500,
  "quantity": 0.01
}
```

Neu trade khop thanh cong, monitor se nhan event `market.trade.created` va hien `lastPrice`.

## Test nhanh khong can trade that

Dung script Redis publisher test:

```bash
pnpm --filter ws-gateway exec ts-node src/test-redis.ts
```

Script nay publish Redis channel `market.trade.created` voi `symbol: "BTC/USDT"`. Neu monitor join `BTCUSDT` va gateway dang chay, monitor phai hien event.

## Checklist debug

Neu trade match thanh cong nhung monitor khong hien event:

- Monitor phai mo truoc khi trade duoc publish, vi Redis Pub/Sub khong luu event cu.
- Restart `ws-gateway` sau khi sua code normalization.
- Kiem tra monitor da connected va join `BTCUSDT`.
- Kiem tra log matching-engine co dong `Order ... matched! Created ... trades.`
- Kiem tra `OutboxEvent` da chuyen sang `sent`.
- Kiem tra matching-engine co publish Redis ma khong log `Redis publisher error`.
- Kiem tra ws-gateway co log `Subscribed Redis channels: kline.updated, market.trade.created`.
- Kiem tra Redis URL cua matching-engine va ws-gateway cung tro ve mot Redis instance.
- Kiem tra symbol trong DB va symbol client khong lech format; gateway se normalize `/` va `-`, nhung format moi can update them.

## Luu y ve Redis Pub/Sub

Redis Pub/Sub la realtime fire-and-forget:

- Client offline se mat event.
- ws-gateway restart trong luc publish se mat event.
- Neu can replay/history sau nay, can them Redis Stream, Kafka, hoac doc lai tu bang `Trade`.

Hien tai source of truth van la PostgreSQL. Redis va Socket.IO chi phuc vu day realtime ra UI.
