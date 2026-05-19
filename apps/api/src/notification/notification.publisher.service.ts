import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Prisma, PrismaService } from '@workspace/db';
// @ts-ignore
import Redis from 'ioredis';
import { UserNotificationPayload } from './notification.types';

export const USER_NOTIFICATION_CHANNEL = 'user.notification';

const createRedisClient = () => {
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL);
  }

  return new Redis({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
  });
};

export const getErrorMessage = (
  error: unknown,
  fallback = 'Unexpected error',
) => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return fallback;
};

@Injectable()
export class NotificationPublisherService implements OnModuleDestroy {
  private readonly logger = new Logger(NotificationPublisherService.name);
  private readonly publisher = createRedisClient();

  constructor(private readonly prisma: PrismaService) {
    this.publisher.on('error', (error) => {
      this.logger.error(`Redis publisher error: ${error.message}`);
    });
  }

  async publishUserNotification(payload: UserNotificationPayload) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          user_id: payload.userId,
          event: payload.event,
          status: payload.status,
          title: payload.title,
          message: payload.message,
          metadata: payload.metadata as Prisma.InputJsonValue | undefined,
          is_read: payload.read ?? false,
        },
      });
      const normalizedPayload = {
        ...payload,
        id: notification.id,
        createdAt: notification.createdAt.toISOString(),
        read: notification.is_read,
      };

      await this.publisher.publish(
        USER_NOTIFICATION_CHANNEL,
        JSON.stringify(normalizedPayload),
      );
    } catch (error) {
      this.logger.warn(
        `Failed to persist/publish user notification. userId=${payload.userId} event=${payload.event} reason=${getErrorMessage(error)}`,
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.publisher.quit();
    } catch {
      this.publisher.disconnect();
    }
  }
}
