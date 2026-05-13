import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@workspace/db';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { MyWalletController } from './my-wallet.controller';
import { MyWalletService } from './my-wallet.service';

@Module({
  controllers: [MyWalletController],
  providers: [MyWalletService, PrismaService, AuditLogService, JwtService],
})
export class MyWalletModule {}
