import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@workspace/db';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import {
  getErrorMessage,
  NotificationPublisherService,
} from 'src/notification/notification.publisher.service';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { FilterDepositWithdrawalDto } from './dto/filter-deposit-withdrawal.dto';
import { RejectRequestDto } from './dto/reject-request.dto';

@Injectable()
export class DepositWithdrawalService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
    private readonly notificationPublisher: NotificationPublisherService,
  ) {}

  async findAll(query: FilterDepositWithdrawalDto) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      asset_id,
      user_id,
      search,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (asset_id) where.asset_id = asset_id;
    if (user_id) where.user_id = user_id;
    if (search) {
      where.user = {
        email: { contains: search, mode: 'insensitive' },
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.depositWithdrawal.count({ where }),
      this.prisma.depositWithdrawal.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true } },
          asset: { select: { id: true, name: true, symbol: true } },
          admin: { select: { id: true, email: true } },
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
    const record = await this.prisma.depositWithdrawal.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true } },
        asset: true,
        admin: { select: { id: true, email: true } },
      },
    });

    if (!record) {
      throw new NotFoundException('Deposit/Withdrawal request not found');
    }

    return record;
  }

  async getOverview(type: 'deposit' | 'withdraw') {
    const [total, pending, completed, rejected, failed] = await Promise.all([
      this.prisma.depositWithdrawal.count({
        where: { type },
      }),
      this.prisma.depositWithdrawal.count({
        where: { type, status: 'pending' },
      }),
      this.prisma.depositWithdrawal.count({
        where: { type, status: 'completed' },
      }),
      this.prisma.depositWithdrawal.count({
        where: { type, status: 'rejected' },
      }),
      this.prisma.depositWithdrawal.count({
        where: { type, status: 'failed' },
      }),
    ]);

    return {
      total,
      pending,
      completed,
      rejected,
      failed,
    };
  }
  // Duyệt
  async approve(
    id: string,
    dto: ApproveRequestDto,
    adminId: string,
    ip: string,
  ) {
    const record = await this.prisma.depositWithdrawal.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Request not found');
    }

    try {
      if (record.status !== 'pending') {
        throw new BadRequestException(
          `Cannot approve a request with status ${record.status}`,
        );
      }

      const result = await this.prisma.$transaction(async (tx) => {
        let updatedRecord;

        if (record.type === 'deposit') {
          const wallet = await tx.wallet.findUnique({
            where: {
              user_id_asset_id: {
                user_id: record.user_id,
                asset_id: record.asset_id,
              },
            },
          });

          if (!wallet) {
            throw new NotFoundException('User wallet not found for this asset');
          }

          updatedRecord = await tx.depositWithdrawal.update({
            where: { id },
            data: {
              status: 'completed',
              admin_id: adminId,
              completed_at: new Date(),
              note: dto.note,
            },
          });

          const newAvailable =
            wallet.available_balance.toNumber() + record.amount.toNumber();

          await tx.wallet.update({
            where: { id: wallet.id },
            data: { available_balance: newAvailable },
          });

          await tx.walletTransaction.create({
            data: {
              wallet_id: wallet.id,
              type: 'deposit',
              direction: 'credit',
              amount: record.amount,
              balance_before: wallet.available_balance,
              balance_after: newAvailable,
              reference_type: 'deposit_withdrawal',
              reference_id: id,
              status: 'success',
            },
          });
        } else if (record.type === 'withdraw') {
          const wallet = await tx.wallet.findUnique({
            where: {
              user_id_asset_id: {
                user_id: record.user_id,
                asset_id: record.asset_id,
              },
            },
          });

          if (!wallet) {
            throw new NotFoundException('User wallet not found for this asset');
          }

          updatedRecord = await tx.depositWithdrawal.update({
            where: { id },
            data: {
              status: 'completed',
              admin_id: adminId,
              completed_at: new Date(),
              tx_hash: dto.tx_hash || record.tx_hash,
              note: dto.note,
            },
          });

          const newBlocked =
            wallet.blocked_balance.toNumber() - record.amount.toNumber();

          await tx.wallet.update({
            where: { id: wallet.id },
            data: { blocked_balance: newBlocked },
          });

          const wTx = await tx.walletTransaction.findFirst({
            where: { reference_id: id, reference_type: 'withdrawal_request' },
          });
          if (wTx) {
            await tx.walletTransaction.update({
              where: { id: wTx.id },
              data: { status: 'success' },
            });
          }
        }

        return updatedRecord;
      });

      await this.auditLogService.create({
        user_id: adminId,
        action: 'UPDATE',
        table_name: 'DepositWithdrawal',
        record_id: id,
        changes: JSON.stringify({ action: 'approve', result }),
        ip_address: ip || 'system',
      });

      await this.notificationPublisher.publishUserNotification({
        userId: record.user_id,
        event:
          record.type === 'deposit' ? 'deposit.approved' : 'withdraw.approved',
        status: 'success',
        title:
          record.type === 'deposit'
            ? 'Yêu cầu nạp đã được duyệt'
            : 'Yêu cầu rút đã được duyệt',
        message:
          record.type === 'deposit'
            ? 'Số dư ví đã được cập nhật sau khi duyệt nạp'
            : 'Yêu cầu rút của bạn đã được xử lý thành công',
        metadata: {
          requestId: id,
          type: record.type,
          amount: record.amount.toNumber(),
          assetId: record.asset_id,
          adminId,
        },
      });

      return result;
    } catch (error) {
      await this.notificationPublisher.publishUserNotification({
        userId: record.user_id,
        event:
          record.type === 'deposit' ? 'deposit.approved' : 'withdraw.approved',
        status: 'failed',
        title: 'Duyệt yêu cầu thất bại',
        message: getErrorMessage(error, 'Không thể duyệt yêu cầu nạp/rút'),
        metadata: {
          requestId: id,
          type: record.type,
          assetId: record.asset_id,
          adminId,
        },
      });
      throw error;
    }
  }

  async reject(id: string, dto: RejectRequestDto, adminId: string, ip: string) {
    const record = await this.prisma.depositWithdrawal.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('Request not found');
    }

    try {
      if (record.status !== 'pending') {
        throw new BadRequestException(
          `Cannot reject a request with status ${record.status}`,
        );
      }

      const result = await this.prisma.$transaction(async (tx) => {
        let updatedRecord;

        if (record.type === 'deposit') {
          updatedRecord = await tx.depositWithdrawal.update({
            where: { id },
            data: {
              status: 'rejected',
              admin_id: adminId,
              rejected_reason: dto.rejected_reason,
            },
          });
        } else if (record.type === 'withdraw') {
          const wallet = await tx.wallet.findUnique({
            where: {
              user_id_asset_id: {
                user_id: record.user_id,
                asset_id: record.asset_id,
              },
            },
          });

          if (!wallet) {
            throw new NotFoundException('User wallet not found for this asset');
          }

          updatedRecord = await tx.depositWithdrawal.update({
            where: { id },
            data: {
              status: 'rejected',
              admin_id: adminId,
              rejected_reason: dto.rejected_reason,
            },
          });

          const newAvailable =
            wallet.available_balance.toNumber() + record.amount.toNumber();
          const newBlocked =
            wallet.blocked_balance.toNumber() - record.amount.toNumber();

          await tx.wallet.update({
            where: { id: wallet.id },
            data: {
              available_balance: newAvailable,
              blocked_balance: newBlocked,
            },
          });

          const wTx = await tx.walletTransaction.findFirst({
            where: { reference_id: id, reference_type: 'withdrawal_request' },
          });
          if (wTx) {
            await tx.walletTransaction.update({
              where: { id: wTx.id },
              data: { status: 'failed' },
            });
          }
        }

        return updatedRecord;
      });

      await this.auditLogService.create({
        user_id: adminId,
        action: 'UPDATE',
        table_name: 'DepositWithdrawal',
        record_id: id,
        changes: JSON.stringify({
          action: 'reject',
          reason: dto.rejected_reason,
        }),
        ip_address: ip || 'system',
      });

      await this.notificationPublisher.publishUserNotification({
        userId: record.user_id,
        event:
          record.type === 'deposit' ? 'deposit.rejected' : 'withdraw.rejected',
        status: 'success',
        title:
          record.type === 'deposit'
            ? 'Yêu cầu nạp đã bị từ chối'
            : 'Yêu cầu rút đã bị từ chối',
        message:
          dto.rejected_reason || 'Yêu cầu đã bị từ chối bởi quản trị viên',
        metadata: {
          requestId: id,
          type: record.type,
          amount: record.amount.toNumber(),
          assetId: record.asset_id,
          adminId,
        },
      });

      return result;
    } catch (error) {
      await this.notificationPublisher.publishUserNotification({
        userId: record.user_id,
        event:
          record.type === 'deposit' ? 'deposit.rejected' : 'withdraw.rejected',
        status: 'failed',
        title: 'Từ chối yêu cầu thất bại',
        message: getErrorMessage(error, 'Không thể từ chối yêu cầu nạp/rút'),
        metadata: {
          requestId: id,
          type: record.type,
          assetId: record.asset_id,
          adminId,
        },
      });
      throw error;
    }
  }
}
