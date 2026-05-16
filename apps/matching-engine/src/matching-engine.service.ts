// matching-engine.service.ts

import { Injectable, Logger } from "@nestjs/common"
import { PrismaService } from "@workspace/db"
import { OrderBookManager } from "./order-book-manager.service"
import { BookOrder } from "./type"

interface OrderData {
  id: string
  user_id: string
  market_id: string
  side: string
  type: any
  price: number | string
  quantity: number | string
  filled_qty: number | string
  status: string
  createdAt: string | Date
}

interface OrderPayload {
  messageId: string
  order: OrderData
  wallet?: any
  walletTransaction?: any
}

@Injectable()
export class MatchingEngineService {
  private readonly logger = new Logger(MatchingEngineService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly orderBookManager: OrderBookManager
  ) {}

  /**
   * Xử lý order nhận được từ RabbitMQ và thực hiện khớp lệnh
   */
  async processOrder(data: OrderPayload) {
    const { messageId, order } = data
    const consumerName = "matching-engine"

    // 1. Kiểm tra Idempotency (xem message đã được xử lý chưa)
    const consumedMessage = await this.prisma.consumedMessage.findUnique({
      where: {
        message_id_consumer_name: {
          message_id: messageId,
          consumer_name: consumerName,
        },
      },
    })

    if (consumedMessage) {
      this.logger.log(`Message ${messageId} already processed. Skipping.`)
      return
    }
    // lấy data order từ db qau orderID từ mesage
    const orderDB = await this.prisma.orderBook.findUnique({
      where: {
        id: order.id,
      },
    })
    if (!orderDB) {
      this.logger.warn(`Order ${order.id} not found. Skipping.`)
      return
    }
    if (orderDB.status === "filled" || orderDB.status === "cancelled") {
      this.logger.warn(`Order ${order.id} already processed. Skipping.`)
      return
    }

    // 2. Validate status của order (chỉ xử lý nếu là open hoặc partial_filled)
    if (orderDB.status !== "open" && orderDB.status !== "partial_filled") {
      this.logger.warn(
        `Order ${order.id} has invalid status: ${orderDB.status}. Skipping.`
      )
      return
    }

    // 3. Xử lý logic nghiệp vụ trong transaction
    await this.prisma.$transaction(async (tx) => {
      // Lưu vào ConsumedMessage để đảm bảo không xử lý lại
      await tx.consumedMessage.upsert({
        where: {
          message_id_consumer_name: {
            message_id: messageId,
            consumer_name: consumerName,
          },
        },
        update: { status: "success", processed_at: new Date() },
        create: {
          message_id: messageId,
          consumer_name: consumerName,
          status: "success",
          processed_at: new Date(),
        },
      })

      // 4. Thêm vào in-memory OrderBook và lấy kết quả khớp lệnh
      const book = this.orderBookManager.getOrCreateBook(order.market_id)
      const bookOrder: BookOrder = {
        id: order.id,
        userId: order.user_id,
        marketId: order.market_id,
        side: order.side as "buy" | "sell",
        type: order.type,
        price: Number(order.price),
        quantity: Number(order.quantity),
        filledQty: Number(order.filled_qty),
        createdAt: new Date(order.createdAt),
      }

      const trades = book.addOrder(bookOrder)

      if (trades.length > 0) {
        this.logger.log(
          `Order ${order.id} matched! Created ${trades.length} trades.`
        )

        for (const trade of trades) {
          // 1. Tạo bản ghi Trade
          await tx.trade.create({
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

          // 2. Cập nhật Maker Order trong DB
          // Chúng ta cần lấy makerOrder từ DB hoặc tin tưởng vào trạng thái in-memory
          // Ở đây ta update dựa trên lượng vừa khớp trong trade này
          const makerOrderDB = await tx.orderBook.findUnique({
            where: { id: trade.makerOrderId },
          })

          if (makerOrderDB) {
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

        // 3. Cập nhật Taker Order (chính là order trong message) sau khi đã khớp hết các maker
        const takerRemaining = Number(order.quantity) - bookOrder.filledQty
        await tx.orderBook.update({
          where: { id: order.id },
          data: {
            filled_qty: bookOrder.filledQty,
            remaining_qty: takerRemaining,
            status: takerRemaining <= 0 ? "filled" : "partial_filled",
          },
        })
      } else {
        this.logger.log(`Order ${order.id} added to OrderBook memory.`)
      }
    })
  }
}
