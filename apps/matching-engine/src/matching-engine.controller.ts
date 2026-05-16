import { Controller, Get, Logger, Param, Query } from "@nestjs/common"
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices"
import { MatchingEngineService } from "./matching-engine.service"
import { OrderBookManager } from "./order-book-manager.service"

type OrderCreatedPayload = {
  messageId: string
  order: any
  wallet: any
  walletTransaction: any
}

@Controller()
export class MatchingEngineController {
  private readonly logger = new Logger(MatchingEngineController.name)

  constructor(
    private readonly matchingEngineService: MatchingEngineService,
    private readonly orderBookManager: OrderBookManager
  ) {}

  @Get("order-book/:marketId")
  getOrderBook(
    @Param("marketId") marketId: string,
    @Query("limit") limit?: number
  ) {
    return this.orderBookManager.getBookDepth(marketId, limit)
  }

  /**
   * Lắng nghe event 'order.created' từ RabbitMQ.
   * Khi API emit message với pattern 'order.created',
   * handler này sẽ tự động được gọi.
   *
   * Manual ACK: chỉ ack sau khi xử lý xong,
   * nếu lỗi thì message sẽ được requeue.
   */
  @EventPattern("order.created")
  async handleOrderCreated(
    @Payload() data: OrderCreatedPayload,
    @Ctx() context: RmqContext
  ): Promise<void> {
    const channel = context.getChannelRef()
    const originalMessage = context.getMessage()

    this.logger.log(
      `Received order.created event - messageId: ${data.messageId}`
    )

    try {
      // Xử lý order (bao gồm cả kiểm tra Idempotency và Status)
      await this.matchingEngineService.processOrder(data)

      // Xử lý thành công hoặc skip (do trùng lặp/status sai) → ACK message
      channel.ack(originalMessage)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)

      this.logger.error(`Failed to handle order: ${errorMessage}`)

      // NACK + requeue: message sẽ quay lại queue để retry
      channel.nack(originalMessage, false, true)
    }
  }
}
