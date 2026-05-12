import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PermissionGuard } from './guards/permission.guard';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [AuthModule],
  controllers: [PermissionController],
  providers: [PermissionService, JwtService, PermissionGuard],
})
export class PermissionModule {}
