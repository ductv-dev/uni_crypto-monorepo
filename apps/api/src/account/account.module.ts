import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { AccountTypeGuard, AtGuard } from 'src/auth/guards';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [AuditLogModule],
  controllers: [AccountController],
  providers: [AccountService, JwtService, AtGuard, AccountTypeGuard],
})
export class AccountModule {}
