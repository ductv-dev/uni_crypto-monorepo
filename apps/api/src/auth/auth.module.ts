import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtGuard, RtGuard } from './guards';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    AtGuard,
    RtGuard,
    MailService,
  ],
  exports: [AtGuard, RtGuard],
})
export class AuthModule {}
