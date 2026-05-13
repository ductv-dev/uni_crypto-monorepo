import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@workspace/db';
import { ClientOnly } from 'src/auth/decorators';
import { CreateMyWalletDto } from './dto/create-my-wallet.dto';
import { RequestDepositDto } from './dto/request-deposit.dto';
import { RequestWithdrawalDto } from './dto/request-withdrawal.dto';

@Injectable()
@ClientOnly()
export class MyWalletService {
  constructor(private prisma: PrismaService) {}

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
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet || wallet.user_id !== userId) {
      throw new NotFoundException('Wallet not found');
    }

    return this.prisma.depositWithdrawal.create({
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
  }

  async requestWithdrawal(
    userId: string,
    walletId: string,
    dto: RequestWithdrawalDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
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
  }
}
