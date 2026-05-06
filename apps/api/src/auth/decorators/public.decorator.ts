import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants/auth.constants';

// Dùng cho các route không cần đăng nhập, ví dụ signin/signup/refresh.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
