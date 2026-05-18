import { CandleInterval } from '../enums/candle-interval.enum';

export const CANDLE_VIEW_MAP: Record<CandleInterval, string> = {
  [CandleInterval.ONE_MINUTE]: 'candles_1m',
  [CandleInterval.FIVE_MINUTES]: 'candles_5m',
  [CandleInterval.FIFTEEN_MINUTES]: 'candles_15m',
  [CandleInterval.ONE_HOUR]: 'candles_1h',
  [CandleInterval.FOUR_HOURS]: 'candles_4h',
  [CandleInterval.ONE_DAY]: 'candles_1d',
} as const;
