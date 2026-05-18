import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaService } from '@workspace/db';
import amqp, { type ChannelModel, type ConfirmChannel } from 'amqplib';

type OrderCreatedEventMessage = {
  eventId: string;
  type: 'ORDER_CREATED';
  orderId: string;
  market: string;
  createdAt: string;
};

const normalizeMarketSymbol = (market: string) =>
  market.trim().toUpperCase().replace(/[\/_]/g, '-').replace(/\s+/g, '');

const buildMatchingConsumerName = (marketSymbol: string) =>
  `matching-engine:${normalizeMarketSymbol(marketSymbol)}`;

const buildMatchingQueueName = (marketSymbol: string) =>
  `matching.${normalizeMarketSymbol(marketSymbol)}`;

type OutboxEventRecord = Prisma.OutboxEventGetPayload<{
  include: {
    order: {
      include: {
        market: {
          select: {
            symbol: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class OutboxProcessorService implements OnModuleDestroy {
  private readonly logger = new Logger(OutboxProcessorService.name);
  private isProcessing = false;
  private readonly maxRetries = 3;
  private readonly rabbitmqUrl: string;
  private readonly rabbitmqExchange: string;
  private connection: ChannelModel | null = null;
  private channel: ConfirmChannel | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.rabbitmqUrl =
      this.configService.get<string>('RABBITMQ_URL') ||
      'amqp://admin:admin@localhost:5672';
    this.rabbitmqExchange =
      this.configService.get<string>('RABBITMQ_EXCHANGE') || 'orders.exchange';
  }

  // Polling loop đơn giản: lấy batch, publish, rồi ngủ một khoảng ngắn trước vòng tiếp theo.
  async processOutboxEvents() {
    this.logger.log('Started Outbox Processor...');

    await this.connectRabbitmq();

    while (true) {
      try {
        if (!this.isProcessing) {
          this.isProcessing = true;
          await this.processBatch();
          this.isProcessing = false;
        }
      } catch (error) {
        this.logger.error(
          `Error in outbox processing loop: ${error instanceof Error ? error.message : String(error)}`,
        );
        this.isProcessing = false;
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  // Confirm channel giúp chỉ đánh dấu sent sau khi broker xác nhận đã nhận message.
  private async connectRabbitmq() {
    try {
      const connection = await amqp.connect(this.rabbitmqUrl);
      this.connection = connection;
      const channel = await connection.createConfirmChannel();
      this.channel = channel;
      await channel.assertExchange(this.rabbitmqExchange, 'topic', {
        durable: true,
      });
      this.logger.log(
        `Connected to RabbitMQ exchange=${this.rabbitmqExchange}`,
      );
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ on startup', error);
      throw error;
    }
  }

  // Chủ động đảm bảo queue/binding tồn tại để event không bị rơi khi engine của market chưa kịp lên.
  private async ensureMarketQueueBinding(
    marketSymbol: string,
    routingKey: string,
  ) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    const queueName = buildMatchingQueueName(marketSymbol);

    await this.channel.assertQueue(queueName, { durable: true });
    await this.channel.bindQueue(queueName, this.rabbitmqExchange, routingKey);
  }

  // Bọc publish callback-style của amqplib thành Promise để await được broker confirm.
  private async publishWithConfirm(
    exchange: string,
    routingKey: string,
    payload: Buffer,
  ) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await new Promise<void>((resolve, reject) => {
      this.channel?.publish(
        exchange,
        routingKey,
        payload,
        { persistent: true },
        (error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        },
      );
    });
  }

  // Chỉ lấy các event còn cần xử lý và publish theo thứ tự createdAt để giảm đảo thứ tự.
  private async processBatch() {
    const events = await this.prisma.outboxEvent.findMany({
      where: {
        OR: [
          { status: 'pending' },
          {
            status: 'failed',
            retry_count: { lt: this.maxRetries },
          },
          {
            status: 'sent',
          },
        ],
      },
      include: {
        order: {
          include: {
            market: {
              select: {
                symbol: true,
              },
            },
          },
        },
      },
      take: 50,
      orderBy: { createdAt: 'asc' },
    });

    const retryableEvents = await this.filterRetryableEvents(events);

    if (retryableEvents.length === 0) {
      return;
    }

    this.logger.log(
      `Found ${retryableEvents.length} outbox events to process.`,
    );

    for (const event of retryableEvents) {
      try {
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: 'processing' },
        });

        if (event.event_type !== 'order_created') {
          this.logger.warn(
            `Unsupported event_type=${event.event_type}, skip event ${event.id}`,
          );
          await this.prisma.outboxEvent.update({
            where: { id: event.id },
            data: {
              status: 'sent',
              sent_at: new Date(),
            },
          });
          continue;
        }

        if (!event.order_id) {
          throw new Error(`Missing order_id for outbox event ${event.id}`);
        }

        const order = await this.prisma.orderBook.findUnique({
          where: { id: event.order_id },
          include: {
            market: {
              select: {
                symbol: true,
              },
            },
          },
        });

        if (!order?.market?.symbol) {
          throw new Error(
            `Order or market not found for outbox event ${event.id}`,
          );
        }

        const market = normalizeMarketSymbol(order.market.symbol);
        const routingKey = `order.created.${market}`;
        const message: OrderCreatedEventMessage = {
          eventId: event.id,
          type: 'ORDER_CREATED',
          orderId: event.order_id,
          market,
          createdAt: event.createdAt.toISOString(),
        };

        if (!this.channel) {
          throw new Error('RabbitMQ channel not initialized');
        }

        await this.ensureMarketQueueBinding(market, routingKey);
        await this.publishWithConfirm(
          this.rabbitmqExchange,
          routingKey,
          Buffer.from(JSON.stringify(message)),
        );

        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            status: 'sent',
            sent_at: new Date(),
          },
        });

        this.logger.log(
          `Published event ${event.id} exchange=${this.rabbitmqExchange} routingKey=${routingKey}`,
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.error(
          `Failed to publish event ${event.id}: ${errorMessage}`,
        );

        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            status: 'failed',
            error_message: errorMessage,
            retry_count: { increment: 1 },
          },
        });
      }
    }
  }

  // Event sent chỉ được republish khi consumer tương ứng chưa ghi success.
  private async filterRetryableEvents(
    events: OutboxEventRecord[],
  ): Promise<OutboxEventRecord[]> {
    const sentEventsNeedingConsumerCheck = events.filter(
      (event) => event.status === 'sent',
    );

    if (sentEventsNeedingConsumerCheck.length === 0) {
      return events;
    }

    const consumerPairs = sentEventsNeedingConsumerCheck.flatMap((event) => {
      const marketSymbol = event.order?.market?.symbol;
      if (!marketSymbol) {
        this.logger.warn(
          `Skip sent event ${event.id}: market symbol is missing, cannot verify consumed status.`,
        );
        return [];
      }

      return [
        {
          message_id: event.id,
          consumer_name: buildMatchingConsumerName(marketSymbol),
        },
      ];
    });

    if (consumerPairs.length === 0) {
      return events.filter((event) => event.status !== 'sent');
    }

    const consumedMessages = await this.prisma.consumedMessage.findMany({
      where: {
        OR: consumerPairs,
      },
      select: {
        message_id: true,
        consumer_name: true,
        status: true,
      },
    });

    const consumedStatusMap = new Map(
      consumedMessages.map((message) => [
        `${message.message_id}:${message.consumer_name}`,
        message.status,
      ]),
    );

    return events.filter((event) => {
      if (event.status !== 'sent') {
        return true;
      }

      const marketSymbol = event.order?.market?.symbol;
      if (!marketSymbol) {
        return false;
      }

      const consumerName = buildMatchingConsumerName(marketSymbol);
      const consumedStatus = consumedStatusMap.get(
        `${event.id}:${consumerName}`,
      );

      return consumedStatus !== undefined && consumedStatus !== 'success';
    });
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
    } catch {
      // ignore close errors
    }

    try {
      await this.connection?.close();
    } catch {
      // ignore close errors
    }
  }
}
