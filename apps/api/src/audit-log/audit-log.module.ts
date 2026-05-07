import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuditLogService } from './audit-log.service';

@Module({
  providers: [AuditLogService, PrismaService, JwtService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
