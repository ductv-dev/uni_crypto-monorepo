import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AdminOnly,
  getCurrentUser,
  getCurrentUserId,
} from 'src/auth/decorators';
import { AtGuard } from 'src/auth/guards/access-token.guard';
import { AccountTypeGuard } from 'src/auth/guards/account-type.guard';
import { PERMISSION_CODES } from 'src/constant/permission-code.constant';
import { Permissions } from '../permission/decorators/permissions.decorator';
import { AccountService } from './account.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('account')
@UseGuards(AtGuard, AccountTypeGuard)
@AdminOnly()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @Permissions(PERMISSION_CODES.CREATE_USERS)
  create(
    @Body() createAccountDto: CreateAccountDto,
    @getCurrentUser('role_level') roleLevel: number,
    @getCurrentUserId() userId: string,
  ) {
    return this.accountService.create(createAccountDto, roleLevel, userId);
  }

  @Get()
  @Permissions(PERMISSION_CODES.READ_USERS)
  findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @getCurrentUserId() userId: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('type') type?: string,
    @Query('roleId') roleId?: string,
    @Query('status') status?: 'active' | 'inactive' | 'blocked',
  ) {
    return this.accountService.findAll(
      limit,
      offset,
      search,
      sortBy,
      sortOrder,
      type,
      roleId,
      status,
      userId,
    );
  }
  // đổi mật khẩu user

  @Patch('change-password/:id')
  @Permissions(PERMISSION_CODES.UPDATE_USERS)
  update(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
    @getCurrentUser('role_level') roleLevel: number,
  ) {
    return this.accountService.updatePassword(id, dto, roleLevel);
  }

  @Patch('block/:id')
  @Permissions(PERMISSION_CODES.UPDATE_USERS)
  block(
    @Param('id') id: string,
    @getCurrentUser('role_level') roleLevel: number,
  ) {
    return this.accountService.block(id, roleLevel);
  }
  @Put('update-profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @getCurrentUser('role_level') roleLevel: number,
  ) {
    return this.accountService.updateProfile(id, dto, roleLevel);
  }
  @Get('info/:id')
  @Permissions(PERMISSION_CODES.READ_USERS)
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }
  @Post('update-role/:id')
  @Permissions(PERMISSION_CODES.UPDATE_USERS)
  updateRole(
    @Param('id') id: string,
    @Body() dto: { role_id: string },
    @getCurrentUser('role_level') roleLevel: number,
  ) {
    return this.accountService.updateRole(id, dto.role_id, roleLevel);
  }
}
