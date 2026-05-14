import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AtGuard } from 'src/auth/guards';

import { BuySellController } from './buy-sell.controller';
import { BuySellService } from './buy-sell.service';

@Module({
  controllers: [BuySellController],
  providers: [BuySellService, AtGuard, JwtService],
})
export class BuySellModule {}
