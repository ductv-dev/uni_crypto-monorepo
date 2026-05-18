import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@workspace/db';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permission.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  private ensureRoleIsNotSuperAdminRole(role: {
    level: number;
    name?: string | null;
  }) {
    if (role.level === 1) {
      throw new ForbiddenException(
        'You not have permission to modify this role',
      );
    }
  }

  async create(createRoleDto: CreateRoleDto, currentRoleLevel: number | null) {
    if (currentRoleLevel == null) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
    if (currentRoleLevel >= createRoleDto.level) {
      throw new ForbiddenException(
        'You can only create a role with level lower than your current role level',
      );
    }

    if (createRoleDto.level === 1) {
      throw new ForbiddenException(
        'You not have permission to create this role',
      );
    }
    const existingRole = await this.prisma.role.findFirst({
      where: {
        name: createRoleDto.name,
      },
    });
    if (existingRole) {
      throw new ForbiddenException('Role name already exists');
    }
    return await this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description,
        level: createRoleDto.level,
        status: createRoleDto.status,
      },
    });
  }

  async findAll() {
    const role = await this.prisma.role.findMany({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        level: 'asc',
      },
    });
    return role;
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: id,
      },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
    currentRoleLevel: number | null,
  ) {
    if (currentRoleLevel == null) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
    // Nếu có update level thì check nếu level mới >= currentRoleLevel thì không cho update.
    if (updateRoleDto.level && currentRoleLevel > updateRoleDto.level) {
      throw new ForbiddenException(
        'You can only update a role with level lower than your current role level',
      );
    }

    const existingRole = await this.prisma.role.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
        description: true,
        level: true,
        status: true,
      },
    });
    // Nếu role không tồn tại thì throw not found.
    if (!existingRole) {
      throw new NotFoundException('Role not found');
    }

    // Nếu không có gì thay đổi thì throw forbidden.
    const isSame =
      (updateRoleDto.name === undefined ||
        updateRoleDto.name === existingRole.name) &&
      (updateRoleDto.description === undefined ||
        updateRoleDto.description === existingRole.description) &&
      (updateRoleDto.level === undefined ||
        updateRoleDto.level === existingRole.level) &&
      (updateRoleDto.status === undefined ||
        updateRoleDto.status === existingRole.status);

    if (isSame) {
      throw new ConflictException('No changes to update');
    }
    // Nếu có update name và name mới khác name cũ thì check nếu đã tồn tại role nào có name mới đó chưa, nếu có rồi thì không cho update.
    if (updateRoleDto.name && existingRole.name !== updateRoleDto.name) {
      const roleWithSameName = await this.prisma.role.findFirst({
        where: {
          name: updateRoleDto.name,
          id: {
            not: id,
          },
        },
      });
      if (roleWithSameName) {
        throw new ConflictException('Role name already exists');
      }
    }
    this.ensureRoleIsNotSuperAdminRole(existingRole);
    //
    const updatedRole = await this.prisma.role.update({
      where: {
        id: id,
      },
      data: {
        name: updateRoleDto.name ?? existingRole.name,
        description: updateRoleDto.description ?? existingRole.description,
        level: updateRoleDto.level ?? existingRole.level,
        status: updateRoleDto.status ?? existingRole.status,
      },
    });
    if (!updatedRole) {
      throw new Error('Failed to update role');
    }
    const result = {
      message: 'Role updated successfully',
      data: updatedRole,
    };
    return result;
  }

  async remove(id: string, currentRoleLevel: number | null) {
    if (currentRoleLevel == null) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
    const existingRole = await this.prisma.role.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingRole) {
      throw new NotFoundException('Role not found');
    }
    if (currentRoleLevel >= existingRole.level) {
      throw new ForbiddenException(
        'You can only remove a role with level lower than your current role level',
      );
    }
    if (existingRole.level === 1) {
      throw new ForbiddenException(
        'You not have permission to remove this role',
      );
    }
    // Nếu role có account đang sử dụng thì không cho xóa.
    const accountUsingRole = await this.prisma.user.findFirst({
      where: {
        role_id: id,
      },
    });
    if (accountUsingRole) {
      throw new ForbiddenException('Role is being used by accounts');
    }

    // Xóa các RolePermission và Role trong cùng một transaction để đảm bảo toàn vẹn dữ liệu
    const [removeRolePermission, removedRole] = await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({
        where: {
          role_id: id,
        },
      }),
      this.prisma.role.delete({
        where: {
          id: id,
        },
      }),
    ]);
    const result = {
      message: 'Role removed successfully',
      data: removedRole,
    };
    return result;
  }

  async findRolePermissions(id: string) {
    const role = await this.prisma.role.findUnique({
      where: {
        id: id,
      },
      include: {
        permissions: {
          select: {
            permission: {
              select: {
                id: true,
                permission_code: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async updateRolePermissions(
    id: string,
    dto: UpdateRolePermissionsDto,
    currentRoleLevel: number | null,
  ) {
    if (currentRoleLevel == null) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }

    const role = await this.prisma.role.findUnique({
      where: {
        id: id,
      },
      select: {
        level: true,
      },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    this.ensureRoleIsNotSuperAdminRole(role);

    if (currentRoleLevel >= role.level) {
      throw new ForbiddenException(
        'You can only update a role with level lower than your current role level',
      );
    }
    // Kiểm tra các permission_id có tồn tại không
    if (
      (await this.prisma.permission.count({
        where: {
          id: {
            in: dto.permission_id,
          },
        },
      })) !== dto.permission_id.length
    ) {
      throw new NotFoundException('One or more permissions not found');
    }
    // Cập nhật Permissions: Xóa tất cả permissions cũ và thêm permissions mới
    const [_, createPermissions] = await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({
        where: {
          role_id: id,
        },
      }),
      this.prisma.rolePermission.createMany({
        data: dto.permission_id.map((permId) => ({
          role_id: id,
          permission_id: permId,
        })),
        skipDuplicates: true,
      }),
    ]);

    return {
      message: 'Role permissions updated successfully',
      data: createPermissions,
    };
  }
}
