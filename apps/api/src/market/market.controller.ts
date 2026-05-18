import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TypeAccount } from '@workspace/db';
import { AccountType, AdminOnly, getCurrentUser } from 'src/auth/decorators';
import { AccountTypeGuard, AtGuard } from 'src/auth/guards';
import { PERMISSION_CODES } from 'src/constant/permission-code.constant';
import { Permissions } from 'src/permission/decorators/permissions.decorator';
import { PermissionGuard } from 'src/permission/guards/permission.guard';
import { CreateMarketDto } from './dto/create-market.dto';
import { FilterMarketDto } from './dto/filter-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { MarketService } from './market.service';

@Controller('market')
@AdminOnly()
@UseGuards(AtGuard, PermissionGuard, AccountTypeGuard)
@AccountType(TypeAccount.admin)
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post()
  @Permissions(PERMISSION_CODES.CREATE_MARKETS)
  create(
    @Body() createMarketDto: CreateMarketDto,
    @getCurrentUser('sub') adminId: string,
    @Ip() ip: string,
  ) {
    return this.marketService.create(createMarketDto, adminId, ip);
  }

  @Get()
  @Permissions(PERMISSION_CODES.READ_MARKETS)
  findAll(@Query() query: FilterMarketDto) {
    return this.marketService.findAll(query);
  }

  @Get('assets/list')
  @Permissions(PERMISSION_CODES.READ_MARKETS)
  findAssets() {
    return this.marketService.findAssets();
  }

  @Get(':id')
  @Permissions(PERMISSION_CODES.READ_MARKETS)
  findOne(@Param('id') id: string) {
    return this.marketService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSION_CODES.UPDATE_MARKETS)
  update(
    @Param('id') id: string,
    @Body() updateMarketDto: UpdateMarketDto,
    @getCurrentUser('sub') adminId: string,
    @Ip() ip: string,
  ) {
    return this.marketService.update(id, updateMarketDto, adminId, ip);
  }

  @Delete(':id')
  @Permissions(PERMISSION_CODES.DELETE_MARKETS)
  remove(
    @Param('id') id: string,
    @getCurrentUser('sub') adminId: string,
    @Ip() ip: string,
  ) {
    return this.marketService.remove(id, adminId, ip);
  }
}
