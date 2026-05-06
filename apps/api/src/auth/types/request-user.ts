import type { Request } from 'express';
import type { AuthAccountType } from '../constants/auth.constants';

export type JwtUserPayload = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
  sessionId: string;
};

export type AccessTokenUser = JwtUserPayload & {
  token: string;
  role_id: string | null;
  is_super_admin: boolean;
  type_account: AuthAccountType;
};

export type RefreshTokenUser = JwtUserPayload & {
  refreshToken: string;
};

export type AuthenticatedUser = AccessTokenUser | RefreshTokenUser;

export type RequestWithUser = Request & {
  user: AuthenticatedUser;
};
