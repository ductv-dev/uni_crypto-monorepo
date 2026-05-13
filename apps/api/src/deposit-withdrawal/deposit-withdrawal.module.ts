import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@workspace/db';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { DepositWithdrawalController } from './deposit-withdrawal.controller';
import { DepositWithdrawalService } from './deposit-withdrawal.service';

@Module({
  controllers: [DepositWithdrawalController],
  providers: [
    DepositWithdrawalService,
    PrismaService,
    AuditLogService,
    JwtService,
  ],
})
export class DepositWithdrawalModule {}
