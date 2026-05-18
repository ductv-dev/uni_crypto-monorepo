// apps/ws-gateway/src/redis-subscriber.service.ts
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
// @ts-ignore
import Redis from 'ioredis';
import { WsGateway } from './ws-gateway';

const KLINE_UPDATED_CHANNEL = 'kline.updated';
const MARKET_TRADE_CREATED_CHANNEL = 'market.trade.created';
const USER_NOTIFICATION_CHANNEL = 'user.notification';

const createRedisClient = () => {
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL);
  }

  return new Redis({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
  });
};

@Injectable()
export class RedisSubscriberService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisSubscriberService.name);
  private readonly sub = createRedisClient();

  constructor(private readonly wsGateway: WsGateway) {
    this.sub.on('error', (error) => {
      this.logger.error(`Redis subscriber error: ${error.message}`);
    });
  }

  async onModuleInit() {
    await this.sub.subscribe(
      KLINE_UPDATED_CHANNEL,
      MARKET_TRADE_CREATED_CHANNEL,
      USER_NOTIFICATION_CHANNEL,
    );

    this.sub.on('message', (channel, message) => {
      this.handleMessage(channel, message);
    });

    this.logger.log(
      `Subscribed Redis channels: ${KLINE_UPDATED_CHANNEL}, ${MARKET_TRADE_CREATED_CHANNEL}, ${USER_NOTIFICATION_CHANNEL}`,
    );
  }

  async onModuleDestroy() {
    try {
      await this.sub.quit();
    } catch {
      this.sub.disconnect();
    }
  }

  private handleMessage(channel: string, message: string) {
    try {
      const payload = JSON.parse(message) as unknown;

      if (channel === KLINE_UPDATED_CHANNEL) {
        this.handleKlineUpdated(payload);
        return;
      }

      if (channel === MARKET_TRADE_CREATED_CHANNEL) {
        this.handleMarketTradeCreated(payload);
        return;
      }

      if (channel === USER_NOTIFICATION_CHANNEL) {
        this.handleUserNotification(payload);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.logger.warn(`Invalid Redis message on ${channel}: ${errorMessage}`);
    }
  }

  private handleKlineUpdated(payload: unknown) {
    if (!this.isRecord(payload)) {
      this.logger.warn('Invalid kline payload: expected object');
      return;
    }

    const { symbol, interval, data } = payload;

    if (typeof symbol !== 'string' || typeof interval !== 'string') {
      this.logger.warn(
        'Invalid kline payload: symbol and interval are required',
      );
      return;
    }

    this.wsGateway.emitKlineUpdate(symbol, interval, data);
  }

  private handleMarketTradeCreated(payload: unknown) {
    if (!this.isRecord(payload)) {
      this.logger.warn('Invalid market trade payload: expected object');
      return;
    }

    const symbol =
      typeof payload.symbol === 'string'
        ? payload.symbol
        : typeof payload.marketId === 'string'
          ? payload.marketId
          : undefined;

    if (!symbol) {
      this.logger.warn('Invalid market trade payload: symbol is required');
      return;
    }

    this.wsGateway.emitMarketTrade(symbol, payload);
  }

  private handleUserNotification(payload: unknown) {
    if (!this.isRecord(payload)) {
      this.logger.warn('Invalid user notification payload: expected object');
      return;
    }

    const userId = payload.userId;
    if (typeof userId !== 'string' || !userId.trim()) {
      this.logger.warn('Invalid user notification payload: userId is required');
      return;
    }

    this.wsGateway.emitUserNotification(userId, payload);
  }

  private isRecord(value: unknown): value is Record<string, any> {
    return typeof value === 'object' && value !== null;
  }
}
