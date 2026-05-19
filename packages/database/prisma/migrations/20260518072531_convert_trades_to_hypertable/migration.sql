-- TimescaleDB hypertable requires every UNIQUE index on the table,
-- including the PRIMARY KEY, to include the partitioning column.
-- Prisma schema already models Trade with @@id([id, createdAt]),
-- so align the SQL migration history before create_hypertable runs.
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_pkey";

ALTER TABLE "Trade"
ADD CONSTRAINT "Trade_pkey" PRIMARY KEY ("id", "createdAt");
