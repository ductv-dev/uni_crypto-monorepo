import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../types/request-user';

type CurrentUserKey =
  | 'sub'
  | 'email'
  | 'iat'
  | 'exp'
  | 'token'
  | 'role_id'
  | 'is_super_admin'
  | 'type_account'
  | 'refreshToken'
  | 'sessionId';

export const getCurrentUser = createParamDecorator(
  (data: CurrentUserKey | undefined, context: ExecutionContext): unknown => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    if (!data) {
      return request.user;
    }

    const user = request.user as Record<CurrentUserKey, unknown>;
    return user[data];
  },
);
