import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuditLogService } from './audit-log.service';

@Module({
  providers: [AuditLogService, JwtService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
