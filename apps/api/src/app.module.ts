import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@workspace/db';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PermissionModule } from './permission/permission.module';
import { ProfileModule } from './profile/profile.module';
import { RoleModule } from './role/role.module';
import { TestRabbitmqModule } from './test-rabbitmq/test-rabbitmq.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { MyWalletModule } from './my-wallet/my-wallet.module';
import { DepositWithdrawalModule } from './deposit-withdrawal/deposit-withdrawal.module';
import { MarketModule } from './market/market.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrismaModule,
    AuthModule,
    MailModule,
    UsersModule,
    PermissionModule,
    RoleModule,
    ProfileModule,
    AccountModule,
    AuditLogModule,

    TestRabbitmqModule,
    WalletModule,
    MyWalletModule,
    DepositWithdrawalModule,
    MarketModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
