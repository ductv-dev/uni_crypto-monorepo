import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { AuthSigninDto } from './dto/signin.dto';
import { AuthSignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('signin')
  signin(@Body() dto: AuthSigninDto, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'unknown';

    const userAgent = req.headers['user-agent'] || 'unknown';
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const device = `${result.browser.name} - ${result.os.name}`;
    return this.authService.signin(dto, ip, userAgent, device);
  }
  @Public()
  @Post('signup')
  signup(@Body() dto: AuthSignupDto, @Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const device = `${result.browser.name} - ${result.os.name}`;
    console.log('Client IP:', ip);
    return this.authService.signup(dto, ip, userAgent, device);
  }
  @Public()
  @Post('activate-account')
  async activateAccount(@Body() body: { email: string; hash: string }) {
    return this.authService.activateAccount(body.email, body.hash);
  }
}
