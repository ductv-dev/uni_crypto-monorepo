import Decimal from 'decimal.js';
import { Candle, CandleTrade } from '../interfaces/candle.interface';

export const mergeTradeIntoCurrentCandle = (
  currentCandle: Candle,
  trade: CandleTrade,
): Candle => {
  const currentHigh = new Decimal(currentCandle.high);
  const currentLow = new Decimal(currentCandle.low);
  const currentVolume = new Decimal(currentCandle.volume);
  const currentQuoteVolume = new Decimal(currentCandle.quoteVolume);
  const tradePrice = new Decimal(trade.price);
  const tradeQuantity = new Decimal(trade.quantity);
  const tradeTotal = new Decimal(trade.total);

  return {
    ...currentCandle,
    high: Decimal.max(currentHigh, tradePrice).toString(),
    low: Decimal.min(currentLow, tradePrice).toString(),
    close: tradePrice.toString(),
    volume: currentVolume.add(tradeQuantity).toString(),
    quoteVolume: currentQuoteVolume.add(tradeTotal).toString(),
  };
};
