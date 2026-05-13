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
import { AdminOnly, getCurrentUser } from 'src/auth/decorators';
import { AtGuard } from 'src/auth/guards';
import { PERMISSION_CODES } from 'src/constant/permission-code.constant';
import { Permissions } from 'src/permission/decorators/permissions.decorator';
import { PermissionGuard } from 'src/permission/guards/permission.guard';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FilterWalletDto } from './dto/filter-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
@AdminOnly()
@UseGuards(AtGuard, PermissionGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @Permissions(PERMISSION_CODES.CREATE_WALLETS)
  create(
    @Body() createWalletDto: CreateWalletDto,
    @getCurrentUser('sub') adminId: string,
    @Ip() ip: string,
  ) {
    return this.walletService.create(createWalletDto, adminId, ip);
  }

  @Get()
  @Permissions(PERMISSION_CODES.READ_WALLETS)
  findAll(@Query() query: FilterWalletDto) {
    return this.walletService.findAll(query);
  }

  @Get(':id')
  @Permissions(PERMISSION_CODES.READ_WALLETS)
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSION_CODES.UPDATE_WALLETS)
  update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
    @getCurrentUser('sub') adminId: string,
    @Ip() ip: string,
  ) {
    return this.walletService.update(id, updateWalletDto, adminId, ip);
  }

  @Delete(':id')
  @Permissions(PERMISSION_CODES.DELETE_WALLETS)
  remove(
    @Param('id') id: string,
    @getCurrentUser('sub') adminId: string,
    @Ip() ip: string,
  ) {
    return this.walletService.remove(id, adminId, ip);
  }
}
