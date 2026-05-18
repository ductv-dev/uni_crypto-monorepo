import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common"
import { PrismaService, type Prisma } from "@workspace/db"
import amqp, {
  type Channel,
  type ChannelModel,
  type ConsumeMessage,
} from "amqplib"
import { OrderBookManager } from "./order-book-manager.service"
import {
  MarketTradeCreatedPayload,
  RedisPublisherService,
} from "./redis-publisher.service"
import { BookOrder } from "./type"
import {
  getMatchingConfig,
  normalizeMarketSymbol,
  type MatchingRuntimeConfig,
} from "./config/matching.config"

type OrderCreatedEventPayload = {
  eventId: string
  type: "ORDER_CREATED"
  orderId: string
  market: string
  createdAt: string
}

type WalletTransactionInput = {
  walletId: string
  type: "order_unlock" | "trade_buy" | "trade_sell"
  direction: "credit" | "debit"
  amount: number
  balanceBefore: number
  balanceAfter: number
  referenceType: "trade"
  referenceId: string
  description: string
}

@Injectable()
export class MatchingEngineService implements OnModuleDestroy {
  private readonly logger = new Logger("MatchingEngine")
  private readonly config: MatchingRuntimeConfig = getMatchingConfig()
  private connection: ChannelModel | null = null
  private channel: Channel | null = null

  constructor(
    private readonly prisma: PrismaService,
    private readonly orderBookManager: OrderBookManager,
    private readonly redisPublisher: RedisPublisherService
  ) {}

  private toFixedDecimal(value: number) {
    return Number(value.toFixed(10))
  }

  private assertNonNegativeBalance(value: number, label: string) {
    if (value < -1e-8) {
      throw new Error(`[MatchingEngine] ${label} is negative: ${value}`)
    }

    // Hấp thụ sai số floating point rất nhỏ (ví dụ -1e-12) về 0.
    return value < 0 ? 0 : value
  }

  private async getOrCreateWallet(
    tx: Prisma.TransactionClient,
    userId: string,
    assetId: string
  ) {
    const existingWallet = await tx.wallet.findUnique({
      where: {
        user_id_asset_id: {
          user_id: userId,
          asset_id: assetId,
        },
      },
    })

    if (existingWallet) {
      return existingWallet
    }

    return tx.wallet.create({
      data: {
        user_id: userId,
        asset_id: assetId,
        available_balance: 0,
        blocked_balance: 0,
      },
    })
  }

  private async createWalletTransaction(
    tx: Prisma.TransactionClient,
    input: WalletTransactionInput
  ) {
    if (input.amount <= 0) {
      return
    }

    await tx.walletTransaction.create({
      data: {
        wallet_id: input.walletId,
        type: input.type,
        direction: input.direction,
        amount: this.toFixedDecimal(input.amount),
        balance_before: this.toFixedDecimal(input.balanceBefore),
        balance_after: this.toFixedDecimal(input.balanceAfter),
        reference_type: input.referenceType,
        reference_id: input.referenceId,
        status: "success",
        description: input.description,
      },
    })
  }

  private async settleWalletsForTrade(
    tx: Prisma.TransactionClient,
    params: {
      tradeId: string
      tradePrice: number
      tradeQuantity: number
      takerSide: "buy" | "sell"
      takerOrder: { userId: string; limitPrice: number }
      makerOrder: { userId: string; limitPrice: number }
      market: { baseAssetId: string; quoteAssetId: string; symbol: string }
    }
  ) {
    const tradeTotal = this.toFixedDecimal(
      params.tradePrice * params.tradeQuantity
    )
    const isTakerBuy = params.takerSide === "buy"

    const buyer = isTakerBuy ? params.takerOrder : params.makerOrder
    const seller = isTakerBuy ? params.makerOrder : params.takerOrder

    const buyerReservedQuote = this.toFixedDecimal(
      buyer.limitPrice * params.tradeQuantity
    )
    const buyerRefund = this.toFixedDecimal(
      Math.max(0, buyerReservedQuote - tradeTotal)
    )

    // 1) BUY side: trừ blocked quote theo phần đã lock của khối lượng khớp.
    const buyerQuoteWallet = await this.getOrCreateWallet(
      tx,
      buyer.userId,
      params.market.quoteAssetId
    )
    const buyerQuoteBlockedAfter = this.assertNonNegativeBalance(
      this.toFixedDecimal(
        Number(buyerQuoteWallet.blocked_balance) - buyerReservedQuote
      ),
      "buyer quote blocked_balance"
    )
    const buyerQuoteAvailableBefore = Number(buyerQuoteWallet.available_balance)
    const buyerQuoteAvailableAfter = this.toFixedDecimal(
      buyerQuoteAvailableBefore + buyerRefund
    )

    await tx.wallet.update({
      where: { id: buyerQuoteWallet.id },
      data: {
        available_balance: buyerQuoteAvailableAfter,
        blocked_balance: buyerQuoteBlockedAfter,
      },
    })

    await this.createWalletTransaction(tx, {
      walletId: buyerQuoteWallet.id,
      type: "order_unlock",
      direction: "credit",
      amount: buyerRefund,
      balanceBefore: buyerQuoteAvailableBefore,
      balanceAfter: buyerQuoteAvailableAfter,
      referenceType: "trade",
      referenceId: params.tradeId,
      description: `Refund unmatched quote for trade ${params.tradeId} (${params.market.symbol})`,
    })

    // 2) BUY side: nhận base asset sau khi khớp.
    const buyerBaseWallet = await this.getOrCreateWallet(
      tx,
      buyer.userId,
      params.market.baseAssetId
    )
    const buyerBaseBefore = Number(buyerBaseWallet.available_balance)
    const buyerBaseAfter = this.toFixedDecimal(
      buyerBaseBefore + params.tradeQuantity
    )

    await tx.wallet.update({
      where: { id: buyerBaseWallet.id },
      data: { available_balance: buyerBaseAfter },
    })

    await this.createWalletTransaction(tx, {
      walletId: buyerBaseWallet.id,
      type: "trade_buy",
      direction: "credit",
      amount: params.tradeQuantity,
      balanceBefore: buyerBaseBefore,
      balanceAfter: buyerBaseAfter,
      referenceType: "trade",
      referenceId: params.tradeId,
      description: `Bought ${params.tradeQuantity} ${params.market.symbol}`,
    })

    // 3) SELL side: trừ blocked base asset đã khớp.
    const sellerBaseWallet = await this.getOrCreateWallet(
      tx,
      seller.userId,
      params.market.baseAssetId
    )
    const sellerBaseBlockedAfter = this.assertNonNegativeBalance(
      this.toFixedDecimal(
        Number(sellerBaseWallet.blocked_balance) - params.tradeQuantity
      ),
      "seller base blocked_balance"
    )

    await tx.wallet.update({
      where: { id: sellerBaseWallet.id },
      data: { blocked_balance: sellerBaseBlockedAfter },
    })

    // 4) SELL side: nhận quote asset theo giá khớp thực tế.
    const sellerQuoteWallet = await this.getOrCreateWallet(
      tx,
      seller.userId,
      params.market.quoteAssetId
    )
    const sellerQuoteBefore = Number(sellerQuoteWallet.available_balance)
    const sellerQuoteAfter = this.toFixedDecimal(sellerQuoteBefore + tradeTotal)

    await tx.wallet.update({
      where: { id: sellerQuoteWallet.id },
      data: { available_balance: sellerQuoteAfter },
    })

    await this.createWalletTransaction(tx, {
      walletId: sellerQuoteWallet.id,
      type: "trade_sell",
      direction: "credit",
      amount: tradeTotal,
      balanceBefore: sellerQuoteBefore,
      balanceAfter: sellerQuoteAfter,
      referenceType: "trade",
      referenceId: params.tradeId,
      description: `Sold ${params.tradeQuantity} ${params.market.symbol}`,
    })
  }

  async start() {
    this.logger.log(
      `[MatchingEngine] market=${this.config.matchingMarket} queue=${this.config.matchingQueue} exchange=${this.config.rabbitmqExchange}`
    )

    await this.orderBookManager.initializeForMarket(this.config.matchingMarket)
    await this.setupConsumer()
  }

  private async setupConsumer() {
    const connection = await amqp.connect(this.config.rabbitmqUrl)
    this.connection = connection
    const channel = await connection.createChannel()
    this.channel = channel

    await channel.assertExchange(this.config.rabbitmqExchange, "topic", {
      durable: true,
    })
    await channel.assertQueue(this.config.matchingQueue, { durable: true })
    await channel.bindQueue(
      this.config.matchingQueue,
      this.config.rabbitmqExchange,
      this.config.routingKey
    )
    await channel.prefetch(1)

    await channel.consume(
      this.config.matchingQueue,
      async (message) => {
        await this.handleMessage(message)
      },
      { noAck: false }
    )

    this.logger.log(
      `[MatchingEngine] Consuming queue ${this.config.matchingQueue}`
    )
  }

  private async handleMessage(message: ConsumeMessage | null) {
    if (!message || !this.channel) {
      return
    }

    const rawPayload = message.content.toString("utf-8")
    let payload: Partial<OrderCreatedEventPayload>

    try {
      payload = JSON.parse(rawPayload) as Partial<OrderCreatedEventPayload>
    } catch (error) {
      this.logger.error(
        `[MatchingEngine] Invalid JSON payload. error=${error instanceof Error ? error.message : String(error)}`
      )
      this.channel.nack(message, false, false)
      return
    }

    if (!payload.eventId || !payload.orderId || !payload.market) {
      this.logger.error(
        `[MatchingEngine] Invalid event payload. eventId=${payload.eventId ?? "unknown"}`
      )
      this.channel.nack(message, false, false)
      return
    }

    if (normalizeMarketSymbol(payload.market) !== this.config.matchingMarket) {
      this.logger.error(
        `[MatchingEngine] Market mismatch. expected=${this.config.matchingMarket} actual=${payload.market}`
      )
      this.channel.ack(message)
      return
    }

    try {
      await this.processOrderCreatedEvent({
        eventId: payload.eventId,
        orderId: payload.orderId,
        market: normalizeMarketSymbol(payload.market),
      })
      this.channel.ack(message)
    } catch (error) {
      this.logger.error(
        `[MatchingEngine] Failed to process event ${payload.eventId}: ${error instanceof Error ? error.message : String(error)}`
      )
      this.channel.nack(message, false, true)
    }
  }

  /**
   * Xử lý event ORDER_CREATED và thực hiện khớp lệnh cho 1 market.
   */
  private async processOrderCreatedEvent(event: {
    eventId: string
    orderId: string
    market: string
  }) {
    const consumerName = `matching-engine:${this.config.matchingMarket}`

    const consumedMessage = await this.prisma.consumedMessage.findUnique({
      where: {
        message_id_consumer_name: {
          message_id: event.eventId,
          consumer_name: consumerName,
        },
      },
    })

    if (consumedMessage) {
      this.logger.log(`Message ${event.eventId} already processed. Skipping.`)
      return
    }

    const orderDB = await this.prisma.orderBook.findUnique({
      where: { id: event.orderId },
      include: {
        market: {
          select: {
            symbol: true,
            base_asset_id: true,
            quote_asset_id: true,
          },
        },
      },
    })

    if (!orderDB) {
      this.logger.warn(`Order ${event.orderId} not found. Skipping.`)
      return
    }

    if (
      normalizeMarketSymbol(orderDB.market.symbol) !==
      this.config.matchingMarket
    ) {
      this.logger.error(
        `[MatchingEngine] Market mismatch. expected=${this.config.matchingMarket} actual=${orderDB.market.symbol}`
      )
      return
    }

    if (orderDB.status === "filled" || orderDB.status === "cancelled") {
      this.logger.warn(`Order ${event.orderId} already processed. Skipping.`)
      return
    }

    if (orderDB.status !== "open" && orderDB.status !== "partial_filled") {
      this.logger.warn(
        `Order ${event.orderId} has invalid status: ${orderDB.status}. Skipping.`
      )
      return
    }

    let marketTradeEvent: MarketTradeCreatedPayload | undefined

    await this.prisma.$transaction(async (tx) => {
      await tx.consumedMessage.upsert({
        where: {
          message_id_consumer_name: {
            message_id: event.eventId,
            consumer_name: consumerName,
          },
        },
        update: { status: "success", processed_at: new Date() },
        create: {
          message_id: event.eventId,
          consumer_name: consumerName,
          status: "success",
          processed_at: new Date(),
        },
      })

      const book = this.orderBookManager.getOrCreateBook(orderDB.market_id)
      const bookOrder: BookOrder = {
        id: orderDB.id,
        userId: orderDB.user_id,
        marketId: orderDB.market_id,
        side: orderDB.side as "buy" | "sell",
        type: orderDB.type,
        price: Number(orderDB.price),
        quantity: Number(orderDB.quantity),
        filledQty: Number(orderDB.filled_qty),
        createdAt: new Date(orderDB.createdAt),
      }

      const trades = book.addOrder(bookOrder)

      if (trades.length > 0) {
        this.logger.log(
          `Order ${orderDB.id} matched! Created ${trades.length} trades.`
        )

        const persistedTrades: MarketTradeCreatedPayload["trades"] = []

        for (const trade of trades) {
          const tradeRecord = await tx.trade.create({
            data: {
              market_id: trade.marketId,
              buy_order_id:
                trade.side === "buy" ? trade.takerOrderId : trade.makerOrderId,
              sell_order_id:
                trade.side === "sell" ? trade.takerOrderId : trade.makerOrderId,
              price: trade.price,
              quantity: trade.quantity,
              total: trade.price * trade.quantity,
              buyer_fee: 0,
              seller_fee: 0,
            },
          })

          persistedTrades.push({
            id: tradeRecord.id,
            makerOrderId: trade.makerOrderId,
            takerOrderId: trade.takerOrderId,
            marketId: trade.marketId,
            price: trade.price,
            quantity: trade.quantity,
            total: trade.price * trade.quantity,
            side: trade.side,
            createdAt: tradeRecord.createdAt.toISOString(),
          })

          const makerOrderDB = await tx.orderBook.findUnique({
            where: { id: trade.makerOrderId },
            select: {
              id: true,
              user_id: true,
              price: true,
              quantity: true,
              filled_qty: true,
            },
          })

          if (makerOrderDB) {
            await this.settleWalletsForTrade(tx, {
              tradeId: tradeRecord.id,
              tradePrice: trade.price,
              tradeQuantity: trade.quantity,
              takerSide: trade.side,
              takerOrder: {
                userId: orderDB.user_id,
                limitPrice: Number(orderDB.price ?? trade.price),
              },
              makerOrder: {
                userId: makerOrderDB.user_id,
                limitPrice: Number(makerOrderDB.price ?? trade.price),
              },
              market: {
                baseAssetId: orderDB.market.base_asset_id,
                quoteAssetId: orderDB.market.quote_asset_id,
                symbol: orderDB.market.symbol,
              },
            })

            const newFilled = Number(makerOrderDB.filled_qty) + trade.quantity
            const remaining = Number(makerOrderDB.quantity) - newFilled
            await tx.orderBook.update({
              where: { id: trade.makerOrderId },
              data: {
                filled_qty: newFilled,
                remaining_qty: remaining,
                status: remaining <= 0 ? "filled" : "partial_filled",
              },
            })
          }
        }

        const takerRemaining = Number(orderDB.quantity) - bookOrder.filledQty
        await tx.orderBook.update({
          where: { id: orderDB.id },
          data: {
            filled_qty: bookOrder.filledQty,
            remaining_qty: takerRemaining,
            status: takerRemaining <= 0 ? "filled" : "partial_filled",
          },
        })

        const latestTrade = persistedTrades[persistedTrades.length - 1]
        if (!latestTrade) {
          return
        }

        await tx.market.update({
          where: { id: orderDB.market_id },
          data: {
            last_price: latestTrade.price,
          },
        })

        marketTradeEvent = {
          symbol: orderDB.market.symbol,
          marketId: orderDB.market_id,
          lastPrice: latestTrade.price,
          totalQuantity: persistedTrades.reduce(
            (sum, trade) => sum + trade.quantity,
            0
          ),
          takerOrderId: orderDB.id,
          trades: persistedTrades,
        }
      } else {
        this.logger.log(
          `Order ${orderDB.id} added to OrderBook memory without immediate match. side=${orderDB.side} price=${orderDB.price} quantity=${orderDB.quantity}`
        )
      }
    })

    if (marketTradeEvent) {
      await this.redisPublisher.publishMarketTrade(marketTradeEvent)
    }
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close()
    } catch {
      // ignore close errors
    }

    try {
      await this.connection?.close()
    } catch {
      // ignore close errors
    }
  }
}
