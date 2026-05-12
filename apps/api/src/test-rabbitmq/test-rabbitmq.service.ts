import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { SendOrderDto } from './dto/send-order.dto';
import { MATCHING_ENGINE_SERVICE } from './test-rabbitmq.constants';

interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  symbol: string;
  side: string;
  type: string;
  price: number;
  quantity: number;
  createdAt: string;
}

export interface SendMessageResult {
  success: boolean;
  message: string;
  data?: OrderCreatedPayload;
}

const MESSAGE_TIMEOUT_MS = 5000;

@Injectable()
export class TestRabbitmqService implements OnModuleInit {
  private readonly logger = new Logger(TestRabbitmqService.name);

  constructor(
    @Inject(MATCHING_ENGINE_SERVICE)
    private readonly matchingClient: ClientProxy,
  ) {}

  /**
   * Kết nối tới RabbitMQ khi module khởi tạo.
   * Nếu không connect được, log warning nhưng không crash app.
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.matchingClient.connect();
      this.logger.log('Successfully connected to RabbitMQ');
    } catch (error) {
      this.logger.warn(
        `Failed to connect to RabbitMQ on init: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Gửi một order message test lên queue matching.order.created.
   * Sử dụng pattern emit (fire-and-forget) vì matching-engine
   * là consumer xử lý async, không cần response trực tiếp.
   */
  async sendOrderCreated(dto: SendOrderDto): Promise<SendMessageResult> {
    const payload: OrderCreatedPayload = {
      orderId: crypto.randomUUID(),
      userId: dto.userId,
      symbol: dto.symbol,
      side: dto.side,
      type: dto.type,
      price: dto.price,
      quantity: dto.quantity,
      createdAt: new Date().toISOString(),
    };

    try {
      // emit() gửi message fire-and-forget (event pattern)
      const result$ = this.matchingClient
        .emit('order.created', payload)
        .pipe(timeout(MESSAGE_TIMEOUT_MS));

      await firstValueFrom(result$);

      this.logger.log(
        `Message sent to queue — orderId: ${payload.orderId}, symbol: ${payload.symbol}`,
      );

      return {
        success: true,
        message: 'Order message sent successfully to matching queue',
        data: payload,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.logger.error(`Failed to send message to RabbitMQ: ${errorMessage}`);

      return {
        success: false,
        message: `Failed to send message: ${errorMessage}`,
      };
    }
  }

  /**
   * Gửi message dạng send (request-response pattern).
   * Dùng khi cần consumer trả kết quả về.
   */
  async sendOrderAndWaitResponse(
    dto: SendOrderDto,
  ): Promise<SendMessageResult> {
    const payload: OrderCreatedPayload = {
      orderId: crypto.randomUUID(),
      userId: dto.userId,
      symbol: dto.symbol,
      side: dto.side,
      type: dto.type,
      price: dto.price,
      quantity: dto.quantity,
      createdAt: new Date().toISOString(),
    };

    try {
      // send() gửi message và chờ response từ consumer
      const result$ = this.matchingClient
        .send('order.created', payload)
        .pipe(timeout(MESSAGE_TIMEOUT_MS));

      const response = await firstValueFrom(result$);

      this.logger.log(
        `Message sent & response received — orderId: ${payload.orderId}`,
      );

      return {
        success: true,
        message: 'Order sent and response received',
        data: response as OrderCreatedPayload,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.logger.error(
        `Failed to send/receive message from RabbitMQ: ${errorMessage}`,
      );

      return {
        success: false,
        message: `Failed to send message: ${errorMessage}`,
      };
    }
  }
}
