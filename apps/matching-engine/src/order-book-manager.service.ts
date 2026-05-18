import { Injectable, Logger } from "@nestjs/common"
import { PrismaService } from "@workspace/db"
import { OrderBook } from "./order-book"
import { BookOrder } from "./type"

@Injectable()
export class OrderBookManager {
  private readonly logger = new Logger("MatchingEngine")
  private books = new Map<string, OrderBook>()
  private isReady = false

  constructor(private readonly prisma: PrismaService) {}

  isEngineReady() {
    return this.isReady
  }

  getOrCreateBook(marketId: string): OrderBook {
    let book = this.books.get(marketId)
    if (!book) {
      book = new OrderBook(marketId)
      this.books.set(marketId, book)
    }
    return book
  }

  /**
   * Load dữ liệu từ DB vào bộ nhớ khi app khởi động
   */
  async initializeForMarket(marketSymbol: string) {
    this.isReady = false
    this.books.clear()

    const market = await this.prisma.market.findFirst({
      where: {
        OR: [
          {
            symbol: {
              equals: marketSymbol,
              mode: "insensitive",
            },
          },
          {
            symbol: {
              equals: marketSymbol.replace(/-/g, "/"),
              mode: "insensitive",
            },
          },
        ],
      },
      select: { id: true },
    })

    if (!market) {
      this.logger.warn(
        `[MatchingEngine] Market ${marketSymbol} not found in DB. Starting with empty order book.`
      )
      this.isReady = true
      return
    }

    const orders = await this.prisma.orderBook.findMany({
      where: {
        market_id: market.id,
        status: {
          in: ["open", "partial_filled"],
        },
      },
      orderBy: { createdAt: "asc" },
    })

    for (const order of orders) {
      const remainingQty = Number(order.quantity) - Number(order.filled_qty)
      if (remainingQty <= 0) continue

      const bookOrder: BookOrder = {
        id: order.id,
        userId: order.user_id,
        marketId: order.market_id,
        side: order.side as "buy" | "sell",
        type: order.type,
        price: Number(order.price),
        quantity: Number(order.quantity),
        filledQty: Number(order.filled_qty),
        createdAt: order.createdAt,
      }

      const book = this.getOrCreateBook(order.market_id)
      book.addOrder(bookOrder)
    }

    this.isReady = true
    this.logger.log(
      `[MatchingEngine] Loaded ${orders.length} active orders for ${marketSymbol}`
    )
  }

  getBookDepth(marketId: string, limit?: number) {
    const book = this.books.get(marketId)
    if (!book) return { bids: [], asks: [] }
    return book.getDepth(limit)
  }
}
