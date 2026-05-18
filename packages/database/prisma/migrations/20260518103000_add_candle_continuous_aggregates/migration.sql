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
    'CREATE INDEX %I ON %I (market_id, bucket DESC)',
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
  'candles_1h',
  INTERVAL '1 hour',
  INTERVAL '180 days',
  INTERVAL '1 hour',
  INTERVAL '1 hour'
);

SELECT create_candle_continuous_aggregate(
  'candles_4h',
  INTERVAL '4 hours',
  INTERVAL '365 days',
  INTERVAL '4 hours',
  INTERVAL '4 hours'
);

SELECT create_candle_continuous_aggregate(
  'candles_1d',
  INTERVAL '1 day',
  INTERVAL '3 years',
  INTERVAL '1 day',
  INTERVAL '1 day'
);

DROP FUNCTION create_candle_continuous_aggregate(
  TEXT,
  INTERVAL,
  INTERVAL,
  INTERVAL,
  INTERVAL
);
