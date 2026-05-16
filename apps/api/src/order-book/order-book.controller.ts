import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminOnly } from 'src/auth/decorators';
import { AccountTypeGuard, AtGuard } from 'src/auth/guards';
import { OrderBookService } from './order-book.service';

@Controller('admin/order-book')
@UseGuards(AtGuard, AccountTypeGuard)
@AdminOnly()
export class OrderBookController {
  constructor(private readonly orderBookService: OrderBookService) {}

  @Get()
  findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('side') side?: string,
  ) {
    return this.orderBookService.findAll({
      limit,
      offset,
      search,
      status,
      type,
      side,
    });
  }

  @Get('overview')
  getOverview() {
    return this.orderBookService.getOverview();
  }
}
