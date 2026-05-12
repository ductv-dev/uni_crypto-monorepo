import { Injectable, Logger } from "@nestjs/common"
import { PrismaService } from "@workspace/db"

interface OrderCreatedPayload {
  orderId: string
  userId: string
  symbol: string
  side: string
  type: string
  price: number
  quantity: number
  createdAt: string
}

interface TradeResult {
  success: boolean
  tradeId?: string
  message: string
}

@Injectable()
export class MatchingEngineService {
  private readonly logger = new Logger(MatchingEngineService.name)

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Xử lý order từ RabbitMQ và tạo Trade test vào DB.
   *
   * Flow test đơn giản:
   * 1. Tìm market theo symbol
   * 2. Tạo 2 order (buy + sell) giả lập khớp lệnh
   * 3. Tạo Trade record liên kết 2 order
   *
   * Trong production, logic matching sẽ phức tạp hơn nhiều
   * (order book, price-time priority, partial fill, etc.)
   */
  async processOrder(payload: OrderCreatedPayload): Promise<TradeResult> {
    this.logger.log(
      `Processing order: ${payload.orderId} | ${payload.symbol} | ${payload.side} ${payload.quantity}@${payload.price}`
    )

    try {
      const market = await this.prisma.market.findUnique({
        where: { symbol: payload.symbol },
      })

      if (!market) {
        this.logger.warn(`Market not found: ${payload.symbol}`)
        return {
          success: false,
          message: `Market not found: ${payload.symbol}`,
        }
      }

      // Tạo trade test bằng transaction để đảm bảo atomic
      const trade = await this.prisma.$transaction(async (tx) => {
        // Tạo buy order giả lập
        const buyOrder = await tx.orderBook.create({
          data: {
            user_id: payload.userId,
            market_id: market.id,
            type: payload.type.toLowerCase(),
            side: "buy",
            price: payload.price,
            quantity: payload.quantity,
            filled_qty: payload.quantity,
            remaining_qty: 0,
            status: "filled",
          },
        })

        // Tạo sell order giả lập (counterparty)
        const sellOrder = await tx.orderBook.create({
          data: {
            user_id: payload.userId,
            market_id: market.id,
            type: payload.type.toLowerCase(),
            side: "sell",
            price: payload.price,
            quantity: payload.quantity,
            filled_qty: payload.quantity,
            remaining_qty: 0,
            status: "filled",
          },
        })

        // Tạo Trade record
        const total = payload.price * payload.quantity
        const createdTrade = await tx.trade.create({
          data: {
            market_id: market.id,
            buy_order_id: buyOrder.id,
            sell_order_id: sellOrder.id,
            price: payload.price,
            quantity: payload.quantity,
            total,
            buyer_fee: 0,
            seller_fee: 0,
          },
        })

        return createdTrade
      })

      this.logger.log(
        `Trade created successfully — tradeId: ${trade.id}, market: ${payload.symbol}`
      )

      return {
        success: true,
        tradeId: trade.id,
        message: `Trade created: ${payload.quantity} ${payload.symbol} @ ${payload.price}`,
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)

      this.logger.error(
        `Failed to process order ${payload.orderId}: ${errorMessage}`
      )

      return {
        success: false,
        message: `Failed to process order: ${errorMessage}`,
      }
    }
  }
}
