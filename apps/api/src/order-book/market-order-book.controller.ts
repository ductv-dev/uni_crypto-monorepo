import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('market-order-book')
export class MarketOrderBookController {
  @Get(':marketId')
  async getOrderBook(
    @Param('marketId') marketId: string,
    @Query('limit') limit?: number,
  ) {
    const res = await fetch(
      `http://localhost:3001/order-book/${marketId}?limit=${limit || 20}`,
    );
    if (!res.ok) return { bids: [], asks: [] };
    return res.json();
  }
}
