import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AtGuard } from 'src/auth/guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, AtGuard, PrismaService, JwtService],
})
export class ProfileModule {}
