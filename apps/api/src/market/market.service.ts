import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@workspace/db';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { FilterMarketDto } from './dto/filter-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';

@Injectable()
export class MarketService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async create(dto: CreateMarketDto, adminId: string, ip: string) {
    const [baseAsset, quoteAsset] = await Promise.all([
      this.prisma.asset.findUnique({ where: { id: dto.base_asset_id } }),
      this.prisma.asset.findUnique({ where: { id: dto.quote_asset_id } }),
    ]);

    if (!baseAsset) throw new NotFoundException('Base asset not found');
    if (!quoteAsset) throw new NotFoundException('Quote asset not found');

    const existing = await this.prisma.market.findUnique({
      where: { symbol: dto.symbol },
    });
    if (existing) {
      throw new ConflictException('Market with this symbol already exists');
    }

    const market = await this.prisma.market.create({
      data: {
        symbol: dto.symbol,
        base_asset_id: dto.base_asset_id,
        quote_asset_id: dto.quote_asset_id,
        min_order_amount: dto.min_order_amount,
        max_order_amount: dto.max_order_amount,
        min_order_value: dto.min_order_value,
        price_precision: dto.price_precision,
        quantity_precision: dto.quantity_precision,
        description: dto.description,
        status: dto.status ?? true,
      },
    });

    await this.auditLogService.create({
      user_id: adminId,
      action: 'CREATE',
      table_name: 'Market',
      record_id: market.id,
      changes: JSON.stringify(market),
      ip_address: ip || 'system',
    });

    return market;
  }

  async findAll(query: FilterMarketDto) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status !== undefined) where.status = status;
    if (search) {
      where.OR = [
        { symbol: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.market.count({ where }),
      this.prisma.market.findMany({
        where,
        skip,
        take: limit,
        include: {
          baseAsset: true,
          quoteAsset: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const market = await this.prisma.market.findUnique({
      where: { id },
      include: {
        baseAsset: true,
        quoteAsset: true,
      },
    });

    if (!market) {
      throw new NotFoundException('Market not found');
    }

    return market;
  }

  async update(id: string, dto: UpdateMarketDto, adminId: string, ip: string) {
    const market = await this.prisma.market.findUnique({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');

    if (
      dto.price_precision !== undefined ||
      dto.quantity_precision !== undefined
    ) {
      const orderCount = await this.prisma.orderBook.count({
        where: { market_id: id },
      });
      if (orderCount > 0) {
        throw new BadRequestException(
          'Cannot change price or quantity precision because orders already exist for this market.',
        );
      }
    }

    const updated = await this.prisma.market.update({
      where: { id },
      data: {
        min_order_amount: dto.min_order_amount,
        max_order_amount: dto.max_order_amount,
        min_order_value: dto.min_order_value,
        price_precision: dto.price_precision,
        quantity_precision: dto.quantity_precision,
        description: dto.description,
        status: dto.status,
      },
    });

    await this.auditLogService.create({
      user_id: adminId,
      action: 'UPDATE',
      table_name: 'Market',
      record_id: id,
      changes: JSON.stringify(dto),
      ip_address: ip || 'system',
    });

    return updated;
  }

  async remove(id: string, adminId: string, ip: string) {
    const market = await this.prisma.market.findUnique({ where: { id } });
    if (!market) throw new NotFoundException('Market not found');

    const [orderCount, tradeCount] = await Promise.all([
      this.prisma.orderBook.count({ where: { market_id: id } }),
      this.prisma.trade.count({ where: { market_id: id } }),
    ]);

    if (orderCount > 0 || tradeCount > 0) {
      throw new BadRequestException(
        'Cannot delete market because it has associated orders or trades. Please disable it instead.',
      );
    }

    await this.prisma.market.delete({ where: { id } });

    await this.auditLogService.create({
      user_id: adminId,
      action: 'DELETE',
      table_name: 'Market',
      record_id: id,
      changes: JSON.stringify(market),
      ip_address: ip || 'system',
    });

    return { message: 'Market deleted successfully' };
  }
}
