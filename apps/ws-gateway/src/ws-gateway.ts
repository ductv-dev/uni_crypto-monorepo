// apps/ws-gateway/src/ws.gateway.ts
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, OnModuleDestroy } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

const normalizeMarketSymbol = (symbol: string) =>
  symbol.trim().replace('/', '').replace('-', '').toUpperCase();

const normalizeUserId = (userId: string) => userId.trim();
const KLINE_INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1d'] as const;

type KlineInterval = (typeof KLINE_INTERVALS)[number];

type MarketTradeCreatedPayload = {
  symbol?: string;
  marketId?: string;
  lastPrice?: number;
  totalQuantity?: number;
  takerOrderId?: string;
  trades?: Array<{
    id?: string;
    marketId?: string;
    price?: number;
    quantity?: number;
    total?: number;
    side?: 'buy' | 'sell';
    createdAt?: string;
  }>;
};

type KlineState = {
  marketId: string;
  symbol: string;
  interval: KlineInterval;
  bucket: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  quoteVolume: number;
  lastTradeAt: string | null;
  hasTrade: boolean;
};

const toIntervalMs = (interval: KlineInterval) => {
  switch (interval) {
    case '1m':
      return 60_000;
    case '5m':
      return 5 * 60_000;
    case '15m':
      return 15 * 60_000;
    case '1h':
      return 60 * 60_000;
    case '4h':
      return 4 * 60 * 60_000;
    case '1d':
      return 24 * 60 * 60_000;
  }
};

const normalizeKlineInterval = (
  interval: string,
): KlineInterval | undefined => {
  const normalized = interval.trim().toLowerCase();

  return KLINE_INTERVALS.find((item) => item === normalized);
};

const getBucketStart = (date: Date, interval: KlineInterval) => {
  const intervalMs = toIntervalMs(interval);
  return new Date(Math.floor(date.getTime() / intervalMs) * intervalMs);
};

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
})
export class WsGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleDestroy
{
  private readonly logger = new Logger(WsGateway.name);
  private readonly klineStateByMarket = new Map<
    string,
    Map<KlineInterval, KlineState>
  >();
  private klineHeartbeat?: NodeJS.Timeout;

  @WebSocketServer()
  server!: Server;

  afterInit() {
    this.logger.log('WebSocket gateway initialized');
    this.klineHeartbeat = setInterval(() => {
      this.emitRealtimeKlines();
    }, 1000);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    const rawUserId = client.handshake.auth?.userId;
    if (typeof rawUserId === 'string' && rawUserId.trim()) {
      const room = `user:${normalizeUserId(rawUserId)}`;
      void client.join(room);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('market.join')
  async handleJoinMarket(
    @MessageBody() body: { symbol: string; interval?: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!body?.symbol) {
      return {
        event: 'market.join.error',
        data: {
          message: 'symbol is required',
        },
      };
    }

    const symbol = normalizeMarketSymbol(body.symbol);
    const rooms = [`market:${symbol}`];

    if (body.interval) {
      const interval = normalizeKlineInterval(body.interval);
      if (!interval) {
        return {
          event: 'market.join.error',
          data: {
            message: 'unsupported interval',
          },
        };
      }

      rooms.push(`market:${symbol}:${interval}`);
    }

    await client.join(rooms);

    return {
      event: 'market.joined',
      data: {
        room: rooms[rooms.length - 1],
        rooms,
      },
    };
  }

  onModuleDestroy() {
    if (this.klineHeartbeat) {
      clearInterval(this.klineHeartbeat);
      this.klineHeartbeat = undefined;
    }
  }

  @SubscribeMessage('notification.join')
  async handleJoinNotification(
    @MessageBody() body: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!body?.userId || typeof body.userId !== 'string') {
      return {
        event: 'notification.join.error',
        data: {
          message: 'userId is required',
        },
      };
    }

    const room = `user:${normalizeUserId(body.userId)}`;
    await client.join(room);

    return {
      event: 'notification.joined',
      data: {
        room,
      },
    };
  }

  emitKlineUpdate(symbol: string, interval: string, data: any) {
    const room = `market:${normalizeMarketSymbol(symbol)}:${interval}`;

    if (!this.server) {
      this.logger.warn(`Cannot emit kline.update before server init: ${room}`);
      return;
    }

    this.server.to(room).emit('kline.update', data);
  }

  emitMarketTrade(symbol: string, data: any) {
    const room = `market:${normalizeMarketSymbol(symbol)}`;

    if (!this.server) {
      this.logger.warn(
        `Cannot emit market.trade.created before server init: ${room}`,
      );
      return;
    }

    this.server.to(room).emit('market.trade.created', data);
  }

  handleMarketTradeEvent(payload: MarketTradeCreatedPayload) {
    const symbol =
      typeof payload.symbol === 'string' && payload.symbol.trim()
        ? payload.symbol
        : undefined;
    const marketId =
      typeof payload.marketId === 'string' && payload.marketId.trim()
        ? payload.marketId
        : undefined;

    if (!symbol || !marketId) {
      this.logger.warn(
        'Skipping kline update for market trade payload missing symbol/marketId',
      );
      return;
    }

    this.updateKlineStateFromTrades(symbol, marketId, payload.trades ?? []);
    this.emitMarketTrade(symbol, payload);
  }

  emitUserNotification(userId: string, data: any) {
    const room = `user:${normalizeUserId(userId)}`;

    if (!this.server) {
      this.logger.warn(
        `Cannot emit user.notification before server init: ${room}`,
      );
      return;
    }

    this.server.to(room).emit('user.notification', data);
  }

  private updateKlineStateFromTrades(
    symbol: string,
    marketId: string,
    trades: NonNullable<MarketTradeCreatedPayload['trades']>,
  ) {
    if (trades.length === 0) {
      return;
    }

    const marketState =
      this.klineStateByMarket.get(marketId) ??
      new Map<KlineInterval, KlineState>();
    this.klineStateByMarket.set(marketId, marketState);

    for (const trade of trades) {
      if (
        typeof trade.price !== 'number' ||
        typeof trade.quantity !== 'number' ||
        typeof trade.total !== 'number' ||
        typeof trade.createdAt !== 'string'
      ) {
        continue;
      }

      const tradeTime = new Date(trade.createdAt);
      if (Number.isNaN(tradeTime.getTime())) {
        continue;
      }

      for (const interval of KLINE_INTERVALS) {
        const bucket = getBucketStart(tradeTime, interval);
        const current = marketState.get(interval);

        if (!current || bucket.getTime() > current.bucket.getTime()) {
          const nextState: KlineState = {
            marketId,
            symbol,
            interval,
            bucket,
            open: trade.price,
            high: trade.price,
            low: trade.price,
            close: trade.price,
            volume: trade.quantity,
            quoteVolume: trade.total,
            lastTradeAt: trade.createdAt,
            hasTrade: true,
          };

          marketState.set(interval, nextState);
          continue;
        }

        if (bucket.getTime() < current.bucket.getTime()) {
          continue;
        }

        current.high = Math.max(current.high, trade.price);
        current.low = Math.min(current.low, trade.price);
        current.close = trade.price;
        current.volume += trade.quantity;
        current.quoteVolume += trade.total;
        current.lastTradeAt = trade.createdAt;
        current.hasTrade = true;
      }
    }
  }

  private emitRealtimeKlines() {
    const now = new Date();

    for (const marketIntervals of this.klineStateByMarket.values()) {
      for (const [interval, state] of marketIntervals.entries()) {
        this.rollKlineStateForward(state, now);
        this.emitKlineUpdate(state.symbol, interval, {
          marketId: state.marketId,
          symbol: state.symbol,
          interval,
          bucket: state.bucket.toISOString(),
          open: state.open,
          high: state.high,
          low: state.low,
          close: state.close,
          volume: state.volume,
          quoteVolume: state.quoteVolume,
          lastTradeAt: state.lastTradeAt,
          hasTrade: state.hasTrade,
          emittedAt: now.toISOString(),
        });
      }
    }
  }

  private rollKlineStateForward(state: KlineState, now: Date) {
    const currentBucket = getBucketStart(now, state.interval);
    if (currentBucket.getTime() <= state.bucket.getTime()) {
      return;
    }

    while (state.bucket.getTime() < currentBucket.getTime()) {
      const nextBucket = new Date(
        state.bucket.getTime() + toIntervalMs(state.interval),
      );
      const previousClose = state.close;

      state.bucket = nextBucket;
      state.open = previousClose;
      state.high = previousClose;
      state.low = previousClose;
      state.close = previousClose;
      state.volume = 0;
      state.quoteVolume = 0;
      state.lastTradeAt = null;
      state.hasTrade = false;
    }
  }
}
