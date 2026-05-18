import {
  Body,
  Get,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { ClientOnly, getCurrentUser } from 'src/auth/decorators';
import { AtGuard } from 'src/auth/guards';
import { BuySellService } from './buy-sell.service';
import { CreateBuyDto } from './dto/create-buy-sell.dto';
import { UpdateBuySellDto } from './dto/update-buy-sell.dto';

@Controller('buy-sell')
export class BuySellController {
  constructor(private readonly buySellService: BuySellService) {}

  @Post()
  @UseGuards(AtGuard)
  create(
    @Body() createBuySellDto: CreateBuyDto,
    @getCurrentUser('sub') userId: string,
    @Ip() ip_address: string,
  ) {
    return this.buySellService.create(createBuySellDto, userId, ip_address);
  }

  @Get('markets')
  @ClientOnly()
  findAvailableMarkets() {
    return this.buySellService.findAvailableMarkets();
  }

  @Get()
  findAll() {
    return this.buySellService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buySellService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuySellDto: UpdateBuySellDto) {
    return this.buySellService.update(+id, updateBuySellDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buySellService.remove(+id);
  }
}
