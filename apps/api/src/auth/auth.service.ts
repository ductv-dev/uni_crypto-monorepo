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
import { Tokens } from './types/token';

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
  ): Promise<Tokens> {
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
    const tokens: Tokens = await this.generateTokens(user.id, user.email);
    // lưu thông tin phiên đăng nhập vào db
    await this.saveSession(
      user.id,
      tokens.refresh_token,
      ip,
      userAgent,
      device,
    );
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
  async generateTokens(userId: string, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.config.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
          expiresIn: Number(
            this.config.get('ACCESS_TOKEN_LIFE_TIME') * 60 * 1000,
          ),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.config.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
          expiresIn: Number(
            this.config.get('REFRESH_TOKEN_LIFE_TIME') * 60 * 1000,
          ),
        },
      ),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }
}
