import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ACCOUNT_TYPES_KEY,
  type AuthAccountType,
} from '../constants/auth.constants';
import { RequestWithUser } from '../types/request-user';

@Injectable()
export class AccountTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Đọc metadata ở method/class để biết route này yêu cầu account type nào.
    const allowedAccountTypes = this.reflector.getAllAndOverride<
      AuthAccountType[]
    >(ACCOUNT_TYPES_KEY, [context.getHandler(), context.getClass()]);

    // Route không khai báo AccountType thì bỏ qua guard này.
    if (!allowedAccountTypes?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !('sub' in user)) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (!('type_account' in user) || !user.type_account) {
      throw new ForbiddenException('User account type is not available');
    }

    // Chặn nếu account hiện tại không nằm trong danh sách được phép.
    if (!allowedAccountTypes.includes(user.type_account)) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }
}
