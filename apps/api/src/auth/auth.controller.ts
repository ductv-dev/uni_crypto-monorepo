import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import { AuthService } from './auth.service';
import { getCurrentUser, getCurrentUserId, Public } from './decorators';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthLogoutDto } from './dto/logout.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthSigninDto } from './dto/signin.dto';
import { AuthSignupDto } from './dto/signup.dto';
import { AtGuard, RtGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // Lấy thông tin người dùng hiện tại dựa trên userId từ token truy cập, sử dụng AtGuard để bảo vệ route và chỉ cho phép truy cập nếu token hợp lệ
  @UseGuards(AtGuard)
  @Get('me')
  me(@getCurrentUserId() userId: string) {
    return this.authService.me(userId);
  }
  // Đăng nhập, xác thực người dùng dựa trên email và password, sau đó tạo token truy cập và làm mới, lưu thông tin phiên đăng nhập vào db và trả về token cho client
  @Public()
  @Post('signin')
  signin(@Body() dto: AuthSigninDto, @Req() req: Request) {
    const { ip, userAgent, device } = this.extractSessionMetadata(req);
    return this.authService.signin(dto, ip, userAgent, device);
  }
  // Đăng ký, tạo tài khoản mới dựa trên thông tin từ AuthSignupDto, sau đó gửi email kích hoạt tài khoản và lưu thông tin người dùng vào db
  @Public()
  @Post('signup')
  signup(@Body() dto: AuthSignupDto) {
    return this.authService.signup(dto);
  }
  // Kích hoạt tài khoản, xác nhận email bằng cách kiểm tra email và hash, sau đó kích hoạt tài khoản nếu hợp lệ
  @Public()
  @Post('activate-account')
  async activateAccount(@Body() body: { email: string; hash: string }) {
    return this.authService.activateAccount(body.email, body.hash);
  }
  // Quên mật khẩu, gửi email chứa liên kết đặt lại mật khẩu nếu email tồn tại trong hệ thống, liên kết này sẽ chứa token để xác thực yêu cầu đặt lại mật khẩu
  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }
  // Đặt lại mật khẩu, xác thực yêu cầu đặt lại mật khẩu dựa trên email và hash từ liên kết trong email, sau đó cập nhật mật khẩu mới nếu hợp lệ
  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.hash, dto.newPassword);
  }

  // Đăng xuất, xóa token làm mới cụ thể khỏi db dựa trên userId và refreshToken
  @UseGuards(AtGuard)
  @Post('logout')
  logout(@getCurrentUserId() userId: string, @Body() dto: AuthLogoutDto) {
    return this.authService.logout(userId, dto.refreshToken);
  }
  // Đăng xuất khỏi tất cả các phiên đăng nhập, xóa tất cả token làm mới liên quan đến userId
  @UseGuards(AtGuard)
  @Post('logout-all')
  logoutAll(@getCurrentUserId() userId: string) {
    return this.authService.logoutAll(userId);
  }

  // refresh token
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @getCurrentUserId() userId: string,
    @getCurrentUser('refreshToken') refreshToken: string,
    @getCurrentUser('sessionId') sessionId: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken, sessionId);
  }

  private extractSessionMetadata(req: Request): {
    ip: string;
    userAgent: string;
    device: string;
  } {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor?.split(',')[0]?.trim() ||
        req.socket.remoteAddress ||
        'unknown';

    const userAgent = req.get('user-agent') ?? 'unknown';

    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    const browserName = result.browser.name || 'Unknown browser';
    const osName = result.os.name || 'Unknown OS';

    return {
      ip,
      userAgent,
      device: `${browserName} - ${osName}`,
    };
  }
  // đổi mk
  @UseGuards(AtGuard)
  @Post('change-password')
  changePassword(
    @getCurrentUserId() userId: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );
  }
}
