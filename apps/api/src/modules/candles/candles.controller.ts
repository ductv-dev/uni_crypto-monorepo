import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { Public } from 'src/auth/decorators';
import { GetCandlesDto } from './dto/get-candles.dto';
import { CandlesService } from './candles.service';

@Public()
@Controller('markets')
export class CandlesController {
  constructor(private readonly candlesService: CandlesService) {}

  @Get(':marketId/candles')
  getCandles(
    @Param('marketId', new ParseUUIDPipe()) marketId: string,
    @Query() dto: GetCandlesDto,
  ) {
    return this.candlesService.getCandles(marketId, dto);
  }
}
