# Order Placement Load Test

Script nay test endpoint dat lenh that cua repo hien tai:

- API route: `POST /buy-sell`
- Auth: `Bearer <JWT>`
- Tu dong refresh lai access token qua `POST /auth/refresh` neu request dat lenh bi `401`
- Payload:
  - `market_id`
  - `type`
  - `side`
  - `price`
  - `quantity`

## 1. Cai k6

Mac:

```bash
brew install k6
```

## 2. Chuan bi token

Copy file mau:

```bash
cp scripts/k6/tokens.example.json scripts/k6/tokens.json
```

Thay cac token mau bang cap token that cua cac test user.

Khuyen nghi dung format nay de script co the tu refresh access token:

```json
[
  {
    "label": "load-user-01",
    "access_token": "<access_token>",
    "refresh_token": "<refresh_token>"
  }
]
```

Script van nhan format cu:

```json
[
  {
    "label": "load-user-01",
    "token": "<access_token>"
  }
]
```

Nhung neu chi co access token thi khi token het han, script khong the refresh.

Co the truyen truc tiep qua env:

```bash
TOKENS_JSON='[{"label":"load-user-01","access_token":"...","refresh_token":"..."}]'
```

## 3. Chuan bi market

Lay market id bang API:

```bash
curl http://localhost:8080/buy-sell/markets
```

Sau do truyen `MARKET_IDS`:

```bash
MARKET_IDS=market-uuid-1,market-uuid-2
```

## 4. Chay test

Kich ban mac dinh:

- ramp-up 0 -> 100 VUs trong 10s
- giu 100 VUs trong 30s
- ramp-down ve 0 trong 10s

```bash
MARKET_IDS=your-market-id \
k6 run scripts/k6/order-placement.js
```

Vi du day du hon:

```bash
BASE_URL=http://localhost:8080 \
MARKET_IDS=0d4e6e22-1111-2222-3333-444444444444 \
PRICE_MIN=500800 \
PRICE_MAX=501200 \
QUANTITY_MIN=0.001 \
QUANTITY_MAX=0.02 \
TARGET_VUS=50 \
RAMP_UP_DURATION=10s \
STEADY_DURATION=30s \
RAMP_DOWN_DURATION=10s \
k6 run scripts/k6/order-placement.js
```

Neu muon ban theo toc do co dinh, vi du `30 trade / phut` trong `10 phut`:

```bash
EXECUTOR_MODE=constant-arrival-rate \
RATE=30 \
TIME_UNIT=1m \
DURATION=10m \
PREALLOCATED_VUS=10 \
MAX_VUS=50 \
MARKET_IDS=your-market-id \
k6 run scripts/k6/order-placement.js
```

## 5. Bien moi truong ho tro

- `BASE_URL`: default `http://localhost:8080`
- `ORDER_PATH`: default `/buy-sell`
- `REFRESH_PATH`: default `/auth/refresh`
- `MARKET_IDS`: danh sach market id, bat buoc
- `TOKENS_JSON`: pool JWT thay cho file local
- `ORDER_TYPE`: default `limit`
- `EXECUTOR_MODE`: `ramping-vus` hoac `constant-arrival-rate`
- `RATE`: so request moi `TIME_UNIT` khi dung `constant-arrival-rate`
- `TIME_UNIT`: mac dinh `1m`
- `DURATION`: thoi gian giu toc do co dinh, mac dinh `10m`
- `PREALLOCATED_VUS`, `MAX_VUS`: pool VU cho `constant-arrival-rate`
- `PRICE_MIN`, `PRICE_MAX`, `PRICE_DECIMALS`
- `QUANTITY_MIN`, `QUANTITY_MAX`, `QUANTITY_DECIMALS`
- `TARGET_VUS`
- `RAMP_UP_DURATION`
- `STEADY_DURATION`
- `RAMP_DOWN_DURATION`
- `THINK_TIME_MIN_MS`, `THINK_TIME_MAX_MS`

## 6. Seed data goi y

### Lay token cho user test

Dang nhap tung user test de lay `access_token` va `refresh_token`:

```bash
curl -X POST http://localhost:8080/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "loadtest1@example.com",
    "password": "123456"
  }'
```

Response se co:

```json
{
  "access_token": "...",
  "refresh_token": "..."
}
```

### User test

Nen tao it nhat:

- 50 user neu test 50 VUs
- 100 user neu test 100 VUs

Neu muon giam lock tren cung 1 vi, moi user nen co:

- 1 wallet `quote_asset` de dat `buy`
- 1 wallet `base_asset` de dat `sell`

### So du can nap

Repo hien tai tinh:

- `buy`: khoa `quantity * price` tren `quote_asset`
- `sell`: khoa `quantity` tren `base_asset`

Voi vung gia `500800 -> 501200` va quantity toi da `0.02`:

- moi lenh buy co the can den ~ `10,024` quote asset
- moi lenh sell can den `0.02` base asset

Neu muon chay 1 user lap lai nhieu request, nap du phong cao hon rat nhieu.

Khuyen nghi cho moi test user:

- `quote_asset.available_balance`: it nhat `1,000,000`
- `base_asset.available_balance`: it nhat `10`

### Cach seed nhanh bang SQL

Y tuong:

1. Tao user test.
2. Tao session/auth de dang nhap lay JWT.
3. Tao wallet cho 2 asset cua market.
4. Nap `available_balance`.

Vi du cap nhat balance cho user da co san:

```sql
UPDATE "Wallet"
SET available_balance = 1000000,
    blocked_balance = 0
WHERE user_id = '<user-id>'
  AND asset_id = '<quote-asset-id>';

UPDATE "Wallet"
SET available_balance = 10,
    blocked_balance = 0
WHERE user_id = '<user-id>'
  AND asset_id = '<base-asset-id>';
```

Neu chua co wallet:

```sql
INSERT INTO "Wallet" (id, user_id, asset_id, available_balance, blocked_balance, status, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), '<user-id>', '<quote-asset-id>', 1000000, 0, true, NOW(), NOW()),
  (gen_random_uuid(), '<user-id>', '<base-asset-id>', 10, 0, true, NOW(), NOW());
```

## 7. Rủi ro deadlock va race condition

### Dieu quan trong trong code hien tai

`buy-sell.service.ts` hien tai **chua thuc su dung `SELECT ... FOR UPDATE`**.
No dang:

1. doc wallet ngoai transaction
2. vao transaction roi `update wallet`
3. tao `OrderBook`
4. tao `OutboxEvent`

Dieu nay de gay:

- lost update
- overspend khi 2 request cung dung 1 wallet vao cung luc
- test load co the fail theo kieu sai so du truoc khi den muc deadlock

### Khi nao de deadlock

Neu ban nang cap sang row locking that, deadlock co the xay ra khi:

1. mot transaction lock wallet A roi wallet B
2. transaction khac lock wallet B roi wallet A
3. hai ben doi nhau

Voi san giao dich, tinh huong nay hay gap khi:

- lock nhieu wallet trong 1 transaction
- lock them market/order rows theo thu tu khong nhat quan
- worker/matching engine cap nhat cung order/wallet theo thu tu khac API

### Cach giam deadlock

1. Neu phai lock nhieu row, **luon lock theo thu tu co dinh**.
   Vi du: sort theo `wallet.id ASC` roi moi lock/update.

2. Giu transaction ngan nhat co the.
   Chi gom:
   - lock wallet
   - validate so du
   - update wallet
   - create order
   - create outbox

3. Tach cac thao tac khong critical ra ngoai transaction:
   - notification
   - audit log neu khong bat buoc atomic cung order

4. Dung 1 cau `UPDATE ... WHERE available_balance >= ?` neu muon toi uu tranh race:

```sql
UPDATE "Wallet"
SET available_balance = available_balance - $1,
    blocked_balance = blocked_balance + $1
WHERE id = $2
  AND available_balance >= $1;
```

## 8. Hanh vi refresh token trong script

Moi VU giu rieng 1 bo token.

Khi `POST /buy-sell` tra `401`:

1. Script goi `POST /auth/refresh` voi `Authorization: Bearer <refresh_token>`
2. Neu refresh thanh cong, script thay `access_token` trong bo nho cua VU
3. Script retry lai request dat lenh dung 1 lan

Metric bo sung:

- `token_refresh_success_rate`
- `token_refresh_failure_count`

Sau do check `rowCount`.
Huong nay thuong ben vung hon model read-then-update.

5. Them retry co gioi han cho Postgres serialization/deadlock errors.

### Index nen co

Schema hien tai da co:

- `Wallet @@unique([user_id, asset_id])`
- `OrderBook @@index([user_id])`
- `OrderBook @@index([market_id])`
- `OutboxEvent @@index([status])`
- `OutboxEvent @@index([createdAt])`

Can dam bao khi load cao:

- query lookup wallet dung dung unique key `(user_id, asset_id)`
- query worker quet outbox co index phu hop theo `status, createdAt`

Neu outbox worker scan theo `status='pending' ORDER BY createdAt`, can can nhac composite index:

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS outbox_status_created_idx
ON "OutboxEvent"(status, "createdAt");
```

## 8. Ket qua test

Summary JSON se duoc ghi ra:

```text
scripts/k6/results/order-placement-summary.json
```
