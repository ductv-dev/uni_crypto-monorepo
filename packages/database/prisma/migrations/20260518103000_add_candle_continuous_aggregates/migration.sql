-- 1. Bật TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- 2. Convert Trade thành hypertable
-- Lưu ý: bảng "Trade" phải có PRIMARY KEY (id, "createdAt")
SELECT create_hypertable(
  '"Trade"',
  'createdAt',
  if_not_exists => TRUE,
  migrate_data => TRUE
);

-- 3. Function tạo candle
CREATE OR REPLACE FUNCTION create_candle_continuous_aggregate(
  p_view_name TEXT,
  p_bucket_width INTERVAL,
  p_start_offset INTERVAL,
  p_end_offset INTERVAL,
  p_schedule_interval INTERVAL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  existing_view REGCLASS;
BEGIN
  existing_view := to_regclass(format('public.%I', p_view_name));

  IF existing_view IS NOT NULL THEN
    PERFORM remove_continuous_aggregate_policy(
      existing_view,
      if_exists => TRUE
    );
  END IF;

  EXECUTE format('DROP MATERIALIZED VIEW IF EXISTS %I CASCADE', p_view_name);

  EXECUTE format(
    $sql$
      CREATE MATERIALIZED VIEW %I
      WITH (
        timescaledb.continuous,
        timescaledb.materialized_only = true
      ) AS
      SELECT
        market_id,
        time_bucket(%L::INTERVAL, "createdAt") AS bucket,
        first(price, "createdAt") AS open,
        max(price) AS high,
        min(price) AS low,
        last(price, "createdAt") AS close,
        sum(quantity) AS volume,
        sum(total) AS quote_volume
      FROM "Trade"
      GROUP BY market_id, bucket
      WITH NO DATA
    $sql$,
    p_view_name,
    p_bucket_width::TEXT
  );

  EXECUTE format(
    'CREATE INDEX IF NOT EXISTS %I ON %I (market_id, bucket DESC)',
    p_view_name || '_market_bucket_idx',
    p_view_name
  );

  PERFORM add_continuous_aggregate_policy(
    p_view_name,
    start_offset => p_start_offset,
    end_offset => p_end_offset,
    schedule_interval => p_schedule_interval
  );
END;
$$;

-- 4. Tạo các candle views

SELECT create_candle_continuous_aggregate(
  'candles_1m',
  INTERVAL '1 minute',
  INTERVAL '7 days',
  INTERVAL '1 minute',
  INTERVAL '1 minute'
);

SELECT create_candle_continuous_aggregate(
  'candles_5m',
  INTERVAL '5 minutes',
  INTERVAL '30 days',
  INTERVAL '5 minutes',
  INTERVAL '5 minutes'
);

SELECT create_candle_continuous_aggregate(
  'candles_15m',
  INTERVAL '15 minutes',
  INTERVAL '90 days',
  INTERVAL '15 minutes',
  INTERVAL '15 minutes'
);

SELECT create_candle_continuous_aggregate(
  'candles_30m',
  INTERVAL '30 minutes',
  INTERVAL '90 days',
  INTERVAL '30 minutes',
  INTERVAL '30 minutes'
);

SELECT create_candle_continuous_aggregate(
  'candles_1h',
  INTERVAL '1 hour',
  INTERVAL '180 days',
  INTERVAL '1 hour',
  INTERVAL '1 hour'
);

SELECT create_candle_continuous_aggregate(
  'candles_24h',
  INTERVAL '24 hours',
  INTERVAL '3 years',
  INTERVAL '1 day',
  INTERVAL '1 day'
);

SELECT create_candle_continuous_aggregate(
  'candles_1w',
  INTERVAL '1 week',
  INTERVAL '5 years',
  INTERVAL '1 week',
  INTERVAL '1 week'
);

SELECT create_candle_continuous_aggregate(
  'candles_15d',
  INTERVAL '15 days',
  INTERVAL '5 years',
  INTERVAL '15 days',
  INTERVAL '15 days'
);

SELECT create_candle_continuous_aggregate(
  'candles_1mo',
  INTERVAL '1 month',
  INTERVAL '10 years',
  INTERVAL '1 month',
  INTERVAL '1 month'
);

SELECT create_candle_continuous_aggregate(
  'candles_6mo',
  INTERVAL '6 months',
  INTERVAL '10 years',
  INTERVAL '6 months',
  INTERVAL '6 months'
);

SELECT create_candle_continuous_aggregate(
  'candles_1y',
  INTERVAL '1 year',
  INTERVAL '10 years',
  INTERVAL '1 year',
  INTERVAL '1 year'
);

-- 5. Xóa helper function sau khi tạo xong
DROP FUNCTION create_candle_continuous_aggregate(
  TEXT,
  INTERVAL,
  INTERVAL,
  INTERVAL,
  INTERVAL
);