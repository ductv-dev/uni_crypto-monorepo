export interface Candle {
  bucket: Date;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  quoteVolume: string;
}

export interface CandleTrade {
  price: string;
  quantity: string;
  total: string;
  createdAt: Date;
}
