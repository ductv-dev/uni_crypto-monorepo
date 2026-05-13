import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@workspace/db';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FilterWalletDto } from './dto/filter-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async create(createWalletDto: CreateWalletDto, adminId: string, ip: string) {
    const { user_id, asset_id } = createWalletDto;

    const userExists = await this.prisma.user.findUnique({
      where: { id: user_id },
    });
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const assetExists = await this.prisma.asset.findUnique({
      where: { id: asset_id },
    });
    if (!assetExists) {
      throw new NotFoundException('Asset not found');
    }

    const existingWallet = await this.prisma.wallet.findUnique({
      where: {
        user_id_asset_id: { user_id, asset_id },
      },
    });

    if (existingWallet) {
      throw new ConflictException(
        'Wallet already exists for this user and asset',
      );
    }

    const wallet = await this.prisma.wallet.create({
      data: {
        user_id,
        asset_id,
      },
    });

    await this.auditLogService.create({
      user_id: adminId,
      action: 'CREATE',
      table_name: 'Wallet',
      record_id: wallet.id,
      changes: JSON.stringify(wallet),
      ip_address: ip || 'system',
    });

    return wallet;
  }

  async findAll(query: FilterWalletDto) {
    const { page = 1, limit = 10, search, status, asset_id, user_id } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status !== undefined) {
      where.status = status;
    }

    if (asset_id) {
      where.asset_id = asset_id;
    }

    if (user_id) {
      where.user_id = user_id;
    }

    if (search) {
      where.user = {
        email: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.wallet.count({ where }),
      this.prisma.wallet.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          blocked_balance: true,
          available_balance: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          asset: {
            select: {
              id: true,
              name: true,
              symbol: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
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
    const wallet = await this.prisma.wallet.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        asset: {
          select: {
            id: true,
            name: true,
            symbol: true,
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async update(
    id: string,
    updateWalletDto: UpdateWalletDto,
    adminId: string,
    ip: string,
  ) {
    const existingWallet = await this.prisma.wallet.findUnique({
      where: { id },
    });

    if (!existingWallet) {
      throw new NotFoundException('Wallet not found');
    }

    const updatedWallet = await this.prisma.wallet.update({
      where: { id },
      data: {
        status: updateWalletDto.status,
      },
    });

    await this.auditLogService.create({
      user_id: adminId,
      action: 'UPDATE',
      table_name: 'Wallet',
      record_id: updatedWallet.id,
      changes: JSON.stringify({ before: existingWallet, after: updatedWallet }),
      ip_address: ip || 'system',
    });

    return updatedWallet;
  }

  async remove(id: string, adminId: string, ip: string) {
    const existingWallet = await this.prisma.wallet.findUnique({
      where: { id },
      include: {
        transactions: {
          take: 1,
        },
      },
    });

    if (!existingWallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (
      existingWallet.available_balance.toNumber() > 0 ||
      existingWallet.blocked_balance.toNumber() > 0
    ) {
      throw new BadRequestException('Cannot delete a wallet that has balance');
    }

    if (existingWallet.transactions.length > 0) {
      throw new BadRequestException(
        'Cannot delete a wallet that has transaction history',
      );
    }

    await this.prisma.wallet.delete({
      where: { id },
    });

    await this.auditLogService.create({
      user_id: adminId,
      action: 'DELETE',
      table_name: 'Wallet',
      record_id: id,
      changes: JSON.stringify(existingWallet),
      ip_address: ip || 'system',
    });

    return { message: 'Wallet deleted successfully' };
  }
}
