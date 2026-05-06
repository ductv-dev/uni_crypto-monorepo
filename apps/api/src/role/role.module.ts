import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AtGuard } from 'src/auth/guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService, PrismaService, AtGuard, JwtService],
})
export class RoleModule {}
