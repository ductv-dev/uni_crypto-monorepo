import { applyDecorators, UseGuards } from '@nestjs/common';
import { AccountTypeGuard, AtGuard } from '../guards';
import { AccountType } from './account-type.decorator';

// Gom guard xác thực + guard phân loại tài khoản cho route admin.
export const AdminOnly = () =>
  applyDecorators(UseGuards(AtGuard, AccountTypeGuard), AccountType('admin'));
