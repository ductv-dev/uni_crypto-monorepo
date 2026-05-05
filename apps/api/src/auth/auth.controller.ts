import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import { AuthService } from './auth.service';
import { getCurrentUserId, Public } from './decorators';
import { AuthLogoutDto } from './dto/logout.dto';
import { AuthSigninDto } from './dto/signin.dto';
import { AuthSignupDto } from './dto/signup.dto';
import { AtGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AtGuard)
  @Get('me')
  me(@getCurrentUserId() userId: string) {
    return this.authService.me(userId);
  }

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
  signup(@Body() dto: AuthSignupDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('activate-account')
  async activateAccount(@Body() body: { email: string; hash: string }) {
    return this.authService.activateAccount(body.email, body.hash);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  logout(@getCurrentUserId() userId: string, @Body() dto: AuthLogoutDto) {
    return this.authService.logout(userId, dto.refreshToken);
  }

  @UseGuards(AtGuard)
  @Post('logout-all')
  logoutAll(@getCurrentUserId() userId: string) {
    return this.authService.logoutAll(userId);
  }
}
