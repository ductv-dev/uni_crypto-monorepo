import { Injectable } from '@nestjs/common';
import { PrismaService } from '@workspace/db';

@Injectable()
export class OrderBookService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    limit?: number;
    offset?: number;
    search?: string;
    status?: string;
    type?: string;
    side?: string;
  }) {
    const { limit = 10, offset = 0, search, status, type, side } = query;

    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (type) {
      where.type = type;
    }
    if (side) {
      where.side = side;
    }

    if (search) {
      where.OR = [
        { user_id: { contains: search, mode: 'insensitive' } },
        { market: { symbol: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.orderBook.findMany({
        where,
        take: Number(limit),
        skip: Number(offset),
        include: {
          market: {
            select: {
              symbol: true,
            },
          },
          user: {
            select: {
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.orderBook.count({ where }),
    ]);

    return {
      data,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOverview() {
    const [totalOrders, openOrders, filledOrders, cancelledOrders] =
      await Promise.all([
        this.prisma.orderBook.count(),
        this.prisma.orderBook.count({ where: { status: 'open' } }),
        this.prisma.orderBook.count({ where: { status: 'filled' } }),
        this.prisma.orderBook.count({ where: { status: 'cancelled' } }),
      ]);

    return {
      totalOrders,
      openOrders,
      filledOrders,
      cancelledOrders,
    };
  }
}
