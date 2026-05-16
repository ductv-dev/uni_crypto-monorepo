import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '@workspace/db';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OutboxProcessorService {
  private readonly logger = new Logger(OutboxProcessorService.name);
  private isProcessing = false;
  private readonly maxRetries = 3;

  constructor(
    private readonly prisma: PrismaService,
    @Inject('MATCHING_ENGINE_SERVICE')
    private readonly rabbitClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  async processOutboxEvents() {
    this.logger.log('Started Outbox Processor...');

    // Check connection RabbitMQ
    try {
      await this.rabbitClient.connect();
      this.logger.log('Connected to RabbitMQ.');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ on startup', error);
    }

    // đọc event từ database và gửi lên rabbitmq
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

      // Sleep for a short interval before polling again
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  private async processBatch() {
    // Find pending or eligible failed events
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
        // Mark as processing
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: { status: 'processing' },
        });

        // Emit message to RabbitMQ using the event_type as the pattern
        // (e.g. 'order_created' or 'order.created')
        // In the test module it was 'order.created', but the event_type is 'order_created'.
        // We replace '_' with '.' to match typical AMQP routing key format if needed,
        // or just use event.event_type directly. The receiver uses whatever pattern we emit.
        const routingKey = event.event_type.replace('_', '.');

        const message = {
          messageId: event.id,
          ...(event.payload as object),
        };

        await lastValueFrom(this.rabbitClient.emit(routingKey, message));

        // Mark as sent
        await this.prisma.outboxEvent.update({
          where: { id: event.id },
          data: {
            status: 'sent',
            sent_at: new Date(),
          },
        });

        this.logger.log(
          `Successfully published event ${event.id} (${routingKey})`,
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.error(
          `Failed to publish event ${event.id}: ${errorMessage}`,
        );

        // Increment retry and set to failed
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
}
