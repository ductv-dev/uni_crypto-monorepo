import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_REFRESH_TOKEN_SECRET_KEY')!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: Record<string, unknown>) {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();
    return {
      ...payload,
      refreshToken,
    };
  }
}
