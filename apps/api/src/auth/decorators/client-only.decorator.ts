import { applyDecorators, UseGuards } from '@nestjs/common';
import { AccountType } from './account-type.decorator';
import { AccountTypeGuard, AtGuard } from '../guards';

// Chỉ cho phép tài khoản client/user đi qua sau khi đã xác thực.
export const ClientOnly = () =>
  applyDecorators(UseGuards(AtGuard, AccountTypeGuard), AccountType('user'));
