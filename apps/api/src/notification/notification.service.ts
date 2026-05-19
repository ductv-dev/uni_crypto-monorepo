import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@workspace/db';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  private serialize(notification: {
    id: string;
    user_id: string;
    event: string;
    status: string;
    title: string;
    message: string;
    metadata: unknown;
    is_read: boolean;
    createdAt: Date;
  }) {
    return {
      id: notification.id,
      userId: notification.user_id,
      event: notification.event,
      status: notification.status,
      title: notification.title,
      message: notification.message,
      metadata:
        notification.metadata &&
        typeof notification.metadata === 'object' &&
        !Array.isArray(notification.metadata)
          ? notification.metadata
          : undefined,
      read: notification.is_read,
      createdAt: notification.createdAt.toISOString(),
    };
  }

  async findAllForUser(userId: string, page?: number, limit?: number) {
    const normalizedPage = Number(page);
    const normalizedLimit = Number(limit);
    const safePage =
      Number.isFinite(normalizedPage) && normalizedPage > 0
        ? normalizedPage
        : 1;
    const safeLimit =
      Number.isFinite(normalizedLimit) && normalizedLimit > 0
        ? Math.min(normalizedLimit, 100)
        : 20;
    const skip = (safePage - 1) * safeLimit;

    const [total, unreadCount, rows] = await Promise.all([
      this.prisma.notification.count({
        where: { user_id: userId },
      }),
      this.prisma.notification.count({
        where: { user_id: userId, is_read: false },
      }),
      this.prisma.notification.findMany({
        where: { user_id: userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
      }),
    ]);

    return {
      data: rows.map((row) => this.serialize(row)),
      meta: {
        total,
        unreadCount,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    });

    return this.serialize(updated);
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        user_id: userId,
        is_read: false,
      },
      data: {
        is_read: true,
      },
    });

    return {
      updatedCount: result.count,
    };
  }
}
