import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common"
import Redis from "ioredis"

export const MARKET_TRADE_CREATED_CHANNEL = "market.trade.created"
export const USER_NOTIFICATION_CHANNEL = "user.notification"

export type MarketTradeCreatedPayload = {
  symbol: string
  marketId: string
  lastPrice: number
  totalQuantity: number
  takerOrderId: string
  trades: Array<{
    id: string
    makerOrderId: string
    takerOrderId: string
    marketId: string
    price: number
    quantity: number
    total: number
    side: "buy" | "sell"
    createdAt: string
  }>
}

export type UserNotificationPayload = {
  id: string
  userId: string
  event: string
  status: "success" | "failed"
  title: string
  message: string
  createdAt: string
  read: boolean
  metadata?: Record<string, unknown>
}

const createRedisClient = () => {
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL)
  }

  return new Redis({
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT ?? 6379),
  })
}

@Injectable()
export class RedisPublisherService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisPublisherService.name)
  private readonly redis = createRedisClient()

  constructor() {
    this.redis.on("error", (error) => {
      this.logger.error(`Redis publisher error: ${error.message}`)
    })
  }

  async publishMarketTrade(payload: MarketTradeCreatedPayload) {
    try {
      await this.redis.publish(
        MARKET_TRADE_CREATED_CHANNEL,
        JSON.stringify(payload)
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)

      this.logger.error(`Failed to publish market trade event: ${message}`)
    }
  }

  async publishUserNotification(payload: UserNotificationPayload) {
    try {
      await this.redis.publish(
        USER_NOTIFICATION_CHANNEL,
        JSON.stringify(payload)
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)

      this.logger.error(`Failed to publish user notification event: ${message}`)
    }
  }

  async onModuleDestroy() {
    try {
      await this.redis.quit()
    } catch {
      this.redis.disconnect()
    }
  }
}
