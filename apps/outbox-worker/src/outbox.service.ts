import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@workspace/db';
import amqp, { type Channel, type ChannelModel } from 'amqplib';

type OrderCreatedEventMessage = {
  eventId: string;
  type: 'ORDER_CREATED';
  orderId: string;
  market: string;
  createdAt: string;
};

const normalizeMarketSymbol = (market: string) =>
  market.trim().toUpperCase().replace(/[\/_]/g, '-').replace(/\s+/g, '');

@Injectable()
export class OutboxProcessorService implements OnModuleDestroy {
  private readonly logger = new Logger(OutboxProcessorService.name);
  private isProcessing = false;
  private readonly maxRetries = 3;
  private readonly rabbitmqUrl: string;
  private readonly rabbitmqExchange: string;
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

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

  private async connectRabbitmq() {
    try {
      const connection = await amqp.connect(this.rabbitmqUrl);
      this.connection = connection;
      const channel = await connection.createChannel();
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

  private async processBatch() {
    const events = await this.prisma.outboxEvent.findMany({
      where: {
        OR: [
          { status: 'pending' },
          {
            status: 'failed',
            retry_count: { lt: this.maxRetries },
          },
        ],
      },
      take: 50,
      orderBy: { createdAt: 'asc' },
    });

    if (events.length === 0) {
      return;
    }

    this.logger.log(`Found ${events.length} outbox events to process.`);

    for (const event of events) {
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

        this.channel.publish(
          this.rabbitmqExchange,
          routingKey,
          Buffer.from(JSON.stringify(message)),
          { persistent: true },
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
