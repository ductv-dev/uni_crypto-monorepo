import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthSigninDto } from './dto/signin.dto';
import { AuthSignupDto } from './dto/signup.dto';
import { AccessTokenResponse, Tokens } from './types/token';

type MessageResponse = {
  message: string;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
  // Xử lý đăng nhập, kiểm tra thông tin người dùng và tạo token truy cập và làm mới
  async signin(
    dto: AuthSigninDto,
    ip: string,
    userAgent: string,
    device: string,
  ): Promise<AccessTokenResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // Check email tồn tại và mật khẩu đúng
    if (!user) throw new UnauthorizedException('User or password is incorrect');
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches)
      throw new UnauthorizedException('User or password is incorrect');
    // Check tài khoản đã được kích hoạt hay chưa
    if (!user.is_active)
      throw new UnauthorizedException('Account is not activated');
    // Check tài khoản đã bị khóa hay chưa
    if (user.is_blocked) throw new UnauthorizedException('Account is blocked');
    const session = await this.prisma.session.create({
      data: {
        user_id: user.id,
        refresh_token: 'TEMP',
        ip_address: ip,
        user_agent: userAgent,
        device,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, session.id);

    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        refresh_token: await bcrypt.hash(tokens.refresh_token, 10),
      },
    });

    return tokens;
  }

  // Đăng ký tài khoản mới, gửi email kích hoạt và lưu thông tin người dùng vào db
  async signup(dto: AuthSignupDto): Promise<MessageResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (existingUser)
      throw new UnauthorizedException('User with this email already exists');

    const defaultUserRole = await this.prisma.role.findUnique({
      where: {
        name: 'USER',
      },
      select: {
        id: true,
      },
    });

    if (!defaultUserRole) {
      throw new InternalServerErrorException(
        'Default USER role is not configured',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const random = Math.random().toString(36).substring(2, 15);
    const hashActive = await bcrypt.hash(random, 5);
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        is_active: false,
        hash_active: hashActive,
        role_id: defaultUserRole.id,
      },
    });
    await this.mailService.sendMailActiveAccount(newUser.email, random);

    return {
      message:
        'User registered successfully. Please check your email to activate your account.',
    };
  }
  // Lấy thông tin người dùng hiện tại dựa trên userId, trả về các trường cần thiết và thông tin liên quan
  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        is_active: true,
        is_blocked: true,
        is_super_admin: true,
        type_account: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            level: true,
            status: true,
          },
        },
        info: {
          select: {
            first_name: true,
            last_name: true,
            date_of_birth: true,
            gender: true,
            phone_number: true,
            address: true,
            city: true,
            country: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
  // Đăng xuất trên 1 thiết bị, xóa phiên đăng nhập tương ứng khỏi db dựa trên refreshToken
  async logout(userId: string, refreshToken: string): Promise<MessageResponse> {
    const result = await this.prisma.session.updateMany({
      where: {
        user_id: userId,
        refresh_token: refreshToken,
        revoked_at: null,
      },
      data: {
        revoked_at: new Date(),
      },
    });

    if (result.count === 0) {
      throw new UnauthorizedException('Session not found or already revoked');
    }

    return { message: 'Logged out successfully' };
  }
  // Đăng xuất trên tất cả thiết bị, xóa tất cả phiên đăng nhập của user khỏi db dựa trên userId
  async logoutAll(userId: string): Promise<MessageResponse> {
    await this.prisma.session.updateMany({
      where: {
        user_id: userId,
        revoked_at: null,
      },
      data: {
        revoked_at: new Date(),
      },
    });
    return { message: 'Logged out from all devices successfully' };
  }
  // Kích hoạt tài khoản người dùng thông qua email và hash
  async activateAccount(email: string, hash: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    // Check nếu user tồn tại, tài khoản chưa được kích hoạt và hash hợp lệ
    if (!user) throw new UnauthorizedException('User not found');
    if (user.is_active)
      throw new UnauthorizedException('Account is already active');
    const isHashValid = user.hash_active
      ? await bcrypt.compare(hash, user.hash_active)
      : false;
    if (!isHashValid)
      throw new UnauthorizedException('Invalid activation link');
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        is_active: true,
        hash_active: null,
      },
    });
    return { message: 'Account activated successfully' };
  }

  async forgotPassword(email: string): Promise<MessageResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is not activated');
    }

    if (user.is_blocked) {
      throw new UnauthorizedException('Account is blocked');
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    const hashResetPassword = await bcrypt.hash(resetToken, 5);

    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        hash_reset_password: hashResetPassword,
      },
    });

    await this.mailService.sendMailResetPassword(email, resetToken);

    return {
      message:
        'Password reset code sent successfully. Please check your email.',
    };
  }
  // Lưu thông tin phiên đăng nhập vào cơ sở dữ liệu, bao gồm userId, refreshToken, ip, userAgent, device và thời gian hết hạn
  async saveSession(
    userId: string,
    refreshToken: string,
    ip: string,
    userAgent: string,
    device: string,
  ): Promise<void> {
    const exp = new Date(
      Date.now() +
        Number(this.config.get('REFRESH_TOKEN_LIFE_TIME')) * 1000 * 60,
    );

    await this.prisma.session.create({
      data: {
        user_id: userId,
        refresh_token: refreshToken,
        ip_address: ip,
        user_agent: userAgent,
        device: device,
        expires_at: exp,
      },
    });
  }
  // Tạo token truy cập và làm mới cho người dùng dựa trên userId và email, sử dụng JWT và cấu hình từ env
  async generateTokens(
    userId: string,
    email: string,
    sessionId: string,
  ): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
      sessionId,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload, type: 'access' },
        {
          secret: this.config.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { ...payload, type: 'refresh' },
        {
          secret: this.config.get<string>('JWT_REFRESH_TOKEN_SECRET_KEY'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async generateAccessToken(
    userId: string,
    email: string,
    sessionId: string,
  ): Promise<AccessTokenResponse> {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email, sessionId },
      {
        secret: this.config.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
        expiresIn: Number(
          this.config.get('ACCESS_TOKEN_LIFE_TIME') * 60 * 1000,
        ),
      },
    );

    return { access_token: accessToken };
  }

  //refresh access token mới dựa trên refreshToken cũ, kiểm tra tính hợp lệ của refreshToken và tạo token mới nếu hợp lệ
  async refreshTokens(
    userId: string,
    refreshToken: string,
    sessionId: string,
  ): Promise<AccessTokenResponse> {
    const session = await this.prisma.session.findFirst({
      where: {
        user_id: userId,
        id: sessionId,
        revoked_at: null,
      },
      select: {
        id: true,
        expires_at: true,
        refresh_token: true,
      },
    });
    if (!session) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
    const isMatchingToken = session
      ? await bcrypt.compare(refreshToken, session.refresh_token)
      : false;

    if (!isMatchingToken) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    if (session.expires_at < new Date()) {
      throw new UnauthorizedException('Refresh token is expired');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        is_active: true,
        is_blocked: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is not activated');
    }

    if (user.is_blocked) {
      throw new UnauthorizedException('Account is blocked');
    }

    return this.generateAccessToken(user.id, user.email, sessionId);
  }

  //Đổi mk
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatches = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    return { message: 'Password changed successfully' };
  }

  async resetPassword(
    email: string,
    hash: string,
    newPassword: string,
  ): Promise<MessageResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.hash_reset_password) {
      throw new UnauthorizedException('Password reset request is invalid');
    }

    const isHashValid = await bcrypt.compare(hash, user.hash_reset_password);

    if (!isHashValid) {
      throw new UnauthorizedException('Invalid password reset code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
          hash_reset_password: null,
        },
      }),
      this.prisma.session.updateMany({
        where: {
          user_id: user.id,
          revoked_at: null,
        },
        data: {
          revoked_at: new Date(),
        },
      }),
    ]);

    return { message: 'Password reset successfully' };
  }
}
