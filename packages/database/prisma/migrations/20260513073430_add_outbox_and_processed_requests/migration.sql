-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL,
    "aggregate_type" TEXT NOT NULL,
    "aggregate_id" TEXT,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "processed_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessedRequest" (
    "id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "user_id" TEXT,
    "endpoint" TEXT,
    "request_hash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "response_data" JSONB,
    "error_message" TEXT,
    "expired_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessedRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OutboxEvent_status_idx" ON "OutboxEvent"("status");

-- CreateIndex
CREATE INDEX "OutboxEvent_event_type_idx" ON "OutboxEvent"("event_type");

-- CreateIndex
CREATE INDEX "OutboxEvent_aggregate_type_aggregate_id_idx" ON "OutboxEvent"("aggregate_type", "aggregate_id");

-- CreateIndex
CREATE INDEX "OutboxEvent_createdAt_idx" ON "OutboxEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProcessedRequest_idempotency_key_key" ON "ProcessedRequest"("idempotency_key");

-- CreateIndex
CREATE INDEX "ProcessedRequest_user_id_idx" ON "ProcessedRequest"("user_id");

-- CreateIndex
CREATE INDEX "ProcessedRequest_status_idx" ON "ProcessedRequest"("status");

-- CreateIndex
CREATE INDEX "ProcessedRequest_expired_at_idx" ON "ProcessedRequest"("expired_at");

-- CreateIndex
CREATE INDEX "ProcessedRequest_createdAt_idx" ON "ProcessedRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "ProcessedRequest" ADD CONSTRAINT "ProcessedRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
