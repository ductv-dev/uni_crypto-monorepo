import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@workspace/db';
import { ClientOnly } from 'src/auth/decorators';
import {
  getErrorMessage,
  NotificationPublisherService,
} from 'src/notification/notification.publisher.service';
import { CreateMyWalletDto } from './dto/create-my-wallet.dto';
import { FilterWalletHistoryDto } from './dto/filter-wallet-history.dto';
import { RequestDepositDto } from './dto/request-deposit.dto';
import { RequestWithdrawalDto } from './dto/request-withdrawal.dto';

@Injectable()
@ClientOnly()
export class MyWalletService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationPublisher: NotificationPublisherService,
  ) {}

  async create(userId: string, createMyWalletDto: CreateMyWalletDto) {
    const { asset_id } = createMyWalletDto;

    const assetExists = await this.prisma.asset.findUnique({
      where: { id: asset_id },
    });
    if (!assetExists) {
      throw new NotFoundException('Asset not found');
    }

    const existingWallet = await this.prisma.wallet.findUnique({
      where: {
        user_id_asset_id: { user_id: userId, asset_id },
      },
    });

    if (existingWallet) {
      throw new ConflictException('Wallet already exists for this asset');
    }

    return this.prisma.wallet.create({
      data: {
        user_id: userId,
        asset_id,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.wallet.findMany({
      where: { user_id: userId },
      include: {
        asset: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByAsset(userId: string, assetId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        user_id_asset_id: { user_id: userId, asset_id: assetId },
      },
      include: {
        asset: true,
      },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found for this asset');
    }

    return wallet;
  }

  async findHistory(userId: string, query: FilterWalletHistoryDto) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 20;
    const skip = (page - 1) * limit;

    const where = {
      wallet: {
        user_id: userId,
      },
    };

    const [total, rows] = await Promise.all([
      this.prisma.walletTransaction.count({ where }),
      this.prisma.walletTransaction.findMany({
        where,
        skip,
        take: limit,
        include: {
          wallet: {
            select: {
              id: true,
              asset: {
                select: {
                  id: true,
                  symbol: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      data: rows.map((row) => ({
        id: row.id,
        wallet_id: row.wallet_id,
        type: row.type,
        direction: row.direction,
        amount: row.amount.toString(),
        balance_before: row.balance_before.toString(),
        balance_after: row.balance_after.toString(),
        reference_type: row.reference_type,
        reference_id: row.reference_id,
        status: row.status,
        description: row.description,
        createdAt: row.createdAt.toISOString(),
        wallet: row.wallet,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id },
      include: {
        asset: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!wallet || wallet.user_id !== userId) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async requestDeposit(
    userId: string,
    walletId: string,
    dto: RequestDepositDto,
  ) {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: { id: walletId },
      });

      if (!wallet || wallet.user_id !== userId) {
        throw new NotFoundException('Wallet not found');
      }

      const depositRequest = await this.prisma.depositWithdrawal.create({
        data: {
          user_id: userId,
          asset_id: wallet.asset_id,
          type: 'deposit',
          amount: dto.amount,
          network: dto.network,
          tx_hash: dto.tx_hash,
          from_address: dto.from_address,
          status: 'pending',
        },
      });

      await this.notificationPublisher.publishUserNotification({
        userId,
        event: 'deposit.request',
        status: 'success',
        title: 'Tạo yêu cầu nạp thành công',
        message: 'Yêu cầu nạp tiền đã được gửi và đang chờ xử lý',
        metadata: {
          requestId: depositRequest.id,
          walletId,
          amount: dto.amount,
          network: dto.network,
          txHash: dto.tx_hash,
        },
      });

      return depositRequest;
    } catch (error) {
      await this.notificationPublisher.publishUserNotification({
        userId,
        event: 'deposit.request',
        status: 'failed',
        title: 'Tạo yêu cầu nạp thất bại',
        message: getErrorMessage(error, 'Không thể tạo yêu cầu nạp'),
        metadata: {
          walletId,
          amount: dto.amount,
          network: dto.network,
        },
      });
      throw error;
    }
  }

  async requestWithdrawal(
    userId: string,
    walletId: string,
    dto: RequestWithdrawalDto,
  ) {
    try {
      const withdrawRecord = await this.prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({
          where: { id: walletId },
        });

        if (!wallet || wallet.user_id !== userId) {
          throw new NotFoundException('Wallet not found');
        }

        if (wallet.available_balance.toNumber() < dto.amount) {
          throw new BadRequestException('Insufficient available balance');
        }

        const withdrawRecord = await tx.depositWithdrawal.create({
          data: {
            user_id: userId,
            asset_id: wallet.asset_id,
            type: 'withdraw',
            amount: dto.amount,
            network: dto.network,
            to_address: dto.to_address,
            status: 'pending',
          },
        });

        const newAvailable = wallet.available_balance.toNumber() - dto.amount;
        const newBlocked = wallet.blocked_balance.toNumber() + dto.amount;

        await tx.wallet.update({
          where: { id: walletId },
          data: {
            available_balance: newAvailable,
            blocked_balance: newBlocked,
          },
        });

        await tx.walletTransaction.create({
          data: {
            wallet_id: walletId,
            type: 'withdraw',
            direction: 'debit',
            amount: dto.amount,
            balance_before: wallet.available_balance,
            balance_after: newAvailable,
            reference_type: 'withdrawal_request',
            reference_id: withdrawRecord.id,
            status: 'pending',
          },
        });

        return withdrawRecord;
      });

      await this.notificationPublisher.publishUserNotification({
        userId,
        event: 'withdraw.request',
        status: 'success',
        title: 'Tạo yêu cầu rút thành công',
        message: 'Yêu cầu rút tiền đã được gửi và đang chờ duyệt',
        metadata: {
          requestId: withdrawRecord.id,
          walletId,
          amount: dto.amount,
          network: dto.network,
          toAddress: dto.to_address,
        },
      });

      return withdrawRecord;
    } catch (error) {
      await this.notificationPublisher.publishUserNotification({
        userId,
        event: 'withdraw.request',
        status: 'failed',
        title: 'Tạo yêu cầu rút thất bại',
        message: getErrorMessage(error, 'Không thể tạo yêu cầu rút'),
        metadata: {
          walletId,
          amount: dto.amount,
          network: dto.network,
        },
      });
      throw error;
    }
  }
}
