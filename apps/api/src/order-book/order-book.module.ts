import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { OrderBookController } from './order-book.controller';
import { MarketOrderBookController } from './market-order-book.controller';
import { OrderBookService } from './order-book.service';

@Module({
  imports: [AuthModule],
  controllers: [OrderBookController, MarketOrderBookController],
  providers: [OrderBookService, JwtService],
})
export class OrderBookModule {}
