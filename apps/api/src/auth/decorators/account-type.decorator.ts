import { SetMetadata } from '@nestjs/common';
import {
  ACCOUNT_TYPES_KEY,
  type AuthAccountType,
} from '../constants/auth.constants';

// Gắn loại tài khoản được phép truy cập để AccountTypeGuard đọc lại ở runtime.
export const AccountType = (...accountTypes: AuthAccountType[]) =>
  SetMetadata(ACCOUNT_TYPES_KEY, accountTypes);
