/*
  Warnings:

  - Changed the type of `type` on the `OrderBook` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `side` on the `OrderBook` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "OrderBook" DROP COLUMN "type",
ADD COLUMN     "type" "OrderBookType" NOT NULL,
DROP COLUMN "side",
ADD COLUMN     "side" "OrderBookSide" NOT NULL;

-- CreateIndex
CREATE INDEX "OrderBook_side_idx" ON "OrderBook"("side");
