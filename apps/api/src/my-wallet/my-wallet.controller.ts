import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ClientOnly, getCurrentUserId } from 'src/auth/decorators';
import { AtGuard } from 'src/auth/guards';
import { CreateMyWalletDto } from './dto/create-my-wallet.dto';
import { RequestDepositDto } from './dto/request-deposit.dto';
import { RequestWithdrawalDto } from './dto/request-withdrawal.dto';
import { MyWalletService } from './my-wallet.service';

@Controller('my-wallet')
@UseGuards(AtGuard)
@ClientOnly()
export class MyWalletController {
  constructor(private readonly myWalletService: MyWalletService) {}

  @Post()
  create(
    @getCurrentUserId() userId: string,
    @Body() createMyWalletDto: CreateMyWalletDto,
  ) {
    return this.myWalletService.create(userId, createMyWalletDto);
  }

  @Get()
  findAll(@getCurrentUserId() userId: string) {
    return this.myWalletService.findAll(userId);
  }

  @Get('asset/:assetId')
  findByAsset(
    @getCurrentUserId() userId: string,
    @Param('assetId') assetId: string,
  ) {
    return this.myWalletService.findByAsset(userId, assetId);
  }

  @Get(':id')
  findOne(@getCurrentUserId() userId: string, @Param('id') id: string) {
    return this.myWalletService.findOne(userId, id);
  }

  @Post(':id/deposit')
  requestDeposit(
    @getCurrentUserId() userId: string,
    @Param('id') walletId: string,
    @Body() requestDepositDto: RequestDepositDto,
  ) {
    return this.myWalletService.requestDeposit(
      userId,
      walletId,
      requestDepositDto,
    );
  }

  @Post(':id/withdraw')
  requestWithdrawal(
    @getCurrentUserId() userId: string,
    @Param('id') walletId: string,
    @Body() requestWithdrawalDto: RequestWithdrawalDto,
  ) {
    return this.myWalletService.requestWithdrawal(
      userId,
      walletId,
      requestWithdrawalDto,
    );
  }
}
