import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AUTH_ACCOUNT_TYPES,
  type AuthAccountType,
  IS_PUBLIC_KEY,
} from '../constants/auth.constants';
import {
  AccessTokenUser,
  JwtUserPayload,
  RequestWithUser,
} from '../types/request-user';

@Injectable()
export class AtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Public route sẽ bỏ qua toàn bộ flow xác thực.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const accessToken = this.extractAccessToken(request);
    if (!accessToken) {
      throw new UnauthorizedException('Missing access token');
    }

    const accessTokenSecret = this.configService.get<string>(
      'JWT_ACCESS_TOKEN_SECRET_KEY',
    );
    if (!accessTokenSecret) {
      throw new InternalServerErrorException(
        'JWT access token secret is not configured',
      );
    }

    let payload: JwtUserPayload;
    try {
      // Verify chữ ký và thời hạn token trước khi dùng payload.
      payload = await this.jwtService.verifyAsync<JwtUserPayload>(accessToken, {
        secret: accessTokenSecret,
      });
    } catch {
      throw new UnauthorizedException('Access token is invalid or expired');
    }

    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Token hợp lệ nhưng session trong DB vẫn có thể đã bị revoke hoặc hết hạn.
    const sessionId = await this.prisma.session.findUnique({
      where: {
        id: payload.sessionId,
      },
      select: {
        id: true,
        revoked_at: true,
        expires_at: true,
      },
    });

    if (!sessionId) {
      throw new UnauthorizedException('Invalid session');
    }
    if (sessionId.revoked_at) {
      throw new UnauthorizedException('Session is revoked');
    }
    if (sessionId.expires_at < new Date()) {
      throw new UnauthorizedException('Session is expired');
    }

    // Luôn lấy trạng thái user mới nhất từ DB thay vì tin hoàn toàn vào JWT.
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role_id: true,
        is_active: true,
        is_blocked: true,
        is_super_admin: true,
        type_account: true,
      },
    });

    if (!user || user.email !== payload.email) {
      throw new UnauthorizedException('User no longer exists');
    }

    if (!user.is_active) {
      throw new ForbiddenException('User account is inactive');
    }

    if (user.is_blocked) {
      throw new ForbiddenException('User account is blocked');
    }

    if (!this.isValidAccountType(user.type_account)) {
      throw new ForbiddenException('User account type is invalid');
    }

    // Chuẩn hóa request.user để decorator/guard khác dùng lại cùng một shape.
    const authenticatedUser: AccessTokenUser = {
      ...payload,
      token: accessToken,
      role_id: user.role_id,
      is_super_admin: user.is_super_admin,
      type_account: user.type_account,
    };
    request.user = authenticatedUser;

    return true;
  }

  private extractAccessToken(request: RequestWithUser): string | null {
    // Ưu tiên Bearer token để hỗ trợ API client/mobile app.
    const bearerToken = request.get('authorization');

    if (bearerToken?.startsWith('Bearer ')) {
      return bearerToken.slice(7).trim();
    }

    // Fallback sang cookie để hỗ trợ web client và admin panel.
    const rawCookieHeader = request.get('cookie');

    if (!rawCookieHeader) {
      return null;
    }

    const cookies = Object.fromEntries(
      rawCookieHeader
        .split(';')
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
          const separatorIndex = entry.indexOf('=');
          if (separatorIndex === -1) {
            return [entry, ''];
          }

          const key = entry.slice(0, separatorIndex).trim();
          const value = entry.slice(separatorIndex + 1).trim();
          return [key, decodeURIComponent(value)];
        }),
    );

    // Cho phép frontend tách session admin/client bằng 2 cookie name khác nhau.
    return cookies.admin_access_token || cookies.access_token || null;
  }

  private isValidAccountType(
    accountType: string,
  ): accountType is AuthAccountType {
    // Chỉ chấp nhận các loại tài khoản đã được định nghĩa nội bộ.
    return AUTH_ACCOUNT_TYPES.includes(accountType as AuthAccountType);
  }
}
