import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthSigninDto } from './dto/signin.dto';
import { Tokens } from './types/token';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}
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
    if (!user) throw new UnauthorizedException('User or password is incorrect');
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches)
      throw new UnauthorizedException('User or password is incorrect');

    const tokens: Tokens = await this.generateTokens(user.id, user.email);
    await this.saveSession(
      user.id,
      tokens.refresh_token,
      ip,
      userAgent,
      device,
    );
    return tokens;
  }
  async signup(
    dto: AuthSigninDto,
    ip: string,
    userAgent: string,
    device: string,
  ): Promise<Tokens> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (existingUser)
      throw new UnauthorizedException('User with this email already exists');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const random = Math.random().toString(36).substring(2, 15);
    const hashActive = await bcrypt.hash(random, 5);
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        is_active: false,
        hash_active: hashActive,
        role_id: 'user-role',
      },
    });
    const tokens: Tokens = await this.generateTokens(newUser.id, newUser.email);
    await this.mailService.sendMailActiveAccount(newUser.email, random);
    await this.saveSession(
      newUser.id,
      tokens.refresh_token,
      ip,
      userAgent,
      device,
    );
    return tokens;
  }

  async activateAccount(email: string, hash: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
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

  async generateTokens(userId: string, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.config.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
          expiresIn: Number(this.config.get('ACCESS_TOKEN_LIFE_TIME')),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.config.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
          expiresIn: Number(this.config.get('REFRESH_TOKEN_LIFE_TIME')),
        },
      ),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }
}
