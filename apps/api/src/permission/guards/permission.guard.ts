import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from 'src/auth/types/request-user';
import { PrismaService } from 'src/prisma/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Đọc metadata ở method/class để biết route này yêu cầu quyền nào.
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !('sub' in user) || !user.sub || !user.email) {
      throw new UnauthorizedException('User is not authenticated');
    }

    if (!('role_id' in user) || !user.role_id) {
      throw new ForbiddenException('User role is not assigned');
    }
    // Nếu là super admin thì cho qua luôn.

    // Chỉ lấy quyền đang active của role đang active.
    const userPermissions = await this.prisma.rolePermission.findMany({
      where: {
        role_id: user.role_id,
        role: {
          status: true,
        },
        permission: {
          status: true,
        },
      },
      select: {
        permission: {
          select: {
            permission_code: true,
          },
        },
        role: {
          select: {
            level: true,
          },
        },
      },
    });
    // Nếu là super admin và role có level 1 thì cho qua luôn.
    if (
      user.is_super_admin === true &&
      userPermissions.some((rp) => rp.role.level === 1)
    ) {
      return true;
    }

    const userPermissionKeys = new Set(
      userPermissions.map((rp) => rp.permission.permission_code),
    );

    const hasPermission = requiredPermissions.every((permission) => {
      return userPermissionKeys.has(permission);
    });

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }

    return true;
  }
}
