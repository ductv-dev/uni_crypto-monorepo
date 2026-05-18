import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@workspace/db';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthModule } from './auth/auth.module';
import { BuySellModule } from './buy-sell/buy-sell.module';
import { DepositWithdrawalModule } from './deposit-withdrawal/deposit-withdrawal.module';
import { MailModule } from './mail/mail.module';
import { MarketModule } from './market/market.module';
import { MyWalletModule } from './my-wallet/my-wallet.module';
import { NotificationModule } from './notification/notification.module';
import { PermissionModule } from './permission/permission.module';
import { ProfileModule } from './profile/profile.module';
import { RoleModule } from './role/role.module';
import { OrderBookModule } from './order-book/order-book.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';

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
    NotificationModule,
    AuthModule,
    MailModule,
    UsersModule,
    PermissionModule,
    RoleModule,
    ProfileModule,
    AccountModule,
    AuditLogModule,
    WalletModule,
    MyWalletModule,
    DepositWithdrawalModule,
    MarketModule,
    BuySellModule,
    OrderBookModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
