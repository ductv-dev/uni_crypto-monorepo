import { Injectable, Logger, OnModuleInit } from "@nestjs/common"
import { PrismaService } from "@workspace/db"
import { OrderBook } from "./order-book"
import { BookOrder } from "./type"

@Injectable()
export class OrderBookManager implements OnModuleInit {
  private readonly logger = new Logger(OrderBookManager.name)
  private books = new Map<string, OrderBook>()
  private isReady = false

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.loadOrderBooksFromDb()
    this.isReady = true
  }

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
  private async loadOrderBooksFromDb() {
    this.logger.log("Loading active orders from database...")
    this.isReady = false
    this.books.clear()

    const orders = await this.prisma.orderBook.findMany({
      where: {
        status: {
          in: ["open", "partial_filled"],
        },
      },
      orderBy: [{ market_id: "asc" }, { createdAt: "asc" }],
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

    this.logger.log(`Loaded ${orders.length} active orders into memory.`)
  }

  getBookDepth(marketId: string, limit?: number) {
    const book = this.books.get(marketId)
    if (!book) return { bids: [], asks: [] }
    return book.getDepth(limit)
  }
}
