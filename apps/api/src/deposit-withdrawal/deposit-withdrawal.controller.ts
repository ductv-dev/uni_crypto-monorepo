import {
  Body,
  Controller,
  Get,
  Ip,
  Param,
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
import { DepositWithdrawalService } from './deposit-withdrawal.service';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { FilterDepositWithdrawalDto } from './dto/filter-deposit-withdrawal.dto';
import { RejectRequestDto } from './dto/reject-request.dto';

@Controller('deposit-withdrawal')
@AdminOnly()
@UseGuards(AtGuard, PermissionGuard, AccountTypeGuard)
@AccountType(TypeAccount.admin)
export class DepositWithdrawalController {
  constructor(
    private readonly depositWithdrawalService: DepositWithdrawalService,
  ) {}

  @Get()
  @Permissions(PERMISSION_CODES.READ_DEPOSIT_WITHDRAWALS)
  findAll(@Query() query: FilterDepositWithdrawalDto) {
    return this.depositWithdrawalService.findAll(query);
  }

  @Get('overview')
  @Permissions(PERMISSION_CODES.READ_DEPOSIT_WITHDRAWALS)
  getOverview(@Query('type') type: 'deposit' | 'withdraw') {
    return this.depositWithdrawalService.getOverview(type);
  }

  @Get(':id')
  @Permissions(PERMISSION_CODES.READ_DEPOSIT_WITHDRAWALS)
  findOne(@Param('id') id: string) {
    return this.depositWithdrawalService.findOne(id);
  }

  @Post(':id/approve')
  @Permissions(PERMISSION_CODES.UPDATE_DEPOSIT_WITHDRAWALS)
  approve(
    @Param('id') id: string,
    @Body() approveRequestDto: ApproveRequestDto,
    @getCurrentUser('sub') adminId: string,
    @Ip() ip: string,
  ) {
    return this.depositWithdrawalService.approve(
      id,
      approveRequestDto,
      adminId,
      ip,
    );
  }

  @Post(':id/reject')
  @Permissions(PERMISSION_CODES.UPDATE_DEPOSIT_WITHDRAWALS)
  reject(
    @Param('id') id: string,
    @Body() rejectRequestDto: RejectRequestDto,
    @getCurrentUser('sub') adminId: string,
    @Ip() ip: string,
  ) {
    return this.depositWithdrawalService.reject(
      id,
      rejectRequestDto,
      adminId,
      ip,
    );
  }
}
