/*
  Warnings:

  - You are about to drop the column `aggregate_id` on the `OutboxEvent` table. All the data in the column will be lost.
  - You are about to drop the column `aggregate_type` on the `OutboxEvent` table. All the data in the column will be lost.
  - You are about to drop the column `processed_at` on the `OutboxEvent` table. All the data in the column will be lost.
  - The `status` column on the `OutboxEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ProcessedRequest` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `order_id` to the `OutboxEvent` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `event_type` on the `OutboxEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OutboxEventType" AS ENUM ('order_created', 'order_cancelled');

-- CreateEnum
CREATE TYPE "OutboxEventStatus" AS ENUM ('pending', 'processing', 'sent', 'failed');

-- CreateEnum
CREATE TYPE "ConsumedMessageStatus" AS ENUM ('processing', 'success', 'failed');

-- DropForeignKey
ALTER TABLE "ProcessedRequest" DROP CONSTRAINT "ProcessedRequest_user_id_fkey";

-- DropIndex
DROP INDEX "OutboxEvent_aggregate_type_aggregate_id_idx";

-- AlterTable
ALTER TABLE "OutboxEvent" DROP COLUMN "aggregate_id",
DROP COLUMN "aggregate_type",
DROP COLUMN "processed_at",
ADD COLUMN     "locked_at" TIMESTAMP(3),
ADD COLUMN     "locked_by" TEXT,
ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "sent_at" TIMESTAMP(3),
DROP COLUMN "event_type",
ADD COLUMN     "event_type" "OutboxEventType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "OutboxEventStatus" NOT NULL DEFAULT 'pending';

-- DropTable
DROP TABLE "ProcessedRequest";

-- CreateTable
CREATE TABLE "ConsumedMessage" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "consumer_name" TEXT NOT NULL,
    "status" "ConsumedMessageStatus" NOT NULL DEFAULT 'processing',
    "error_message" TEXT,
    "processed_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsumedMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConsumedMessage_consumer_name_idx" ON "ConsumedMessage"("consumer_name");

-- CreateIndex
CREATE INDEX "ConsumedMessage_status_idx" ON "ConsumedMessage"("status");

-- CreateIndex
CREATE INDEX "ConsumedMessage_processed_at_idx" ON "ConsumedMessage"("processed_at");

-- CreateIndex
CREATE UNIQUE INDEX "ConsumedMessage_message_id_consumer_name_key" ON "ConsumedMessage"("message_id", "consumer_name");

-- CreateIndex
CREATE INDEX "OutboxEvent_order_id_idx" ON "OutboxEvent"("order_id");

-- CreateIndex
CREATE INDEX "OutboxEvent_event_type_idx" ON "OutboxEvent"("event_type");

-- CreateIndex
CREATE INDEX "OutboxEvent_status_idx" ON "OutboxEvent"("status");

-- AddForeignKey
ALTER TABLE "OutboxEvent" ADD CONSTRAINT "OutboxEvent_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "OrderBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
