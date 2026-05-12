import { Controller, Logger } from "@nestjs/common"
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices"
import { MatchingEngineService } from "./matching-engine.service"

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

@Controller()
export class MatchingEngineController {
  private readonly logger = new Logger(MatchingEngineController.name)

  constructor(private readonly matchingEngineService: MatchingEngineService) {}

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

    this.logger.log(`Received order.created event — orderId: ${data.orderId}`)

    try {
      const result = await this.matchingEngineService.processOrder(data)

      if (result.success) {
        // Xử lý thành công → ACK message (xóa khỏi queue)
        channel.ack(originalMessage)
        this.logger.log(`ACK — tradeId: ${result.tradeId}`)
      } else {
        // Xử lý thất bại (vd: market not found) → vẫn ACK để tránh loop
        channel.ack(originalMessage)
        this.logger.warn(`ACK (with failure) — ${result.message}`)
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)

      this.logger.error(`NACK — Failed to handle order: ${errorMessage}`)

      // NACK + requeue: message sẽ quay lại queue để retry
      channel.nack(originalMessage, false, true)
    }
  }
}
