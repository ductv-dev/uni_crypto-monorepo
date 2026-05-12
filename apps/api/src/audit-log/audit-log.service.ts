import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@workspace/db';
import { CreateAuditLog } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(dto: CreateAuditLog) {
    const log = await this.prisma.auditLog.create({
      data: {
        user_id: dto.user_id,
        action: dto.action,
        table_name: dto.table_name,
        record_id: dto.record_id,
        changes: dto.changes,
        ip_address: dto.ip_address,
      },
    });
    if (!log) {
      throw new Error('Failed to create audit log');
    }
    return {
      message: 'Audit log created successfully',
      data: log,
    };
  }
}
